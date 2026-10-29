"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { artworks, artworkVersions, contents } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { ARTWORKS_BUCKET } from "@/lib/content/artworks";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import {
  getCurrentUserId,
  getOrCreateCurrentBrandKit,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { scheduleArtworkSchema, type ScheduleArtworkInput } from "./schema";

const imageExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const scheduleFailedMessage =
  "Não conseguimos agendar o post agora. Tente de novo em alguns minutos.";

export async function scheduleArtwork(
  input: ScheduleArtworkInput,
): Promise<AuthActionResult<{ contentId: string }>> {
  const parsedInput = scheduleArtworkSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const store = await getOwnedStore(userId);

  if (!store) {
    return authFailure(onboardingErrorMessages.storeMissing);
  }

  const { title, prompt, caption, format, scheduledAt, artworkId, imageDataUrl } =
    parsedInput.data;
  const supabase = await createSupabaseServerClient();
  let uploadedRenderPath: string | null = null;

  try {
    const brandKit = await getOrCreateCurrentBrandKit(store.id, userId);
    const [draftArtwork] = artworkId
      ? await db
          .select({ id: artworks.id })
          .from(artworks)
          .where(and(eq(artworks.id, artworkId), eq(artworks.storeId, store.id)))
      : [];

    if (!brandKit || (artworkId && !draftArtwork)) {
      return authFailure(scheduleFailedMessage);
    }

    if (!draftArtwork && imageDataUrl) {
      const [header, base64] = imageDataUrl.split(",");
      const mimeType = header.slice("data:".length, header.indexOf(";"));
      const renderPath = `${store.id}/artworks/${crypto.randomUUID()}.${imageExtensions[mimeType]}`;
      const { error: uploadError } = await supabase.storage
        .from(ARTWORKS_BUCKET)
        .upload(renderPath, Buffer.from(base64, "base64"), {
          contentType: mimeType,
        });

      if (uploadError) {
        console.error("[studio] falha no upload da arte", uploadError.message);
        return authFailure(scheduleFailedMessage);
      }

      uploadedRenderPath = renderPath;
    }

    const contentId = await db.transaction(async (tx) => {
      const approvedAt = new Date();
      const [content] = await tx
        .insert(contents)
        .values({
          storeId: store.id,
          title,
          format,
          goal: "engajar",
          scheduledAt: new Date(scheduledAt),
          status: "aprovado",
          caption,
          createdBy: userId,
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
            storeId: store.id,
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

      return content.id;
    });

    return authSuccess({ contentId });
  } catch (error) {
    console.error("[studio] falha ao agendar arte", error);

    if (uploadedRenderPath) {
      await supabase.storage.from(ARTWORKS_BUCKET).remove([uploadedRenderPath]);
    }

    return authFailure(scheduleFailedMessage);
  }
}
