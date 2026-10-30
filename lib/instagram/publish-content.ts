import "server-only";

import { and, desc, eq, isNull, ne } from "drizzle-orm";

import { db } from "@/db";
import { artworkVersions, contents, contentStatusHistory } from "@/db/schema";
import { ARTWORKS_BUCKET } from "@/lib/content/artworks";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getInstagramAccessToken, markInstagramForReconnect } from "./accounts";
import { getInstagramApiConfig } from "./config";
import {
  InstagramApiError,
  PublishingLimitError,
  publishImage,
} from "./instagram-api";
import { toInstagramJpeg } from "./to-instagram-jpeg";

const SIGNED_URL_TTL_SECONDS = 10 * 60;

export type PublishContentResult =
  | { isSuccess: true; permalink: string | null }
  | { isSuccess: false; errorMessage: string };

const publishErrorMessages = {
  notConnected:
    "Conecte o Instagram da loja em Marca > Conexões antes de publicar.",
  alreadyPublishing: "Este post já foi publicado ou está sendo publicado.",
  missingImage: "Não encontramos a arte deste post. Gere de novo.",
  limitReached:
    "O Instagram atingiu o limite de publicações das últimas 24 horas. Tente mais tarde.",
  reconnect: "O acesso ao Instagram expirou. Reconecte em Marca > Conexões.",
  failed: "O Instagram não aceitou a publicação agora. Tente de novo.",
};

const failure = (errorMessage: string): PublishContentResult => ({
  isSuccess: false,
  errorMessage,
});

export async function publishContentNow({
  storeId,
  contentId,
  userId,
}: {
  storeId: string;
  contentId: string;
  userId: string;
}): Promise<PublishContentResult> {
  const account = await getInstagramAccessToken(storeId);

  if (!account) {
    return failure(publishErrorMessages.notConnected);
  }

  const publishingMarker = `publicando:${contentId}`;
  const [content] = await db
    .update(contents)
    .set({ externalPostId: publishingMarker, updatedAt: new Date() })
    .where(
      and(
        eq(contents.id, contentId),
        eq(contents.storeId, storeId),
        isNull(contents.externalPostId),
        ne(contents.status, "publicado"),
      ),
    )
    .returning({
      status: contents.status,
      format: contents.format,
      caption: contents.caption,
      artworkId: contents.currentArtworkId,
    });

  if (!content) {
    return failure(publishErrorMessages.alreadyPublishing);
  }

  const supabase = await createSupabaseServerClient();
  const storage = supabase.storage.from(ARTWORKS_BUCKET);
  const temporaryPath = `${storeId}/publish/${crypto.randomUUID()}.jpg`;
  let hasUploaded = false;
  let publishedMediaId: string | null = null;

  const releaseClaim = () =>
    db
      .update(contents)
      .set({ externalPostId: null, updatedAt: new Date() })
      .where(
        and(
          eq(contents.id, contentId),
          eq(contents.externalPostId, publishingMarker),
        ),
      );

  try {
    const [version] = content.artworkId
      ? await db
          .select({ renderPath: artworkVersions.renderPath })
          .from(artworkVersions)
          .where(eq(artworkVersions.artworkId, content.artworkId))
          .orderBy(desc(artworkVersions.version))
          .limit(1)
      : [];
    const { data: original } = version?.renderPath
      ? await storage.download(version.renderPath)
      : { data: null };

    if (!original) {
      await releaseClaim();
      return failure(publishErrorMessages.missingImage);
    }

    const isStory = content.format === "story";
    const jpeg = await toInstagramJpeg(
      Buffer.from(await original.arrayBuffer()),
      isStory,
    );
    const { error: uploadError } = await storage.upload(temporaryPath, jpeg, {
      contentType: "image/jpeg",
    });

    if (uploadError) {
      throw new Error("upload da imagem temporária falhou");
    }

    hasUploaded = true;

    const { data: signed } = await storage.createSignedUrl(
      temporaryPath,
      SIGNED_URL_TTL_SECONDS,
    );

    if (!signed?.signedUrl) {
      throw new Error("URL assinada não foi criada");
    }

    const published = await publishImage(getInstagramApiConfig(), {
      igUserId: account.igUserId,
      accessToken: account.accessToken,
      imageUrl: signed.signedUrl,
      caption: content.caption ?? "",
      isStory,
      isAiGenerated: true,
    });
    publishedMediaId = published.mediaId;
    const publishedAt = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(contents)
        .set({
          status: "publicado",
          socialAccountId: account.socialAccountId,
          externalPostId: published.mediaId,
          permalink: published.permalink,
          publishedAt,
          updatedAt: publishedAt,
        })
        .where(eq(contents.id, contentId));
      await tx.insert(contentStatusHistory).values({
        contentId,
        fromStatus: content.status,
        toStatus: "publicado",
        changedBy: userId,
      });
    });

    return { isSuccess: true, permalink: published.permalink };
  } catch (error) {
    if (!publishedMediaId) {
      await releaseClaim();
    }

    console.error(
      "[instagram] falha ao publicar",
      error instanceof InstagramApiError
        ? { status: error.status, code: error.code }
        : error instanceof Error
          ? error.name
          : "erro desconhecido",
    );

    if (error instanceof PublishingLimitError) {
      return failure(publishErrorMessages.limitReached);
    }

    if (error instanceof InstagramApiError && error.isInvalidToken) {
      await markInstagramForReconnect(account.socialAccountId);
      return failure(publishErrorMessages.reconnect);
    }

    return failure(publishErrorMessages.failed);
  } finally {
    if (hasUploaded) {
      await storage.remove([temporaryPath]);
    }
  }
}
