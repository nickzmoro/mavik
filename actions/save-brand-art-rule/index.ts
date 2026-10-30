"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { brandArtRules } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import {
  getCurrentBrandKit,
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import { saveBrandArtRuleSchema, type SaveBrandArtRuleInput } from "./schema";

export async function saveBrandArtRule(
  input: SaveBrandArtRuleInput,
): Promise<AuthActionResult> {
  const parsedInput = saveBrandArtRuleSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const store = await getOwnedStore(userId);
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!brandKit) {
    return authFailure(onboardingErrorMessages.storeMissing);
  }

  const { id, rule, isActive } = parsedInput.data;

  try {
    const savedRules = id
      ? await db
          .update(brandArtRules)
          .set({ rule, isActive })
          .where(
            and(
              eq(brandArtRules.id, id),
              eq(brandArtRules.brandKitId, brandKit.id),
            ),
          )
          .returning({ id: brandArtRules.id })
      : await db
          .insert(brandArtRules)
          .values({ brandKitId: brandKit.id, rule, isActive })
          .returning({ id: brandArtRules.id });

    if (savedRules.length === 0) {
      return authFailure(onboardingErrorMessages.saveFailed);
    }
  } catch (error) {
    console.error("[brand] falha ao salvar regra de direção de arte", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess(undefined);
}
