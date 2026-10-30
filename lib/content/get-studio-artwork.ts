import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { artworks, artworkVersions, contents } from "@/db/schema";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { getArtworkImageUrls } from "./artwork-images";

export type StudioArtwork = {
  artworkId: string;
  contentId?: string;
  prompt: string;
  caption: string;
  imageUrl: string;
  isStory: boolean;
};

export async function getStudioArtwork(
  artworkId: string,
): Promise<StudioArtwork | null> {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!store || !z.uuid().safeParse(artworkId).success) {
    return null;
  }

  const [artwork] = await db
    .select({
      prompt: artworks.prompt,
      format: artworks.format,
      contentId: artworks.contentId,
      contentCaption: contents.caption,
    })
    .from(artworks)
    .leftJoin(contents, eq(contents.id, artworks.contentId))
    .where(and(eq(artworks.id, artworkId), eq(artworks.storeId, store.id)));

  if (!artwork) {
    return null;
  }

  const [[latestVersion], imageUrlByArtwork] = await Promise.all([
    db
      .select({ caption: artworkVersions.caption })
      .from(artworkVersions)
      .where(eq(artworkVersions.artworkId, artworkId))
      .orderBy(desc(artworkVersions.version))
      .limit(1),
    getArtworkImageUrls([artworkId]),
  ]);
  const imageUrl = imageUrlByArtwork.get(artworkId);

  if (!imageUrl) {
    return null;
  }

  return {
    artworkId,
    contentId: artwork.contentId ?? undefined,
    prompt: artwork.prompt ?? "",
    caption: latestVersion?.caption ?? artwork.contentCaption ?? "",
    imageUrl,
    isStory: artwork.format === "story",
  };
}
