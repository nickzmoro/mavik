import { z } from "zod";

import {
  carouselCopySchema,
  MAX_CAROUSEL_SLIDES,
  MIN_CAROUSEL_SLIDES,
  type CarouselCopy,
} from "@/lib/carousel/carousel-copy";
import { generateArtFormSchema } from "@/lib/validations/generate-art";

export const carouselCopyFieldSchema = z.union([
  z.literal("caption"),
  z.object({ slide: z.number().int().min(1).max(MAX_CAROUSEL_SLIDES) }),
]);

export const generateCarouselCopySchema = z.object({
  prompt: generateArtFormSchema.shape.prompt,
  slideCount: z
    .number()
    .int()
    .min(MIN_CAROUSEL_SLIDES)
    .max(MAX_CAROUSEL_SLIDES),
  field: carouselCopyFieldSchema.optional(),
  currentCopy: carouselCopySchema.optional(),
});

export type CarouselCopyField = z.infer<typeof carouselCopyFieldSchema>;
export type GenerateCarouselCopyInput = z.infer<
  typeof generateCarouselCopySchema
>;
export type GeneratedCarouselCopy = { copy: CarouselCopy };
