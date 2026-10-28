import { Mic } from "lucide-react";

import { AttachmentList } from "@/components/common/attachments/attachment-list";
import { AttachmentPicker } from "@/components/common/attachments/attachment-picker";
import { IconButton } from "@/components/common/icon-button";
import { VoiceRecordingBar } from "@/components/common/voice-recording-bar";
import type { AttachmentsState } from "@/hooks/use-attachments";
import type { SpeechRecognitionState } from "@/hooks/use-speech-recognition";
import { cn } from "@/lib/utils";

export const composerTextareaClassName =
  "min-h-0 resize-none rounded-none border-transparent bg-transparent p-1 leading-[1.55] not-disabled:hover:border-transparent focus-visible:border-transparent focus-visible:outline-none aria-invalid:border-transparent";

type StudioComposerShellProps = {
  attachments: AttachmentsState;
  recording: SpeechRecognitionState;
  micLabel: string;
  tools?: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function StudioComposerShell({
  attachments,
  recording,
  micLabel,
  tools,
  actions,
  className,
  children,
}: StudioComposerShellProps) {
  return (
    <div
      className={cn(
        "composer flex flex-col gap-2 rounded-[22px] px-2 pt-2.5 pb-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus",
        className,
      )}
    >
      <AttachmentList
        attachments={attachments.attachments}
        errorMessage={attachments.errorMessage}
        onRemove={attachments.removeAttachment}
        className="px-2"
      />
      <div className="px-1">{children}</div>
      {recording.isRecording ? (
        <VoiceRecordingBar
          elapsedLabel={recording.elapsedLabel}
          onCancel={recording.cancelRecording}
          onFinish={recording.finishRecording}
        />
      ) : (
        <div className="flex flex-wrap items-center gap-1">
          <AttachmentPicker
            attachments={attachments}
            target="art"
            triggerClassName="size-10"
          />
          <IconButton
            label={micLabel}
            className="size-10"
            onClick={recording.startRecording}
          >
            <Mic className="size-4.5!" />
          </IconButton>
          {tools}
          <span className="ml-auto flex items-center gap-2.5">{actions}</span>
        </div>
      )}
    </div>
  );
}
