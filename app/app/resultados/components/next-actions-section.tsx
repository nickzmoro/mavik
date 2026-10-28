import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { mockConclusions, mockResultActions } from "@/lib/mocks/results";

import { EvidenceButton } from "./evidence-badge";
import { StrengthMeter } from "./strength-meter";

type NextActionsSectionProps = {
  doneConclusionIds: string[];
  hasSavedStoreTraffic: boolean;
  onExplain: (conclusionId: string) => void;
  onRunAction: (conclusionId: string) => void;
};

export function NextActionsSection({
  doneConclusionIds,
  hasSavedStoreTraffic,
  onExplain,
  onRunAction,
}: NextActionsSectionProps) {
  return (
    <section aria-labelledby="next-title" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="next-title"
          className="m-0 font-display text-xl leading-[1.3] font-semibold"
        >
          O que fazer agora
        </h2>
        <span className="text-[13px] leading-[1.4] text-muted">
          Sugestões do agente a partir destes resultados
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(250px,100%),1fr))] gap-3.5">
        {mockResultActions.map((action) => {
          const conclusion = mockConclusions[action.conclusionId];
          const isStoreTraffic = conclusion.action === "store-traffic";
          const isDone =
            doneConclusionIds.includes(conclusion.id) ||
            (isStoreTraffic && hasSavedStoreTraffic);
          const doneLabel = isStoreTraffic
            ? "Coleta iniciada"
            : conclusion.action === "keep"
              ? "Mantido na agenda"
              : "Na agenda";

          return (
            <article
              key={action.conclusionId}
              className="glass flex min-w-0 flex-col gap-3 rounded-[22px] p-4.5"
            >
              <div className="flex items-center justify-between gap-2">
                <EvidenceButton
                  kind={conclusion.kind}
                  onClick={() => onExplain(conclusion.id)}
                />
                <StrengthMeter strength={conclusion.strength} size="sm" />
              </div>
              <h3 className="m-0 font-display text-base leading-[1.35] font-semibold">
                {action.title}
              </h3>
              <p className="m-0 text-sm leading-normal text-muted">
                {conclusion.basis}
              </p>
              <div className="mt-auto">
                {isDone ? (
                  <span className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-success">
                    <Check aria-hidden="true" className="size-4" />
                    {doneLabel}
                  </span>
                ) : (
                  <Button
                    variant={action.isPrimary ? "default" : "outline"}
                    onClick={() => onRunAction(conclusion.id)}
                  >
                    {conclusion.cta}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
