import { z } from "zod";

import { artRuleFormSchema } from "@/lib/validations/brand";

export const saveBrandArtRuleSchema = artRuleFormSchema.extend({
  id: z.uuid().optional(),
  isActive: z.boolean(),
});

export type SaveBrandArtRuleInput = z.infer<typeof saveBrandArtRuleSchema>;
