import "server-only";

import { cache } from "react";

import {
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

export const getOnboardingStatus = cache(async () => {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const store = await getOwnedStore(userId);

  return {
    isCompleted: Boolean(store?.onboardingCompletedAt),
    currentStep: store?.onboardingStep ?? 1,
  };
});
