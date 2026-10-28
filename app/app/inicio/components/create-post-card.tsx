"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mic, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AttachmentList } from "@/components/common/attachments/attachment-list";
import { AttachmentPicker } from "@/components/common/attachments/attachment-picker";
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
import { cn } from "@/lib/utils";
import {
  generateArtFormSchema,
  type GenerateArtFormValues,
} from "@/lib/validations/generate-art";

const promptStarters = [
  "Produto em destaque",
  "Promoção da semana",
  "Bastidores",
  "Dica para clientes",
];

export function CreatePostCard() {
  const form = useForm<GenerateArtFormValues>({
    resolver: zodResolver(generateArtFormSchema),
    defaultValues: { prompt: "" },
  });
  const [isComposerActive, setIsComposerActive] = useState(false);
  const attachments = useAttachments();
  const recording = useSpeechRecognition((transcript) =>
    form.setValue("prompt", `${form.getValues("prompt")} ${transcript}`.trim(), {
      shouldValidate: form.formState.isSubmitted,
    }),
  );

  const handleGenerateArt = () => {};

  const handlePickStarter = (starter: string) => {
    form.setValue("prompt", `${starter}: `);
    form.setFocus("prompt");
  };

  return (
    <section
      aria-labelledby="create-title"
      className="glass flex flex-col gap-5 rounded-3xl p-5 sm:p-7"
    >
      <div className="flex flex-col gap-1.5">
        <h2
          id="create-title"
          className="m-0 font-display text-2xl leading-[1.2] font-bold"
        >
          O que a sua loja vai contar hoje?
        </h2>
        <p className="m-0 text-base leading-[1.6] text-muted">
          Descreva a ideia com suas palavras. A arte sai com as cores e a fonte
          da sua marca.
        </p>
      </div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(handleGenerateArt)}
          className="m-0 flex flex-col gap-3.5"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <AttachmentList
                  attachments={attachments.attachments}
                  errorMessage={attachments.errorMessage}
                  onRemove={attachments.removeAttachment}
                  className="px-1"
                />
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-2 rounded-[20px] border border-border bg-white py-2 pr-2 shadow-[0_1px_2px_rgba(26,15,60,.05),0_8px_20px_rgba(26,15,60,.05)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus sm:flex-nowrap dark:border-white/12 dark:bg-white/6 dark:shadow-[inset_0_1px_0_rgba(255,255,255,.05)]",
                    isComposerActive || recording.isRecording ? "pl-2" : "pl-4",
                  )}
                >
                  {recording.isRecording ? (
                    <VoiceRecordingBar
                      elapsedLabel={recording.elapsedLabel}
                      onCancel={recording.cancelRecording}
                      onFinish={recording.finishRecording}
                      className="flex-1"
                    />
                  ) : (
                    <>
                      {isComposerActive ? (
                        <AttachmentPicker
                          attachments={attachments}
                          target="art"
                        />
                      ) : (
                        <Sparkles
                          aria-hidden="true"
                          className="size-4.5 shrink-0 text-primary"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <FormControl>
                          <Input
                            aria-label="Descreva a ideia do post"
                            placeholder="Ex.: uma arte com a foto do nosso novo bolo"
                            autoComplete="off"
                            className="border-transparent bg-transparent pl-1 not-disabled:hover:border-transparent focus-visible:border-transparent focus-visible:outline-none aria-invalid:border-transparent"
                            {...field}
                            onFocus={() => setIsComposerActive(true)}
                          />
                        </FormControl>
                      </div>
                      <button
                        type="button"
                        aria-label="Falar a ideia"
                        onClick={recording.startRecording}
                        className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-muted transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none dark:hover:bg-white/12"
                      >
                        <Mic aria-hidden="true" className="size-4.5" />
                      </button>
                      <Button type="submit" className="max-sm:w-full">
                        Gerar arte
                      </Button>
                    </>
                  )}
                </div>
                <FormMessage className="px-4" />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm leading-normal text-muted">
              Comece por:
            </span>
            {promptStarters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => handlePickStarter(starter)}
                className="min-h-9 cursor-pointer rounded-full border border-border bg-white/70 px-3.5 text-sm font-medium text-text transition-[background-color,border-color] duration-150 hover:border-accent hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none dark:border-white/12 dark:bg-white/6 dark:hover:border-accent dark:hover:bg-white/12"
              >
                {starter}
              </button>
            ))}
          </div>
        </form>
      </Form>
    </section>
  );
}
