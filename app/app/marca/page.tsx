import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppShell } from "@/components/app/app-shell";
import { OnboardingStepSkeleton } from "@/components/onboarding/onboarding-step-skeleton";
import { Button } from "@/components/ui/button";
import {
  getBrandRulesData,
  getBrandStepData,
  getCompanyStepData,
  getVoiceStepData,
} from "@/lib/onboarding/get-step-data";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import { CompanyForm } from "@/components/brand/company/company-form";
import { BrandKitForm } from "@/components/brand/brand-kit/brand-kit-form";
import { VoiceForm } from "@/components/brand/voice/voice-form";

import { BrandRulesPanel } from "@/components/brand/rules/brand-rules-panel";
import {
  brandTabs,
  BrandTabsNav,
  type BrandTabId,
} from "./components/brand-tabs-nav";

export const metadata: Metadata = {
  title: "Marca",
  robots: { index: false, follow: false },
};

function MissingStepNotice({ href }: { href: string }) {
  return (
    <div className="mt-8 flex flex-col items-start gap-3 rounded-(--r-lg) border border-border bg-bg p-6">
      <p className="m-0 text-base text-text">
        Complete a configuração da conta para editar esta parte.
      </p>
      <Button asChild variant="brand">
        <Link href={href}>Continuar configuração</Link>
      </Button>
    </div>
  );
}

async function BrandTabContent({
  tab,
  userId,
}: {
  tab: BrandTabId;
  userId: string;
}) {
  if (tab === "empresa") {
    return (
      <CompanyForm
        defaultValues={await getCompanyStepData(userId)}
        isSettings
      />
    );
  }

  if (tab === "brand-kit") {
    const brandStepData = await getBrandStepData(userId);

    return brandStepData ? (
      <BrandKitForm {...brandStepData} isSettings />
    ) : (
      <MissingStepNotice href={routes.onboardingCompany} />
    );
  }

  if (tab === "voz") {
    const voiceStepData = await getVoiceStepData(userId);

    return voiceStepData ? (
      <VoiceForm {...voiceStepData} isSettings />
    ) : (
      <MissingStepNotice href={routes.onboardingBrand} />
    );
  }

  const rulesData = await getBrandRulesData(userId);

  return rulesData ? (
    <BrandRulesPanel {...rulesData} />
  ) : (
    <MissingStepNotice href={routes.onboardingBrand} />
  );
}

async function BrandTabs({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string }>;
}) {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(routes.login);
  }

  const { aba } = await searchParams;
  const activeTab = brandTabs.find(({ id }) => id === aba)?.id ?? "empresa";

  return (
    <>
      <BrandTabsNav activeTab={activeTab} />
      <BrandTabContent key={activeTab} tab={activeTab} userId={userId} />
    </>
  );
}

export default function BrandPage({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string }>;
}) {
  return (
    <AppShell
      activeHref={routes.brand}
      section="Marca"
      title="Sua marca"
      description="Empresa, Brand Kit, voz e as regras que a IA segue em toda arte. Tudo é salvo automaticamente."
    >
      <Suspense fallback={<OnboardingStepSkeleton />}>
        <BrandTabs searchParams={searchParams} />
      </Suspense>
    </AppShell>
  );
}
