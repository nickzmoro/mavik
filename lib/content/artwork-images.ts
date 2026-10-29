import "server-only";

import { desc, inArray } from "drizzle-orm";

import { db } from "@/db";
import { artworkVersions } from "@/db/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTWORKS_BUCKET } from "./artworks";

export async function getArtworkImageUrls(artworkIds: string[]) {
  if (artworkIds.length === 0) {
    return new Map<string, string>();
  }

  const versions = await db
    .select({
      artworkId: artworkVersions.artworkId,
      renderPath: artworkVersions.renderPath,
    })
    .from(artworkVersions)
    .where(inArray(artworkVersions.artworkId, artworkIds))
    .orderBy(desc(artworkVersions.version));
  const latestPathByArtwork = new Map<string, string>();

  versions.forEach(({ artworkId, renderPath }) => {
    if (renderPath && !latestPathByArtwork.has(artworkId)) {
      latestPathByArtwork.set(artworkId, renderPath);
    }
  });

  const renderPaths = [...latestPathByArtwork.values()];

  if (renderPaths.length === 0) {
    return new Map<string, string>();
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .createSignedUrls(renderPaths, 60 * 60);
  const urlByPath = new Map(
    (data ?? []).flatMap(({ path, signedUrl }) =>
      path && signedUrl ? [[path, signedUrl] as const] : [],
    ),
  );

  return new Map(
    [...latestPathByArtwork].flatMap(([artworkId, renderPath]) => {
      const url = urlByPath.get(renderPath);

      return url ? [[artworkId, url] as const] : [];
    }),
  );
}
