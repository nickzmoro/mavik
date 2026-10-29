import { z } from "zod";

import {
  colorRoleColumns,
  imageStyleColumns,
} from "@/lib/brand/brand-kit-data";
import { fontRoles, layoutElements, mockBrandRules } from "@/lib/mocks/brand";

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, { error: "Use uma cor em HEX." });

const textSchema = (maxLength: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maxLength, { error: `Use até ${maxLength} caracteres.` });

const scoreSchema = z.number().int().min(0).max(100);

const colorRoles = Object.keys(colorRoleColumns) as [
  keyof typeof colorRoleColumns,
  ...(keyof typeof colorRoleColumns)[],
];
const imageStyleValues = Object.keys(imageStyleColumns) as [
  keyof typeof imageStyleColumns,
  ...(keyof typeof imageStyleColumns)[],
];
const layoutElementIds = layoutElements.map((element) => element.id) as [
  (typeof layoutElements)[number]["id"],
  ...(typeof layoutElements)[number]["id"][],
];
const ruleIds = mockBrandRules.map((rule) => rule.id) as [string, ...string[]];

export const saveBrandKitSchema = z.object({
  palette: z
    .array(
      z.object({
        role: z.enum(colorRoles),
        name: textSchema(60),
        hex: hexColorSchema,
      }),
    )
    .max(20),
  fonts: z
    .array(
      z.object({
        role: z.enum(fontRoles),
        family: textSchema(120),
        assetId: z.uuid().optional(),
      }),
    )
    .max(fontRoles.length),
  imageStyle: z.enum(imageStyleValues).nullable(),
  layouts: z
    .array(
      z.object({
        id: z.uuid(),
        name: textSchema(60),
        layoutModes: z.record(z.enum(layoutElementIds), z.boolean()),
        sourceAssetId: z.uuid().optional(),
      }),
    )
    .max(20),
  voice: z.object({
    formality: scoreSchema,
    humor: scoreSchema,
    complexity: scoreSchema,
    intent: scoreSchema,
    toneLabel: textSchema(60),
    sampleCaption: textSchema(300),
  }),
  lovedWords: z.array(textSchema(60)).max(30),
  bannedWords: z.array(textSchema(60)).max(30),
  personas: z
    .array(
      z.object({
        id: z.uuid(),
        name: textSchema(60),
        age: z.number().int().min(0).max(120),
        description: textSchema(300),
      }),
    )
    .max(3),
  activeRuleIds: z.array(z.enum(ruleIds)),
  avoidedColors: z
    .array(z.object({ name: textSchema(60), hex: hexColorSchema }))
    .max(15),
  avoidedElements: z.array(textSchema(60)).max(15),
  avoidedStyles: z.array(textSchema(60)).max(15),
});

export type SaveBrandKitInput = z.infer<typeof saveBrandKitSchema>;
