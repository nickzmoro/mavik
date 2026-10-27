import { useMutation } from "@tanstack/react-query";

import { saveOnboardingBrandKit } from "@/actions/save-onboarding-brand-kit";

export const getSaveOnboardingBrandKitMutationKey = () =>
  ["save-onboarding-brand-kit"] as const;

export function useSaveOnboardingBrandKit() {
  return useMutation({
    mutationKey: getSaveOnboardingBrandKitMutationKey(),
    mutationFn: saveOnboardingBrandKit,
  });
}
