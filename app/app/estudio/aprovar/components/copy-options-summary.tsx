import { Copy } from "lucide-react";

import { formatVariationCount } from "@/lib/art-options";
import type { ArtFormat } from "@/lib/mocks/studio";
import { cn } from "@/lib/utils";

type CopyOptionsSummaryProps = {
  prompt: string;
  format: ArtFormat;
  variationCount: number;
};

export function CopyOptionsSummary({
  prompt,
  format,
  variationCount,
}: CopyOptionsSummaryProps) {
  return (
    <div className="flex flex-col gap-3 text-sm leading-normal">
      <dl className="m-0 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs leading-[1.4] font-semibold text-muted">
            Seu pedido
          </dt>
          <dd className="m-0 break-words">{prompt}</dd>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="chip-surface inline-flex min-h-9 items-center gap-1.75 rounded-full px-3 text-[13px] font-semibold">
            <dt className="sr-only">Formato</dt>
            <span
              aria-hidden="true"
              className={cn(
                "block rounded-[3px] border-[1.5px] border-current",
                format.chipIconClassName,
              )}
            />
            <dd className="m-0">
              {format.label} · {format.ratioLabel}
            </dd>
          </div>
          <div className="chip-surface inline-flex min-h-9 items-center gap-1.75 rounded-full px-3 text-[13px] font-semibold">
            <dt className="sr-only">Variações</dt>
            <Copy aria-hidden="true" className="size-3.5 text-muted" />
            <dd className="m-0">{formatVariationCount(variationCount)}</dd>
          </div>
        </div>
      </dl>
      <p className="m-0 text-xs leading-normal text-muted">
        Os mesmos textos vão em todas as variações. Elas mudam só o visual, e
        cada uma usa 1 arte do seu plano.
      </p>
    </div>
  );
}
