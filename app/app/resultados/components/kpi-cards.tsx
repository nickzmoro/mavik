import {
  Eye,
  Heart,
  MousePointerClick,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { ResultsKpi } from "../utils/results-chart";
import { EvidenceButton } from "./evidence-badge";

const kpiIcons: Record<ResultsKpi["id"], LucideIcon> = {
  reach: Users,
  views: Eye,
  engagement: Heart,
  clicks: MousePointerClick,
};

const kpiTintClassNames: Record<ResultsKpi["id"], string> = {
  reach:
    "from-[rgba(220,206,251,.75)] to-[rgba(255,255,255,.55)] dark:from-[rgba(179,144,250,.22)] dark:to-[rgba(255,255,255,.03)]",
  views:
    "from-[rgba(214,232,250,.8)] to-[rgba(255,255,255,.55)] dark:from-[rgba(91,148,240,.2)] dark:to-[rgba(255,255,255,.03)]",
  engagement:
    "from-[rgba(214,244,232,.8)] to-[rgba(255,255,255,.55)] dark:from-[rgba(79,209,174,.18)] dark:to-[rgba(255,255,255,.03)]",
  clicks:
    "from-[rgba(255,236,214,.8)] to-[rgba(255,255,255,.55)] dark:from-[rgba(245,185,77,.16)] dark:to-[rgba(255,255,255,.03)]",
};

type KpiCardsProps = {
  kpis: readonly ResultsKpi[];
  onExplain: () => void;
};

export function KpiCards({ kpis, onExplain }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(210px,100%),1fr))] gap-3.5">
      {kpis.map((kpi) => {
        const KpiIcon = kpiIcons[kpi.id];

        return (
          <section
            key={kpi.id}
            aria-label={kpi.label}
            className={cn(
              "glass flex min-w-0 flex-col gap-2.5 rounded-[22px] bg-transparent bg-linear-135/srgb px-4.5 py-4",
              kpiTintClassNames[kpi.id],
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm leading-[1.4] font-semibold">
                <span
                  aria-hidden="true"
                  className="flex size-7.5 items-center justify-center rounded-[10px] bg-surface-2 text-primary"
                >
                  <KpiIcon className="size-4" />
                </span>
                {kpi.label}
              </span>
              <EvidenceButton kind="real" onClick={onExplain} />
            </div>
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-[28px] leading-[1.1] font-bold">
                  {kpi.value}
                </span>
                <span className="flex items-center gap-1 text-xs leading-[1.4] font-semibold text-success">
                  <TrendingUp aria-hidden="true" className="size-3.25" />
                  {kpi.delta}{" "}
                  <span className="font-medium text-muted">vs anterior</span>
                </span>
              </div>
              <svg
                aria-hidden="true"
                viewBox="0 0 120 40"
                preserveAspectRatio="none"
                className="h-9 w-24 shrink-0 overflow-visible"
              >
                <path
                  d={kpi.sparkline}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </section>
        );
      })}
    </div>
  );
}
