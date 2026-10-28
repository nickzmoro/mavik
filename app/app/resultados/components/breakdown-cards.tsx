import { cn } from "@/lib/utils";
import {
  mockAudienceSplit,
  mockFormatEngagement,
  mockTopicReach,
} from "@/lib/mocks/results";

import { ResultsCardHeader, ResultsCardNote } from "./results-card-header";

const donutCircumference = 339.29;
const donutSlices = mockAudienceSplit.map((slice, sliceIndex) => {
  const previousPercentage = mockAudienceSplit
    .slice(0, sliceIndex)
    .reduce((total, previousSlice) => total + previousSlice.percentage, 0);

  return {
    ...slice,
    dashArray: `${(donutCircumference * slice.percentage) / 100} ${donutCircumference}`,
    dashOffset: (-donutCircumference * previousPercentage) / 100,
  };
});

const cardClassName = "glass flex min-w-0 flex-col gap-3.5 rounded-3xl p-5";

function FormatsCard() {
  return (
    <section aria-labelledby="fmt-title" className={cardClassName}>
      <ResultsCardHeader
        titleId="fmt-title"
        title="Formatos"
        description="Engajamento médio por publicação"
      />
      <div
        role="img"
        aria-label={`Engajamento médio: ${mockFormatEngagement.map((format) => `${format.label} ${format.value}`).join(", ")}`}
        className="grid h-47.5 grid-cols-4 items-end gap-3 pt-2"
      >
        {mockFormatEngagement.map((format) => (
          <div
            key={format.label}
            className="flex h-full min-w-0 flex-col items-center justify-end gap-1.5"
          >
            <span className="text-sm leading-[1.2] font-bold">
              {format.value}
            </span>
            <div
              className={cn(
                "w-full max-w-14 rounded-t-(--r-md) rounded-b-(--r-sm)",
                format.colorClassName,
              )}
              style={{ height: `${format.height}%` }}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-3 text-center">
        {mockFormatEngagement.map((format) => (
          <div key={format.label} className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[13px] leading-[1.3] font-semibold">
              {format.label}
            </span>
            <span
              className={cn(
                "text-xs leading-[1.3]",
                format.isSmallSample ? "text-warning" : "text-muted",
              )}
            >
              {format.note}
            </span>
          </div>
        ))}
      </div>
      <ResultsCardNote>
        Carrossel teve só 2 publicações: o número pode mudar bastante com mais
        testes.
      </ResultsCardNote>
    </section>
  );
}

function TopicsCard() {
  return (
    <section aria-labelledby="thm-title" className={cardClassName}>
      <ResultsCardHeader
        titleId="thm-title"
        title="Temas"
        description="Alcance médio por publicação"
      />
      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {mockTopicReach.map((topic) => (
          <li key={topic.label} className="flex flex-col gap-1.5">
            <span className="flex items-baseline justify-between gap-2">
              <span className="text-sm leading-[1.4] font-semibold">
                {topic.label}{" "}
                <span className="text-xs font-normal text-muted">
                  {topic.note}
                </span>
              </span>
              <span className="text-sm leading-[1.4] font-bold">
                {topic.value}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="block h-2.5 overflow-hidden rounded-full bg-[rgba(127,117,160,.16)]"
            >
              <span
                className={cn(
                  "block h-full rounded-full",
                  topic.colorClassName,
                )}
                style={{ width: `${topic.percentage}%` }}
              />
            </span>
          </li>
        ))}
      </ul>
      <ResultsCardNote>
        Bastidores alcança quase o dobro de Produtos. Equipe tem só 2 posts:
        ainda é cedo para concluir.
      </ResultsCardNote>
    </section>
  );
}

function AudienceCard() {
  const [primarySlice] = mockAudienceSplit;

  return (
    <section aria-labelledby="who-title" className={cardClassName}>
      <ResultsCardHeader
        titleId="who-title"
        title="Quem viu"
        description="Alcance por tipo de público"
      />
      <div className="flex flex-wrap items-center justify-center gap-5">
        <div className="relative size-40 shrink-0">
          <svg
            role="img"
            aria-label="54% do alcance veio de não seguidores e 46% de seguidores"
            viewBox="0 0 140 140"
            className="size-full -rotate-90"
          >
            <circle
              cx="70"
              cy="70"
              r="54"
              fill="none"
              strokeWidth="18"
              stroke="rgba(127,117,160,.16)"
            />
            {donutSlices.map((slice) => (
              <circle
                key={slice.label}
                cx="70"
                cy="70"
                r="54"
                fill="none"
                strokeWidth="18"
                stroke={slice.colorVariable}
                strokeDasharray={slice.dashArray}
                strokeDashoffset={slice.dashOffset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-display text-2xl leading-[1.1] font-bold">
              {primarySlice.percentage}%
            </span>
            <span className="text-xs leading-[1.3] text-muted">gente nova</span>
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {mockAudienceSplit.map((slice) => (
            <li
              key={slice.label}
              className="flex items-center gap-2 text-sm leading-[1.4]"
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-full"
                style={{ backgroundColor: slice.colorVariable }}
              />
              <span className="flex-1">{slice.label}</span>
              <strong className="font-bold">{slice.percentage}%</strong>
            </li>
          ))}
        </ul>
      </div>
      <ResultsCardNote>
        Mais da metade do alcance veio de quem ainda não segue o Aurora. Reels
        puxaram a maior parte.
      </ResultsCardNote>
    </section>
  );
}

export function BreakdownCards() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
      <FormatsCard />
      <TopicsCard />
      <AudienceCard />
    </div>
  );
}
