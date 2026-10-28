import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OnboardingStepIntro } from "@/components/onboarding/onboarding-step-intro";
import { OnboardingStepSkeleton } from "@/components/onboarding/onboarding-step-skeleton";
import { getBrandStepData } from "@/lib/onboarding/get-step-data";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import { BrandKitForm } from "@/components/brand/brand-kit/brand-kit-form";

async function BrandKitStep() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(routes.login);
  }

  const brandStepData = await getBrandStepData(userId);

  if (!brandStepData) {
    redirect(routes.onboardingCompany);
  }

  return <BrandKitForm {...brandStepData} />;
}

export default function OnboardingBrandPage() {
  return (
    <>
      <OnboardingStepIntro
        step={2}
        title="Monte seu Brand Kit"
        description="A base de tudo. Pedimos só o mínimo para liberar o Estúdio; o resto vem aos poucos."
      />
      <Suspense fallback={<OnboardingStepSkeleton />}>
        <BrandKitStep />
      </Suspense>
    </>
  );
}
