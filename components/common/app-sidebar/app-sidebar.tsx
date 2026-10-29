import { Suspense } from "react";

import { SidebarAccount, SidebarAccountSkeleton } from "./sidebar-account";
import { SidebarContent } from "./sidebar-content";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarPanel } from "./sidebar-panel";
import {
  SidebarStoreSwitcher,
  SidebarStoreSwitcherSkeleton,
} from "./sidebar-store-switcher";

export function AppSidebar() {
  const account = (
    <Suspense fallback={<SidebarAccountSkeleton />}>
      <SidebarAccount />
    </Suspense>
  );
  const store = (
    <Suspense fallback={<SidebarStoreSwitcherSkeleton />}>
      <SidebarStoreSwitcher />
    </Suspense>
  );

  return (
    <>
      <SidebarMobile account={account} store={store} />
      <aside
        aria-label="Menu principal"
        className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-62 shrink-0 lg:block"
      >
        <SidebarPanel className="h-full">
          <SidebarContent account={account} store={store} />
        </SidebarPanel>
      </aside>
    </>
  );
}
