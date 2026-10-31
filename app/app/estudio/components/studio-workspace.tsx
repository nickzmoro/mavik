"use client";

import type { StudioArtwork } from "@/lib/content/get-studio-artwork";
import type { ScheduleArtFormValues } from "@/lib/validations/studio";
import { usePostDraft } from "@/providers/post-draft-provider";
import { useToast } from "@/providers/toast-provider";

import { useStudio, type StudioDialog } from "../hooks/use-studio";
import { AiEditorDialog } from "./ai-editor-dialog";
import { ScheduleArtDialog } from "./schedule-art-dialog";
import { StudioHeader } from "./studio-header";
import { StudioPreviewPanel } from "./studio-preview-panel";
import { StudioRequestPanel } from "./studio-request-panel";
import { TrialLimitDialog } from "@/components/common/trial-limit-dialog";

type StudioWorkspaceProps = {
  initialArtwork: StudioArtwork | null;
};

export function StudioWorkspace({ initialArtwork }: StudioWorkspaceProps) {
  const { isHydrated } = usePostDraft();

  return (
    <StudioWorkspaceContent
      key={isHydrated ? "hydrated" : "server"}
      initialArtwork={initialArtwork}
    />
  );
}

function StudioWorkspaceContent({ initialArtwork }: StudioWorkspaceProps) {
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

  const handlePublishNow = async (caption: string) => {
    const isStory = studio.resultFormat.id === "story";

    if (!isStory && !caption.trim()) {
      showToast("Gere ou escreva a legenda antes de publicar.");
      return;
    }

    if (await studio.publishArtNow(isStory ? "" : caption)) {
      showToast(
        isStory
          ? "Story publicado no Instagram."
          : "Post publicado no Instagram.",
      );
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
          onPublishNow={() => handlePublishNow(studio.caption)}
        />
      </div>
      <AiEditorDialog
        key={studio.selectedVariation}
        open={studio.dialog === "editor"}
        onOpenChange={handleDialogOpenChange("editor")}
        variationIndex={studio.selectedVariation}
        imageUrl={studio.imageUrls[studio.selectedVariation]}
        isAdjusting={studio.isAdjusting}
        format={studio.resultFormat}
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
        format={studio.resultFormat}
        caption={studio.caption}
        isScheduling={studio.isScheduling}
        isPublishing={studio.isPublishing}
        onScheduled={handleScheduled}
        onPublishNow={handlePublishNow}
      />
      <TrialLimitDialog
        open={studio.dialog === "limit"}
        onOpenChange={handleDialogOpenChange("limit")}
        artLimit={studio.artLimit}
      />
    </>
  );
}
