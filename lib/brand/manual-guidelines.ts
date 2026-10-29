import "server-only";

import { and, eq } from "drizzle-orm";
import type OpenAI from "openai";

import { db } from "@/db";
import { brandRules } from "@/db/schema";
import type { ExtractedBrandKit } from "@/actions/extract-brand-manual/schema";
import { LUNA_MODEL } from "@/lib/ai/models";
import { parseColor } from "@/lib/color-contrast";
import {
  MAX_FONT_NAME_LENGTH,
  MAX_RESTRICTIONS,
} from "@/lib/onboarding/constants";

const MANUAL_READER_INSTRUCTIONS = `You are a senior brand designer reading a brand manual (brand book).
Extract every rule a designer needs to create Instagram posts that follow this manual exactly.
Be specific and faithful to the document: use the exact names, HEX codes, font families, proportions and rules written in it.
If a color is given only in CMYK, RGB or Pantone, convert it to the closest HEX and say so in "usage".
For each color set "role" to primaria, secundaria, destaque, fundo or texto when the manual makes the role clear (main brand color, supporting color, accent, page background, text color), otherwise "extra". For each typeface set "role" to titulo (headlines), paragrafo (body text), destaque (highlights, prices, badges) or outro. Set "imageStyleCategory" to the closest of fotografico, ilustrado, minimalista, 3d or outro, or nao_informado when the manual says nothing about imagery.
Write every text value in Brazilian Portuguese. Use empty strings or empty lists when the manual says nothing about a topic. Never invent rules.`;

const colorRoleValues = [
  "primaria",
  "secundaria",
  "destaque",
  "fundo",
  "texto",
  "extra",
] as const;
const fontRoleValues = ["titulo", "paragrafo", "destaque", "outro"] as const;
const imageStyleValues = [
  "fotografico",
  "ilustrado",
  "minimalista",
  "3d",
  "outro",
  "nao_informado",
] as const;

const guidelinesSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "essence",
    "colors",
    "typography",
    "logoRules",
    "layoutRules",
    "imageStyle",
    "toneOfVoice",
    "imageStyleCategory",
    "doRules",
    "dontRules",
  ],
  properties: {
    imageStyleCategory: { type: "string", enum: imageStyleValues },
    essence: { type: "string" },
    colors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "role", "hex", "usage"],
        properties: {
          role: { type: "string", enum: colorRoleValues },
          name: { type: "string" },
          hex: { type: "string" },
          usage: { type: "string" },
        },
      },
    },
    typography: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["family", "role", "usage"],
        properties: {
          role: { type: "string", enum: fontRoleValues },
          family: { type: "string" },
          usage: { type: "string" },
        },
      },
    },
    logoRules: { type: "array", items: { type: "string" } },
    layoutRules: { type: "array", items: { type: "string" } },
    imageStyle: { type: "string" },
    toneOfVoice: { type: "string" },
    doRules: { type: "array", items: { type: "string" } },
    dontRules: { type: "array", items: { type: "string" } },
  },
} as const;

export type ManualGuidelines = {
  essence: string;
  imageStyleCategory: (typeof imageStyleValues)[number];
  colors: {
    name: string;
    role: (typeof colorRoleValues)[number];
    hex: string;
    usage: string;
  }[];
  typography: {
    family: string;
    role: (typeof fontRoleValues)[number];
    usage: string;
  }[];
  logoRules: string[];
  layoutRules: string[];
  imageStyle: string;
  toneOfVoice: string;
  doRules: string[];
  dontRules: string[];
};

function toRuleLines(guidelines: ManualGuidelines) {
  return [
    guidelines.essence && `Essência da marca: ${guidelines.essence}`,
    ...guidelines.colors.map(
      ({ name, hex, usage }) => `Cor ${name} ${hex}: ${usage}`,
    ),
    ...guidelines.typography.map(
      ({ family, usage }) => `Tipografia ${family}: ${usage}`,
    ),
    ...guidelines.logoRules.map((rule) => `Logo: ${rule}`),
    ...guidelines.layoutRules.map((rule) => `Layout: ${rule}`),
    guidelines.imageStyle && `Estilo de imagem: ${guidelines.imageStyle}`,
    guidelines.toneOfVoice && `Tom de voz: ${guidelines.toneOfVoice}`,
    ...guidelines.doRules.map((rule) => `Fazer: ${rule}`),
    ...guidelines.dontRules.map((rule) => `Nunca: ${rule}`),
  ].filter((line): line is string => Boolean(line?.trim()));
}

