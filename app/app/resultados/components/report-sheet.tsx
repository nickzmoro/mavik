"use client";

import { Calendar, Download, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { mockConclusions, mockResultActions } from "@/lib/mocks/results";

import type { ResultsKpi } from "../utils/results-chart";
import { ConclusionItem } from "./conclusion-item";
import { EvidenceBadge, evidenceLabels } from "./evidence-badge";

const realConclusionIds = ["c1", "c2", "c4"];
const hypothesisConclusionIds = ["c3", "c5", "c6"];

type ReportSheetProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  periodRangeLabel: string;
  kpis: readonly ResultsKpi[];
  onExplain: (conclusionId: string) => void;
  onShare: () => void;
  onDownload: () => void;
  onSendActionsToAgenda: () => void;
};

export function ReportSheet({
  open,
  onOpenChange,
  periodRangeLabel,
  kpis,
  onExplain,
  onShare,
  onDownload,
  onSendActionsToAgenda,
}: ReportSheetProps) {
  const reachDelta = kpis[0].delta.replace("+", "");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="bg-(--scrim) backdrop-blur-[6px]"
        closeClassName="top-5 right-4 size-11 hover:bg-icon-hover hover:text-muted"
        className="dialog-surface inset-y-3 right-3 box-border h-auto w-160 max-w-[calc(100%-1.5rem)] overflow-hidden rounded-[28px] font-sans text-text sm:inset-y-4 sm:right-4 sm:max-w-[calc(100%-2rem)]"
      >
        <div className="flex flex-col gap-1 pt-6 pr-16 pl-5 sm:pl-7">
          <SheetTitle className="m-0 text-xl leading-[1.3]">
            Relatório: {periodRangeLabel}
          </SheetTitle>
          <SheetDescription className="m-0 leading-normal">
            Escrito pelo agente, em linguagem simples. Cada frase diz se vem de
            dado real ou se é hipótese.
          </SheetDescription>
        </div>

        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <div className="plan flex flex-col gap-1.5 rounded-[18px] px-4.5 py-4">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Em uma frase
            </h3>
            <p className="m-0 font-display text-[17px] leading-[1.45] font-semibold">
              O Aurora alcançou {reachDelta} mais gente que no período anterior,
              puxado pelos Reels de bastidores. Ainda não dá para dizer se isso
              trouxe mais clientes no sábado.
            </p>
          </div>

          <dl className="tile m-0 grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 rounded-(--r-lg) px-4 py-3.5">
            {kpis.map((kpi) => (
              <div key={kpi.id}>
                <dt className="text-xs leading-[1.4] text-muted">
                  {kpi.label}
                </dt>
                <dd className="m-0 font-display text-xl leading-[1.2] font-bold">
                  {kpi.value}
                </dd>
                <dd className="m-0 text-xs leading-[1.4] font-semibold text-success">
                  {kpi.delta}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 flex items-center gap-2 text-[15px] leading-[1.4] font-semibold">
              O que os dados mostram <EvidenceBadge kind="real" />
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {realConclusionIds.map((conclusionId) => (
                <ConclusionItem
                  key={conclusionId}
                  conclusion={mockConclusions[conclusionId]}
                  onExplain={onExplain}
                  textClassName="leading-[1.55]"
                />
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 flex items-center gap-2 text-[15px] leading-[1.4] font-semibold">
              O que ainda é hipótese <EvidenceBadge kind="hypothesis" />
            </h3>
            <ul className="m-0 flex list-none flex-col gap-2 p-0">
              {hypothesisConclusionIds.map((conclusionId) => (
                <ConclusionItem
                  key={conclusionId}
                  conclusion={mockConclusions[conclusionId]}
                  onExplain={onExplain}
                  textClassName="leading-[1.55]"
                  hasHowToConfirm
                />
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-[15px] leading-[1.4] font-semibold">
              O que fazer nas próximas semanas
            </h3>
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {mockResultActions.map((action, actionIndex) => (
                <li
                  key={action.conclusionId}
                  className="flex items-start gap-2.5"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary"
                  >
                    {actionIndex + 1}
                  </span>
                  <span className="text-sm leading-normal">
                    <strong className="font-semibold">{action.title}.</strong>{" "}
                    <span className="text-muted">
                      {
                        evidenceLabels[
                          mockConclusions[action.conclusionId].kind
                        ]
                      }
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-text/10 px-5 pt-3.5 pb-4.5 sm:px-7">
          <Button variant="ghost" onClick={onShare}>
            <Share2 aria-hidden="true" className="size-4.5" />
            Compartilhar
          </Button>
          <Button variant="outline" onClick={onDownload}>
            <Download aria-hidden="true" className="size-4.5" />
            Baixar PDF
          </Button>
          <Button onClick={onSendActionsToAgenda}>
            <Calendar aria-hidden="true" className="size-4.5" />
            Levar ações para a agenda
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
