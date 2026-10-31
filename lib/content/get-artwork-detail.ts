import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";

import { db } from "@/db";
import { artworks, artworkVersions, contents } from "@/db/schema";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { signRenderPaths } from "./artwork-images";
import {
  getArtworkDisplayStatus,
  type ArtworkDisplayStatus,
} from "./artwork-status";
import { getArtworkTitle } from "./get-recent-artworks";

export type ArtworkVersionDetail = {
  version: number;
  imageUrl: string;
  editInstruction?: string;
  createdAt: Date;
};

export type ArtworkDetail = {
  id: string;
  title: string;
  prompt: string;
  format: (typeof artworks.$inferSelect)["format"];
  status: ArtworkDisplayStatus;
  createdAt: Date;
  approvedAt: Date | null;
  scheduledAt: Date | null;
  contentId?: string;
  caption: string;
  versions: ArtworkVersionDetail[];
};

const versionLayersSchema = z
  .object({ editInstruction: z.string().optional() })
  .catch({});

export const getArtworkDetail = cache(async function getArtworkDetail(
  artworkId: string,
): Promise<ArtworkDetail | null> {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!store || !z.uuid().safeParse(artworkId).success) {
    return null;
  }

  const [artwork] = await db
    .select({
      prompt: artworks.prompt,
      format: artworks.format,
      status: artworks.status,
      createdAt: artworks.createdAt,
      approvedAt: artworks.approvedAt,
      contentId: artworks.contentId,
      contentStatus: contents.status,
      contentCaption: contents.caption,
      scheduledAt: contents.scheduledAt,
    })
    .from(artworks)
    .leftJoin(contents, eq(contents.id, artworks.contentId))
    .where(and(eq(artworks.id, artworkId), eq(artworks.storeId, store.id)));

  if (!artwork) {
    return null;
  }

  const versions = await db
    .select({
      version: artworkVersions.version,
      renderPath: artworkVersions.renderPath,
      layers: artworkVersions.layers,
      caption: artworkVersions.caption,
      createdAt: artworkVersions.createdAt,
    })
    .from(artworkVersions)
    .where(eq(artworkVersions.artworkId, artworkId))
    .orderBy(desc(artworkVersions.version));
  const urlByPath = await signRenderPaths(
    versions.flatMap(({ renderPath }) => (renderPath ? [renderPath] : [])),
  );
  const versionDetails = versions.flatMap((version) => {
    const imageUrl = version.renderPath && urlByPath.get(version.renderPath);

    return imageUrl
      ? [
          {
            version: version.version,
            imageUrl,
            editInstruction: versionLayersSchema.parse(version.layers)
              .editInstruction,
            createdAt: version.createdAt,
          },
        ]
      : [];
  });

  if (versionDetails.length === 0) {
    return null;
  }

  return {
    id: artworkId,
    title: getArtworkTitle(artwork.prompt),
    prompt: artwork.prompt ?? "",
    format: artwork.format,
    status: getArtworkDisplayStatus({
      artworkStatus: artwork.status,
      contentStatus: artwork.contentStatus,
      scheduledAt: artwork.scheduledAt,
      now: new Date(),
    }),
    createdAt: artwork.createdAt,
    approvedAt: artwork.approvedAt,
    scheduledAt: artwork.scheduledAt,
    contentId: artwork.contentId ?? undefined,
    caption: versions[0]?.caption ?? artwork.contentCaption ?? "",
    versions: versionDetails,
  };
});
