import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { artworks } from "@/db/schema";
import {
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import { getArtworkImageUrls } from "./artwork-images";

export type RecentArtwork = {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Date;
};

type GetRecentArtworksOptions = {
  limit: number;
  onlyDrafts?: boolean;
};

export const getArtworkTitle = (prompt: string | null) =>
  prompt?.split("\n")[0].trim().slice(0, 120) || "Arte do Estúdio";

export async function getRecentArtworks({
  limit,
  onlyDrafts = false,
}: GetRecentArtworksOptions): Promise<RecentArtwork[]> {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!store) {
    return [];
  }

  const storeArtworks = await db
    .select({
      id: artworks.id,
      prompt: artworks.prompt,
      createdAt: artworks.createdAt,
    })
    .from(artworks)
    .where(
      and(
        eq(artworks.storeId, store.id),
        onlyDrafts ? eq(artworks.status, "rascunho") : undefined,
      ),
    )
    .orderBy(desc(artworks.createdAt))
    .limit(limit);
  const imageUrlByArtwork = await getArtworkImageUrls(
    storeArtworks.map((artwork) => artwork.id),
  );

  return storeArtworks.flatMap((artwork) => {
    const imageUrl = imageUrlByArtwork.get(artwork.id);

    return imageUrl
      ? [
          {
            id: artwork.id,
            title: getArtworkTitle(artwork.prompt),
            imageUrl,
            createdAt: artwork.createdAt,
          },
        ]
      : [];
  });
}
