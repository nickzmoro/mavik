import { buildMonthWeeks } from "@/lib/agenda-dates";
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

type MonthViewProps = {
  monthIndex: number;
  items: ResolvedAgendaItem[];
  onOpenItem: (itemId: string) => void;
};

export function MonthView({ monthIndex, items, onOpenItem }: MonthViewProps) {
  const weeks = buildMonthWeeks(2026, monthIndex);

  return (
    <div className="scrollbar-subtle overflow-x-auto">
      <div className="flex min-w-190 flex-col gap-2">
        <div className="grid grid-cols-7 gap-2">
          {agendaWeekdayLabels.map((weekdayLabel, weekdayIndex) => (
            <div
              key={weekdayLabel}
              className="flex items-center justify-center gap-1.5 py-1 text-xs leading-[1.4] font-semibold text-muted"
            >
              {weekdayLabel}
              {agendaFocusWeekdays.includes(weekdayIndex) ? (
                <span className="rounded-full bg-surface-2 px-1.5 py-px text-[11px] font-semibold text-primary">
                  foco
                </span>
              ) : null}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0].isoDate} className="grid grid-cols-7 gap-2">
            {week.map((day, weekdayIndex) => {
              const isToday = day.isoDate === mockAgendaToday;
              const marker = day.isInMonth
                ? mockAgendaMarkers[day.isoDate]
                : undefined;
              const dayItems = day.isInMonth
                ? items.filter((item) => item.date === day.isoDate)
                : [];

              return (
                <div
                  key={day.isoDate}
                  className={cn(
                    "box-border flex min-h-29.5 min-w-0 flex-col gap-1.25 rounded-(--r-lg) p-2",
                    agendaDayCellClassName,
                    day.isInMonth &&
                      agendaFocusWeekdays.includes(weekdayIndex) &&
                      agendaFocusDayCellClassName,
                    !day.isInMonth && "opacity-40",
                    isToday && "shadow-[inset_0_0_0_2px_var(--primary)]",
                  )}
                >
                  <div className="flex min-w-0 items-center justify-between gap-1">
                    <span
                      className={cn(
                        "box-border inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[13px] leading-none font-semibold",
                        isToday && "bg-primary text-on-primary",
                      )}
                    >
                      {day.dayNumber}
                    </span>
                    {marker ? (
                      <span
                        title={marker}
                        className="date-chip min-w-0 truncate rounded-full px-1.75 py-0.5 text-[11px] leading-[1.3] font-semibold"
                      >
                        {marker}
                      </span>
                    ) : null}
                  </div>
                  {dayItems.map((item) => (
                    <AgendaItemCard
                      key={item.id}
                      item={item}
                      variant="compact"
                      onClick={() => onOpenItem(item.id)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
