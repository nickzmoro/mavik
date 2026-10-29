"use client";

import { useRouter } from "next/navigation";

import type { OnboardingStepNumber } from "@/lib/onboarding/constants";
import type { OnboardingData } from "@/lib/onboarding/get-onboarding-data";
import {
  getOnboardingStepRoute,
  getStudioUrlForPauta,
  routes,
} from "@/lib/routes";

import {
  toInitialBrandAssets,
  useBrandAssets,
} from "../hooks/use-brand-assets";
import { BrandKitStep } from "./brand-kit-step";
import { CompanyStep } from "./company-step";
import { OnboardingHeader } from "./onboarding-header";
import { OnboardingStepper } from "./onboarding-stepper";
import { PlanStep } from "./plan-step";
import { VoiceStep } from "./voice-step";

type OnboardingWorkspaceProps = {
  step: OnboardingStepNumber;
  reachedStep: OnboardingStepNumber;
  userInitials: string;
  data: OnboardingData;
};

export function OnboardingWorkspace({
  step,
  reachedStep,
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
  const handleFinish = (firstPauta?: string) =>
    router.push(firstPauta ? getStudioUrlForPauta(firstPauta) : routes.studio);

  return (
    <>
      <OnboardingHeader userInitials={userInitials} />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="flex flex-col justify-between gap-8 rounded-none border-x-0 border-t-0 px-4 py-4 sm:px-6 lg:sticky lg:top-5 lg:h-[calc(100dvh-4rem)] lg:border-b-0 lg:py-8">
          <OnboardingStepper currentStep={step} reachedStep={reachedStep} />
          <div className="hidden lg:block">
            <p className="m-0 text-sm font-semibold">Pode sair quando quiser</p>
            <p className="m-0 mt-1 text-sm leading-normal text-muted">
              Seu progresso é salvo a cada etapa. Você retoma de onde parou, em
              qualquer dispositivo.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
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
              onFinish={handleFinish}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
