import { z } from "zod";

import { carouselCopySchema } from "@/lib/carousel/carousel-copy";

export const startCarouselSchema = z.object({
  artworkId: z.uuid(),
  carouselCopy: carouselCopySchema,
  discardedArtworkIds: z.array(z.uuid()).max(3),
});

export type StartCarouselInput = z.infer<typeof startCarouselSchema>;
