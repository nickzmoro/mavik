import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getInitials } from "@/lib/get-initials";
import { getOnboardingData } from "@/lib/onboarding/get-onboarding-data";
import { getOnboardingStepRoute, routes } from "@/lib/routes";
import { getCurrentUserProfile } from "@/lib/supabase/get-current-user-profile";

import { OnboardingWorkspace } from "./components/onboarding-workspace";
import { parseOnboardingStep } from "./utils/parse-onboarding-step";

export const metadata: Metadata = {
  title: "Configuração da conta",
  robots: { index: false, follow: false },
};

type OnboardingPageProps = {
  searchParams: Promise<{ etapa?: string }>;
};

async function OnboardingLoader({ searchParams }: OnboardingPageProps) {
  const [{ etapa }, { fullName, email }, data] = await Promise.all([
    searchParams,
    getCurrentUserProfile(),
    getOnboardingData(),
  ]);

  if (!data) {
    redirect(routes.login);
  }

  const unlockedStep = parseOnboardingStep(data.currentStep);
  const requestedStep = etapa ? parseOnboardingStep(etapa) : unlockedStep;

  const isPlanMissing = requestedStep === 4 && !data.plan;

  if (requestedStep > unlockedStep || isPlanMissing) {
    redirect(
      getOnboardingStepRoute(
        Math.min(unlockedStep, isPlanMissing ? 3 : unlockedStep),
      ),
    );
  }

  return (
    <OnboardingWorkspace
      step={requestedStep}
      userInitials={getInitials(fullName || email, "U")}
      data={data}
    />
  );
}

export default function OnboardingPage({ searchParams }: OnboardingPageProps) {
  return (
    <Suspense fallback={null}>
      <OnboardingLoader searchParams={searchParams} />
    </Suspense>
  );
}
