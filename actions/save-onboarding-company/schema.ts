import { z } from "zod";

import {
  businessGoals,
  marketingLevels,
  MAX_PRODUCTS,
  segments,
} from "@/lib/onboarding/constants";

const websitePattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/i;

export const saveOnboardingCompanyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Digite o nome da empresa." })
    .max(80, { error: "Use até 80 caracteres." }),
  segment: z.string().refine((segment) => segments.includes(segment), {
    error: "Escolha um segmento da lista.",
  }),
  products: z
    .array(
      z.string().trim().min(1).max(40, { error: "Use até 40 caracteres." }),
    )
    .min(1, { error: "Adicione pelo menos um produto ou serviço." })
    .max(MAX_PRODUCTS, { error: `Adicione até ${MAX_PRODUCTS} itens.` }),
  location: z
    .string()
    .trim()
    .regex(/^[^,]{2,60},\s*[A-Za-z]{2}$/, {
      error: "Use o formato Cidade, UF. Ex.: Bauru, SP",
    }),
  servesOnline: z.boolean(),
  websiteUrl: z
    .string()
    .trim()
    .max(200, { error: "Use até 200 caracteres." })
    .refine((value) => !value || websitePattern.test(value), {
      error: "Digite um endereço válido. Ex.: www.suaempresa.com.br",
    }),
  instagramHandle: z
    .string()
    .trim()
    .refine((value) => !value || /^@?[A-Za-z0-9._]{1,30}$/.test(value), {
      error: "Digite um @ válido. Ex.: @suaempresa",
    }),
  mainGoal: z.enum(
    businessGoals.map((goal) => goal.value),
    {
      error: "Escolha o seu principal objetivo.",
    },
  ),
  marketingLevel: z.enum(
    marketingLevels.map((level) => level.value),
    {
      error: "Conte quanto você entende de marketing.",
    },
  ),
});

export const saveOnboardingCompanySchema =
  saveOnboardingCompanyFormSchema.extend({
    shouldAdvance: z.boolean(),
  });

export type SaveOnboardingCompanyFormValues = z.infer<
  typeof saveOnboardingCompanyFormSchema
>;
export type SaveOnboardingCompanyInput = z.infer<
  typeof saveOnboardingCompanySchema
>;
