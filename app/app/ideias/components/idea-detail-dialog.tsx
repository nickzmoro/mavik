"use client";

import { Bot, Calendar, Copy, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockIdeaContextReasons, type Idea } from "@/lib/mocks/ideas";
import { mockCurrentStore } from "@/lib/mocks/sidebar";
import { routes } from "@/lib/routes";
import { useToast } from "@/providers/toast-provider";

import { IdeaDateChip, IdeaFormatChip, IdeaTagChip } from "./idea-chips";

type IdeaDetailDialogProps = {
  idea: Idea;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpenVersions: () => void;
  onUse: () => void;
};

export function IdeaDetailDialog({
  idea,
  open,
  onOpenChange,
  onOpenVersions,
  onUse,
}: IdeaDetailDialogProps) {
  const { showToast } = useToast();

  const ideaFacts = [
    { label: "Objetivo", value: idea.goal },
    { label: "Etapa de compra", value: idea.stage },
    { label: "Público", value: idea.audience },
    { label: "Melhor momento", value: idea.bestMoment },
  ];

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(idea.caption);
      showToast("Legenda copiada");
    } catch {
      showToast("Não consegui copiar. Selecione a legenda e copie.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-190">
        <DialogHeader contentClassName="gap-1">
          <div className="mb-1 flex flex-wrap gap-1.5">
            <IdeaFormatChip format={idea.format} />
            <Badge variant="secondary">{idea.type}</Badge>
            {idea.dateKey ? (
              <IdeaDateChip dateKey={idea.dateKey} hasIcon={false} />
            ) : null}
          </div>
          <DialogTitle>{idea.title}</DialogTitle>
          <DialogDescription>
            {idea.format} · {idea.type} · Para {idea.audience.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <div className="flex flex-col gap-1.5">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Objetivo da ideia
            </h3>
            <p className="m-0 text-[15px] leading-[1.6]">{idea.why}</p>
          </div>

          <dl className="tile m-0 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 rounded-(--r-lg) px-4 py-3.5">
            {ideaFacts.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs leading-[1.4] text-muted">{label}</dt>
                <dd className="m-0 text-sm leading-[1.4] font-semibold">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="plan flex flex-col gap-2.5 rounded-[18px] px-4.5 py-4">
            <h3 className="m-0 flex items-center gap-1.5 text-xs leading-[1.4] font-semibold text-primary">
              <Lightbulb aria-hidden="true" className="size-3.5" />
              Recomendação de uso
            </h3>
            <p className="m-0 text-sm leading-[1.55]">{idea.how}</p>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {idea.steps.map((step, stepIndex) => (
                <li
                  key={step}
                  className="tile flex items-start gap-3 rounded-[14px] px-3 py-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary"
                  >
                    {stepIndex + 1}
                  </span>
                  <span className="text-sm leading-normal">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
                Exemplo de legenda
              </h3>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-3 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-icon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
              >
                <Copy aria-hidden="true" className="size-4" />
                Copiar
              </button>
            </div>
            <p className="composer m-0 rounded-(--r-lg) px-4 py-3.5 text-[15px] leading-[1.6] whitespace-pre-line">
              {idea.caption}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-0.5 text-xs leading-[1.4] font-medium text-muted">
              Por que para o {mockCurrentStore.name}:
            </span>
            {mockIdeaContextReasons.map((reason) => (
              <IdeaTagChip key={reason}>{reason}</IdeaTagChip>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Link
            href={routes.agent}
            className="mr-auto inline-flex min-h-10 items-center gap-1.5 rounded-(--r-sm) text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <Bot aria-hidden="true" className="size-4" />
            Ajustar com o agente
          </Link>
          <Button variant="outline" onClick={onOpenVersions}>
            <Sparkles aria-hidden="true" className="size-4.5" />
            Gerar versões
          </Button>
          <Button onClick={onUse}>
            <Calendar aria-hidden="true" className="size-4.5" />
            Usar ideia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
