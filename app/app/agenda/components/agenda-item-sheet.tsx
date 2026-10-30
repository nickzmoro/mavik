"use client";

import { Bot, Check, Flag, Target } from "lucide-react";
import Link from "next/link";

import { formatLabels } from "@/lib/content/content-labels";
import { FilterPill } from "@/components/common/filter-pill";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  addDays,
  formatLongAgendaDate,
  getWeekday,
  parseIsoDate,
} from "@/lib/agenda-dates";
import {
  agendaStatusLabels,
  agendaStatusNextActionLabels,
  agendaStatuses,
  agendaWeekdayLabels,
  type AgendaStatus,
} from "@/lib/mocks/agenda";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

import type { ResolvedAgendaItem } from "../hooks/use-agenda";
import {
  getAgendaItemCaption,
  getAgendaItemReason,
} from "../utils/get-agenda-item-reason";
import { agendaStatusCardClassNames } from "./agenda-status-styles";

const rescheduleWeekdays = [2, 4, 5, 6];

type AgendaItemSheetProps = {
  item: ResolvedAgendaItem;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onChangeStatus: (status: AgendaStatus) => void;
  onReschedule: (isoDate: string) => void;
};

export function AgendaItemSheet({
  item,
  open,
  onOpenChange,
  onChangeStatus,
  onReschedule,
}: AgendaItemSheetProps) {
  const statusIndex = agendaStatuses.indexOf(item.status);
  const nextStatus = agendaStatuses[statusIndex + 1];
  const previousStatus = agendaStatuses[statusIndex - 1];
  const canGoBack = statusIndex > 0 && statusIndex < agendaStatuses.length - 1;
  const longDate = formatLongAgendaDate(item.date);
  const weekStart = addDays(item.date, -getWeekday(item.date));

  const itemFacts = [
    { label: "Objetivo", value: item.goal },
    { label: "Formato", value: item.format },
    { label: "Data", value: `${longDate}, ${item.time}` },
    { label: "Origem", value: item.origin },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        closeLabel="Fechar"
        overlayClassName="bg-(--scrim) backdrop-blur-[6px]"
        closeClassName="top-5 right-4 size-11 hover:bg-icon-hover hover:text-muted"
        className="dialog-surface inset-y-3 right-3 box-border h-auto w-130 max-w-[calc(100%-1.5rem)] overflow-hidden rounded-[28px] font-sans text-text sm:inset-y-4 sm:right-4 sm:max-w-[calc(100%-2rem)]"
      >
        <div className="flex flex-col gap-1 pt-6 pr-16 pl-5 sm:pl-7">
          <div className="mb-1 flex flex-wrap gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-semibold",
                agendaStatusCardClassNames[item.status],
              )}
            >
              {agendaStatusLabels[item.status]}
            </span>
            {item.campaign ? (
              <span className="chip-surface inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-semibold text-text">
                <Flag aria-hidden="true" className="size-3" />
                {item.campaign}
              </span>
            ) : null}
          </div>
          <SheetTitle className="m-0 text-xl leading-[1.3]">
            {item.title}
          </SheetTitle>
          <SheetDescription className="m-0 leading-normal">
            {longDate} às {item.time} · {formatLabels[item.format]}
          </SheetDescription>
        </div>

        <div className="scrollbar-subtle flex min-h-0 flex-1 flex-col gap-4.5 overflow-y-auto px-5 pt-4.5 pb-5 sm:px-7">
          <ol
            aria-label="Status do conteúdo"
            className="m-0 grid list-none grid-cols-5 gap-1.5 p-0"
          >
            {agendaStatuses.map((status, index) => {
              const isDone = index < statusIndex;
              const isCurrent = index === statusIndex;

              return (
                <li
                  key={status}
                  aria-current={isCurrent ? "step" : undefined}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  <span
                    className={cn(
                      "box-border flex size-7.5 items-center justify-center rounded-full border-2 border-[rgba(127,117,160,.4)] text-xs font-bold",
                      isDone && "border-primary bg-primary text-on-primary",
                      isCurrent && "border-primary text-primary",
                    )}
                  >
                    {isDone ? (
                      <Check
                        aria-hidden="true"
                        className="size-3.5"
                        strokeWidth={3}
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-xs leading-[1.3]",
                      isCurrent
                        ? "font-semibold text-text"
                        : "font-medium text-muted",
                    )}
                  >
                    {agendaStatusLabels[status]}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="plan flex flex-col gap-1.5 rounded-[18px] px-4 py-3.5">
            <h3 className="m-0 flex items-center gap-1.5 text-xs leading-[1.4] font-semibold text-primary">
              <Target aria-hidden="true" className="size-3.5" />
              Por que neste dia
            </h3>
            <p className="m-0 text-sm leading-[1.55]">
              {getAgendaItemReason(item)}
            </p>
          </div>

          <dl className="tile m-0 grid grid-cols-2 gap-3 rounded-(--r-lg) px-4 py-3.5">
            {itemFacts.map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs leading-[1.4] text-muted">{label}</dt>
                <dd className="m-0 text-sm leading-[1.4] font-semibold">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Prévia
            </h3>
            <div className="flex items-start gap-3">
              <div
                role="img"
                aria-label="Prévia da arte, ainda não criada"
                className="relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-[14px] bg-[#efe4d6]"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-3.5 -bottom-2.5 size-15 rounded-full bg-[#c9a27e]"
                />
              </div>
              <p className="composer m-0 flex-1 rounded-[14px] px-3.5 py-3 text-sm leading-[1.55] whitespace-pre-line">
                {getAgendaItemCaption(item)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="m-0 text-xs leading-[1.4] font-semibold text-primary">
              Reagendar
            </h3>
            <div className="flex flex-wrap gap-2">
              {rescheduleWeekdays.map((weekday) => {
                const isoDate = addDays(weekStart, weekday);

                return (
                  <FilterPill
                    key={isoDate}
                    isActive={isoDate === item.date}
                    onClick={() => onReschedule(isoDate)}
                  >
                    {agendaWeekdayLabels[weekday]},{" "}
                    {parseIsoDate(isoDate).getDate()}
                  </FilterPill>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-text/10 px-5 pt-3.5 pb-4.5 sm:px-7">
          <Link
            href={routes.agent}
            className="mr-auto inline-flex min-h-10 items-center gap-1.5 rounded-(--r-sm) text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <Bot aria-hidden="true" className="size-4" />
            Pedir ajuste
          </Link>
          {canGoBack && previousStatus ? (
            <Button
              variant="ghost"
              onClick={() => onChangeStatus(previousStatus)}
            >
              Voltar etapa
            </Button>
          ) : null}
          {nextStatus ? (
            <Button onClick={() => onChangeStatus(nextStatus)}>
              <Check aria-hidden="true" className="size-4.5" />
              {agendaStatusNextActionLabels[item.status]}
            </Button>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
