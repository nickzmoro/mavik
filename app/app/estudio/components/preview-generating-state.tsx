import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatVariationCount } from "@/lib/art-options";
import { generationSteps } from "@/lib/mocks/studio";
import { VariationGrid } from "./variation-grid";

type PreviewGeneratingStateProps = {
  variationCount: number;
  aspectRatio: string;
  onCancel: () => void;
};

export function PreviewGeneratingState({
  variationCount,
  aspectRatio,
  onCancel,
}: PreviewGeneratingStateProps) {
  return (
    <div aria-live="polite" className="flex flex-col gap-3.5">
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {generationSteps.map((step) => (
          <li
            key={step}
            className="flex items-center gap-2 text-sm leading-[1.4]"
          >
            <Check
              aria-hidden="true"
              className="size-4 shrink-0 text-success"
            />
            {step}
          </li>
        ))}
        <li className="flex animate-soft-pulse items-center gap-2 text-sm leading-[1.4] text-muted motion-reduce:animate-none">
          <Sparkles aria-hidden="true" className="size-4 shrink-0" />
          Criando {formatVariationCount(variationCount)}…
        </li>
      </ul>
      <VariationGrid>
        {Array.from({ length: variationCount }, (_, index) => (
          <div
            key={index}
            className="tile animate-soft-pulse rounded-2xl motion-reduce:animate-none"
            style={{ aspectRatio }}
          />
        ))}
      </VariationGrid>
      <Button variant="ghost" onClick={onCancel} className="self-start">
        Cancelar
      </Button>
    </div>
  );
}
