import { z } from "zod";

import {
  bodyFontFamilies,
  fontFamilies,
  imageStyles,
  titleFontFamilies,
} from "@/lib/onboarding/constants";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, { error: "Use uma cor em HEX. Ex.: #B4536A" });

export const saveOnboardingBrandKitFormSchema = z.object({
  source: z.enum(["upload_manual", "guiado"]),
  colors: z.object({
    primaria: hexColorSchema,
    secundaria: hexColorSchema,
    destaque: hexColorSchema,
    fundo: hexColorSchema,
    texto: hexColorSchema,
  }),
  titleFont: z.enum(titleFontFamilies, {
    error: "Escolha a fonte dos títulos.",
  }),
  bodyFont: z.enum(bodyFontFamilies, {
    error: "Escolha a fonte dos parágrafos.",
  }),
  highlightFont: z
    .string()
    .refine((font) => !font || fontFamilies.some((family) => family === font), {
      error: "Escolha uma fonte da lista.",
    }),
  licenseConfirmed: z.boolean().refine(Boolean, {
    error: "Confirme que você tem o direito de uso das fontes.",
  }),
  imageStyle: z.enum(imageStyles.map((style) => style.value)).optional(),
  restrictions: z
    .array(
      z.string().trim().min(1).max(60, { error: "Use até 60 caracteres." }),
    )
    .max(15, { error: "Adicione até 15 itens." }),
});

export const saveOnboardingBrandKitSchema =
  saveOnboardingBrandKitFormSchema.extend({
    shouldAdvance: z.boolean(),
  });

export type SaveOnboardingBrandKitFormValues = z.infer<
  typeof saveOnboardingBrandKitFormSchema
>;
export type SaveOnboardingBrandKitInput = z.infer<
  typeof saveOnboardingBrandKitSchema
>;
