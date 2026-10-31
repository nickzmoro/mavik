import { z } from "zod";

import { carouselSlideCopySchema } from "@/lib/carousel/carousel-copy";

export const startCarouselSchema = z.object({
  artworkId: z.uuid(),
  coverCopy: carouselSlideCopySchema,
  discardedArtworkIds: z.array(z.uuid()).max(3),
});

export type StartCarouselInput = z.infer<typeof startCarouselSchema>;