export async function readManualGuidelines({
  openai,
  pdfBytes,
  fileName,
}: {
  openai: OpenAI;
  pdfBytes: Buffer;
  fileName: string;
}) {
  const completion = await openai.chat.completions.create({
    model: LUNA_MODEL,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "brand_manual_guidelines",
        strict: true,
        schema: guidelinesSchema,
      },
    },
    messages: [
      { role: "system", content: MANUAL_READER_INSTRUCTIONS },
      {
        role: "user",
        content: [
          {
            type: "file",
            file: {
              filename: fileName,
              file_data: `data:application/pdf;base64,${pdfBytes.toString("base64")}`,
            },
          },
          { type: "text", text: "Extraia as regras deste manual de marca." },
        ],
      },
    ],
  });

  const content = completion.choices[0]?.message.content;

  return content ? (JSON.parse(content) as ManualGuidelines) : null;
}

export async function saveManualRules(
  brandKitId: string,
  guidelines: ManualGuidelines,
) {
  const ruleLines = toRuleLines(guidelines);

  await db.transaction(async (tx) => {
    await deleteManualRules(brandKitId, tx);

    if (ruleLines.length > 0) {
      await tx.insert(brandRules).values(
        ruleLines.map((rule) => ({
          brandKitId,
          rule: rule.slice(0, 1000),
          source: "manual" as const,
        })),
      );
    }
  });

  return ruleLines;
}

export async function extractAndSaveManualRules({
  openai,
  brandKitId,
  pdfBytes,
  fileName,
}: {
  openai: OpenAI;
  brandKitId: string;
  pdfBytes: Buffer;
  fileName: string;
}) {
  const guidelines = await readManualGuidelines({ openai, pdfBytes, fileName });

  return guidelines ? saveManualRules(brandKitId, guidelines) : [];
}

export async function deleteManualRules(
  brandKitId: string,
  executor: Pick<typeof db, "delete"> = db,
) {
  await executor
    .delete(brandRules)
    .where(
      and(
        eq(brandRules.brandKitId, brandKitId),
        eq(brandRules.source, "manual"),
      ),
    );
}

const extractableColorRoles = [
  "primaria",
  "secundaria",
  "destaque",
  "fundo",
  "texto",
] as const;

function toFontName(family: string) {
  return family
    .split(",")[0]
    .replace(/\s+(family|família)$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_FONT_NAME_LENGTH);
}

export function toExtractedBrandKit(
  guidelines: ManualGuidelines,
): ExtractedBrandKit {
  const colors: ExtractedBrandKit["colors"] = {};

  for (const role of extractableColorRoles) {
    const hex = guidelines.colors
      .filter((color) => color.role === role)
      .map((color) => parseColor(color.hex))
      .find((parsedHex): parsedHex is string => Boolean(parsedHex));

    if (hex) {
      colors[role] = hex;
    }
  }

  const unassignedFamily = guidelines.typography.find(
    (font) => font.role === "outro",
  )?.family;

  const findFont = (
    role: "titulo" | "paragrafo" | "destaque",
    fallbackFamily?: string,
  ) => {
    const family =
      guidelines.typography.find((font) => font.role === role)?.family ??
      fallbackFamily;

    return family ? toFontName(family) || undefined : undefined;
  };

  const restrictions = guidelines.dontRules
    .map((rule) => rule.trim().slice(0, 60))
    .filter(Boolean)
    .slice(0, MAX_RESTRICTIONS);
  const imageStyle =
    guidelines.imageStyleCategory === "nao_informado"
      ? undefined
      : guidelines.imageStyleCategory;
  const titleFont = findFont("titulo", unassignedFamily);
  const bodyFont = findFont("paragrafo", unassignedFamily);
  const highlightFont = findFont("destaque");

  return {
    colors,
    titleFont,
    bodyFont,
    highlightFont,
    imageStyle,
    restrictions,
    filledCount:
      Object.keys(colors).length +
      [titleFont, bodyFont, highlightFont, imageStyle].filter(Boolean).length +
      Number(restrictions.length > 0),
  };
}
