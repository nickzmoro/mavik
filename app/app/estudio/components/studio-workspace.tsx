"use client";

import type { ScheduleArtFormValues } from "@/lib/validations/studio";
import { useToast } from "@/providers/toast-provider";

import { useStudio, type StudioDialog } from "../hooks/use-studio";
import { AiEditorDialog } from "./ai-editor-dialog";
import { ScheduleArtDialog } from "./schedule-art-dialog";
import { StudioHeader } from "./studio-header";
import { StudioPreviewPanel } from "./studio-preview-panel";
import { StudioRequestPanel } from "./studio-request-panel";
import { TrialLimitDialog } from "./trial-limit-dialog";

export function StudioWorkspace() {
  const studio = useStudio();
  const { showToast } = useToast();

  const handleDialogOpenChange = (dialog: StudioDialog) => (isOpen: boolean) => {
    if (!isOpen && studio.dialog === dialog) {
      studio.closeDialog();
    }
  };

  const handleDownload = (variationIndex: number) => {
    const link = document.createElement("a");
    link.href = studio.imageUrls[variationIndex];
    link.download = `arte-variacao-${variationIndex + 1}.png`;
    link.click();
    showToast(`Variação ${variationIndex + 1} baixada em PNG`);
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(studio.caption);
      showToast("Legenda copiada");
    } catch {
      showToast("Não foi possível copiar a legenda");
    }
  };

  const handleScheduled = ({ day, time, caption }: ScheduleArtFormValues) => {
    studio.setCaption(caption);
    studio.closeDialog();
    showToast(`Agendado: ${day} às ${time}. Você confirma antes de publicar.`);
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
        open={studio.dialog === "editor"}
        onOpenChange={handleDialogOpenChange("editor")}
        variationIndex={studio.selectedVariation}
        format={studio.format}
        onApprove={studio.openSchedule}
      />
      <ScheduleArtDialog
        open={studio.dialog === "schedule"}
        onOpenChange={handleDialogOpenChange("schedule")}
        variationIndex={studio.selectedVariation}
        format={studio.format}
        caption={studio.caption}
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
