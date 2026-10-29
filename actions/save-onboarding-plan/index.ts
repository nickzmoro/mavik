"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { contents, contentPlans, stores } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";
import type { PlanItem } from "@/lib/onboarding/thirty-day-plan";

import {
  saveOnboardingPlanSchema,
  type SaveOnboardingPlanInput,
} from "./schema";

const DAY_MS = 24 * 60 * 60 * 1000;
const PUBLISH_HOUR_UTC = 13;

function toScheduledAt(startDate: string, day: number) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();

  return new Date(
    start + (day - 1) * DAY_MS + PUBLISH_HOUR_UTC * 60 * 60 * 1000,
  );
}

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

    const sortedItems = [...items].sort(
      (first, second) => first.day - second.day,
    );
    const currentRationale = plan.rationale as Record<string, unknown> & {
      startDate?: string;
    };
    const rationale = { ...currentRationale, items: sortedItems };
    const startDate = currentRationale.startDate ?? plan.month;

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
          .delete(contents)
          .where(
            and(
              eq(contents.planId, plan.id),
              eq(contents.origin, "onboarding"),
              eq(contents.status, "ideia"),
            ),
          );

        if (sortedItems.length > 0) {
          await tx.insert(contents).values(
            sortedItems.map((item: PlanItem) => ({
              storeId: store.id,
              planId: plan.id,
              title: item.title,
              format: item.format,
              goal: item.goal,
              scheduledAt: toScheduledAt(startDate, item.day),
              status: "ideia" as const,
              origin: "onboarding" as const,
              createdBy: userId,
            })),
          );
        }

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
