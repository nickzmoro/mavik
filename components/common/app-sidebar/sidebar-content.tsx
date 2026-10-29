import { SidebarLogo } from "./sidebar-logo";
import { SidebarNav } from "./sidebar-nav";
import { SidebarTrialCard } from "./sidebar-trial-card";

type SidebarContentProps = {
  account: React.ReactNode;
  store: React.ReactNode;
  onNavigate?: () => void;
};

export function SidebarContent({
  account,
  store,
  onNavigate,
}: SidebarContentProps) {
  return (
    <div className="relative flex h-full flex-col gap-5 overflow-y-auto px-3.5 pt-5 pb-3.5 [scrollbar-width:none]">
      <SidebarLogo onNavigate={onNavigate} />
      {store}
      <SidebarNav onNavigate={onNavigate} />
      <div className="relative mt-auto flex flex-col gap-3">
        <SidebarTrialCard />
        {account}
      </div>
    </div>
  );
}
