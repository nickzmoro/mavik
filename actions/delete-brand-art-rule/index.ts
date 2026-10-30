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

import {
  deleteBrandArtRuleSchema,
  type DeleteBrandArtRuleInput,
} from "./schema";

export async function deleteBrandArtRule(
  input: DeleteBrandArtRuleInput,
): Promise<AuthActionResult> {
  const parsedInput = deleteBrandArtRuleSchema.safeParse(input);

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

  try {
    await db
      .delete(brandArtRules)
      .where(
        and(
          eq(brandArtRules.id, parsedInput.data.id),
          eq(brandArtRules.brandKitId, brandKit.id),
        ),
      );
  } catch (error) {
    console.error("[brand] falha ao remover regra de direção de arte", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess(undefined);
}
