import { contentFormatIcons } from "@/components/common/format-icons";
import { mockTopContents } from "@/lib/mocks/results";

import { ResultsCardHeader } from "./results-card-header";

type TopContentsCardProps = {
  onOpenContent: (contentId: string) => void;
};

export function TopContentsCard({ onOpenContent }: TopContentsCardProps) {
  return (
    <section
      aria-labelledby="top-title"
      className="glass flex min-w-0 flex-[3_1_520px] flex-col gap-3 rounded-3xl p-5"
    >
      <ResultsCardHeader
        titleId="top-title"
        title="Melhores conteúdos"
        description="Ordenados por alcance · comparados à média do perfil"
        hasEvidenceBadge={false}
      />
      <ol className="m-0 flex list-none flex-col gap-1 p-0">
        {mockTopContents.map((content) => {
          const FormatIcon = contentFormatIcons[content.format];

          return (
            <li key={content.id}>
              <button
                type="button"
                aria-label={`${content.rank}º: ${content.title}, ${content.reach} de alcance, ${content.multiplier} a média`}
                onClick={() => onOpenContent(content.id)}
                className="flex w-full cursor-pointer flex-wrap items-center gap-3.5 rounded-(--r-lg) border-0 bg-transparent p-2.5 text-left text-text transition-colors duration-150 hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none sm:flex-nowrap"
              >
                <span
                  aria-hidden="true"
                  className="w-5.5 shrink-0 text-center font-display text-[15px] font-bold text-muted"
                >
                  {content.rank}
                </span>
                <span
                  aria-hidden="true"
                  className="relative h-16 w-13 shrink-0 overflow-hidden rounded-(--r-md)"
                  style={{ backgroundColor: content.thumbColor }}
                >
                  <span
                    className="absolute -right-2 -bottom-1.5 size-8.5 rounded-full"
                    style={{ backgroundColor: content.thumbAccentColor }}
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.75">
                  <span className="text-[15px] leading-[1.35] font-semibold">
                    {content.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs leading-[1.4] text-muted">
                    <FormatIcon
                      aria-hidden="true"
                      className="size-3.25 shrink-0"
                    />
                    {content.format} · {content.date} · {content.topic}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-0.75 max-sm:ml-9">
                  <span className="text-[15px] leading-[1.3] font-bold">
                    {content.reach}
                  </span>
                  <span className="text-xs leading-[1.3] text-muted">
                    alcance · {content.engagement} eng.
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs leading-[1.3] font-bold text-primary">
                  {content.multiplier}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
