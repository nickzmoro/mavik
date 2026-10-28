import type { Conclusion } from "@/lib/mocks/results";

import { EvidenceButton } from "./evidence-badge";

type ConclusionItemProps = {
  conclusion: Conclusion;
  onExplain: (conclusionId: string) => void;
  hasHowToConfirm?: boolean;
  textClassName?: string;
};

export function ConclusionItem({
  conclusion,
  onExplain,
  hasHowToConfirm = false,
  textClassName = "leading-normal",
}: ConclusionItemProps) {
  return (
    <li className="tile flex flex-col gap-2 rounded-(--r-lg) px-3.5 py-3">
      <span className={`text-sm ${textClassName}`}>{conclusion.text}</span>
      {hasHowToConfirm ? (
        <span className="text-[13px] leading-normal text-muted">
          <strong className="font-semibold text-text">Como confirmar:</strong>{" "}
          {conclusion.limit}
        </span>
      ) : null}
      <span className="flex flex-wrap items-center justify-between gap-2">
        <EvidenceButton
          kind={conclusion.kind}
          onClick={() => onExplain(conclusion.id)}
        />
        <span className="text-xs leading-[1.4] text-muted">
          {conclusion.basisShort}
        </span>
      </span>
    </li>
  );
}
