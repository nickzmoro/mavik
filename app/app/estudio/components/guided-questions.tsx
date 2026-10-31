"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Bot } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { studioQuestions } from "@/lib/mocks/studio";
import {
  guidedAnswerFormSchema,
  type GuidedAnswerFormValues,
} from "@/lib/validations/studio";

import type { StudioState } from "../hooks/use-studio";
import { RoundSendButton } from "@/components/common/round-send-button";
import {
  composerTextareaClassName,
  StudioComposerShell,
} from "./studio-composer-shell";

type GuidedQuestionsProps = {
  studio: StudioState;
};

function GuidedAnswerForm({ studio }: GuidedQuestionsProps) {
  const form = useForm<GuidedAnswerFormValues>({
    resolver: zodResolver(guidedAnswerFormSchema),
    defaultValues: { answer: "" },
  });
  const recording = useSpeechRecognition((transcript) =>
    form.setValue("answer", `${form.getValues("answer")} ${transcript}`.trim()),
  );

  const handleAnswer = ({ answer }: GuidedAnswerFormValues) =>
    studio.answerQuestion(answer);

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(handleAnswer)}
        className="m-0"
      >
        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="gap-2">
              <StudioComposerShell
                attachments={studio.attachments}
                recording={recording}
                micLabel="Falar em vez de digitar"
                actions={
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={studio.skipQuestion}
                    >
                      Pular
                    </Button>
                    <RoundSendButton label="Responder" />
                  </>
                }
              >
                <FormControl>
                  <Textarea
                    rows={2}
                    aria-label="Responda com suas palavras, anexe uma foto ou fale"
                    placeholder="Responda com suas palavras, anexe uma foto ou fale"
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
  );
}

export function GuidedQuestions({ studio }: GuidedQuestionsProps) {
  const question = studioQuestions[studio.guidedStep];

  return (
    <div className="flex flex-col gap-4">
      <div className="plan flex flex-col gap-3 rounded-[20px] p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-(--r-md) bg-accent text-(--violet-900)"
          >
            <Bot className="size-4.5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="m-0 font-display text-[17px] leading-[1.4] font-semibold">
              {question.text}
            </p>
            <p className="m-0 text-[13px] leading-normal text-muted">
              {question.why}
            </p>
          </div>
        </div>
        <div
          role="group"
          aria-label="Respostas rápidas"
          className="flex flex-wrap gap-2"
        >
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => studio.answerQuestion(option)}
              className="chip-surface min-h-10 cursor-pointer rounded-full px-3.5 text-sm font-medium text-text! transition-[border-color] duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <GuidedAnswerForm key={studio.guidedStep} studio={studio} />
      {studio.guidedStep > 0 ? (
        <button
          type="button"
          onClick={studio.goToPreviousQuestion}
          className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 self-start rounded-(--r-sm) border-0 bg-transparent px-1 text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Pergunta anterior
        </button>
      ) : null}
    </div>
  );
}
