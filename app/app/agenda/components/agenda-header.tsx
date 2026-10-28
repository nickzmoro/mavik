import { Flag, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

type AgendaHeaderProps = {
  onNewCampaign: () => void;
  onGeneratePlan: () => void;
  onNewContent: () => void;
};

export function AgendaHeader({
  onNewCampaign,
  onGeneratePlan,
  onNewContent,
}: AgendaHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs leading-[1.4] font-semibold text-muted">
          Calendário editorial
        </span>
        <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
          Agenda
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" onClick={onNewCampaign}>
          <Flag aria-hidden="true" className="size-4.5" />
          Nova campanha
        </Button>
        <Button variant="outline" onClick={onGeneratePlan}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Gerar plano do mês
        </Button>
        <Button onClick={onNewContent}>
          <Plus aria-hidden="true" className="size-4.5" />
          Novo conteúdo
        </Button>
      </div>
    </header>
  );
}
