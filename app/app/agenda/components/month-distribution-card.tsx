import { PanelCard, PanelMeta } from "@/components/common/panel-card";
import { ideaFormats, ideaGoals } from "@/lib/mocks/ideas";

import type { ResolvedAgendaItem } from "../hooks/use-agenda";

const formatBarOrder = ["Reels", "Carrossel", "Post", "Story"] as const;

const formatBarColors: Record<(typeof ideaFormats)[number], string> = {
  Reels: "bg-primary",
  Carrossel: "bg-accent",
  Post: "bg-[#c9a27e]",
  Story: "bg-success",
};

const goalBarColors: Record<(typeof ideaGoals)[number], string> = {
  Atrair: "bg-accent",
  Engajar: "bg-primary",
  Vender: "bg-success",
  Fidelizar: "bg-[#c9a27e]",
};

type DistributionBarsProps = {
  title: string;
  rows: { label: string; count: number; colorClassName: string }[];
};

function DistributionBars({ title, rows }: DistributionBarsProps) {
  const maximumCount = Math.max(1, ...rows.map((row) => row.count));

  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-0 text-xs leading-[1.4] font-semibold text-muted">
        {title}
      </h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[84px_minmax(0,1fr)_24px] items-center gap-2.5"
          >
            <span className="text-[13px] leading-[1.4] font-medium">
              {row.label}
            </span>
            <span
              aria-hidden="true"
              className="block h-2 overflow-hidden rounded-full bg-[rgba(127,117,160,.16)]"
            >
              <span
                className={`block h-full rounded-full ${row.colorClassName}`}
                style={{
                  width: `${Math.round((row.count / maximumCount) * 100)}%`,
                }}
              />
            </span>
            <span className="text-right text-[13px] leading-[1.4] font-semibold">
              {row.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MonthDistributionCardProps = {
  monthItems: ResolvedAgendaItem[];
};

export function MonthDistributionCard({
  monthItems,
}: MonthDistributionCardProps) {
  const countBy = (field: "format" | "goal", value: string) =>
    monthItems.filter((item) => item[field] === value).length;

  return (
    <PanelCard
      titleId="dist-title"
      title="Distribuição do mês"
      className="gap-3.5"
      action={<PanelMeta>{monthItems.length} conteúdos</PanelMeta>}
    >
      <DistributionBars
        title="Por formato"
        rows={formatBarOrder.map((format) => ({
          label: format,
          count: countBy("format", format),
          colorClassName: formatBarColors[format],
        }))}
      />
      <DistributionBars
        title="Por objetivo"
        rows={ideaGoals.map((goal) => ({
          label: goal,
          count: countBy("goal", goal),
          colorClassName: goalBarColors[goal],
        }))}
      />
    </PanelCard>
  );
}
