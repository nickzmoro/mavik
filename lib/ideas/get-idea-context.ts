import "server-only";

import { and, asc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  brandRules,
  brandTerms,
  brandVoice,
  ideas,
  personas,
  storePositioning,
  storeProducts,
  type stores,
} from "@/db/schema";
import type { IdeaPromptContext } from "@/lib/ai/prompts/ideas";
import { businessGoals } from "@/lib/onboarding/constants";
import { getCurrentBrandKit } from "@/lib/onboarding/store-access";

type Store = typeof stores.$inferSelect;

const todayInSaoPaulo = (now: Date) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
    now,
  );

export async function getIdeaContext(
  store: Store,
  now: Date,
): Promise<IdeaPromptContext> {
  const brandKit = await getCurrentBrandKit(store.id);
  const forBrandKit = <TRow>(query: (brandKitId: string) => Promise<TRow[]>) =>
    brandKit ? query(brandKit.id) : Promise.resolve<TRow[]>([]);
  const [
    products,
    [positioning],
    storePersonas,
    [voice],
    terms,
    activeRules,
    existingIdeas,
  ] = await Promise.all([
    db
      .select({ name: storeProducts.name })
      .from(storeProducts)
      .where(eq(storeProducts.storeId, store.id))
      .orderBy(asc(storeProducts.position)),
    db
      .select()
      .from(storePositioning)
      .where(eq(storePositioning.storeId, store.id)),
    forBrandKit((brandKitId) =>
      db.select().from(personas).where(eq(personas.brandKitId, brandKitId)),
    ),
    forBrandKit((brandKitId) =>
      db.select().from(brandVoice).where(eq(brandVoice.brandKitId, brandKitId)),
    ),
    forBrandKit((brandKitId) =>
      db.select().from(brandTerms).where(eq(brandTerms.brandKitId, brandKitId)),
    ),
    forBrandKit((brandKitId) =>
      db
        .select({ rule: brandRules.rule })
        .from(brandRules)
        .where(
          and(
            eq(brandRules.brandKitId, brandKitId),
            eq(brandRules.isActive, true),
          ),
        ),
    ),
    db
      .select({ title: ideas.title })
      .from(ideas)
      .where(eq(ideas.storeId, store.id)),
  ]);

  return {
    storeName: store.name,
    segment: store.segment,
    city: store.city && store.state ? `${store.city}, ${store.state}` : null,
    products: products.map(({ name }) => name),
    differentiators: positioning?.differentiators ?? null,
    objections: positioning?.objections ?? null,
    businessGoal:
      businessGoals.find(({ value }) => value === store.mainGoal)?.label ??
      null,
    currentObjective: store.currentObjective,
    personas: storePersonas.map(({ name, age, description }) => ({
      name,
      age,
      description,
    })),
    tone: voice?.toneLabel ?? null,
    lovedTerms: terms
      .filter(({ kind }) => kind === "amada")
      .map(({ term }) => term),
    forbiddenTerms: terms
      .filter(({ kind }) => kind === "proibida")
      .map(({ term }) => term),
    brandRules: activeRules.map(({ rule }) => rule),
    existingTitles: existingIdeas.map(({ title }) => title),
    today: todayInSaoPaulo(now),
  };
}
