import { z } from "zod";

import { MAX_COMPETITORS, MAX_PERSONAS } from "@/lib/onboarding/constants";

const toneSchema = z.number().int().min(0).max(100);
const termListSchema = z
  .array(z.string().trim().min(1).max(40, { error: "Use até 40 caracteres." }))
  .max(10, { error: "Adicione até 10 palavras." });

export const saveOnboardingVoiceFormSchema = z.object({
  tone: z.object({
    formalCasual: toneSchema,
    seriousFun: toneSchema,
    technicalSimple: toneSchema,
    educationalSales: toneSchema,
  }),
  sampleApproved: z.boolean(),
  lovedTerms: termListSchema,
  forbiddenTerms: termListSchema,
  personas: z
    .array(
      z.object({
        name: z
          .string()
          .trim()
          .min(2, { error: "Digite o nome da persona." })
          .max(40, { error: "Use até 40 caracteres." }),
        age: z
          .number({ error: "Digite uma idade válida." })
          .int()
          .min(14, { error: "Digite uma idade a partir de 14 anos." })
          .max(100, { error: "Digite uma idade até 100 anos." }),
        description: z
          .string()
          .trim()
          .max(240, { error: "Use até 240 caracteres." }),
        confirmed: z.boolean(),
      }),
    )
    .max(MAX_PERSONAS, { error: `Adicione até ${MAX_PERSONAS} personas.` }),
  differentiators: z
    .string()
    .trim()
    .max(500, { error: "Use até 500 caracteres." }),
  objections: z.string().trim().max(500, { error: "Use até 500 caracteres." }),
  competitors: z
    .array(
      z
        .string()
        .trim()
        .refine((value) => !value || /^@?[A-Za-z0-9._]{1,30}$/.test(value), {
          error: "Digite um @ válido. Ex.: @concorrente",
        }),
    )
    .max(MAX_COMPETITORS),
});

export const saveOnboardingVoiceSchema = saveOnboardingVoiceFormSchema.extend({
  sampleCaption: z.string().trim().max(300),
  shouldAdvance: z.boolean(),
});

export type SaveOnboardingVoiceFormValues = z.infer<
  typeof saveOnboardingVoiceFormSchema
>;
export type SaveOnboardingVoiceInput = z.infer<
  typeof saveOnboardingVoiceSchema
>;
