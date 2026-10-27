"use server";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { contentPlans, stores } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import {
  saveOnboardingPlanSchema,
  type SaveOnboardingPlanInput,
} from "./schema";

export async function saveOnboardingPlan(
  input: SaveOnboardingPlanInput,
): Promise<AuthActionResult<{ isApproved: boolean }>> {
  const parsedInput = saveOnboardingPlanSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const store = await getOwnedStore(userId);

  if (!store) {
    return authFailure(onboardingErrorMessages.storeMissing);
  }

  const { items, shouldApprove } = parsedInput.data;

  try {
    const [plan] = await db
      .select()
      .from(contentPlans)
      .where(eq(contentPlans.storeId, store.id))
      .orderBy(desc(contentPlans.createdAt))
      .limit(1);

    if (!plan) {
      return authFailure(onboardingErrorMessages.previousStepMissing);
    }

    const rationale = {
      ...(plan.rationale as Record<string, unknown>),
      items: [...items].sort((first, second) => first.day - second.day),
    };

    await db.transaction(async (tx) => {
      await tx
        .update(contentPlans)
        .set(
          shouldApprove
            ? {
                rationale,
                status: "aprovado",
                approvedBy: userId,
                approvedAt: new Date(),
              }
            : { rationale },
        )
        .where(eq(contentPlans.id, plan.id));

      if (shouldApprove) {
        await tx
          .update(stores)
          .set({
            onboardingCompletedAt: store.onboardingCompletedAt ?? new Date(),
          })
          .where(eq(stores.id, store.id));
      }
    });

    return authSuccess({
      isApproved: shouldApprove || plan.status === "aprovado",
    });
  } catch (error) {
    console.error("[onboarding] falha ao salvar plano", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }
}
