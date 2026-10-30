import "server-only";

import { and, asc, count, eq, ne } from "drizzle-orm";
import type OpenAI from "openai";

import { db } from "@/db";
import {
  artworks,
  brandArtRules,
  brandAssets,
  brandColors,
  brandFonts,
  brandLayouts,
  brandRestrictions,
  brandRules,
  brandTerms,
  brandVoice,
  personas,
  storeProducts,
} from "@/db/schema";
import { BRAND_ASSETS_BUCKET } from "@/lib/onboarding/brand-assets";
import {
  getCurrentBrandKit,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import { layoutElements } from "@/lib/mocks/brand";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { buildArtDirectionSection } from "./art-direction-rules";
import { logoRules } from "./logo-rules";
import { extractAndSaveManualRules } from "./manual-guidelines";

type LogoAsset = { storagePath: string; kind: "logo_claro" | "logo_escuro" };

type StoredFile = { storagePath: string; mimeType: string; label: string };

export type BrandContext = {
  brandName: string;
  productNames: string[];
  guidelines: string;
  colorHexes: string[];
  restrictions: string[];
  forbiddenTerms: string[];
  primaryHex?: string;
  variationIndex: number;
  logos: LogoAsset[];
  manual?: StoredFile;
  goodExamples: StoredFile[];
  hasStoryExamples: boolean;
  badExamples: StoredFile[];
};

function describeScale(value: number, low: string, high: string) {
  if (value <= 35) return low;
  if (value >= 65) return high;
  return `equilibrado entre ${low} e ${high}`;
}

export async function downloadBrandAsset(storagePath: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .download(storagePath);

  if (error || !data) {
    throw new Error(`Falha ao baixar ${storagePath}: ${error?.message}`);
  }

  return Buffer.from(await data.arrayBuffer());
}

async function getManualRules(
  openai: OpenAI,
  brandKitId: string,
  manual?: { storagePath: string; label: string | null; mimeType: string },
) {
  const savedRules = await db
    .select({ rule: brandRules.rule })
    .from(brandRules)
    .where(
      and(
        eq(brandRules.brandKitId, brandKitId),
        eq(brandRules.source, "manual"),
        eq(brandRules.isActive, true),
      ),
    );

  if (savedRules.length > 0 || manual?.mimeType !== "application/pdf") {
    return savedRules.map(({ rule }) => rule);
  }

  try {
    return await extractAndSaveManualRules({
      openai,
      brandKitId,
      pdfBytes: await downloadBrandAsset(manual.storagePath),
      fileName: manual.label ?? "manual.pdf",
    });
  } catch (error) {
    console.error("[brand] falha ao ler o manual da marca", error);
    return [];
  }
}

type GetBrandContextOptions = {
  variationOffset?: number;
  contentFormat?: "post" | "story";
};

export async function getBrandContext(
  userId: string,
  openai: OpenAI,
  { variationOffset = 0, contentFormat = "post" }: GetBrandContextOptions = {},
): Promise<BrandContext | null> {
  const store = await getOwnedStore(userId);
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!store || !brandKit) {
    return null;
  }

  const [
    products,
    colors,
    fonts,
    [voice],
    terms,
    restrictions,
    storePersonas,
    assets,
    layouts,
    activeRules,
    artDirectionRules,
    [artworkTotal],
  ] = await Promise.all([
    db
      .select({ name: storeProducts.name })
      .from(storeProducts)
      .where(eq(storeProducts.storeId, store.id))
      .orderBy(asc(storeProducts.position)),
    db
      .select()
      .from(brandColors)
      .where(eq(brandColors.brandKitId, brandKit.id))
      .orderBy(asc(brandColors.position)),
    db.select().from(brandFonts).where(eq(brandFonts.brandKitId, brandKit.id)),
    db.select().from(brandVoice).where(eq(brandVoice.brandKitId, brandKit.id)),
    db.select().from(brandTerms).where(eq(brandTerms.brandKitId, brandKit.id)),
    db
      .select({ kind: brandRestrictions.kind, value: brandRestrictions.value })
      .from(brandRestrictions)
      .where(eq(brandRestrictions.brandKitId, brandKit.id)),
    db.select().from(personas).where(eq(personas.brandKitId, brandKit.id)),
    db
      .select()
      .from(brandAssets)
      .where(eq(brandAssets.brandKitId, brandKit.id)),
    db
      .select({ structure: brandLayouts.structure })
      .from(brandLayouts)
      .where(
        and(
          eq(brandLayouts.brandKitId, brandKit.id),
          eq(brandLayouts.format, contentFormat),
        ),
      ),
    db
      .select({ rule: brandRules.rule })
      .from(brandRules)
      .where(
        and(
          eq(brandRules.brandKitId, brandKit.id),
          ne(brandRules.source, "manual"),
          eq(brandRules.isActive, true),
        ),
      ),
    db
      .select({
        brandKitId: brandArtRules.brandKitId,
        rule: brandArtRules.rule,
        isActive: brandArtRules.isActive,
      })
      .from(brandArtRules)
      .where(eq(brandArtRules.brandKitId, brandKit.id))
      .orderBy(asc(brandArtRules.createdAt)),
    db
      .select({ total: count() })
      .from(artworks)
      .where(eq(artworks.storeId, store.id)),
  ]);

  const manual = assets.find(({ kind }) => kind === "manual");
  const manualRules = await getManualRules(openai, brandKit.id, manual);
  const variationIndex = (artworkTotal?.total ?? 0) + variationOffset;
  const storyExamples = assets.filter(({ kind }) => kind === "story_bom");
  const hasStoryExamples =
    contentFormat === "story" && storyExamples.length > 0;
  const lovedTerms = terms.filter(({ kind }) => kind === "amada");
  const forbiddenTerms = terms.filter(({ kind }) => kind === "proibida");
  const fixedLayoutElements = [
    ...new Set(
      layouts.flatMap(({ structure }) => {
        const layoutModes =
          (structure as { layoutModes?: Record<string, boolean> })
            .layoutModes ?? {};

        return layoutElements
          .filter((element) => layoutModes[element.id])
          .map((element) => element.label);
      }),
    ),
  ];

  const sections = [
    `Marca: ${store.name} (segmento: ${store.segment}).`,
    products.length > 0 &&
      `Produtos e serviços: ${products.map(({ name }) => name).join(", ")}.`,
    manualRules.length > 0 &&
      `REGRAS DO MANUAL DA MARCA (prioridade máxima, seguir à risca):\n- ${manualRules.join("\n- ")}`,
    buildArtDirectionSection(brandKit.id, artDirectionRules, variationIndex),
    colors.length > 0 &&
      `Paleta do Brand Kit: ${colors.map(({ name, role, hex }) => `${name ?? role} ${hex}`).join(", ")}.`,
    fonts.length > 0 &&
      `Fontes do Brand Kit: ${fonts.map(({ role, family }) => `${role} ${family}`).join(", ")}.`,
    brandKit.imageStyle && `Estilo de imagem: ${brandKit.imageStyle}.`,
    voice &&
      `Tom de voz: ${describeScale(voice.formalCasual, "formal", "descontraído")}, ${describeScale(voice.seriousFun, "sério", "divertido")}, ${describeScale(voice.technicalSimple, "técnico", "simples")}, ${describeScale(voice.educationalSales, "educativo", "vendedor")}.`,
    lovedTerms.length > 0 &&
      `Palavras que a marca ama: ${lovedTerms.map(({ term }) => term).join(", ")}.`,
    forbiddenTerms.length > 0 &&
      `Termos proibidos (nunca usar): ${forbiddenTerms.map(({ term }) => term).join(", ")}.`,
    activeRules.length > 0 &&
      `Regras ativas do Brand Kit:\n- ${activeRules.map(({ rule }) => rule).join("\n- ")}`,
    fixedLayoutElements.length > 0 &&
      `Elementos fixos do layout da marca: ${fixedLayoutElements.join(", ")}.`,
    restrictions.length > 0 &&
      `PROIBIDO NA ARTE (prioridade máxima, nunca usar, mesmo que apareça nos posts aprovados):\n- ${restrictions.map(({ value }) => value).join("\n- ")}`,
    storePersonas.length > 0 &&
      `Público: ${storePersonas.map(({ name, age, description }) => `${name}, ${age ?? "?"} anos${description ? ` (${description})` : ""}`).join("; ")}.`,
    store.isRegulated &&
      "Setor regulado: nunca prometa resultados nem use antes e depois.",
    `Regras da logo:\n- ${logoRules.join("\n- ")}`,
  ].filter((section): section is string => Boolean(section));

  const guidelines = sections.join("\n");
  const avoidedHexes = new Set(
    restrictions
      .filter(({ kind }) => kind === "cor")
      .map(({ value }) => value.toUpperCase()),
  );
  const allowedHexText = [...colors.map(({ hex }) => hex), ...manualRules].join(
    " ",
  );
  const toStoredFile = ({
    storagePath,
    mimeType,
    label,
  }: (typeof assets)[number]) => ({
    storagePath,
    mimeType,
    label: label ?? "arquivo",
  });

  return {
    brandName: store.name,
    productNames: products.map(({ name }) => name),
    guidelines,
    colorHexes: [
      ...new Set(
        allowedHexText
          .match(/#[0-9A-Fa-f]{6}\b/g)
          ?.map((hex) => hex.toUpperCase())
          .filter((hex) => !avoidedHexes.has(hex)),
      ),
    ],
    restrictions: restrictions.map(({ value }) => value),
    forbiddenTerms: forbiddenTerms.map(({ term }) => term),
    primaryHex: colors
      .find(({ role }) => role === "primaria")
      ?.hex.toUpperCase(),
    variationIndex,
    manual:
      manual?.mimeType === "application/pdf" ? toStoredFile(manual) : undefined,
    goodExamples: (hasStoryExamples
      ? storyExamples
      : assets.filter(({ kind }) => kind === "post_bom")
    ).map(toStoredFile),
    hasStoryExamples,
    badExamples: assets
      .filter(({ kind }) => kind === "post_ruim")
      .map(toStoredFile),
    logos: assets
      .filter(
        (asset): asset is typeof asset & { kind: LogoAsset["kind"] } =>
          asset.kind === "logo_claro" || asset.kind === "logo_escuro",
      )
      .map(({ storagePath, kind }) => ({ storagePath, kind })),
  };
}
