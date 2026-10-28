import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { SegmentedControl } from "@/components/common/segmented-control";
import { Button } from "@/components/ui/button";
import { addDays, getMonthName, parseIsoDate } from "@/lib/agenda-dates";
import {
  agendaStatusLabels,
  agendaStatuses,
  type AgendaMonth,
  type AgendaStatus,
} from "@/lib/mocks/agenda";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

import type {
  AgendaView,
  ResolvedAgendaItem,
  useAgenda,
} from "../hooks/use-agenda";
import { agendaStatusDotClassNames } from "./agenda-status-styles";
import { BoardView } from "./board-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

const viewOptions: { value: AgendaView; label: string }[] = [
  { value: "month", label: "Mês" },
  { value: "week", label: "Semana" },
  { value: "board", label: "Status" },
];

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const navigationButtonClassName =
  "chip-surface flex size-10 cursor-pointer items-center justify-center rounded-(--r-md) p-0 text-text transition-colors duration-150 hover:bg-icon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";

type AgendaCalendarCardProps = {
  agenda: ReturnType<typeof useAgenda>;
  onOpenItem: (itemId: string) => void;
  onCreateContent: () => void;
  onApprovePlan: () => void;
  onMoveItem: (item: ResolvedAgendaItem, status: AgendaStatus) => void;
};

export function AgendaCalendarCard({
  agenda,
  onOpenItem,
  onCreateContent,
  onApprovePlan,
  onMoveItem,
}: AgendaCalendarCardProps) {
  const { monthSettings } = agenda;
  const monthName = getMonthName(monthSettings.monthIndex);
  const weekEnd = addDays(monthSettings.weekStart, 6);
  const periodLabel =
    agenda.view === "week"
      ? `${parseIsoDate(monthSettings.weekStart).getDate()} a ${parseIsoDate(weekEnd).getDate()} de ${getMonthName(parseIsoDate(weekEnd).getMonth())}`
      : `${capitalize(monthName)} de 2026`;

  const goToMonth = (month: AgendaMonth) => agenda.setMonth(month);

  return (
    <section
      aria-labelledby="cal-title"
      className="glass box-border flex min-w-0 flex-col gap-3.5 rounded-3xl p-4 xl:flex-[999_1_640px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Mês anterior"
            disabled={agenda.month === "october"}
            onClick={() => goToMonth("october")}
            className={navigationButtonClassName}
          >
            <ChevronLeft aria-hidden="true" className="size-4.5" />
          </button>
          <button
            type="button"
            aria-label="Próximo mês"
            disabled={agenda.month === "november"}
            onClick={() => goToMonth("november")}
            className={navigationButtonClassName}
          >
            <ChevronRight aria-hidden="true" className="size-4.5" />
          </button>
          <h2
            id="cal-title"
            className="m-0 ml-1.5 font-display text-xl leading-[1.3] font-semibold"
          >
            {periodLabel}
          </h2>
          {agenda.month !== "october" ? (
            <button
              type="button"
              onClick={() => goToMonth("october")}
              className="min-h-8 cursor-pointer rounded-(--r-sm) border-0 bg-transparent px-2 text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              Hoje
            </button>
          ) : null}
        </div>
        <SegmentedControl
          label="Visualização"
          options={viewOptions}
          value={agenda.view}
          onChange={agenda.setView}
        />
      </div>

      <div
        role="group"
        aria-label="Filtrar por status"
        className="flex flex-wrap items-center gap-1.5"
      >
        {agendaStatuses.map((status) => {
          const isShown = !agenda.hiddenStatuses.includes(status);
          const statusCount = agenda.monthItems.filter(
            (item) => item.status === status,
          ).length;

          return (
            <button
              key={status}
              type="button"
              aria-pressed={isShown}
              onClick={() => agenda.toggleStatusVisibility(status)}
              className={cn(
                "chip-surface inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-[border-color,opacity] duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
                !isShown && "opacity-55",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  agendaStatusDotClassNames[status],
                )}
              />
              <span className="text-text">{agendaStatusLabels[status]}</span>
              <span>{statusCount}</span>
            </button>
          );
        })}
      </div>

      {agenda.isSuggestedPlan ? (
        <div className="plan flex flex-wrap items-center gap-3.5 rounded-[18px] px-4 py-3.5">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-(--r-md) bg-accent text-(--violet-900)"
          >
            <Sparkles className="size-5" />
          </span>
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-0.5">
            <span className="font-display text-[15px] leading-[1.4] font-semibold">
              Plano sugerido pelo agente · {agenda.monthItems.length} conteúdos
              em rascunho
            </span>
            <span className="text-[13px] leading-normal text-muted">
              Montado a partir do seu objetivo. Abra qualquer conteúdo para
              mover, trocar ou remover antes de aprovar.
            </span>
          </div>
          <Button variant="ghost" asChild>
            <Link href={routes.agent}>Pedir ajustes</Link>
          </Button>
          <Button onClick={onApprovePlan}>
            <Check aria-hidden="true" className="size-4.5" />
            Aprovar plano
          </Button>
        </div>
      ) : null}

      {agenda.view === "month" ? (
        <MonthView
          monthIndex={monthSettings.monthIndex}
          items={agenda.visibleItems}
          onOpenItem={onOpenItem}
        />
      ) : null}
      {agenda.view === "week" ? (
        <WeekView
          weekStart={monthSettings.weekStart}
          items={agenda.visibleItems}
          onOpenItem={onOpenItem}
          onCreateContent={onCreateContent}
        />
      ) : null}
      {agenda.view === "board" ? (
        <BoardView
          items={agenda.monthItems}
          hiddenStatuses={agenda.hiddenStatuses}
          onOpenItem={onOpenItem}
          onMoveItem={(itemId, status) => {
            const item = agenda.monthItems.find(
              (monthItem) => monthItem.id === itemId,
            );

            if (item) {
              onMoveItem(item, status);
            }
          }}
        />
      ) : null}

      {agenda.isSuggestedPlan ? (
        <button
          type="button"
          onClick={onApprovePlan}
          className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-primary text-[15px] font-semibold text-on-primary shadow-[0_10px_24px_rgba(89,38,200,.28)] transition-colors duration-150 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          <Check aria-hidden="true" className="size-4.5" />
          Aprovar plano de {monthName}
        </button>
      ) : null}
    </section>
  );
}
