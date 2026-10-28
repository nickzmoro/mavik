import {
  Calendar,
  Copy,
  Download,
  PenLine,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { IconButton } from "@/components/common/icon-button";
import { Button } from "@/components/ui/button";
import { brandRuleHighlights, mockGeneratedArt } from "@/lib/mocks/studio";
import { cn } from "@/lib/utils";

import type { StudioState } from "../hooks/use-studio";
import { StudioArt } from "./studio-art";
import { VariationGrid } from "./variation-grid";

type PreviewVariationsResultProps = {
  studio: StudioState;
  onDownload: (variationIndex: number) => void;
  onCopyCaption: () => void;
};

export function PreviewVariationsResult({
  studio,
  onDownload,
  onCopyCaption,
}: PreviewVariationsResultProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <p className="m-0 text-sm leading-normal text-muted">
        Pronto! Veja suas {studio.variationCount} opções de arte. Toque numa
        para escolher.
      </p>
      <VariationGrid role="radiogroup" aria-label="Variações geradas">
        {Array.from({ length: studio.variationCount }, (_, index) => {
          const variationLabel = `Variação ${index + 1}`;
          const isSelected = studio.selectedVariation === index;

          return (
            <div key={variationLabel} className="flex min-w-0 flex-col gap-2">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={variationLabel}
                onClick={() => studio.selectVariation(index)}
                className={cn(
                  "block w-full cursor-pointer rounded-2xl border-0 bg-transparent p-0 transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  isSelected && "shadow-[0_0_0_3px_var(--primary)]",
                )}
              >
                <StudioArt
                  styleIndex={index}
                  title={mockGeneratedArt.title}
                  subtitle={mockGeneratedArt.subtitle}
                  aspectRatio={studio.format.aspectRatio}
                  label={`${variationLabel}: ${mockGeneratedArt.title}`}
                />
              </button>
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-[13px] leading-[1.4] font-semibold">
                  {variationLabel}
                </span>
                <span className="flex shrink-0 gap-0.5">
                  <IconButton
                    label={`Pedir ajuste na variação ${index + 1}`}
                    onClick={() => studio.openEditor(index)}
                  >
                    <PenLine />
                  </IconButton>
                  <IconButton
                    label={`Baixar variação ${index + 1}`}
                    onClick={() => onDownload(index)}
                  >
                    <Download />
                  </IconButton>
                </span>
              </div>
            </div>
          );
        })}
      </VariationGrid>
      <div className="tile flex flex-col gap-2 rounded-2xl px-3.5 py-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs leading-[1.4] font-semibold text-primary">
            Legenda sugerida
          </span>
          <button
            type="button"
            onClick={onCopyCaption}
            className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-transparent px-2.5 text-[13px] font-semibold text-primary transition-colors duration-150 hover:bg-icon-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
          >
            <Copy aria-hidden="true" className="size-3.5" />
            Copiar
          </button>
        </div>
        <p className="m-0 text-sm leading-[1.55] whitespace-pre-line">
          {studio.caption}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-[13px] leading-[1.4] font-semibold">
          <ShieldCheck aria-hidden="true" className="size-4 text-success" />
          Segue as 5 regras da marca
        </span>
        {brandRuleHighlights.map((rule) => (
          <span
            key={rule}
            className="chip-surface rounded-full px-2.5 py-0.75 text-xs leading-[1.4] font-medium"
          >
            {rule}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={studio.openSchedule}>
          <Calendar aria-hidden="true" className="size-4.5" />
          Aprovar e agendar
        </Button>
        <Button variant="outline" onClick={() => studio.openEditor()}>
          <WandSparkles aria-hidden="true" className="size-4.5" />
          Pedir ajuste à IA
        </Button>
        <Button variant="ghost" onClick={studio.generate}>
          <Sparkles aria-hidden="true" className="size-4.5" />
          Gerar parecidas
        </Button>
      </div>
    </div>
  );
}
