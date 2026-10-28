import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AppBackground } from "@/components/common/app-background";
import { AppSidebar } from "@/components/common/app-sidebar/app-sidebar";
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
        <div className="relative isolate min-h-dvh overflow-clip bg-app-canvas font-sans text-text">
          <AppBackground />
          <div className="relative flex min-h-dvh flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:items-start lg:gap-6">
            <AppSidebar />
            <main className="flex min-w-0 flex-1 flex-col gap-6 px-1 pt-2 pb-8 lg:pt-4 lg:pr-4 lg:pl-2">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </>
  );
}
