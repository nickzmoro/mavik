import { SidebarLogo } from "./sidebar-logo";
import { SidebarNav } from "./sidebar-nav";
import { SidebarStoreSwitcher } from "./sidebar-store-switcher";
import { SidebarTrialCard } from "./sidebar-trial-card";

type SidebarContentProps = {
  account: React.ReactNode;
  onNavigate?: () => void;
};

export function SidebarContent({ account, onNavigate }: SidebarContentProps) {
  return (
    <div className="relative flex h-full flex-col gap-5 overflow-y-auto px-3.5 pt-5 pb-3.5 [scrollbar-width:none]">
      <SidebarLogo onNavigate={onNavigate} />
      <SidebarStoreSwitcher />
      <SidebarNav onNavigate={onNavigate} />
      <div className="relative mt-auto flex flex-col gap-3">
        <SidebarTrialCard />
        {account}
      </div>
    </div>
  );
}
