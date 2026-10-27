import { useMutation } from "@tanstack/react-query";

import { saveOnboardingVoice } from "@/actions/save-onboarding-voice";

export const getSaveOnboardingVoiceMutationKey = () =>
  ["save-onboarding-voice"] as const;

export function useSaveOnboardingVoice() {
  return useMutation({
    mutationKey: getSaveOnboardingVoiceMutationKey(),
    mutationFn: saveOnboardingVoice,
  });
}
