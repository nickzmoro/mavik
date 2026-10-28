import { Calendar, TrendingUp } from "lucide-react";

import { mockIdeaDates, mockIdeas, type IdeaDateKey } from "@/lib/mocks/ideas";
import { cn } from "@/lib/utils";

const getIdeasCountLabel = (dateKey: IdeaDateKey) => {
  const ideasCount = mockIdeas.filter(
    (idea) => idea.dateKey === dateKey,
  ).length;

  if (ideasCount === 0) {
    return "sem ideias ainda";
  }

  return ideasCount === 1 ? "1 ideia" : `${ideasCount} ideias`;
};

type IdeasDatesProps = {
  selectedDateKey: IdeaDateKey | null;
  onToggleDate: (dateKey: IdeaDateKey) => void;
};

export function IdeasDates({ selectedDateKey, onToggleDate }: IdeasDatesProps) {
  return (
    <section aria-labelledby="dates-title" className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="dates-title"
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          Datas e acontecimentos
        </h2>
        <span className="text-[13px] leading-[1.4] text-muted">
          Próximos 70 dias · toque para filtrar
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(190px,100%),1fr))] gap-3 max-sm:grid-cols-2">
        {mockIdeaDates.map((ideaDate) => {
          const isSelected = ideaDate.key === selectedDateKey;
          const DateIcon = ideaDate.isTrend ? TrendingUp : Calendar;

          return (
            <button
              key={ideaDate.key}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggleDate(ideaDate.key)}
              className={cn(
                "flex min-h-24 min-w-0 cursor-pointer flex-col items-start gap-1 rounded-[20px] px-4 py-3.5 text-left transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
                isSelected
                  ? "border border-primary bg-primary text-on-primary"
                  : "glass text-text hover:border-accent",
              )}
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs leading-[1.4] font-semibold",
                  !isSelected && "text-primary",
                )}
              >
                {isSelected ? null : (
                  <DateIcon aria-hidden="true" className="size-3.5 shrink-0" />
                )}
                {ideaDate.day}
              </span>
              <span className="font-display text-[15px] leading-[1.3] font-semibold">
                {ideaDate.name}
              </span>
              <span
                className={cn(
                  "text-xs leading-[1.4]",
                  isSelected ? "opacity-85" : "text-muted",
                )}
              >
                {ideaDate.when} · {getIdeasCountLabel(ideaDate.key)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
