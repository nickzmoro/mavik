import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { mockTrialUsage } from "@/lib/mocks/sidebar";
import { routes } from "@/lib/routes";

export function SidebarTrialCard() {
  if (!mockTrialUsage.isLimitEnabled) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-(--r-lg) border border-white/14 bg-white/8 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-sm leading-[1.3] font-semibold">
          Teste grátis
        </span>
        <span className="text-xs leading-[1.4] font-medium text-(--violet-200)">
          {mockTrialUsage.used} de {mockTrialUsage.total} artes
        </span>
      </div>
      <Progress
        value={mockTrialUsage.used}
        max={mockTrialUsage.total}
        aria-label="Artes grátis usadas"
        className="bg-white/16"
        indicatorClassName="bg-white"
      />
      <Link
        href={routes.plans}
        className="self-start rounded-(--r-sm) text-sm leading-normal font-semibold text-(--violet-200) underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      >
        Ver planos
      </Link>
    </div>
  );
}
