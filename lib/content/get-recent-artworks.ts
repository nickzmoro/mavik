import "server-only";

import { and, desc, eq, not, sql, type SQL } from "drizzle-orm";

import { db } from "@/db";
import { artworks, contents } from "@/db/schema";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { getArtworkImageUrls } from "./artwork-images";
import {
  getArtworkDisplayStatus,
  type ArtworkDisplayStatus,
  type ArtworkStatusFilter,
} from "./artwork-status";

export type ArtworkListFormat = "post" | "story" | "banner";

export type RecentArtwork = {
  id: string;
  title: string;
  imageUrl: string;
  status: ArtworkDisplayStatus;
  format: (typeof artworks.$inferSelect)["format"];
  createdAt: Date;
};

type GetRecentArtworksOptions = {
  limit: number;
  offset?: number;
  format?: ArtworkListFormat;
  status?: ArtworkStatusFilter;
};

export const getArtworkTitle = (prompt: string | null) =>
  prompt?.split("\n")[0].trim().slice(0, 120) || "Arte do Estúdio";

const isScheduled = sql<boolean>`coalesce(${contents.status} = 'aprovado' and ${contents.scheduledAt} > now(), false)`;
const isPublished = sql<boolean>`coalesce(${contents.status} = 'publicado', false)`;

const statusConditions: Record<ArtworkStatusFilter, SQL | undefined> = {
  agendada: isScheduled,
  rascunho: and(
    eq(artworks.status, "rascunho"),
    not(isScheduled),
    not(isPublished),
  ),
  aprovada: and(
    eq(artworks.status, "aprovada"),
    not(isScheduled),
    not(isPublished),
  ),
};

export async function getRecentArtworks({
  limit,
  offset = 0,
  format,
  status,
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
      status: artworks.status,
      format: artworks.format,
      createdAt: artworks.createdAt,
      contentStatus: contents.status,
      scheduledAt: contents.scheduledAt,
    })
    .from(artworks)
    .leftJoin(contents, eq(contents.id, artworks.contentId))
    .where(
      and(
        eq(artworks.storeId, store.id),
        format ? eq(artworks.format, format) : undefined,
        status ? statusConditions[status] : undefined,
      ),
    )
    .orderBy(desc(artworks.createdAt))
    .limit(limit)
    .offset(offset);
  const imageUrlByArtwork = await getArtworkImageUrls(
    storeArtworks.map((artwork) => artwork.id),
  );
  const now = new Date();

  return storeArtworks.flatMap((artwork) => {
    const imageUrl = imageUrlByArtwork.get(artwork.id);

    return imageUrl
      ? [
          {
            id: artwork.id,
            title: getArtworkTitle(artwork.prompt),
            imageUrl,
            status: getArtworkDisplayStatus({
              artworkStatus: artwork.status,
              contentStatus: artwork.contentStatus,
              scheduledAt: artwork.scheduledAt,
              now,
            }),
            format: artwork.format,
            createdAt: artwork.createdAt,
          },
        ]
      : [];
  });
}
