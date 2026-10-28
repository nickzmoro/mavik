import { Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type PlanRationaleCardProps = {
  focusPercentage: number;
  dateNote: string;
  monthItemsCount: number;
  recommendedMaximum: number;
};

function RationaleItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden="true"
        className="mt-1.75 size-1.5 shrink-0 rounded-full bg-primary"
      />
      <span className="text-sm leading-normal">{children}</span>
    </li>
  );
}

export function PlanRationaleCard({
  focusPercentage,
  dateNote,
  monthItemsCount,
  recommendedMaximum,
}: PlanRationaleCardProps) {
  return (
    <section
      aria-labelledby="why-title"
      className="glass flex flex-col gap-3.5 rounded-3xl p-5"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-(--r-md) bg-accent text-(--violet-900)"
        >
          <Target className="size-4.5" />
        </span>
        <div className="flex flex-col">
          <h2
            id="why-title"
            className="m-0 font-display text-base leading-[1.4] font-semibold"
          >
            Por que este plano
          </h2>
          <span className="text-xs leading-[1.4] text-muted">
            Objetivo: mais movimento no fim de semana
          </span>
        </div>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        <RationaleItem>
          <strong className="font-semibold">
            {focusPercentage}% dos conteúdos
          </strong>{" "}
          entre quinta e sábado, para trazer gente ao balcão no fim de semana.
        </RationaleItem>
        <RationaleItem>
          Reels na quinta para alcance, carrossel na sexta para salvar e story
          no sábado para conversar.
        </RationaleItem>
        <RationaleItem>{dateNote}</RationaleItem>
      </ul>
      <div className="tile flex flex-col gap-2 rounded-(--r-lg) px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] leading-[1.4] font-semibold">
            Frequência sugerida
          </span>
          <Badge variant="secondary">3 a 4 por semana</Badge>
        </div>
        <Progress
          value={monthItemsCount}
          max={recommendedMaximum}
          aria-label="Conteúdos planejados em relação à frequência sugerida"
        />
        <span className="text-xs leading-[1.4] text-muted">
          {monthItemsCount} conteúdos no mês · dentro do ritmo sugerido para o
          seu objetivo
        </span>
      </div>
    </section>
  );
}
