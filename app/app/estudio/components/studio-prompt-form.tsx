"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import {
  studioPromptMaxLength,
  studioPromptStarters,
} from "@/lib/mocks/studio";
import {
  studioPromptFormSchema,
  type StudioPromptFormValues,
} from "@/lib/validations/studio";

import { formatVariationCount, type StudioState } from "../hooks/use-studio";
import { FormatOptionsPopover } from "./format-options-popover";
import { RoundSendButton } from "./round-send-button";
import {
  composerTextareaClassName,
  StudioComposerShell,
} from "./studio-composer-shell";

const getCreditNote = (variationCount: number) =>
  variationCount === 1
    ? "Esta geração usa 1 arte do seu plano."
    : `Esta geração usa ${variationCount} artes do seu plano, uma por variação.`;

type StudioPromptFormProps = {
  studio: StudioState;
  defaultPrompt: string;
};

export function StudioPromptForm({
  studio,
  defaultPrompt,
}: StudioPromptFormProps) {
  const form = useForm<StudioPromptFormValues>({
    resolver: zodResolver(studioPromptFormSchema),
    defaultValues: { prompt: defaultPrompt },
  });
  const prompt = useWatch({ control: form.control, name: "prompt" });
  const recording = useSpeechRecognition((transcript) =>
    form.setValue("prompt", `${form.getValues("prompt")} ${transcript}`.trim()),
  );
  const isFreeMode = studio.mode === "free";

  const handlePickStarter = (starter: string) => {
    form.setValue("prompt", `${starter}: `);
    form.setFocus("prompt");
  };

  return (
    <div className="flex flex-col gap-4">
      {studio.mode === "guided" ? (
        <p className="m-0 flex items-start gap-2 text-sm leading-normal text-muted">
          <Bot
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          Montei o pedido com as suas respostas. Ajuste o que quiser e envie.
        </p>
      ) : null}
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(studio.generate)}
          className="m-0"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="gap-2">
                <StudioComposerShell
                  attachments={studio.attachments}
                  recording={recording}
                  micLabel="Falar em vez de digitar"
                  tools={
                    <FormatOptionsPopover
                      open={studio.isOptionsOpen}
                      onOpenChange={studio.setIsOptionsOpen}
                      format={studio.format}
                      onFormatChange={studio.setFormatId}
                      variationCount={studio.variationCount}
                      onVariationCountChange={studio.changeVariationCount}
                      remainingArts={studio.remainingArts}
                    />
                  }
                  actions={
                    <>
                      <span className="text-xs leading-[1.4] text-muted tabular-nums">
                        {prompt.length} / {studioPromptMaxLength}
                      </span>
                      <RoundSendButton
                        label={`Enviar e gerar ${formatVariationCount(studio.variationCount)}`}
                        disabled={prompt.trim().length === 0}
                      />
                    </>
                  }
                >
                  <FormControl>
                    <Textarea
                      rows={6}
                      aria-label="Descreva a arte que você quer"
                      placeholder="Ex.: post do novo blend de outono, com foto real do balcão, luz da manhã e o título “Chegou o outono”"
                      maxLength={studioPromptMaxLength}
                      className={composerTextareaClassName}
                      {...field}
                    />
                  </FormControl>
                </StudioComposerShell>
                <FormMessage className="px-4" />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {isFreeMode ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-0.5 text-xs leading-[1.4] font-medium text-muted">
            Comece por:
          </span>
          {studioPromptStarters.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => handlePickStarter(starter)}
              className="chip-surface min-h-9 cursor-pointer rounded-full px-3 text-[13px] font-medium transition-[border-color,color] duration-150 hover:border-accent hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              {starter}
            </button>
          ))}
        </div>
      ) : null}
      <p className="m-0 text-xs leading-normal text-muted">
        {getCreditNote(studio.variationCount)} Nada é publicado sem a sua
        aprovação.
      </p>
    </div>
  );
}
