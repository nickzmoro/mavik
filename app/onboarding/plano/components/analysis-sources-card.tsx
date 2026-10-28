"use client";

import { Check, Circle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const sourceLabels: Record<string, string> = {
  respostas: "Suas respostas",
  site: "Site",
  instagram: "Perfil público do Instagram",
};

type AnalysisSourcesCardProps = {
  sources: Record<string, boolean>;
  shareSummary: string;
};

export function AnalysisSourcesCard({
  sources,
  shareSummary,
}: AnalysisSourcesCardProps) {
  const [shareMessage, setShareMessage] = useState<string>();
  const readSources = Object.keys(sourceLabels).filter(
    (source) => sources[source],
  );
  const unreadSources = Object.keys(sourceLabels).filter(
    (source) => !sources[source],
  );

  const handleShare = async () => {
    if (navigator.share) {
      await navigator
        .share({ title: "Diagnóstico da minha marca", text: shareSummary })
        .catch(() => undefined);
      return;
    }

    await navigator.clipboard
      .writeText(shareSummary)
      .then(() => setShareMessage("Resumo copiado. Cole onde quiser."))
      .catch(() => setShareMessage("Não conseguimos copiar. Use Exportar."));
  };

  return (
    <div className="rounded-(--r-lg) border border-border bg-bg p-5 shadow-(--shadow-md)">
      <p className="m-0 font-display text-lg font-semibold text-text">
        O que analisamos
      </p>
      <p className="m-0 mt-1 text-sm text-muted">
        Transparência sobre o que foi lido e o que não foi acessado.
      </p>
      <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0 text-sm">
        {readSources.map((source) => (
          <li key={source} className="flex items-center gap-2 text-text">
            <Check size={16} aria-hidden="true" className="text-success" />
            {sourceLabels[source]}
          </li>
        ))}
        {unreadSources.length > 0 && (
          <li className="flex items-start gap-2 text-muted">
            <Circle size={16} aria-hidden="true" className="mt-0.5 flex-none" />
            Não acessado:{" "}
            {unreadSources
              .map((source) => sourceLabels[source].toLowerCase())
              .join(" e ")}
          </li>
        )}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          Exportar diagnóstico
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleShare}>
          Compartilhar
        </Button>
      </div>
      {shareMessage && (
        <p aria-live="polite" className="m-0 mt-2 text-sm text-muted">
          {shareMessage}
        </p>
      )}
    </div>
  );
}
