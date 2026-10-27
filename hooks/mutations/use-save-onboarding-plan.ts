import { useMutation } from "@tanstack/react-query";

import { saveOnboardingPlan } from "@/actions/save-onboarding-plan";

export const getSaveOnboardingPlanMutationKey = () =>
  ["save-onboarding-plan"] as const;

export function useSaveOnboardingPlan() {
  return useMutation({
    mutationKey: getSaveOnboardingPlanMutationKey(),
    mutationFn: saveOnboardingPlan,
  });
}
