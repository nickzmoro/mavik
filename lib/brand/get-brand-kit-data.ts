import "server-only";

import { and, asc, eq, ne } from "drizzle-orm";

import { db } from "@/db";
import {
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
} from "@/db/schema";
import { getColorName } from "@/lib/color";
import {
  basePalette,
  defaultBrandFonts,
  emptyLayoutModes,
  fontSamples,
  mockBrandRules,
  type BrandColor,
  type BrandFont,
  type LayoutModes,
} from "@/lib/mocks/brand";
import { signStoragePaths } from "@/lib/onboarding/get-step-data";
import {
  getCurrentBrandKit,
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import {
  colorRoleColumns,
  defaultVoiceValues,
  emptyBrandKitData,
  findKeyByValue,
  fontRoleColumns,
  getGoogleFontFamily,
  getUploadedFontFamily,
  imageStyleColumns,
  logoAssetKinds,
  type BrandFile,
  type BrandKitData,
} from "./brand-kit-data";

const hexPattern = /#[0-9A-Fa-f]{6}\b/;

const getRoleLabel = (role: BrandColor["role"]) =>
  basePalette.find((color) => color.role === role)?.roleLabel ?? "Extra";

export async function getBrandKitData(): Promise<BrandKitData> {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!brandKit) {
    return emptyBrandKitData;
  }

  const [
    colors,
    fonts,
    [voice],
    terms,
    restrictions,
    storePersonas,
    rules,
    layouts,
    assets,
    artRules,
  ] = await Promise.all([
    db
      .select()
      .from(brandColors)
      .where(eq(brandColors.brandKitId, brandKit.id))
      .orderBy(asc(brandColors.position)),
    db.select().from(brandFonts).where(eq(brandFonts.brandKitId, brandKit.id)),
    db.select().from(brandVoice).where(eq(brandVoice.brandKitId, brandKit.id)),
    db.select().from(brandTerms).where(eq(brandTerms.brandKitId, brandKit.id)),
    db
      .select()
      .from(brandRestrictions)
      .where(eq(brandRestrictions.brandKitId, brandKit.id)),
    db.select().from(personas).where(eq(personas.brandKitId, brandKit.id)),
    db
      .select()
      .from(brandRules)
      .where(
        and(
          eq(brandRules.brandKitId, brandKit.id),
          ne(brandRules.source, "manual"),
        ),
      ),
    db
      .select()
      .from(brandLayouts)
      .where(eq(brandLayouts.brandKitId, brandKit.id))
      .orderBy(asc(brandLayouts.createdAt)),
    db
      .select()
      .from(brandAssets)
      .where(eq(brandAssets.brandKitId, brandKit.id))
      .orderBy(asc(brandAssets.createdAt)),
    db
      .select({
        id: brandArtRules.id,
        rule: brandArtRules.rule,
        isActive: brandArtRules.isActive,
      })
      .from(brandArtRules)
      .where(eq(brandArtRules.brandKitId, brandKit.id))
      .orderBy(asc(brandArtRules.createdAt)),
  ]);

  const signedUrls = await signStoragePaths(
    assets.map((asset) => asset.storagePath),
  );
  const urlByPath = new Map(
    signedUrls.flatMap(({ path, signedUrl }) =>
      path && signedUrl ? [[path, signedUrl] as const] : [],
    ),
  );
  const toBrandFile = (asset: (typeof assets)[number]): BrandFile => ({
    assetId: asset.id,
    url: urlByPath.get(asset.storagePath) ?? "",
    fileName: asset.label ?? "arquivo",
    isSvg: asset.mimeType === "image/svg+xml",
  });
  const toStyleReference = (asset: (typeof assets)[number]) => ({
    id: asset.id,
    caption: (asset.label ?? "Referência").replace(/\.[^.]+$/, ""),
    imageUrl: urlByPath.get(asset.storagePath) ?? "",
  });
  const findAsset = (assetId: string | null) =>
    assets.find((asset) => asset.id === assetId);

  const logos = Object.fromEntries(
    Object.entries(logoAssetKinds).flatMap(([slotId, kind]) => {
      const asset = assets.find((currentAsset) => currentAsset.kind === kind);

      return asset ? [[slotId, toBrandFile(asset)]] : [];
    }),
  );

  const palette: BrandColor[] = colors.length
    ? colors.flatMap((color) => {
        const role = findKeyByValue(colorRoleColumns, color.role);

        return role
          ? [
              {
                id: role === "extra" ? color.id : role,
                role,
                roleLabel: getRoleLabel(role),
                name:
                  color.name && color.name !== getRoleLabel(role)
                    ? color.name
                    : getColorName(color.hex),
                hex: color.hex.toUpperCase(),
              },
            ]
          : [];
      })
    : basePalette;

  const savedFonts = fonts.flatMap((font): BrandFont[] => {
    const role = findKeyByValue(fontRoleColumns, font.role);
    const asset = findAsset(font.assetId);

    if (!role) {
      return [];
    }

    const defaultFont = defaultBrandFonts.find(
      (currentFont) => currentFont.role === role,
    );
    const isUpload = font.source === "upload" && asset;

    return [
      {
        role,
        family: isUpload
          ? getUploadedFontFamily(asset.id)
          : getGoogleFontFamily(font.family),
        displayName: font.family,
        sample: fontSamples[role],
        isRequired: role !== "Destaque",
        isDefault: !isUpload && defaultFont?.displayName === font.family,
        assetId: isUpload ? asset.id : undefined,
        url: isUpload ? urlByPath.get(asset.storagePath) : undefined,
      },
    ];
  });

  const ruleLabelsInUse = new Set(
    rules.filter((rule) => rule.isActive).map((rule) => rule.rule),
  );

  return {
    logos,
    palette,
    fonts: savedFonts.length ? savedFonts : defaultBrandFonts,
    imageStyle: brandKit.imageStyle
      ? findKeyByValue(imageStyleColumns, brandKit.imageStyle)
      : null,
    references: assets
      .filter((asset) => asset.kind === "post_bom")
      .map(toStyleReference),
    storyReferences: assets
      .filter((asset) => asset.kind === "story_bom")
      .map(toStyleReference),
    layouts: layouts.map((layout) => {
      const sourceAsset = findAsset(layout.sourceAssetId);
      const structure = layout.structure as { layoutModes?: LayoutModes };

      return {
        id: layout.id,
        name: layout.name,
        format:
          layout.format === "story" ? ("story" as const) : ("post" as const),
        layoutModes: { ...emptyLayoutModes, ...structure.layoutModes },
        postImageUrl: sourceAsset
          ? urlByPath.get(sourceAsset.storagePath)
          : undefined,
        sourceAssetId: sourceAsset?.id,
      };
    }),
    voiceValues: voice
      ? {
          formality: voice.formalCasual,
          humor: voice.seriousFun,
          complexity: voice.technicalSimple,
          intent: voice.educationalSales,
        }
      : defaultVoiceValues,
    lovedWords: terms
      .filter((term) => term.kind === "amada")
      .map((term) => term.term),
    bannedWords: terms
      .filter((term) => term.kind === "proibida")
      .map((term) => term.term),
    personas: storePersonas.map((persona) => ({
      id: persona.id,
      name: persona.name,
      age: persona.age ?? 0,
      description: persona.description,
    })),
    activeRuleIds: rules.length
      ? mockBrandRules
          .filter((rule) => ruleLabelsInUse.has(rule.label))
          .map((rule) => rule.id)
      : emptyBrandKitData.activeRuleIds,
    avoidedColors: restrictions.flatMap((restriction) => {
      const hex = restriction.value.match(hexPattern)?.[0];

      if (restriction.kind !== "cor" || !hex) {
        return [];
      }

      const name = restriction.value.replace(hexPattern, "").trim();

      return [{ name: name || getColorName(hex), hex: hex.toUpperCase() }];
    }),
    avoidedElements: restrictions
      .filter((restriction) => restriction.kind === "elemento")
      .map((restriction) => restriction.value),
    avoidedStyles: restrictions
      .filter((restriction) => restriction.kind === "estilo")
      .map((restriction) => restriction.value),
    artRules,
  };
}
