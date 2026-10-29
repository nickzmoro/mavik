import { z } from "zod";

import {
  fontSources,
  imageStyles,
  MAX_FONT_NAME_LENGTH,
  MAX_RESTRICTIONS,
} from "@/lib/onboarding/constants";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, { error: "Use uma cor em HEX. Ex.: #B4536A" });

const fontNamePattern = /^[\p{L}\p{N} .&'+-]+$/u;

export const fontNameSchema = z
  .string()
  .trim()
  .min(2, { error: "Digite o nome da fonte." })
  .max(MAX_FONT_NAME_LENGTH, {
    error: `Use até ${MAX_FONT_NAME_LENGTH} caracteres.`,
  })
  .regex(fontNamePattern, { error: "Use apenas letras, números e espaços." });

const fontSourceSchema = z.enum(fontSources);

export const saveOnboardingBrandKitFormSchema = z.object({
  source: z.enum(["upload_manual", "guiado"]),
  colors: z.object({
    primaria: hexColorSchema,
    secundaria: hexColorSchema,
    destaque: hexColorSchema,
    fundo: hexColorSchema,
    texto: hexColorSchema,
  }),
  titleFont: fontNameSchema,
  bodyFont: fontNameSchema,
  highlightFont: z
    .string()
    .trim()
    .refine(
      (font) =>
        !font ||
        (font.length >= 2 &&
          font.length <= MAX_FONT_NAME_LENGTH &&
          fontNamePattern.test(font)),
      { error: "Use apenas letras, números e espaços." },
    ),
  fontSources: z.object({
    titulo: fontSourceSchema,
    paragrafo: fontSourceSchema,
    destaque: fontSourceSchema,
  }),
  licenseConfirmed: z.boolean().refine(Boolean, {
    error: "Confirme que você tem o direito de uso das fontes.",
  }),
  imageStyle: z.enum(imageStyles.map((style) => style.value)).optional(),
  restrictions: z
    .array(
      z.string().trim().min(1).max(60, { error: "Use até 60 caracteres." }),
    )
    .max(MAX_RESTRICTIONS, {
      error: `Adicione até ${MAX_RESTRICTIONS} itens.`,
    }),
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
