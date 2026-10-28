"use client";

import { ArrowUp, Mic } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { AttachmentList } from "@/components/common/attachments/attachment-list";
import { AttachmentPicker } from "@/components/common/attachments/attachment-picker";
import { IconButton } from "@/components/common/icon-button";
import { VoiceRecordingBar } from "@/components/common/voice-recording-bar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAttachments } from "@/hooks/use-attachments";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import type { AgentMessageFormValues } from "@/lib/validations/agent";

type AgentComposerProps = {
  form: UseFormReturn<AgentMessageFormValues>;
};

export function AgentComposer({ form }: AgentComposerProps) {
  const attachments = useAttachments();
  const recording = useSpeechRecognition((transcript) =>
    form.setValue(
      "message",
      `${form.getValues("message")} ${transcript}`.trim(),
      { shouldValidate: form.formState.isSubmitted },
    ),
  );

  const handleSendMessage = () => {};

  return (
    <div className="flex flex-col gap-3 border-t border-text/10 px-4 pt-3.5 pb-4 sm:px-5 sm:pb-5">
      <AttachmentList
        attachments={attachments.attachments}
        errorMessage={attachments.errorMessage}
        onRemove={attachments.removeAttachment}
      />
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleSendMessage)}
          className="m-0 flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <div className="composer flex items-center gap-1.5 rounded-[20px] py-1.5 pr-1.5 pl-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus">
                  {recording.isRecording ? (
                    <VoiceRecordingBar
                      elapsedLabel={recording.elapsedLabel}
                      onCancel={recording.cancelRecording}
                      onFinish={recording.finishRecording}
                      className="flex-1"
                    />
                  ) : (
                    <>
                      <AttachmentPicker attachments={attachments} target="agent" />
                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            aria-label="Mensagem para o agente"
                            placeholder="Pergunte ou peça algo ao seu agente"
                            autoComplete="off"
                            className="border-transparent bg-transparent pl-1 not-disabled:hover:border-transparent focus-visible:border-transparent focus-visible:outline-none aria-invalid:border-transparent"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <IconButton
                        label="Falar a mensagem"
                        size="lg"
                        onClick={recording.startRecording}
                      >
                        <Mic />
                      </IconButton>
                      <Button
                        type="submit"
                        size="icon"
                        aria-label="Enviar mensagem"
                      >
                        <ArrowUp aria-hidden="true" className="size-4.5" />
                      </Button>
                    </>
                  )}
                </div>
                <FormMessage className="px-4" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <p className="m-0 text-center text-xs leading-[1.4] text-muted">
        O agente sugere. Nada é publicado sem a sua aprovação.
      </p>
    </div>
  );
}
