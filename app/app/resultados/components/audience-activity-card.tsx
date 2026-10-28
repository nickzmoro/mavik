import { mockActivityByDay, mockActivityHours } from "@/lib/mocks/results";
import { cn } from "@/lib/utils";

import { ResultsCardHeader, ResultsCardNote } from "./results-card-header";

const heatCellClassName = "bg-[#5926c8] dark:bg-[#b390fa]";
const legendOpacities = [0.12, 0.45, 0.95];

export function AudienceActivityCard() {
  return (
    <section
      aria-labelledby="heat-title"
      className="glass flex min-w-0 flex-[2_1_340px] flex-col gap-3 rounded-3xl p-5"
    >
      <ResultsCardHeader
        titleId="heat-title"
        title="Quando seu público está on-line"
        description="Seguidores ativos por dia e horário"
      />
      <div
        role="img"
        aria-label="Seguidores mais ativos de quinta a sábado, entre 7h e 9h e entre 18h e 20h"
        className="grid grid-cols-[40px_repeat(6,minmax(0,1fr))] items-center gap-1.25"
      >
        <span />
        {mockActivityHours.map((hour) => (
          <span
            key={hour}
            className="text-center text-[11px] leading-[1.3] text-muted"
          >
            {hour}
          </span>
        ))}
        {mockActivityByDay.map((row) => (
          <div key={row.day} className="contents">
            <span
              className={cn(
                "text-xs leading-[1.3] font-semibold",
                row.isFocus ? "text-primary" : "text-muted",
              )}
            >
              {row.day}
            </span>
            {row.values.map((value, hourIndex) => (
              <span
                key={mockActivityHours[hourIndex]}
                className={cn("block h-6.5 rounded-[7px]", heatCellClassName)}
                style={{ opacity: +(0.1 + value * 0.85).toFixed(2) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs leading-[1.3] text-muted">
        Menos
        {legendOpacities.map((opacity) => (
          <span
            key={opacity}
            className={cn("h-2.5 w-4 rounded-[3px]", heatCellClassName)}
            style={{ opacity }}
          />
        ))}
        Mais
      </div>
      <ResultsCardNote>
        Combina com a agenda atual: Reels na quinta às 18h e stories no sábado
        cedo.
      </ResultsCardNote>
    </section>
  );
}
