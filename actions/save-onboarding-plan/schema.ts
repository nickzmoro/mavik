import { z } from "zod";

import {
  contentFormats,
  contentGoals,
  contentKinds,
} from "@/lib/onboarding/constants";

export const planItemSchema = z.object({
  day: z.number().int().min(1).max(30),
  kind: z.enum(contentKinds.map((kind) => kind.value)),
  format: z.enum(contentFormats),
  goal: z.enum(contentGoals),
  title: z
    .string()
    .trim()
    .min(3, { error: "Escreva um título para a pauta." })
    .max(120, { error: "Use até 120 caracteres." }),
});

export const saveOnboardingPlanSchema = z.object({
  items: z
    .array(planItemSchema)
    .max(30)
    .refine(
      (items) => new Set(items.map(({ day }) => day)).size === items.length,
      { error: "Cada dia pode ter só uma pauta." },
    ),
  shouldApprove: z.boolean(),
});

export type PlanItemValues = z.infer<typeof planItemSchema>;
export type SaveOnboardingPlanInput = z.infer<typeof saveOnboardingPlanSchema>;
