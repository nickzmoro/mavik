import { TrendingUp } from "lucide-react";

import { SegmentedControl } from "@/components/common/segmented-control";
import { cn } from "@/lib/utils";

import {
  getPerformanceChart,
  type ResultsMetric,
  type ResultsPeriod,
} from "../utils/results-chart";
import { EvidenceBadge } from "./evidence-badge";

const metricOptions: { value: ResultsMetric; label: string }[] = [
  { value: "reach", label: "Alcance" },
  { value: "views", label: "Visualizações" },
  { value: "engagement", label: "Engajamento" },
];

const metricNames: Record<ResultsMetric, string> = {
  reach: "alcance",
  views: "visualizações",
  engagement: "engajamento",
};

type PerformanceChartCardProps = {
  period: ResultsPeriod;
  periodLabel: string;
  metric: ResultsMetric;
  tooltipDayIndex: number;
  onMetricChange: (metric: ResultsMetric) => void;
  onSelectDay: (dayIndex: number) => void;
};

export function PerformanceChartCard({
  period,
  periodLabel,
  metric,
  tooltipDayIndex,
  onMetricChange,
  onSelectDay,
}: PerformanceChartCardProps) {
  const chart = getPerformanceChart(period, metric, tooltipDayIndex);

  return (
    <section
      aria-labelledby="perf-title"
      className="glass flex min-w-0 flex-[2_1_560px] flex-col gap-3.5 rounded-3xl p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h2
            id="perf-title"
            className="m-0 font-display text-base leading-[1.4] font-semibold"
          >
            Desempenho no período
          </h2>
          <span className="text-[13px] leading-[1.4] text-muted">
            Linha cheia: {periodLabel} · tracejada: período anterior · pontos:
            dias com publicação
          </span>
        </div>
        <SegmentedControl
          label="Métrica"
          options={metricOptions}
          value={metric}
          onChange={onMetricChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm leading-[1.4]">
          <strong className="font-bold">{chart.total}</strong>{" "}
          <span className="text-muted">{chart.totalLabel}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-success">
          <TrendingUp aria-hidden="true" className="size-3.25" />
          {chart.delta}
        </span>
        <EvidenceBadge kind="real" />
      </div>

      <div className="relative mt-1 ml-9 h-65">
        {chart.yTicks.map((tick) => (
          <div
            key={tick.top}
            className="absolute inset-x-0 border-t border-dashed border-[rgba(26,15,60,.08)] dark:border-white/8"
            style={{ top: `${tick.top}%` }}
          >
            <span className="absolute right-full mr-2 -translate-y-1/2 text-[11px] leading-none whitespace-nowrap text-muted">
              {tick.label}
            </span>
          </div>
        ))}
        <svg
          role="img"
          aria-label={`Gráfico de ${metricNames[metric]} por dia, ${periodLabel.toLowerCase()}, com picos às quintas-feiras`}
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full overflow-visible"
        >
          <path d={chart.areaPath} className="fill-primary/10 stroke-none" />
          <path
            d={chart.previousPath}
            fill="none"
            className="stroke-muted"
            strokeWidth="2"
            strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={chart.linePath}
            fill="none"
            className="stroke-primary"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {chart.points.map((point) => (
          <button
            key={point.dayIndex}
            type="button"
            aria-label={point.ariaLabel}
            aria-pressed={point.isActive}
            onClick={() => onSelectDay(point.dayIndex)}
            className={cn(
              "absolute size-3.5 -translate-1/2 cursor-pointer rounded-full border-3 border-bg p-0 shadow-[0_1px_4px_rgba(26,15,60,.3)] transition-transform duration-120 hover:scale-130 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
              point.isActive ? "bg-accent" : "bg-primary",
            )}
            style={{ left: `${point.left}%`, top: `${point.top}%` }}
          />
        ))}
        <div
          role="status"
          className="dialog-surface pointer-events-none absolute box-border flex w-55 flex-col gap-1 rounded-[14px] px-3 py-2.5"
          style={{
            left: `${chart.tooltip.left}%`,
            top: `${chart.tooltip.top}%`,
            transform: `translate(${chart.tooltip.horizontalShift}, ${chart.tooltip.verticalShift})`,
          }}
        >
          <span className="text-xs leading-[1.3] font-semibold text-muted">
            {chart.tooltip.date}
          </span>
          <span className="text-sm leading-[1.35] font-semibold">
            {chart.tooltip.title}
          </span>
          <span className="text-[13px] leading-[1.35]">
            {chart.tooltip.value}
          </span>
        </div>
      </div>
      <div className="relative ml-9 h-4.5">
        {chart.xTicks.map((tick) => (
          <span
            key={tick.label}
            className="absolute -translate-x-1/2 text-[11px] leading-[1.4] whitespace-nowrap text-muted"
            style={{ left: `${tick.left}%` }}
          >
            {tick.label}
          </span>
        ))}
      </div>
    </section>
  );
}
