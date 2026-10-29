import "server-only";

import { and, asc, eq, gte, ne } from "drizzle-orm";

import { db } from "@/db";
import { contents } from "@/db/schema";
import {
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import { getArtworkImageUrls } from "./artwork-images";

const upcomingContentsLimit = 4;

export async function getUpcomingContents() {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!store) {
    return [];
  }

  const upcomingContents = await db
    .select({
      id: contents.id,
      title: contents.title,
      format: contents.format,
      status: contents.status,
      scheduledAt: contents.scheduledAt,
      currentArtworkId: contents.currentArtworkId,
    })
    .from(contents)
    .where(
      and(
        eq(contents.storeId, store.id),
        gte(contents.scheduledAt, new Date()),
        ne(contents.status, "publicado"),
      ),
    )
    .orderBy(asc(contents.scheduledAt))
    .limit(upcomingContentsLimit);
  const imageUrlByArtwork = await getArtworkImageUrls(
    upcomingContents.flatMap((content) => content.currentArtworkId ?? []),
  );

  return upcomingContents.map(({ currentArtworkId, ...content }) => ({
    ...content,
    imageUrl: currentArtworkId
      ? imageUrlByArtwork.get(currentArtworkId)
      : undefined,
  }));
}

export type UpcomingContent = Awaited<
  ReturnType<typeof getUpcomingContents>
>[number];
