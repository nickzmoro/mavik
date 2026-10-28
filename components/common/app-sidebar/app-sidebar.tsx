import { Suspense } from "react";

import { SidebarAccount, SidebarAccountSkeleton } from "./sidebar-account";
import { SidebarContent } from "./sidebar-content";
import { SidebarMobile } from "./sidebar-mobile";
import { SidebarPanel } from "./sidebar-panel";

export function AppSidebar() {
  const account = (
    <Suspense fallback={<SidebarAccountSkeleton />}>
      <SidebarAccount />
    </Suspense>
  );

  return (
    <>
      <SidebarMobile account={account} />
      <aside
        aria-label="Menu principal"
        className="sticky top-4 hidden h-[calc(100dvh-2rem)] w-62 shrink-0 lg:block"
      >
        <SidebarPanel className="h-full">
          <SidebarContent account={account} />
        </SidebarPanel>
      </aside>
    </>
  );
}
