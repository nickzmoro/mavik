"use client";

import { useRouter } from "next/navigation";

import type { OnboardingStepNumber } from "@/lib/onboarding/constants";
import type { OnboardingData } from "@/lib/onboarding/get-onboarding-data";
import { getOnboardingStepRoute, routes } from "@/lib/routes";

import { toInitialBrandAssets, useBrandAssets } from "../hooks/use-brand-assets";
import { BrandKitStep } from "./brand-kit-step";
import { CompanyStep } from "./company-step";
import { OnboardingHeader } from "./onboarding-header";
import { OnboardingStepper } from "./onboarding-stepper";
import { PlanStep } from "./plan-step";
import { VoiceStep } from "./voice-step";

type OnboardingWorkspaceProps = {
  step: OnboardingStepNumber;
  userInitials: string;
  data: OnboardingData;
};

export function OnboardingWorkspace({
  step,
  userInitials,
  data,
}: OnboardingWorkspaceProps) {
  const router = useRouter();
  const brandAssets = useBrandAssets(
    toInitialBrandAssets(
      data.brandKit?.uploadedAssets,
      data.voice?.postExamples,
    ),
  );

  const goToStep = (targetStep: number) =>
    router.push(getOnboardingStepRoute(targetStep));
  const handleExit = () => router.push(routes.authenticatedHome);

  return (
    <>
      <OnboardingHeader userInitials={userInitials} />
      <OnboardingStepper currentStep={step} />

      {step === 1 ? (
        <CompanyStep
          defaultValues={data.company}
          onExit={handleExit}
          onContinue={() => goToStep(2)}
        />
      ) : null}

      {step === 2 ? (
        <BrandKitStep
          defaultValues={data.brandKit?.defaultValues}
          brandAssets={brandAssets}
          onExit={handleExit}
          onBack={() => goToStep(1)}
          onContinue={() => goToStep(3)}
        />
      ) : null}

      {step === 3 ? (
        <VoiceStep
          defaultValues={data.voice?.defaultValues}
          context={{
            segment: data.voice?.segment ?? "",
            firstProduct: data.voice?.firstProduct ?? "",
            isRegulated: data.voice?.isRegulated ?? false,
            sampleCaption: data.voice?.sampleCaption ?? "",
          }}
          brandAssets={brandAssets}
          onExit={handleExit}
          onBack={() => goToStep(2)}
          onContinue={() => goToStep(4)}
        />
      ) : null}

      {step === 4 && data.plan ? (
        <PlanStep
          plan={data.plan}
          onBack={() => goToStep(3)}
          onFinish={() => router.push(routes.studio)}
        />
      ) : null}
    </>
  );
}
