import { redirect } from "next/navigation";

import { onboardingSteps } from "@/lib/onboarding/constants";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

export async function OnboardingGate() {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!store || (!store.onboardingCompletedAt && store.onboardingStep < 4)) {
    redirect(onboardingSteps[(store?.onboardingStep ?? 1) - 1].href);
  }

  return null;
}
