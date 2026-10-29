import "server-only";

import { and, asc, desc, eq, inArray } from "drizzle-orm";

import type { SaveOnboardingBrandKitFormValues } from "@/actions/save-onboarding-brand-kit/schema";
import type { SaveOnboardingCompanyFormValues } from "@/actions/save-onboarding-company/schema";
import type { SaveOnboardingVoiceFormValues } from "@/actions/save-onboarding-voice/schema";
import {
  brandAssetKinds,
  isPostExampleKind,
  postExampleKinds,
  type BrandAssetKind,
  type PostExampleKind,
} from "@/actions/upload-brand-asset/schema";
import { db } from "@/db";
import {
  brandAssets,
  brandColors,
  brandFonts,
  brandRestrictions,
  brandRules,
  brandTerms,
  brandVoice,
  competitors,
  contentPlans,
  diagnostics,
  personas,
  profiles,
  storePositioning,
  storeProducts,
} from "@/db/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { BRAND_ASSETS_BUCKET } from "./brand-assets";
import {
  DEFAULT_BODY_FONT,
  DEFAULT_TITLE_FONT,
  defaultBrandColors,
} from "./constants";
import type { PlanItem } from "./thirty-day-plan";
import { getCurrentBrandKit, getOwnedStore } from "./store-access";

async function getProductNames(storeId: string) {
  const products = await db
    .select({ name: storeProducts.name })
    .from(storeProducts)
    .where(eq(storeProducts.storeId, storeId))
    .orderBy(asc(storeProducts.position));

  return products.map(({ name }) => name);
}

export async function signStoragePaths(storagePaths: string[]) {
  if (storagePaths.length === 0) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.storage
    .from(BRAND_ASSETS_BUCKET)
    .createSignedUrls(storagePaths, 60 * 60);

  return data ?? [];
}

export type PostExample = {
  id: string;
  kind: PostExampleKind;
  url: string;
  fileName: string;
};

