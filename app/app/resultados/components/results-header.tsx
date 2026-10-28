import { FileText, Link2 } from "lucide-react";

import { SegmentedControl } from "@/components/common/segmented-control";
import { Button } from "@/components/ui/button";
import { mockCurrentStore } from "@/lib/mocks/sidebar";

import type { ResultsPeriod } from "../utils/results-chart";

type PeriodValue = "7" | "30" | "90";

const periodOptions: {
  value: PeriodValue;
  label: string;
  isDisabled?: boolean;
  title?: string;
}[] = [
  { value: "7", label: "7 dias" },
  { value: "30", label: "30 dias" },
  {
    value: "90",
    label: "90 dias",
    isDisabled: true,
    title: "Disponível a partir de 12 nov, quando houver 90 dias de dados",
  },
];

type ResultsHeaderProps = {
  period: ResultsPeriod;
  hasData: boolean;
  onPeriodChange: (period: ResultsPeriod) => void;
  onOpenSources: () => void;
  onOpenReport: () => void;
};

export function ResultsHeader({
  period,
  hasData,
  onPeriodChange,
  onOpenSources,
  onOpenReport,
}: ResultsHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Desempenho do {mockCurrentStore.name}
        </span>
        <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
          Resultados
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SegmentedControl
          label="Período"
          options={periodOptions}
          value={String(period) as PeriodValue}
          onChange={(value) => onPeriodChange(Number(value) as ResultsPeriod)}
        />
        <Button variant="ghost" onClick={onOpenSources}>
          <Link2 aria-hidden="true" className="size-4.5" />
          Fontes de dados
        </Button>
        <Button onClick={onOpenReport} disabled={!hasData}>
          <FileText aria-hidden="true" className="size-4.5" />
          Relatório do período
        </Button>
      </div>
    </header>
  );
}
