import "server-only";

import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { artworks, artworkSlides, artworkVersions } from "@/db/schema";
import { planSlideReorder } from "@/lib/carousel/slides";
import {
  carouselCopySchema,
  type CarouselCopy,
  type CarouselSlideCopy,
} from "@/lib/carousel/carousel-copy";
import { getOwnedStore } from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { ARTWORKS_BUCKET } from "./artworks";

const coverLayersSchema = z
  .object({
    carouselStyle: z.string().optional(),
    carouselCopy: carouselCopySchema.optional().catch(undefined),
  })
  .passthrough()
  .catch({});

async function findOwnedCarousel(userId: string, artworkId: string) {
  const store = await getOwnedStore(userId);

  if (!store) {
    return null;
  }

  const [artwork] = await db
    .select({ id: artworks.id, storeId: artworks.storeId })
    .from(artworks)
    .where(
      and(
        eq(artworks.id, artworkId),
        eq(artworks.storeId, store.id),
        eq(artworks.format, "carrossel"),
      ),
    );

  return artwork ?? null;
}

async function downloadRender(renderPath: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .download(renderPath);

  return error || !data ? null : Buffer.from(await data.arrayBuffer());
}

export async function getCarouselCover(userId: string, artworkId: string) {
  const artwork = await findOwnedCarousel(userId, artworkId);

  if (!artwork) {
    return null;
  }

  const [coverVersion] = await db
    .select({
      id: artworkVersions.id,
      renderPath: artworkVersions.renderPath,
      layers: artworkVersions.layers,
    })
    .from(artworkVersions)
    .where(eq(artworkVersions.artworkId, artworkId))
    .orderBy(desc(artworkVersions.version))
    .limit(1);
  const image = coverVersion?.renderPath
    ? await downloadRender(coverVersion.renderPath)
    : null;

  if (!coverVersion?.renderPath || !image) {
    return null;
  }

  return {
    storeId: artwork.storeId,
    versionId: coverVersion.id,
    renderPath: coverVersion.renderPath,
    image,
    style: coverLayersSchema.parse(coverVersion.layers).carouselStyle,
    carouselCopy: coverLayersSchema.parse(coverVersion.layers).carouselCopy,
  };
}

async function mergeCoverLayers(
  versionId: string,
  layers: Record<string, unknown>,
) {
  await db
    .update(artworkVersions)
    .set({
      layers: sql`${artworkVersions.layers} || ${JSON.stringify(layers)}::jsonb`,
    })
    .where(eq(artworkVersions.id, versionId));
}

export const saveCarouselStyle = (versionId: string, style: string) =>
  mergeCoverLayers(versionId, { carouselStyle: style });

export async function getSlideImage(artworkId: string, position: number) {
  const [slide] = await db
    .select({ renderPath: artworkSlides.renderPath })
    .from(artworkSlides)
    .where(
      and(
        eq(artworkSlides.artworkId, artworkId),
        eq(artworkSlides.position, position),
      ),
    );

  return slide ? downloadRender(slide.renderPath) : null;
}

type UpsertSlideInput = {
  storeId: string;
  artworkId: string;
  position: number;
  image: Buffer;
  copy: CarouselSlideCopy;
};

export async function upsertSlide({
  storeId,
  artworkId,
  position,
  image,
  copy,
}: UpsertSlideInput) {
  const renderPath = `${storeId}/artworks/${crypto.randomUUID()}.png`;
  const supabase = await createSupabaseServerClient();
  const { error: uploadError } = await supabase.storage
    .from(ARTWORKS_BUCKET)
    .upload(renderPath, image, { contentType: "image/png" });

  if (uploadError) {
    console.error("[carrossel] falha ao salvar slide", uploadError.message);
    return null;
  }

  try {
    const [previousSlide] = await db
      .select({ renderPath: artworkSlides.renderPath })
      .from(artworkSlides)
      .where(
        and(
          eq(artworkSlides.artworkId, artworkId),
          eq(artworkSlides.position, position),
        ),
      );
    const [savedSlide] = await db
      .insert(artworkSlides)
      .values({ artworkId, position, renderPath, copy })
      .onConflictDoUpdate({
        target: [artworkSlides.artworkId, artworkSlides.position],
        set: {
          renderPath,
          copy,
          version: sql`${artworkSlides.version} + 1`,
          updatedAt: new Date(),
        },
      })
      .returning({ version: artworkSlides.version });

    const [versionUsingPreviousFile] = previousSlide
      ? await db
          .select({ id: artworkVersions.id })
          .from(artworkVersions)
          .where(eq(artworkVersions.renderPath, previousSlide.renderPath))
          .limit(1)
      : [];

    if (previousSlide && !versionUsingPreviousFile) {
      await supabase.storage
        .from(ARTWORKS_BUCKET)
        .remove([previousSlide.renderPath]);
    }

    return { position, version: savedSlide.version };
  } catch (error) {
    console.error("[carrossel] falha ao salvar slide", error);
    await supabase.storage.from(ARTWORKS_BUCKET).remove([renderPath]);
    return null;
  }
}

export async function startCarousel(
  userId: string,
  artworkId: string,
  carouselCopy: CarouselCopy,
) {
  const cover = await getCarouselCover(userId, artworkId);

  if (!cover) {
    return false;
  }

  await mergeCoverLayers(cover.versionId, { carouselCopy });
  await db
    .insert(artworkSlides)
    .values({
      artworkId,
      position: 1,
      renderPath: cover.renderPath,
      copy: carouselCopy.slides[0],
    })
    .onConflictDoNothing();

  return true;
}

export async function listSlides(artworkId: string) {
  return db
    .select({
      position: artworkSlides.position,
      renderPath: artworkSlides.renderPath,
      copy: artworkSlides.copy,
      version: artworkSlides.version,
    })
    .from(artworkSlides)
    .where(eq(artworkSlides.artworkId, artworkId))
    .orderBy(asc(artworkSlides.position));
}

export async function reorderSlides(
  userId: string,
  artworkId: string,
  newOrder: number[],
) {
  const artwork = await findOwnedCarousel(userId, artworkId);

  if (!artwork) {
    return false;
  }

  const slides = await listSlides(artworkId);
  const moves = planSlideReorder(
    slides.map(({ position }) => position),
    newOrder,
  );

  if (!moves) {
    return false;
  }

  const slideByPosition = new Map(
    slides.map((slide) => [slide.position, slide]),
  );

  await db.transaction(async (tx) => {
    for (const { from, to } of moves) {
      const movedSlide = slideByPosition.get(from);

      if (!movedSlide || from === to) {
        continue;
      }

      await tx
        .update(artworkSlides)
        .set({
          renderPath: movedSlide.renderPath,
          copy: movedSlide.copy,
          version: movedSlide.version,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(artworkSlides.artworkId, artworkId),
            eq(artworkSlides.position, to),
          ),
        );
    }
  });

  return true;
}

export { findOwnedCarousel };
