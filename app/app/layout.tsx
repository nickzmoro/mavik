import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppShell } from "@/components/common/app-shell";
import { AppSidebar } from "@/components/common/app-sidebar/app-sidebar";
import { FeedbackWidget } from "@/components/common/feedback-widget/feedback-widget";
import { OnboardingBanner } from "@/components/common/onboarding-banner";
import { routes } from "@/lib/routes";
import { ToastProvider } from "@/providers/toast-provider";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";

async function RequireAuth() {
  const claims = await getCurrentUserClaims();

  if (!claims) {
    redirect(routes.login);
  }

  return null;
}

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <RequireAuth />
      </Suspense>
      <ToastProvider>
        <AppShell
          sidebar={<AppSidebar />}
          banner={
            <Suspense fallback={null}>
              <OnboardingBanner />
            </Suspense>
          }
        >
          {children}
        </AppShell>
        <FeedbackWidget />
      </ToastProvider>
    </>
  );
}
