import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { artworks, artworkVersions, contents } from "@/db/schema";
import { getOrCreateCurrentBrandKit } from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTWORKS_BUCKET } from "./artworks";

const imageExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export type ApprovedContentInput = {
  title: string;
  prompt: string;
  caption: string;
  format: "post" | "story";
  scheduledAt: Date;
  artworkId?: string;
  contentId?: string;
  imageDataUrl?: string;
};

export async function saveApprovedContent({
  storeId,
  userId,
  input: {
    title,
    prompt,
    caption,
    format,
    scheduledAt,
    artworkId,
    contentId: requestedContentId,
    imageDataUrl,
  },
}: {
  storeId: string;
  userId: string;
  input: ApprovedContentInput;
}) {
  const supabase = await createSupabaseServerClient();
  let uploadedRenderPath: string | null = null;

  try {
    const brandKit = await getOrCreateCurrentBrandKit(storeId, userId);
    const [draftArtwork] = artworkId
      ? await db
          .select({ id: artworks.id, contentId: artworks.contentId })
          .from(artworks)
          .where(and(eq(artworks.id, artworkId), eq(artworks.storeId, storeId)))
      : [];
    const existingContentId = requestedContentId ?? draftArtwork?.contentId;
    const [existingContent] = existingContentId
      ? await db
          .select({ id: contents.id })
          .from(contents)
          .where(
            and(
              eq(contents.id, existingContentId),
              eq(contents.storeId, storeId),
            ),
          )
      : [];

    if (
      !brandKit ||
      (artworkId && !draftArtwork) ||
      (requestedContentId && !existingContent)
    ) {
      return null;
    }

    if (!draftArtwork && imageDataUrl) {
      const [header, base64] = imageDataUrl.split(",");
      const mimeType = header.slice("data:".length, header.indexOf(";"));
      const renderPath = `${storeId}/artworks/${crypto.randomUUID()}.${imageExtensions[mimeType]}`;
      const { error: uploadError } = await supabase.storage
        .from(ARTWORKS_BUCKET)
        .upload(renderPath, Buffer.from(base64, "base64"), {
          contentType: mimeType,
        });

      if (uploadError) {
        console.error("[studio] falha no upload da arte", uploadError.message);
        return null;
      }

      uploadedRenderPath = renderPath;
    }

    return await db.transaction(async (tx) => {
      const approvedAt = new Date();
      const contentValues = {
        title,
        format,
        scheduledAt,
        status: "aprovado" as const,
        caption,
      };
      const [content] = existingContent
        ? await tx
            .update(contents)
            .set(contentValues)
            .where(eq(contents.id, existingContent.id))
            .returning({ id: contents.id })
        : await tx
            .insert(contents)
            .values({
              storeId,
              goal: "engajar",
              createdBy: userId,
              ...contentValues,
            })
            .returning({ id: contents.id });
      const approval = {
        contentId: content.id,
        format,
        status: "aprovada" as const,
        approvedBy: userId,
        approvedAt,
      };
      let approvedArtworkId: string;

      if (draftArtwork) {
        await tx
          .update(artworks)
          .set(approval)
          .where(eq(artworks.id, draftArtwork.id));

        const [latestVersion] = await tx
          .select({ id: artworkVersions.id })
          .from(artworkVersions)
          .where(eq(artworkVersions.artworkId, draftArtwork.id))
          .orderBy(desc(artworkVersions.version))
          .limit(1);

        if (latestVersion) {
          await tx
            .update(artworkVersions)
            .set({ caption })
            .where(eq(artworkVersions.id, latestVersion.id));
        }

        approvedArtworkId = draftArtwork.id;
      } else {
        const [artwork] = await tx
          .insert(artworks)
          .values({
            storeId,
            brandKitId: brandKit.id,
            prompt,
            createdBy: userId,
            ...approval,
          })
          .returning({ id: artworks.id });

        await tx.insert(artworkVersions).values({
          artworkId: artwork.id,
          version: 1,
          layers: {},
          renderPath: uploadedRenderPath,
          caption,
          author: "usuario",
        });

        approvedArtworkId = artwork.id;
      }

      await tx
        .update(contents)
        .set({ currentArtworkId: approvedArtworkId })
        .where(eq(contents.id, content.id));

      return { contentId: content.id };
    });
  } catch (error) {
    console.error("[studio] falha ao salvar arte aprovada", error);

    if (uploadedRenderPath) {
      await supabase.storage.from(ARTWORKS_BUCKET).remove([uploadedRenderPath]);
    }

    return null;
  }
}
