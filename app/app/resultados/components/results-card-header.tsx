import { EvidenceBadge } from "./evidence-badge";

type ResultsCardHeaderProps = {
  titleId: string;
  title: string;
  description: string;
  hasEvidenceBadge?: boolean;
};

export function ResultsCardHeader({
  titleId,
  title,
  description,
  hasEvidenceBadge = true,
}: ResultsCardHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h2
          id={titleId}
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          {title}
        </h2>
        <span className="text-[13px] leading-[1.4] text-muted">
          {description}
        </span>
      </div>
      {hasEvidenceBadge ? <EvidenceBadge kind="real" /> : null}
    </div>
  );
}

export function ResultsCardNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 text-[13px] leading-normal text-muted">{children}</p>
  );
}
