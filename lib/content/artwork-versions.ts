import "server-only";

import { and, desc, eq, inArray, max } from "drizzle-orm";

import { db } from "@/db";
import { artworks, artworkVersions } from "@/db/schema";
import { getOwnedStore } from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { getVersionsToDiscard } from "./adjust-artwork";
import { ARTWORKS_BUCKET } from "./artworks";

async function findOwnedArtwork(userId: string, artworkId: string) {
  const store = await getOwnedStore(userId);

  if (!store) {
    return null;
  }

  const [artwork] = await db
    .select({ id: artworks.id, storeId: artworks.storeId })
    .from(artworks)
    .where(and(eq(artworks.id, artworkId), eq(artworks.storeId, store.id)));

  return artwork ?? null;
}

export async function getLatestArtworkRender(
  userId: string,
  artworkId: string,
) {
  const artwork = await findOwnedArtwork(userId, artworkId);

  if (!artwork) {
    return null;
  }

  const [latestVersion] = await db
    .select({ renderPath: artworkVersions.renderPath })
    .from(artworkVersions)
    .where(eq(artworkVersions.artworkId, artworkId))
    .orderBy(desc(artworkVersions.version))
    .limit(1);

  if (!latestVersion?.renderPath) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .download(latestVersion.renderPath);

  return error || !data ? null : Buffer.from(await data.arrayBuffer());
}

type AppendArtworkVersionInput = {
  userId: string;
  artworkId: string;
  image: Buffer;
  editInstruction: string;
};

export async function appendArtworkVersion({
  userId,
  artworkId,
  image,
  editInstruction,
}: AppendArtworkVersionInput) {
  const artwork = await findOwnedArtwork(userId, artworkId);

  if (!artwork) {
    return null;
  }

  const renderPath = `${artwork.storeId}/artworks/${crypto.randomUUID()}.png`;
  const supabase = await createSupabaseServerClient();
  const { error: uploadError } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .upload(renderPath, image, { contentType: "image/png" });

  if (uploadError) {
    console.error("[artes] falha ao salvar ajuste", uploadError.message);
    return null;
  }

  try {
    return await db.transaction(async (tx) => {
      const [{ latestVersion }] = await tx
        .select({ latestVersion: max(artworkVersions.version) })
        .from(artworkVersions)
        .where(eq(artworkVersions.artworkId, artworkId));
      const version = (latestVersion ?? 0) + 1;

      await tx.insert(artworkVersions).values({
        artworkId,
        version,
        layers: { editInstruction },
        renderPath,
        author: "usuario",
      });

      return { artworkId, version };
    });
  } catch (error) {
    console.error("[artes] falha ao salvar ajuste", error);
    await supabase.storage.from(ARTWORKS_BUCKET).remove([renderPath]);
    return null;
  }
}

export async function deleteArtworkVersionsAfter(
  userId: string,
  artworkId: string,
  keepVersion: number,
) {
  const artwork = await findOwnedArtwork(userId, artworkId);

  if (!artwork) {
    return false;
  }

  const versions = await db
    .select({
      version: artworkVersions.version,
      renderPath: artworkVersions.renderPath,
    })
    .from(artworkVersions)
    .where(eq(artworkVersions.artworkId, artworkId));
  const versionsToDiscard = getVersionsToDiscard(
    versions.map(({ version }) => version),
    keepVersion,
  );

  if (versionsToDiscard.length === 0) {
    return true;
  }

  await db
    .delete(artworkVersions)
    .where(
      and(
        eq(artworkVersions.artworkId, artworkId),
        inArray(artworkVersions.version, versionsToDiscard),
      ),
    );

  const renderPaths = versions.flatMap(({ version, renderPath }) =>
    renderPath && versionsToDiscard.includes(version) ? [renderPath] : [],
  );
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .remove(renderPaths);

  if (error) {
    console.error(
      "[artes] falha ao remover arquivos descartados",
      error.message,
    );
  }

  return true;
}
