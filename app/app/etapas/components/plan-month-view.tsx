import { AgendaItemCard } from "@/app/app/agenda/components/agenda-item-card";
import { agendaDayCellClassName } from "@/app/app/agenda/components/agenda-status-styles";
import type { ResolvedAgendaItem } from "@/app/app/agenda/hooks/use-agenda";
import { addDays, getMonthName, getWeekday, parseIsoDate } from "@/lib/agenda-dates";
import { agendaWeekdayLabels } from "@/lib/mocks/agenda";
import { cn } from "@/lib/utils";

import { PLAN_DAYS } from "../utils/plan-agenda-items";

type PlanMonthViewProps = {
  startDate: string;
  items: ResolvedAgendaItem[];
  onOpenItem: (itemId: string) => void;
};

export function PlanMonthView({
  startDate,
  items,
  onOpenItem,
}: PlanMonthViewProps) {
  const endDate = addDays(startDate, PLAN_DAYS - 1);
  const firstCell = addDays(startDate, -getWeekday(startDate));
  const cellsCount = Math.ceil((getWeekday(startDate) + PLAN_DAYS) / 7) * 7;
  const days = Array.from({ length: cellsCount }, (_, index) =>
    addDays(firstCell, index),
  );
  const weeks = Array.from({ length: cellsCount / 7 }, (_, weekIndex) =>
    days.slice(weekIndex * 7, weekIndex * 7 + 7),
  );

  return (
    <div className="scrollbar-subtle overflow-x-auto">
      <div className="flex min-w-190 flex-col gap-2">
        <div className="grid grid-cols-7 gap-2">
          {agendaWeekdayLabels.map((weekdayLabel) => (
            <div
              key={weekdayLabel}
              className="py-1 text-center text-xs leading-[1.4] font-semibold text-muted"
            >
              {weekdayLabel}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={week[0]} className="grid grid-cols-7 gap-2">
            {week.map((isoDate) => {
              const date = parseIsoDate(isoDate);
              const isInRange = isoDate >= startDate && isoDate <= endDate;
              const isMonthStart = date.getDate() === 1 || isoDate === startDate;
              const dayItems = items.filter((item) => item.date === isoDate);

              return (
                <div
                  key={isoDate}
                  className={cn(
                    "box-border flex min-h-29.5 min-w-0 flex-col gap-1.25 rounded-(--r-lg) p-2",
                    agendaDayCellClassName,
                    !isInRange && "opacity-40",
                  )}
                >
                  <div className="flex min-w-0 items-center justify-between gap-1">
                    <span className="box-border inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full px-1 text-[13px] leading-none font-semibold">
                      {date.getDate()}
                    </span>
                    {isInRange && isMonthStart ? (
                      <span className="date-chip min-w-0 truncate rounded-full px-1.75 py-0.5 text-[11px] leading-[1.3] font-semibold">
                        {getMonthName(date.getMonth()).slice(0, 3)}
                      </span>
                    ) : null}
                  </div>
                  {isInRange
                    ? dayItems.map((item) => (
                        <AgendaItemCard
                          key={item.id}
                          item={item}
                          variant="compact"
                          onClick={() => onOpenItem(item.id)}
                        />
                      ))
                    : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
