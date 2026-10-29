"use client";

import { usePathname } from "next/navigation";

import { AppBackground } from "@/components/common/app-background";
import { routes } from "@/lib/routes";

type AppShellProps = {
  sidebar: React.ReactNode;
  banner: React.ReactNode;
  children: React.ReactNode;
};

export function AppShell({ sidebar, banner, children }: AppShellProps) {
  const pathname = usePathname();
  const isOnboarding = pathname === routes.onboarding;

  return (
    <div className="relative isolate min-h-dvh overflow-clip bg-app-canvas font-sans text-text">
      <AppBackground />
      {isOnboarding ? (
        <div className="relative flex min-h-dvh flex-col">{children}</div>
      ) : (
        <div className="relative flex min-h-dvh flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:items-start lg:gap-6">
          {sidebar}
          <main className="flex min-w-0 flex-1 flex-col gap-6 px-1 pt-2 pb-8 lg:pt-4 lg:pr-4 lg:pl-2">
            {banner}
            {children}
          </main>
        </div>
      )}
    </div>
  );
}
