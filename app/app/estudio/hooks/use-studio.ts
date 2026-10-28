"use client";

import { useEffect, useState } from "react";

import { useAttachments } from "@/hooks/use-attachments";
import {
  artFormats,
  buildGuidedPrompt,
  maxVariationsPerGeneration,
  mockSuggestedCaption,
  skippedAnswer,
  studioQuestions,
  type ArtFormatId,
} from "@/lib/mocks/studio";
import { mockTrialUsage } from "@/lib/mocks/sidebar";
import { useToast } from "@/providers/toast-provider";

export type StudioMode = "guided" | "free";
export type StudioPhase = "idle" | "generating" | "done";
export type StudioDialog = "none" | "editor" | "schedule" | "limit";

const generationDurationInMs = 1800;

export const formatArtCount = (count: number) =>
  count === 1 ? "1 arte" : `${count} artes`;

export const formatVariationCount = (count: number) =>
  count === 1 ? "1 variação" : `${count} variações`;

export function useStudio() {
  const { showToast } = useToast();
  const [mode, setMode] = useState<StudioMode | null>(null);
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedAnswers, setGuidedAnswers] = useState<string[]>([]);
  const attachments = useAttachments();
  const [formatId, setFormatId] = useState<ArtFormatId>("portrait");
  const [usedArts, setUsedArts] = useState(mockTrialUsage.used);
  const [variationCount, setVariationCount] = useState(
    Math.max(
      1,
      Math.min(
        maxVariationsPerGeneration,
        mockTrialUsage.total - mockTrialUsage.used,
      ),
    ),
  );
  const [phase, setPhase] = useState<StudioPhase>("idle");
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [dialog, setDialog] = useState<StudioDialog>("none");
  const [caption, setCaption] = useState(mockSuggestedCaption);

  const artLimit = mockTrialUsage.total;
  const remainingArts = Math.max(0, artLimit - usedArts);
  const format =
    artFormats.find((artFormat) => artFormat.id === formatId) ?? artFormats[1];
  const isGuidedComplete = guidedStep >= studioQuestions.length;

  useEffect(() => {
    if (phase !== "generating") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPhase("done");
      setSelectedVariation(0);
      setUsedArts((currentUsed) => currentUsed + variationCount);
    }, generationDurationInMs);

    return () => window.clearTimeout(timeoutId);
  }, [phase, variationCount]);

  const pickMode = (nextMode: StudioMode) => {
    setMode(nextMode);
    setGuidedStep(0);
    setGuidedAnswers([]);
  };

  const restart = () => {
    setMode(null);
    setGuidedStep(0);
    setGuidedAnswers([]);
    attachments.clearAttachments();
    setIsOptionsOpen(false);
  };

  const answerQuestion = (answer: string) => {
    setGuidedAnswers((currentAnswers) => [
      ...currentAnswers.slice(0, guidedStep),
      answer,
    ]);
    setGuidedStep((currentStep) => currentStep + 1);
  };

  const skipQuestion = () => answerQuestion(skippedAnswer);

  const goToPreviousQuestion = () =>
    setGuidedStep((currentStep) => Math.max(0, currentStep - 1));

  const generate = () => {
    if (remainingArts <= 0) {
      setDialog("limit");
      return;
    }

    if (variationCount > remainingArts) {
      setIsOptionsOpen(true);
      showToast(
        `Restam ${formatArtCount(remainingArts)} no teste. Escolha até ${formatVariationCount(remainingArts)}.`,
      );
      return;
    }

    setIsOptionsOpen(false);
    setDialog("none");
    setPhase("generating");
  };

  const cancelGeneration = () => setPhase("idle");

  const openEditor = (variationIndex = selectedVariation) => {
    setSelectedVariation(variationIndex);
    setDialog("editor");
  };

  const changeVariationCount = (count: number) => {
    setVariationCount(count);
    setSelectedVariation(0);
  };

  const closeDialog = () => setDialog("none");

  return {
    mode,
    guidedStep,
    guidedAnswers,
    guidedPrompt: buildGuidedPrompt(guidedAnswers),
    isGuidedComplete,
    attachments,
    format,
    usedArts,
    artLimit,
    remainingArts,
    variationCount,
    phase,
    selectedVariation: Math.min(selectedVariation, variationCount - 1),
    isOptionsOpen,
    dialog,
    caption,
    pickMode,
    restart,
    answerQuestion,
    skipQuestion,
    goToPreviousQuestion,
    editAnswer: setGuidedStep,
    setFormatId,
    changeVariationCount,
    setIsOptionsOpen,
    generate,
    cancelGeneration,
    selectVariation: setSelectedVariation,
    openEditor,
    openSchedule: () => setDialog("schedule"),
    closeDialog,
    setCaption,
  };
}

export type StudioState = ReturnType<typeof useStudio>;
