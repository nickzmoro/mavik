"use client";

import type { StudioArtwork } from "@/lib/content/get-studio-artwork";
import type { ScheduleArtFormValues } from "@/lib/validations/studio";
import { useToast } from "@/providers/toast-provider";

import { useStudio, type StudioDialog } from "../hooks/use-studio";
import { AiEditorDialog } from "./ai-editor-dialog";
import { ScheduleArtDialog } from "./schedule-art-dialog";
import { StudioHeader } from "./studio-header";
import { StudioPreviewPanel } from "./studio-preview-panel";
import { StudioRequestPanel } from "./studio-request-panel";
import { TrialLimitDialog } from "./trial-limit-dialog";

type StudioWorkspaceProps = {
  initialArtwork: StudioArtwork | null;
};

export function StudioWorkspace({ initialArtwork }: StudioWorkspaceProps) {
  const studio = useStudio(initialArtwork);
  const { showToast } = useToast();

  const handleDialogOpenChange =
    (dialog: StudioDialog) => (isOpen: boolean) => {
      if (!isOpen && studio.dialog === dialog) {
        studio.closeDialog();
      }
    };

  const handleDownload = async (variationIndex: number) => {
    try {
      const imageBlob = await fetch(studio.imageUrls[variationIndex]).then(
        (response) => response.blob(),
      );
      const link = document.createElement("a");
      link.href = URL.createObjectURL(imageBlob);
      link.download = `arte-variacao-${variationIndex + 1}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
      showToast(`Variação ${variationIndex + 1} baixada em PNG`);
    } catch {
      showToast("Não foi possível baixar a arte");
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(studio.caption);
      showToast("Legenda copiada");
    } catch {
      showToast("Não foi possível copiar a legenda");
    }
  };

  const handleScheduled = async (values: ScheduleArtFormValues) => {
    if (await studio.scheduleArt(values)) {
      showToast("Post agendado. Ele aparece em Próximos posts, na Início.");
    }
  };

  return (
    <>
      <StudioHeader usedArts={studio.usedArts} artLimit={studio.artLimit} />
      <div className="flex flex-wrap items-start gap-5">
        <StudioRequestPanel studio={studio} />
        <StudioPreviewPanel
          studio={studio}
          onDownload={handleDownload}
          onCopyCaption={handleCopyCaption}
        />
      </div>
      <AiEditorDialog
        key={studio.selectedVariation}
        open={studio.dialog === "editor"}
        onOpenChange={handleDialogOpenChange("editor")}
        variationIndex={studio.selectedVariation}
        imageUrl={studio.imageUrls[studio.selectedVariation]}
        isAdjusting={studio.isAdjusting}
        format={studio.format}
        onAdjust={studio.adjustVariation}
        onDiscard={studio.discardAdjustments}
        onApprove={studio.openSchedule}
      />
      <ScheduleArtDialog
        open={studio.dialog === "schedule"}
        onOpenChange={handleDialogOpenChange("schedule")}
        variationIndex={studio.selectedVariation}
        imageUrl={studio.imageUrls[studio.selectedVariation]}
        title={studio.postTitle}
        format={studio.format}
        caption={studio.caption}
        isScheduling={studio.isScheduling}
        onScheduled={handleScheduled}
      />
      <TrialLimitDialog
        open={studio.dialog === "limit"}
        onOpenChange={handleDialogOpenChange("limit")}
        artLimit={studio.artLimit}
      />
    </>
  );
}
