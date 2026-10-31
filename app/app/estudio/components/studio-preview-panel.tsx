import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatVariationCount } from "@/lib/art-options";

import type { StudioPhase, StudioState } from "../hooks/use-studio";
import { PreviewGeneratingState } from "./preview-generating-state";
import { PreviewIdleState } from "./preview-idle-state";
import { PreviewVariationsResult } from "./preview-variations-result";

const getPreviewTitle = (
  phase: StudioPhase,
  variationCount: number,
  formatName: string,
) => {
  const previewTitles: Record<StudioPhase, string> = {
    idle: "Prévia",
    generating: "Gerando",
    done: `${formatVariationCount(variationCount)} · ${formatName}`,
  };
  const title = previewTitles[phase];

  return title.charAt(0).toUpperCase() + title.slice(1);
};

type StudioPreviewPanelProps = {
  studio: StudioState;
  onDownload: (variationIndex: number) => void;
  onCopyCaption: () => void;
  onPublishNow: () => void;
};

export function StudioPreviewPanel({
  studio,
  onDownload,
  onCopyCaption,
  onPublishNow,
}: StudioPreviewPanelProps) {
  return (
    <section
      aria-labelledby="studio-preview-title"
      className="glass flex min-w-0 flex-[1.1_1_480px] flex-col gap-4 rounded-3xl p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="studio-preview-title"
          className="m-0 font-display text-base leading-[1.4] font-semibold"
        >
          {getPreviewTitle(
            studio.phase,
            studio.phase === "done"
              ? studio.imageUrls.length
              : studio.variationCount,
            studio.phase === "done"
              ? studio.resultFormat.name
              : studio.format.name,
          )}
        </h2>
        {studio.phase === "done" ? (
          <Button variant="ghost" onClick={studio.regenerate}>
            <RefreshCw aria-hidden="true" className="size-4.5" />
            Gerar de novo
          </Button>
        ) : null}
      </div>
      {studio.phase === "idle" ? <PreviewIdleState /> : null}
      {studio.phase === "generating" ? (
        <PreviewGeneratingState
          variationCount={studio.variationCount}
          aspectRatio={studio.format.aspectRatio}
          onCancel={studio.cancelGeneration}
        />
      ) : null}
      {studio.phase === "done" ? (
        <PreviewVariationsResult
          studio={studio}
          onDownload={onDownload}
          onCopyCaption={onCopyCaption}
          onPublishNow={onPublishNow}
        />
      ) : null}
    </section>
  );
}
