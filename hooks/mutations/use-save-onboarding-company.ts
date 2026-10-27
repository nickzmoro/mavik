import { useMutation } from "@tanstack/react-query";

import { saveOnboardingCompany } from "@/actions/save-onboarding-company";

export const getSaveOnboardingCompanyMutationKey = () =>
  ["save-onboarding-company"] as const;

export function useSaveOnboardingCompany() {
  return useMutation({
    mutationKey: getSaveOnboardingCompanyMutationKey(),
    mutationFn: saveOnboardingCompany,
  });
}
