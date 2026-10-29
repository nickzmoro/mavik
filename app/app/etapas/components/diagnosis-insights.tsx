import { CircleCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type DiagnosisInsightsProps = {
  strengths: string[];
  attentionPoints: string[];
  opportunities: string[];
};

type InsightCardProps = {
  title: string;
  items: string[];
  markerClassName: string;
  emptyMessage: string;
};

function InsightCard({
  title,
  items,
  markerClassName,
  emptyMessage,
}: InsightCardProps) {
  return (
    <section
      aria-label={title}
      className="tile flex flex-col gap-3 rounded-(--r-lg) p-5"
    >
      <h3 className="m-0 flex items-center gap-2 font-display text-[15px] font-semibold">
        <i
          aria-hidden="true"
          className={cn("size-2.5 rounded-full", markerClassName)}
        />
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-normal">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="m-0 text-sm leading-normal text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}

export function DiagnosisInsights({
  strengths,
  attentionPoints,
  opportunities,
}: DiagnosisInsightsProps) {
  const isEverythingInOrder = attentionPoints.length === 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <InsightCard
        title="Pontos fortes"
        items={strengths}
        markerClassName="bg-success"
        emptyMessage="Complete mais informações da marca para ver seus pontos fortes."
      />
      {isEverythingInOrder ? (
        <section
          aria-label="Tudo em dia"
          className="flex flex-col gap-3 rounded-(--r-lg) border border-success bg-success-bg p-5"
        >
          <h3 className="m-0 flex items-center gap-2 font-display text-[15px] font-semibold">
            <CircleCheck
              aria-hidden="true"
              className="size-4.5 text-success"
            />
            Tudo em dia
          </h3>
          <p className="m-0 text-sm leading-normal">
            Cores, fontes, logos, voz e público estão completos. Sua marca está
            pronta para criar com consistência.
          </p>
        </section>
      ) : (
        <InsightCard
          title="Pontos de atenção"
          items={attentionPoints}
          markerClassName="bg-warning"
          emptyMessage=""
        />
      )}
      <InsightCard
        title="Oportunidades"
        items={opportunities}
        markerClassName="bg-primary"
        emptyMessage="Nenhuma oportunidade urgente por enquanto."
      />
    </div>
  );
}
