import { TrendingUp } from "lucide-react";

import { mockWeeklyStats } from "@/lib/mocks/home";
import { cn } from "@/lib/utils";

import { HomeSectionTitle } from "./home-section-title";

export function WeeklySummaryCard() {
  return (
    <section
      aria-labelledby="week-title"
      className="glass flex flex-col gap-4 rounded-3xl p-5 sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <HomeSectionTitle id="week-title">Sua semana</HomeSectionTitle>
        <span className="text-xs leading-[1.4] font-medium text-muted">
          {mockWeeklyStats.periodLabel}
        </span>
      </div>
      <dl className="m-0 grid grid-cols-3 gap-2.5">
        {mockWeeklyStats.metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex min-w-0 flex-col gap-1 rounded-(--r-lg) bg-white/75 px-3 py-3.5 dark:border dark:border-white/6 dark:bg-white/5"
          >
            <dt className="truncate text-xs leading-[1.4] font-medium text-muted">
              {metric.label}
            </dt>
            <dd
              className={cn(
                "m-0 font-display text-lg leading-[1.2] font-bold min-[400px]:text-[22px]",
                metric.isHighlighted && "text-primary",
              )}
            >
              {metric.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="m-0 flex gap-2 text-sm leading-normal text-muted">
        <TrendingUp
          aria-hidden="true"
          className="mt-0.75 size-4 shrink-0 text-primary"
        />
        {mockWeeklyStats.insight}
      </p>
    </section>
  );
}
