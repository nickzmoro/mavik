import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  brandAssets,
  brandColors,
  brandFonts,
  brandTerms,
  brandVoice,
  competitors,
  contentPlans,
  diagnostics,
  personas,
  storePositioning,
  storeProducts,
  type brandKits,
  type stores,
} from "@/db/schema";

import { buildThirtyDayPlan, computeDiagnosis } from "./diagnosis";

type Store = typeof stores.$inferSelect;
type BrandKit = typeof brandKits.$inferSelect;

function toDateString(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function generateOnboardingDiagnosis(
  store: Store,
  brandKit: BrandKit,
) {
  const brandKitId = brandKit.id;
  const [
    products,
    colors,
    fonts,
    logos,
    [voice],
    terms,
    storePersonas,
    [positioning],
    storeCompetitors,
  ] = await Promise.all([
    db
      .select({ name: storeProducts.name })
      .from(storeProducts)
      .where(eq(storeProducts.storeId, store.id))
      .orderBy(asc(storeProducts.position)),
    db
      .select({ id: brandColors.id })
      .from(brandColors)
      .where(eq(brandColors.brandKitId, brandKitId)),
    db
      .select({ role: brandFonts.role })
      .from(brandFonts)
      .where(eq(brandFonts.brandKitId, brandKitId)),
    db
      .select({ kind: brandAssets.kind })
      .from(brandAssets)
      .where(eq(brandAssets.brandKitId, brandKitId)),
    db.select().from(brandVoice).where(eq(brandVoice.brandKitId, brandKitId)),
    db
      .select({ kind: brandTerms.kind })
      .from(brandTerms)
      .where(eq(brandTerms.brandKitId, brandKitId)),
    db
      .select({ confirmed: personas.confirmed })
      .from(personas)
      .where(
        and(eq(personas.brandKitId, brandKitId), eq(personas.confirmed, true)),
      ),
    db
      .select()
      .from(storePositioning)
      .where(eq(storePositioning.storeId, store.id)),
    db
      .select({ id: competitors.id })
      .from(competitors)
      .where(eq(competitors.storeId, store.id)),
  ]);

  const productNames = products.map(({ name }) => name);
  const fontRoles = new Set(fonts.map(({ role }) => role));
  const logoKinds = new Set(logos.map(({ kind }) => kind));

  const diagnosis = computeDiagnosis({
    products: productNames,
    hasWebsite: Boolean(store.websiteUrl),
    hasInstagram: Boolean(store.instagramHandle),
    hasMainGoal: Boolean(store.mainGoal),
    colorCount: colors.length,
    hasTitleFont: fontRoles.has("titulo"),
    hasBodyFont: fontRoles.has("paragrafo"),
    logoCount:
      Number(logoKinds.has("logo_claro")) +
      Number(logoKinds.has("logo_escuro")),
    hasImageStyle: Boolean(brandKit.imageStyle),
    hasVoice: Boolean(voice),
    isSampleApproved: Boolean(voice?.sampleApproved),
    lovedTermCount: terms.filter(({ kind }) => kind === "amada").length,
    forbiddenTermCount: terms.filter(({ kind }) => kind === "proibida").length,
    confirmedPersonaCount: storePersonas.length,
    hasDifferentiators: Boolean(positioning?.differentiators),
    hasObjections: Boolean(positioning?.objections),
    competitorCount: storeCompetitors.length,
  });

  const startDate = new Date();
  startDate.setUTCHours(0, 0, 0, 0);
  const month = new Date(
    Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1),
  );
  const planItems = buildThirtyDayPlan(store.name, productNames);
  const rationale = { startDate: toDateString(startDate), items: planItems };

  await db.transaction(async (tx) => {
    await tx
      .delete(diagnostics)
      .where(
        and(
          eq(diagnostics.storeId, store.id),
          eq(diagnostics.isBaseline, true),
        ),
      );

    await tx.insert(diagnostics).values({
      storeId: store.id,
      ...diagnosis,
      sources: { respostas: true, site: false, instagram: false },
      isBaseline: true,
    });

    await tx
      .insert(contentPlans)
      .values({
        storeId: store.id,
        month: toDateString(month),
        weeklyFrequency: "3 a 4 posts por semana",
        focusWeekdays: store.focusWeekdays,
        rationale,
      })
      .onConflictDoUpdate({
        target: [contentPlans.storeId, contentPlans.month],
        set: {
          rationale,
          status: "sugerido",
          approvedBy: null,
          approvedAt: null,
        },
      });
  });
}
