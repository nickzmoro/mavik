import { Bot, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mockConclusions } from "@/lib/mocks/results";

import { ConclusionItem } from "./conclusion-item";

const summaryConclusionIds = ["c1", "c2", "c3"];

type PlainSummaryCardProps = {
  periodLabel: string;
  onExplain: (conclusionId: string) => void;
  onOpenReport: () => void;
};

export function PlainSummaryCard({
  periodLabel,
  onExplain,
  onOpenReport,
}: PlainSummaryCardProps) {
  return (
    <section
      aria-labelledby="sum-title"
      className="glass flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-3xl p-5"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-(--r-md) bg-accent text-(--violet-900)"
        >
          <Bot className="size-4.5" />
        </span>
        <div className="flex flex-col">
          <h2
            id="sum-title"
            className="m-0 font-display text-base leading-[1.4] font-semibold"
          >
            Em linguagem simples
          </h2>
          <span className="text-xs leading-[1.4] text-muted">
            {periodLabel} · resumo do agente
          </span>
        </div>
      </div>
      <p className="m-0 font-display text-[17px] leading-[1.45] font-semibold">
        Mais gente viu o Aurora, puxado pelos Reels de bastidores. Ainda não
        sabemos se isso encheu os sábados.
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {summaryConclusionIds.map((conclusionId) => (
          <ConclusionItem
            key={conclusionId}
            conclusion={mockConclusions[conclusionId]}
            onExplain={onExplain}
          />
        ))}
      </ul>
      <Button variant="outline" onClick={onOpenReport}>
        <FileText aria-hidden="true" className="size-4.5" />
        Ler relatório completo
      </Button>
    </section>
  );
}
