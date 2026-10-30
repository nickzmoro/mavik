import { z } from "zod";

export const deleteBrandArtRuleSchema = z.object({
  id: z.uuid(),
});

export type DeleteBrandArtRuleInput = z.infer<typeof deleteBrandArtRuleSchema>;
