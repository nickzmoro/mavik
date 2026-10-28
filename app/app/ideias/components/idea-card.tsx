import { Bookmark, Calendar, Lightbulb, Sparkles, Target } from "lucide-react";

import { IconButton } from "@/components/common/icon-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Idea } from "@/lib/mocks/ideas";
import { cn } from "@/lib/utils";

import { IdeaDateChip, IdeaFormatChip, IdeaTagChip } from "./idea-chips";

type IdeaCardProps = {
  idea: Idea;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDetail: () => void;
  onOpenVersions: () => void;
  onUse: () => void;
};

export function IdeaCard({
  idea,
  isSaved,
  onToggleSave,
  onOpenDetail,
  onOpenVersions,
  onUse,
}: IdeaCardProps) {
  return (
    <article
      aria-label={idea.title}
      className="glass flex min-w-0 flex-col gap-3.5 rounded-3xl p-5 transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <IdeaFormatChip format={idea.format} />
          <Badge variant="secondary">{idea.type}</Badge>
          {idea.dateKey ? <IdeaDateChip dateKey={idea.dateKey} /> : null}
        </div>
        <IconButton
          label={`${isSaved ? "Remover dos salvos" : "Salvar ideia"}: ${idea.title}`}
          aria-pressed={isSaved}
          onClick={onToggleSave}
          className={cn(
            "-mt-2 -mr-2 size-10 [&_svg]:size-4.5",
            isSaved && "text-primary",
          )}
        >
          <Bookmark fill={isSaved ? "currentColor" : "none"} />
        </IconButton>
      </div>

      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onOpenDetail}
          className="cursor-pointer rounded-(--r-sm) border-0 bg-transparent p-0 text-left font-display text-lg leading-[1.35] font-semibold text-text transition-colors duration-150 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          {idea.title}
        </button>
        {idea.isRecommended ? (
          <span className="inline-flex items-center gap-1.5 text-xs leading-[1.4] font-semibold text-success">
            <Target aria-hidden="true" className="size-3.25" />
            Combina com o seu objetivo
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs leading-[1.4] font-semibold text-primary">
          Objetivo da ideia
        </span>
        <p className="m-0 text-sm leading-[1.55]">{idea.why}</p>
      </div>

      <div className="plan flex flex-col gap-1 rounded-(--r-lg) px-3.5 py-3">
        <span className="flex items-center gap-1.5 text-xs leading-[1.4] font-semibold text-primary">
          <Lightbulb aria-hidden="true" className="size-3.5" />
          Recomendação de uso
        </span>
        <p className="m-0 text-sm leading-[1.55]">{idea.how}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <IdeaTagChip>{idea.goal}</IdeaTagChip>
        <IdeaTagChip>{idea.stage}</IdeaTagChip>
        <IdeaTagChip>{idea.audience}</IdeaTagChip>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Button onClick={onUse}>
          <Calendar aria-hidden="true" className="size-4.5" />
          Usar ideia
        </Button>
        <Button variant="outline" onClick={onOpenVersions}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Gerar versões
        </Button>
        <Button variant="ghost" onClick={onOpenDetail}>
          Detalhes
        </Button>
      </div>
    </article>
  );
}
