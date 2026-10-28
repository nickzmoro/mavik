import { Info } from "lucide-react";

import { EvidenceBadge, type EvidenceBadgeKind } from "./evidence-badge";

const guideItems: { kind: EvidenceBadgeKind; description: string }[] = [
  { kind: "real", description: "medido no Instagram, sem interpretação" },
  {
    kind: "hypothesis",
    description: "leitura do agente, ainda não comprovada",
  },
  { kind: "none", description: "ainda não medimos" },
];

type ReadingGuideProps = {
  hasData: boolean;
};

export function ReadingGuide({ hasData }: ReadingGuideProps) {
  return (
    <div
      role="note"
      className="glass flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-[18px] px-3.5 py-2.5 text-[13px] leading-[1.45]"
    >
      <span className="inline-flex items-center gap-1.5 font-semibold">
        <Info aria-hidden="true" className="size-4" />
        Como ler
      </span>
      {guideItems.map(({ kind, description }) => (
        <span key={kind} className="inline-flex items-center gap-2">
          <EvidenceBadge kind={kind} />
          <span className="text-muted">{description}</span>
        </span>
      ))}
      {hasData ? (
        <span className="ml-auto text-muted">
          Fonte: Instagram · atualizado há 2 horas
        </span>
      ) : null}
    </div>
  );
}
