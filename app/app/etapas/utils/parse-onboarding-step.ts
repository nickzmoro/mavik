import {
  onboardingSteps,
  type OnboardingStepNumber,
} from "@/lib/onboarding/constants";

export function parseOnboardingStep(
  value: string | number | undefined,
): OnboardingStepNumber {
  const matchedStep = onboardingSteps.find(
    ({ number }) => String(number) === String(value),
  );

  return matchedStep?.number ?? onboardingSteps[0].number;
}
