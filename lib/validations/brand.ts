import { z } from "zod";

import { parseColor } from "@/lib/color-contrast";
import { fontRoles, restrictionTypes } from "@/lib/mocks/brand";

const colorValueSchema = z
  .string()
  .trim()
  .min(1, "Informe a cor.")
  .refine(
    (value) => parseColor(value) !== null,
    "Use HEX (#2B2420) ou RGB (rgb(43, 36, 32)).",
  );

export const brandColorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Dê um nome para a cor.")
    .max(40, "Use até 40 caracteres."),
  value: colorValueSchema,
});

export type BrandColorFormValues = z.infer<typeof brandColorFormSchema>;

export const brandFontFormSchema = z.object({
  role: z.enum(fontRoles),
  file: z
    .instanceof(File, { error: "Escolha o arquivo da fonte." })
    .refine(
      (file) => /\.(ttf|otf|woff2?)$/i.test(file.name),
      "Use um arquivo .ttf, .otf, .woff ou .woff2.",
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "A fonte precisa ter até 5 MB.",
    ),
  hasLicense: z
    .boolean()
    .refine((value) => value, "Confirme que você tem a licença de uso."),
});

export type BrandFontFormValues = z.infer<typeof brandFontFormSchema>;

export const brandTagFormSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "Escreva algo para adicionar.")
    .max(40, "Use até 40 caracteres."),
});

export type BrandTagFormValues = z.infer<typeof brandTagFormSchema>;

export const artRuleFormSchema = z.object({
  rule: z
    .string()
    .trim()
    .min(1, "Escreva a regra.")
    .max(500, "Use até 500 caracteres."),
});

export type ArtRuleFormValues = z.infer<typeof artRuleFormSchema>;

export const personaFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Dê um nome para a persona.")
    .max(30, "Use até 30 caracteres."),
  age: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, "Use só números.")
    .refine(
      (value) => Number(value) >= 12 && Number(value) <= 110,
      "Use uma idade entre 12 e 110.",
    ),
  description: z
    .string()
    .trim()
    .min(10, "Descreva em pelo menos 10 caracteres.")
    .max(200, "Use até 200 caracteres."),
});

export type PersonaFormValues = z.infer<typeof personaFormSchema>;

export const restrictionFormSchema = z
  .object({
    type: z.enum(restrictionTypes),
    value: z
      .string()
      .trim()
      .min(1, "Descreva o que evitar.")
      .max(40, "Use até 40 caracteres."),
    color: z.string().trim(),
  })
  .refine((values) => values.type !== "Cores" || parseColor(values.color), {
    path: ["color"],
    message: "Use HEX (#E53935) ou RGB (rgb(229, 57, 53)).",
  });

export type RestrictionFormValues = z.infer<typeof restrictionFormSchema>;
