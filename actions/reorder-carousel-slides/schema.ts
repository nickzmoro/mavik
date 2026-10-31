import { z } from "zod";

import { MAX_CAROUSEL_SLIDES } from "@/lib/carousel/carousel-copy";

export const reorderCarouselSlidesSchema = z.object({
  artworkId: z.uuid(),
  newOrder: z
    .array(z.number().int().min(1).max(MAX_CAROUSEL_SLIDES))
    .min(1)
    .max(MAX_CAROUSEL_SLIDES),
});

export type ReorderCarouselSlidesInput = z.infer<
  typeof reorderCarouselSlidesSchema
>;
