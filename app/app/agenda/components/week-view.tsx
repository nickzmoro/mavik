import { Sparkles } from "lucide-react";

import { addDays, getWeekday, parseIsoDate } from "@/lib/agenda-dates";
import {
  agendaFocusWeekdays,
  agendaWeekdayLabels,
  mockAgendaMarkers,
  mockAgendaToday,
} from "@/lib/mocks/agenda";
import { cn } from "@/lib/utils";

import type { ResolvedAgendaItem } from "../hooks/use-agenda";
import { AgendaItemCard } from "./agenda-item-card";
import {
  agendaDayCellClassName,
  agendaFocusDayCellClassName,
} from "./agenda-status-styles";

const getEmptyDaySuggestion = (weekday: number) => {
  if (weekday === 0) {
    return "Dia livre de propósito: o foco é de quinta a sábado.";
  }

  return agendaFocusWeekdays.includes(weekday)
    ? "Dia de foco sem conteúdo. Um story de bastidores já ajuda."
    : "Um story rápido de bastidores mantém o perfil ativo.";
};

type WeekViewProps = {
  weekStart: string;
  items: ResolvedAgendaItem[];
  onOpenItem: (itemId: string) => void;
  onCreateContent: () => void;
};

export function WeekView({
  weekStart,
  items,
  onOpenItem,
  onCreateContent,
}: WeekViewProps) {
  const weekDays = Array.from({ length: 7 }, (_, dayOffset) =>
    addDays(weekStart, dayOffset),
  );

  return (
    <div className="scrollbar-subtle overflow-x-auto">
      <div className="grid min-w-225 grid-cols-7 gap-2.5">
        {weekDays.map((isoDate) => {
          const weekday = getWeekday(isoDate);
          const isFocusDay = agendaFocusWeekdays.includes(weekday);
          const isToday = isoDate === mockAgendaToday;
          const marker = mockAgendaMarkers[isoDate];
          const dayItems = items.filter((item) => item.date === isoDate);

          return (
            <div
              key={isoDate}
              className={cn(
                "box-border flex min-h-130 min-w-0 flex-col gap-2 rounded-[18px] p-2.5",
                agendaDayCellClassName,
                isFocusDay && agendaFocusDayCellClassName,
                isToday && "shadow-[inset_0_0_0_2px_var(--primary)]",
              )}
            >
              <div className="flex flex-col gap-0.5 px-0.5 pt-0.5 pb-1.5">
                <span className="text-xs leading-[1.4] font-semibold text-muted">
                  {agendaWeekdayLabels[weekday]}
                  {isFocusDay ? " · foco" : null}
                </span>
                <span
                  className={cn(
                    "box-border inline-flex h-7.5 w-fit min-w-7.5 items-center justify-center rounded-full px-1 font-display text-lg font-bold",
                    isToday && "bg-primary text-on-primary",
                  )}
                >
                  {parseIsoDate(isoDate).getDate()}
                </span>
                {marker ? (
                  <span className="date-chip self-start rounded-full px-2 py-0.5 text-[11px] leading-[1.3] font-semibold">
                    {marker}
                  </span>
                ) : null}
              </div>
              {dayItems.map((item) => (
                <AgendaItemCard
                  key={item.id}
                  item={item}
                  variant="detailed"
                  onClick={() => onOpenItem(item.id)}
                />
              ))}
              {dayItems.length === 0 ? (
                <button
                  type="button"
                  onClick={onCreateContent}
                  className="flex cursor-pointer flex-col items-start gap-1 rounded-[14px] border border-dashed border-[rgba(127,117,160,.45)] bg-transparent px-3 py-2.5 text-left text-muted transition-colors duration-150 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
                >
                  <span className="flex items-center gap-1.5 text-xs leading-[1.3] font-semibold">
                    <Sparkles aria-hidden="true" className="size-3.25" />
                    Sugestão
                  </span>
                  <span className="text-[13px] leading-[1.4]">
                    {getEmptyDaySuggestion(weekday)}
                  </span>
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
