import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OnboardingStepIntro } from "@/components/onboarding/onboarding-step-intro";
import { OnboardingStepSkeleton } from "@/components/onboarding/onboarding-step-skeleton";
import { getCompanyStepData } from "@/lib/onboarding/get-step-data";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import { CompanyForm } from "@/components/brand/company/company-form";

async function CompanyStep() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(routes.login);
  }

  return <CompanyForm defaultValues={await getCompanyStepData(userId)} />;
}

export default function OnboardingCompanyPage() {
  return (
    <>
      <OnboardingStepIntro
        step={1}
        title="Conte sobre sua empresa"
        description="Um assunto por tela, sem formulário gigante. Você pode editar tudo depois."
      />
      <Suspense fallback={<OnboardingStepSkeleton />}>
        <CompanyStep />
      </Suspense>
    </>
  );
}
