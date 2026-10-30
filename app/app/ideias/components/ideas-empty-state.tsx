import { Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { IdeaDateView } from "@/lib/ideas/idea-types";

import type { IdeasView } from "../hooks/use-ideas-library";

const getEmptyStateCopy = (
  selectedDate: IdeaDateView | null,
  view: IdeasView,
  storeName: string,
  hasIdeas: boolean,
) => {
  if (selectedDate) {
    return {
      title: `Ainda não há ideias para ${selectedDate.isTrend ? "esta tendência" : selectedDate.name}`,
      help: `Posso criar ideias para ${selectedDate.name} com o tom ${storeName ? `do ${storeName}` : "da sua marca"}.`,
      cta: `Gerar ideias para ${selectedDate.name}`,
    };
  }

  if (!hasIdeas) {
    return {
      title: "Você ainda não tem ideias",
      help: "Peça ao agente ideias feitas para os seus produtos e o seu público.",
      cta: "Gerar ideias",
    };
  }

  return {
    title:
      view === "saved"
        ? "Você ainda não salvou ideias"
        : "Nenhuma ideia com esses filtros",
    help: "Tente remover algum filtro ou peça ao agente ideias com essa combinação.",
    cta: "Gerar ideias com esses filtros",
  };
};

type IdeasEmptyStateProps = {
  selectedDate: IdeaDateView | null;
  storeName: string;
  hasIdeas: boolean;
  view: IdeasView;
  onGenerateIdeas: () => void;
  onClearAll: () => void;
};

export function IdeasEmptyState({
  selectedDate,
  storeName,
  hasIdeas,
  view,
  onGenerateIdeas,
  onClearAll,
}: IdeasEmptyStateProps) {
  const emptyStateCopy = getEmptyStateCopy(
    selectedDate,
    view,
    storeName,
    hasIdeas,
  );

  return (
    <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-[18px] bg-surface-2 text-primary"
      >
        <Lightbulb className="size-6.5" />
      </span>
      <h2 className="m-0 font-display text-xl leading-[1.3] font-semibold">
        {emptyStateCopy.title}
      </h2>
      <p className="m-0 max-w-110 text-[15px] leading-[1.55] text-muted">
        {emptyStateCopy.help}
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        <Button onClick={onGenerateIdeas}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          {emptyStateCopy.cta}
        </Button>
        <Button variant="ghost" onClick={onClearAll}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
