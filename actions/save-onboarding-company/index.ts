"use server";

import { and, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { profiles, storeMembers, storeProducts, stores } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import {
  isRegulatedSegment,
  onboardingSteps,
} from "@/lib/onboarding/constants";
import { getCurrentUserId } from "@/lib/onboarding/store-access";

import {
  saveOnboardingCompanySchema,
  type SaveOnboardingCompanyInput,
} from "./schema";

function toSlug(name: string) {
  const baseSlug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return `${baseSlug || "loja"}-${crypto.randomUUID().slice(0, 6)}`;
}

function toWebsiteUrl(website: string) {
  if (!website) {
    return null;
  }

  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export async function saveOnboardingCompany(
  input: SaveOnboardingCompanyInput,
): Promise<AuthActionResult<{ redirectTo?: string }>> {
  const parsedInput = saveOnboardingCompanySchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const { products, location, marketingLevel, shouldAdvance, ...company } =
    parsedInput.data;
  const [city, state] = location.split(",").map((part) => part.trim());

  const storeValues = {
    name: company.name,
    segment: company.segment,
    city,
    state: state.toUpperCase(),
    servesOnline: company.servesOnline,
    websiteUrl: toWebsiteUrl(company.websiteUrl),
    instagramHandle: company.instagramHandle
      ? `@${company.instagramHandle.replace(/^@/, "")}`
      : null,
    mainGoal: company.mainGoal,
    isRegulated: isRegulatedSegment(company.segment),
  };

  try {
    await db.transaction(async (tx) => {
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtext(${`onboarding:${userId}`}))`,
      );

      const [ownedStore] = await tx
        .select({ id: stores.id, onboardingStep: stores.onboardingStep })
        .from(stores)
        .innerJoin(storeMembers, eq(storeMembers.storeId, stores.id))
        .where(
          and(eq(storeMembers.userId, userId), eq(storeMembers.role, "owner")),
        )
        .limit(1);

      const nextStep = shouldAdvance ? 2 : 1;

      const storeId = ownedStore
        ? ownedStore.id
        : (
            await tx
              .insert(stores)
              .values({
                ...storeValues,
                slug: toSlug(company.name),
                onboardingStep: nextStep,
                createdBy: userId,
              })
              .returning({ id: stores.id })
          )[0].id;

      if (ownedStore) {
        await tx
          .update(stores)
          .set({
            ...storeValues,
            onboardingStep: Math.max(ownedStore.onboardingStep, nextStep),
          })
          .where(eq(stores.id, storeId));
      }

      await tx.delete(storeProducts).where(eq(storeProducts.storeId, storeId));
      await tx.insert(storeProducts).values(
        products.map((productName, position) => ({
          storeId,
          name: productName,
          position,
        })),
      );

      await tx
        .update(profiles)
        .set({ marketingLevel })
        .where(eq(profiles.id, userId));
    });
  } catch (error) {
    console.error("[onboarding] falha ao salvar empresa", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess({
    redirectTo: shouldAdvance ? onboardingSteps[1].href : undefined,
  });
}
