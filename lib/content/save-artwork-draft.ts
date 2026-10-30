import "server-only";

import { db } from "@/db";
import { artworks, artworkVersions } from "@/db/schema";
import {
  getOrCreateCurrentBrandKit,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTWORKS_BUCKET } from "./artworks";

type SaveArtworkDraftInput = {
  userId: string;
  image: Buffer;
  prompt: string;
  format: "post" | "story";
};

export async function saveArtworkDraft({
  userId,
  image,
  prompt,
  format,
}: SaveArtworkDraftInput) {
  const store = await getOwnedStore(userId);

  if (!store) {
    return null;
  }

  const renderPath = `${store.id}/artworks/${crypto.randomUUID()}.png`;
  const supabase = await createSupabaseServerClient();

  try {
    const brandKit = await getOrCreateCurrentBrandKit(store.id, userId);

    if (!brandKit) {
      return null;
    }

    const { error: uploadError } = await supabase.storage
      .from(ARTWORKS_BUCKET)
      .upload(renderPath, image, { contentType: "image/png" });

    if (uploadError) {
      console.error("[studio] falha ao salvar rascunho", uploadError.message);
      return null;
    }

    return await db.transaction(async (tx) => {
      const [artwork] = await tx
        .insert(artworks)
        .values({
          storeId: store.id,
          brandKitId: brandKit.id,
          prompt,
          format,
          status: "rascunho",
          createdBy: userId,
        })
        .returning({ id: artworks.id });

      await tx.insert(artworkVersions).values({
        artworkId: artwork.id,
        version: 1,
        layers: {},
        renderPath,
        author: "agente",
      });

      return artwork.id;
    });
  } catch (error) {
    console.error("[studio] falha ao salvar rascunho", error);
    await supabase.storage.from(ARTWORKS_BUCKET).remove([renderPath]);
    return null;
  }
}
