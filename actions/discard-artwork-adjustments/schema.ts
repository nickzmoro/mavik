import { z } from "zod";

export const discardArtworkAdjustmentsSchema = z.object({
  artworkId: z.uuid(),
  keepVersion: z.number().int().min(1),
});

export type DiscardArtworkAdjustmentsInput = z.infer<
  typeof discardArtworkAdjustmentsSchema
>;
