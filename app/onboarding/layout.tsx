import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { OnboardingStepper } from "@/components/onboarding/onboarding-stepper";
import { getOwnedStore } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";

export const metadata: Metadata = {
  title: "Configuração da conta",
  robots: { index: false, follow: false },
};

async function AuthenticatedHeader() {
  const claims = await getCurrentUserClaims();

  if (!claims) {
    redirect(routes.login);
  }

  const fullName = claims.user_metadata?.full_name;

  return (
    <OnboardingHeader userName={typeof fullName === "string" ? fullName : ""} />
  );
}

async function StepperWithProgress() {
  const claims = await getCurrentUserClaims();
  const store = claims?.sub ? await getOwnedStore(claims.sub) : null;

  return <OnboardingStepper reachedStep={store?.onboardingStep ?? 1} />;
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-light min-h-screen bg-[radial-gradient(circle_at_top_right,var(--violet-100),var(--bg)_45%)] font-sans text-text">
      <Suspense fallback={<OnboardingHeader userName="" />}>
        <AuthenticatedHeader />
      </Suspense>

      <div className="mx-auto w-full max-w-[1280px] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-b border-border px-4 py-5 sm:px-6 lg:sticky lg:top-0 lg:flex lg:h-[calc(100vh-64px)] lg:flex-col lg:justify-between lg:border-r lg:border-b-0 lg:py-8">
          <Suspense fallback={<OnboardingStepper reachedStep={1} />}>
            <StepperWithProgress />
          </Suspense>
          <div className="hidden lg:block">
            <p className="m-0 text-sm font-semibold text-text">
              Pode sair quando quiser
            </p>
            <p className="m-0 mt-1 text-sm leading-normal text-muted">
              Tudo é salvo automaticamente. Você retoma de onde parou, em
              qualquer dispositivo.
            </p>
          </div>
        </aside>

        <main className="px-4 pt-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