export async function getCompanyStepData(userId: string) {
  const [store, [profile]] = await Promise.all([
    getOwnedStore(userId),
    db
      .select({ marketingLevel: profiles.marketingLevel })
      .from(profiles)
      .where(eq(profiles.id, userId)),
  ]);

  const defaultValues: Partial<SaveOnboardingCompanyFormValues> = {
    name: store?.name ?? "",
    segment: store?.segment ?? "",
    products: store ? await getProductNames(store.id) : [],
    location: store?.city && store.state ? `${store.city}, ${store.state}` : "",
    servesOnline: store?.servesOnline ?? false,
    websiteUrl: store?.websiteUrl?.replace(/^https?:\/\//, "") ?? "",
    instagramHandle: store?.instagramHandle ?? "",
    mainGoal: store?.mainGoal ?? undefined,
    marketingLevel: profile?.marketingLevel ?? "simples",
  };

  return defaultValues;
}

export type UploadedBrandAsset = {
  id: string;
  url: string;
  fileName: string;
  isGenerated: boolean;
  checks: Record<string, "ok" | "aviso" | "erro">;
};

export async function getBrandStepData(userId: string) {
  const store = await getOwnedStore(userId);

  if (!store) {
    return null;
  }

  const brandKit = await getCurrentBrandKit(store.id);
  const [colors, fonts, restrictions, assets, products] = brandKit
    ? await Promise.all([
        db
          .select()
          .from(brandColors)
          .where(eq(brandColors.brandKitId, brandKit.id)),
        db
          .select()
          .from(brandFonts)
          .where(eq(brandFonts.brandKitId, brandKit.id)),
        db
          .select({ value: brandRestrictions.value })
          .from(brandRestrictions)
          .where(eq(brandRestrictions.brandKitId, brandKit.id)),
        db
          .select()
          .from(brandAssets)
          .where(eq(brandAssets.brandKitId, brandKit.id)),
        getProductNames(store.id),
      ])
    : [[], [], [], [], await getProductNames(store.id)];

  const signedUrls = await signStoragePaths(
    assets.map(({ storagePath }) => storagePath),
  );

  const uploadedAssets: Partial<Record<BrandAssetKind, UploadedBrandAsset>> =
    {};
  assets.forEach((asset, index) => {
    const signedUrl = signedUrls?.[index]?.signedUrl;

    const kind = brandAssetKinds.find((assetKind) => assetKind === asset.kind);

    if (signedUrl && kind) {
      uploadedAssets[kind] = {
        id: asset.id,
        url: signedUrl,
        fileName: asset.label ?? "arquivo",
        isGenerated: asset.isGenerated,
        checks:
          (asset.validation as { checks?: UploadedBrandAsset["checks"] })
            .checks ?? {},
      };
    }
  });

  const colorByRole = Object.fromEntries(
    colors.map(({ role, hex }) => [role, hex]),
  );
  const fontByRole = Object.fromEntries(
    fonts.map(({ role, family }) => [role, family]),
  );
  const fontSourceByRole = Object.fromEntries(
    fonts.map(({ role, source }) => [
      role,
      source === "nome" ? "nome" : "google",
    ]),
  );

  const defaultValues: SaveOnboardingBrandKitFormValues = {
    source: brandKit?.source ?? "guiado",
    colors: { ...defaultBrandColors, ...colorByRole },
    titleFont: fontByRole.titulo ?? DEFAULT_TITLE_FONT,
    bodyFont: fontByRole.paragrafo ?? DEFAULT_BODY_FONT,
    highlightFont: fontByRole.destaque ?? "",
    fontSources: {
      titulo: fontSourceByRole.titulo ?? "google",
      paragrafo: fontSourceByRole.paragrafo ?? "google",
      destaque: fontSourceByRole.destaque ?? "google",
    },
    licenseConfirmed: fonts.some(({ licenseConfirmed }) => licenseConfirmed),
    imageStyle: brandKit?.imageStyle ?? undefined,
    restrictions: restrictions.map(({ value }) => value),
  } as SaveOnboardingBrandKitFormValues;

  return {
    storeName: store.name,
    products,
    defaultValues,
    uploadedAssets,
  };
}

export async function getVoiceStepData(userId: string) {
  const store = await getOwnedStore(userId);
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!store || !brandKit) {
    return null;
  }

  const [
    [voice],
    terms,
    storePersonas,
    [positioning],
    storeCompetitors,
    products,
    exampleAssets,
  ] = await Promise.all([
    db.select().from(brandVoice).where(eq(brandVoice.brandKitId, brandKit.id)),
    db.select().from(brandTerms).where(eq(brandTerms.brandKitId, brandKit.id)),
    db.select().from(personas).where(eq(personas.brandKitId, brandKit.id)),
    db
      .select()
      .from(storePositioning)
      .where(eq(storePositioning.storeId, store.id)),
    db
      .select({ handle: competitors.handle })
      .from(competitors)
      .where(eq(competitors.storeId, store.id)),
    getProductNames(store.id),
    db
      .select()
      .from(brandAssets)
      .where(
        and(
          eq(brandAssets.brandKitId, brandKit.id),
          inArray(brandAssets.kind, [...postExampleKinds]),
        ),
      )
      .orderBy(asc(brandAssets.createdAt)),
  ]);

  const exampleUrls = await signStoragePaths(
    exampleAssets.map(({ storagePath }) => storagePath),
  );
  const postExamples: PostExample[] = exampleAssets.flatMap((asset, index) => {
    const url = exampleUrls[index]?.signedUrl;

    return url && isPostExampleKind(asset.kind)
      ? [{ id: asset.id, kind: asset.kind, url, fileName: asset.label ?? "" }]
      : [];
  });

  const defaultValues: SaveOnboardingVoiceFormValues = {
    tone: {
      formalCasual: voice?.formalCasual ?? 70,
      seriousFun: voice?.seriousFun ?? 45,
      technicalSimple: voice?.technicalSimple ?? 80,
      educationalSales: voice?.educationalSales ?? 35,
    },
    sampleApproved: voice?.sampleApproved ?? false,
    lovedTerms: terms
      .filter(({ kind }) => kind === "amada")
      .map(({ term }) => term),
    forbiddenTerms: terms
      .filter(({ kind }) => kind === "proibida")
      .map(({ term }) => term),
    personas: storePersonas.map(({ name, age, description, confirmed }) => ({
      name,
      age: age ?? 30,
      description,
      confirmed,
    })),
    differentiators: positioning?.differentiators ?? "",
    objections: positioning?.objections ?? "",
    competitors: [0, 1, 2].map(
      (index) => storeCompetitors[index]?.handle ?? "",
    ),
  };

  return {
    isRegulated: store.isRegulated,
    segment: store.segment,
    sampleCaption: voice?.sampleCaption ?? "",
    firstProduct: products[0],
    defaultValues,
    postExamples,
  };
}

export async function getPlanStepData(userId: string) {
  const store = await getOwnedStore(userId);

  if (!store) {
    return null;
  }

  const [[diagnosis], [plan]] = await Promise.all([
    db
      .select()
      .from(diagnostics)
      .where(
        and(
          eq(diagnostics.storeId, store.id),
          eq(diagnostics.isBaseline, true),
        ),
      )
      .orderBy(desc(diagnostics.createdAt))
      .limit(1),
    db
      .select()
      .from(contentPlans)
      .where(eq(contentPlans.storeId, store.id))
      .orderBy(desc(contentPlans.createdAt))
      .limit(1),
  ]);

  if (!diagnosis || !plan) {
    return null;
  }

  const rationale = plan.rationale as {
    startDate?: string;
    items?: PlanItem[];
  };

  return {
    diagnosis,
    sources: diagnosis.sources as Record<string, boolean>,
    planStartDate: rationale.startDate ?? plan.month,
    planItems: rationale.items ?? [],
    isPlanApproved: plan.status === "aprovado",
  };
}

export async function getBrandRulesData(userId: string) {
  const store = await getOwnedStore(userId);
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!brandKit) {
    return null;
  }

  const [rules, [manual]] = await Promise.all([
    db
      .select({ id: brandRules.id, rule: brandRules.rule })
      .from(brandRules)
      .where(
        and(
          eq(brandRules.brandKitId, brandKit.id),
          eq(brandRules.source, "manual"),
          eq(brandRules.isActive, true),
        ),
      ),
    db
      .select({ label: brandAssets.label })
      .from(brandAssets)
      .where(
        and(
          eq(brandAssets.brandKitId, brandKit.id),
          eq(brandAssets.kind, "manual"),
        ),
      ),
  ]);

  return { rules, manualFileName: manual?.label ?? undefined };
}
