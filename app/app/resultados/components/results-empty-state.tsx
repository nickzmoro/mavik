import { Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { EvidenceBadge, type EvidenceBadgeKind } from "./evidence-badge";

const previewItems: {
  kind: EvidenceBadgeKind;
  badgeLabel?: string;
  title: string;
  description: string;
}[] = [
  {
    kind: "real",
    title: "Números do seu perfil",
    description:
      "Alcance, visualizações, engajamento e cliques, comparados ao período anterior.",
  },
  {
    kind: "hypothesis",
    title: "Hipóteses sinalizadas",
    description:
      "Quando o agente interpreta algo que os dados não provam, ele avisa e diz como confirmar.",
  },
  {
    kind: "none",
    badgeLabel: "Ações",
    title: "Próximos passos",
    description:
      "Cada conclusão vira uma ação que você pode levar direto para a agenda.",
  },
];

type ResultsEmptyStateProps = {
  onConnectInstagram: () => void;
  onOpenSources: () => void;
};

export function ResultsEmptyState({
  onConnectInstagram,
  onOpenSources,
}: ResultsEmptyStateProps) {
  return (
    <>
      <section
        aria-labelledby="empty-title"
        className="glass flex flex-col items-center gap-4 rounded-[28px] px-5 py-10 text-center sm:px-8"
      >
        <span
          aria-hidden="true"
          className="flex size-18 items-center justify-center rounded-3xl bg-accent text-(--violet-900)"
        >
          <Link2 className="size-8" />
        </span>
        <h2
          id="empty-title"
          className="m-0 font-display text-[22px] leading-[1.25] font-bold sm:text-[26px]"
        >
          Conecte o Instagram para ver seus resultados
        </h2>
        <p className="m-0 max-w-140 text-[15px] leading-[1.6] text-muted">
          A Mavik só lê as métricas, nunca publica sozinha. Em cerca de 24 horas
          você vê alcance, engajamento e os melhores conteúdos, e o agente
          começa a sugerir próximos passos.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={onConnectInstagram}>
            <Link2 aria-hidden="true" className="size-4.5" />
            Conectar Instagram
          </Button>
          <Button variant="ghost" onClick={onOpenSources}>
            Ver outras fontes
          </Button>
        </div>
        <div className="mt-3 grid w-full max-w-215 grid-cols-[repeat(auto-fill,minmax(min(240px,100%),1fr))] gap-3 text-left">
          {previewItems.map((item) => (
            <div
              key={item.title}
              className="tile flex flex-col gap-2 rounded-[18px] p-4"
            >
              <EvidenceBadge
                kind={item.kind}
                label={item.badgeLabel}
                className="self-start"
              />
              <span className="text-[15px] leading-[1.4] font-semibold">
                {item.title}
              </span>
              <span className="text-[13px] leading-normal text-muted">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </section>
      <div
        aria-hidden="true"
        className="grid grid-cols-[repeat(auto-fill,minmax(min(210px,100%),1fr))] gap-3.5"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="glass h-30 rounded-[22px] opacity-50" />
        ))}
      </div>
    </>
  );
}
