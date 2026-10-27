import "server-only";

import { and, eq } from "drizzle-orm";
import type OpenAI from "openai";

import { db } from "@/db";
import { brandRules } from "@/db/schema";

const MANUAL_READER_INSTRUCTIONS = `You are a senior brand designer reading a brand manual (brand book).
Extract every rule a designer needs to create Instagram posts that follow this manual exactly.
Be specific and faithful to the document: use the exact names, HEX codes, font families, proportions and rules written in it.
If a color is given only in CMYK, RGB or Pantone, convert it to the closest HEX and say so in "usage".
Write every text value in Brazilian Portuguese. Use empty strings or empty lists when the manual says nothing about a topic. Never invent rules.`;

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
    "doRules",
    "dontRules",
  ],
  properties: {
    essence: { type: "string" },
    colors: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "hex", "usage"],
        properties: {
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
        required: ["family", "usage"],
        properties: {
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

type ManualGuidelines = {
  essence: string;
  colors: { name: string; hex: string; usage: string }[];
  typography: { family: string; usage: string }[];
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
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
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

  if (!content) {
    return [];
  }

  const ruleLines = toRuleLines(JSON.parse(content) as ManualGuidelines);

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
