import "server-only";

import { getOnboardingStatus } from "./get-onboarding-status";
import {
  getBrandStepData,
  getCompanyStepData,
  getPlanStepData,
  getVoiceStepData,
} from "./get-step-data";
import { getCurrentUserId } from "./store-access";

export type OnboardingData = NonNullable<
  Awaited<ReturnType<typeof getOnboardingData>>
>;

export async function getOnboardingData() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const [status, company, brandKit, voice, plan] = await Promise.all([
    getOnboardingStatus(),
    getCompanyStepData(userId),
    getBrandStepData(userId),
    getVoiceStepData(userId),
    getPlanStepData(userId),
  ]);

  return {
    currentStep: status?.currentStep ?? 1,
    company,
    brandKit,
    voice,
    plan,
  };
}
