import { Suspense } from "react";

import { AppHeaderActions } from "@/components/common/app-header-actions";
import { formatLongDate, getGreeting } from "@/lib/greeting";
import { getCurrentUserProfile } from "@/lib/supabase/get-current-user-profile";

async function HomeGreeting() {
  const { fullName } = await getCurrentUserProfile();
  const now = new Date();
  const firstName = fullName.split(/\s+/)[0];
  const greeting = getGreeting(now);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs leading-[1.4] font-semibold text-muted">
        {formatLongDate(now)}
      </span>
      <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
        {firstName ? `${greeting}, ${firstName}` : greeting}
      </h1>
    </div>
  );
}

function HomeGreetingSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      <span className="h-3.5 w-44 animate-pulse rounded-full bg-text/10 motion-reduce:animate-none" />
      <span className="h-8 w-56 animate-pulse rounded-full bg-text/10 motion-reduce:animate-none sm:h-9.5" />
    </div>
  );
}

export function HomeHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <Suspense fallback={<HomeGreetingSkeleton />}>
        <HomeGreeting />
      </Suspense>
      <AppHeaderActions />
    </header>
  );
}
