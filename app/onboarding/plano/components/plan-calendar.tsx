import type { PlanItemValues } from "@/actions/save-onboarding-plan/schema";
import { contentKinds, type ContentKind } from "@/lib/onboarding/constants";
import { cn } from "@/lib/utils";

export const contentKindStyles: Record<ContentKind, string> = {
  educativo: "bg-accent text-(--violet-900)",
  comercial: "bg-primary-brand text-white",
  autoridade: "border border-(--violet-300) bg-surface-2 text-(--violet-900)",
};

const weekdayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const PLAN_DAYS = 30;

export function getPlanDate(startDate: string, day: number) {
  const date = new Date(`${startDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + day - 1);

  return date;
}

type PlanCalendarProps = {
  startDate: string;
  items: PlanItemValues[];
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
};

export function PlanCalendar({
  startDate,
  items,
  selectedDay,
  onSelectDay,
}: PlanCalendarProps) {
  const itemByDay = new Map(items.map((item) => [item.day, item]));
  const leadingEmptyCells = (getPlanDate(startDate, 1).getUTCDay() + 6) % 7;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
        role="grid"
        aria-label="Plano de 30 dias"
      >
        {weekdayLabels.map((weekday) => (
          <span
            key={weekday}
            role="columnheader"
            className="text-center text-xs text-muted"
          >
            {weekday}
          </span>
        ))}
        {Array.from({ length: leadingEmptyCells }, (_, index) => (
          <span key={`empty-${index}`} aria-hidden="true" />
        ))}
        {Array.from({ length: PLAN_DAYS }, (_, index) => {
          const day = index + 1;
          const item = itemByDay.get(day);
          const date = getPlanDate(startDate, day);
          const dateLabel = date.toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            timeZone: "UTC",
          });
          const kindLabel = contentKinds.find(
            ({ value }) => value === item?.kind,
          )?.label;

          return (
            <button
              key={day}
              type="button"
              role="gridcell"
              aria-selected={selectedDay === day}
              aria-label={
                item
                  ? `${dateLabel}: ${kindLabel}, ${item.title}`
                  : `${dateLabel}: sem pauta. Adicionar`
              }
              onClick={() => onSelectDay(day)}
              className={cn(
                "flex min-h-16 cursor-pointer flex-col items-start gap-1 rounded-(--r-md) border bg-bg p-1.5 text-left transition-colors duration-150 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none sm:min-h-20 sm:p-2",
                selectedDay === day
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border",
              )}
            >
              <span className="text-xs text-muted">{date.getUTCDate()}</span>
              {item && (
                <span
                  className={cn(
                    "w-full truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:text-xs",
                    contentKindStyles[item.kind],
                  )}
                >
                  {kindLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-4 p-0 text-sm text-text">
        {contentKinds.map(({ value, label }) => (
          <li key={value} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className={cn("h-3 w-5 rounded-full", contentKindStyles[value])}
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
