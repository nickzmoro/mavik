"use client";

import { Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

import { formatLabels } from "@/lib/content/content-labels";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockConclusions, type TopContent } from "@/lib/mocks/results";
import { routes } from "@/lib/routes";

import { ConclusionItem } from "./conclusion-item";
import { EvidenceBadge } from "./evidence-badge";

type ContentDetailDialogProps = {
  content: TopContent;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onExplain: (conclusionId: string) => void;
  onRepeatInAgenda: () => void;
};

export function ContentDetailDialog({
  content,
  open,
  onOpenChange,
  onExplain,
  onRepeatInAgenda,
}: ContentDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-195">
        <DialogHeader contentClassName="gap-1">
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            {formatLabels[content.format]} · publicado em {content.date} · tema{" "}
            {content.topic}
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <div className="flex flex-wrap items-start gap-4">
            <div
              role="img"
              aria-label="Capa do conteúdo"
              className="relative aspect-4/5 w-33 shrink-0 overflow-hidden rounded-[18px]"
              style={{ backgroundColor: content.thumbColor }}
            >
              <div
                aria-hidden="true"
                className="absolute -right-4.5 -bottom-3.5 size-20 rounded-full"
                style={{ backgroundColor: content.thumbAccentColor }}
              />
            </div>
            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <EvidenceBadge kind="real" />
                <span className="text-xs leading-[1.4] text-muted">
                  Instagram Insights · 5 dias após publicar
                </span>
              </div>
              <dl className="m-0 grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-2.5">
                {content.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="tile rounded-[14px] px-3 py-2.5"
                  >
                    <dt className="text-xs leading-[1.4] text-muted">
                      {metric.label}
                    </dt>
                    <dd className="m-0 font-display text-[19px] leading-[1.25] font-bold">
                      {metric.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Comparado à média do perfil
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {content.comparison.map((comparison) => (
                <li
                  key={comparison.label}
                  className="grid grid-cols-[96px_minmax(0,1fr)_52px] items-center gap-3 sm:grid-cols-[120px_minmax(0,1fr)_52px]"
                >
                  <span className="text-[13px] leading-[1.4] font-medium">
                    {comparison.label}
                  </span>
                  <span className="relative block h-3">
                    <span className="absolute inset-0 rounded-full bg-[rgba(127,117,160,.16)]" />
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary"
                      style={{ width: `${comparison.percentage}%` }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -bottom-1 w-0.5 bg-text opacity-55"
                      style={{ left: `${comparison.averagePercentage}%` }}
                    />
                  </span>
                  <span className="text-right text-[13px] leading-[1.4] font-bold">
                    {comparison.multiplier}
                  </span>
                </li>
              ))}
            </ul>
            <span className="text-xs leading-[1.4] text-muted">
              A linha vertical marca a média das publicações do mesmo formato.
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Por que funcionou
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {content.conclusionIds.map((conclusionId) => (
                <ConclusionItem
                  key={conclusionId}
                  conclusion={mockConclusions[conclusionId]}
                  onExplain={onExplain}
                  textClassName="leading-[1.55]"
                />
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" asChild>
            <Link href={routes.ideas}>
              <Sparkles aria-hidden="true" className="size-4.5" />
              Criar versão parecida
            </Link>
          </Button>
          <Button onClick={onRepeatInAgenda}>
            <Calendar aria-hidden="true" className="size-4.5" />
            Repetir na agenda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
