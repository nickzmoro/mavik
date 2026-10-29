"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { useGenerateImage } from "@/hooks/mutations/use-generate-image";
import { useScheduleArtwork } from "@/hooks/mutations/use-schedule-artwork";
import { useAttachments } from "@/hooks/use-attachments";
import { compressImageDataUrl } from "@/lib/compress-image-data-url";
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
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { STUDIO_PAUTA_PARAM } from "@/lib/routes";
import {
  REFERENCE_IMAGE_MAX_BYTES,
  REFERENCE_IMAGE_TYPES,
  type GenerateImageResult,
} from "@/lib/validations/image-generation";
import type {
  ScheduleArtFormValues,
  StudioPromptFormValues,
} from "@/lib/validations/studio";
import { useToast } from "@/providers/toast-provider";

import { toScheduledAt } from "../utils/schedule-days";

export type StudioMode = "guided" | "free";
export type StudioPhase = "idle" | "generating" | "done";
export type StudioDialog = "none" | "editor" | "schedule" | "limit";

export const formatArtCount = (count: number) =>
  count === 1 ? "1 arte" : `${count} artes`;

export const formatVariationCount = (count: number) =>
  count === 1 ? "1 variação" : `${count} variações`;

export function useStudio() {
  const { showToast } = useToast();
  const pauta = useSearchParams().get(STUDIO_PAUTA_PARAM) ?? "";
  const generateImageMutation = useGenerateImage();
  const scheduleArtworkMutation = useScheduleArtwork();
  const generationIdRef = useRef(0);
  const [mode, setMode] = useState<StudioMode | null>(pauta ? "free" : null);
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
  const [generatedImages, setGeneratedImages] = useState<
    GenerateImageResult[]
  >([]);
  const [lastPrompt, setLastPrompt] = useState(pauta);
  const [editorOriginalImage, setEditorOriginalImage] =
    useState<GenerateImageResult | null>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const imageUrls = generatedImages.map((image) => image.imageUrl);
  const artLimit = mockTrialUsage.total;
  const remainingArts = mockTrialUsage.isLimitEnabled
    ? Math.max(0, artLimit - usedArts)
    : Number.POSITIVE_INFINITY;
  const format =
    artFormats.find((artFormat) => artFormat.id === formatId) ?? artFormats[1];
  const isGuidedComplete = guidedStep >= studioQuestions.length;

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

  const getReferencePhoto = () =>
    attachments.attachments.find(
      (attachment) => attachment.kind === "photo" && attachment.file,
    )?.file;

  const generate = async ({ prompt }: StudioPromptFormValues) => {
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

    const referencePhoto = getReferencePhoto();

    if (
      referencePhoto &&
      (!REFERENCE_IMAGE_TYPES.includes(referencePhoto.type) ||
        referencePhoto.size > REFERENCE_IMAGE_MAX_BYTES)
    ) {
      showToast("Use uma foto de referência em PNG, JPG ou WEBP com até 4 MB.");
      return;
    }

    const generationId = ++generationIdRef.current;
    setLastPrompt(prompt);
    setIsOptionsOpen(false);
    setDialog("none");
    setPhase("generating");

    const referenceImage = referencePhoto
      ? await readFileAsDataUrl(referencePhoto).catch(() => undefined)
      : undefined;
    const results = await Promise.allSettled(
      Array.from({ length: variationCount }, () =>
        generateImageMutation.mutateAsync({ prompt, referenceImage }),
      ),
    );

    if (generationId !== generationIdRef.current) {
      return;
    }

    const generatedResults = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    const failedResult = results.find(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    );

    if (generatedResults.length === 0) {
      setPhase("idle");
      showToast(
        failedResult?.reason instanceof Error
          ? failedResult.reason.message
          : "Não conseguimos gerar a arte desta vez. Tente de novo.",
      );
      return;
    }

    if (failedResult) {
      showToast(
        `Geramos ${formatArtCount(generatedResults.length)} de ${variationCount}. Tente de novo para as outras.`,
      );
    }

    setGeneratedImages(generatedResults);
    setSelectedVariation(0);
    setUsedArts((currentUsed) => currentUsed + generatedResults.length);
    setPhase("done");
  };

  const regenerate = () => generate({ prompt: lastPrompt });

  const cancelGeneration = () => {
    generationIdRef.current += 1;
    setPhase("idle");
  };

  const activeVariation = Math.min(
    selectedVariation,
    Math.max(imageUrls.length, 1) - 1,
  );

  const openEditor = (variationIndex = activeVariation) => {
    setSelectedVariation(variationIndex);
    setEditorOriginalImage(generatedImages[variationIndex] ?? null);
    setDialog("editor");
  };

  const replaceImage = (
    variationIndex: number,
    generatedImage: GenerateImageResult,
  ) =>
    setGeneratedImages((currentImages) =>
      currentImages.map((currentImage, index) =>
        index === variationIndex ? generatedImage : currentImage,
      ),
    );

  const adjustVariation = async (editInstruction: string) => {
    const currentImageUrl = imageUrls[activeVariation];

    if (!currentImageUrl) {
      showToast("Gere uma arte antes de pedir ajuste.");
      return false;
    }

    if (remainingArts <= 0) {
      setDialog("limit");
      return false;
    }

    setIsAdjusting(true);

    try {
      const referenceImage = await compressImageDataUrl(currentImageUrl);
      const adjustedImage = await generateImageMutation.mutateAsync({
        prompt: lastPrompt,
        referenceImage,
        editInstruction,
      });

      replaceImage(activeVariation, adjustedImage);
      setUsedArts((currentUsed) => currentUsed + 1);

      return true;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Não conseguimos ajustar a arte. Tente de novo.",
      );

      return false;
    } finally {
      setIsAdjusting(false);
    }
  };

  const postTitle = lastPrompt.split("\n")[0].trim().slice(0, 120);

  const scheduleArt = async ({ day, time, caption }: ScheduleArtFormValues) => {
    const currentImage = generatedImages[activeVariation];

    if (!currentImage) {
      showToast("Gere uma arte antes de agendar.");
      return false;
    }

    const result = await (
      currentImage.artworkId
        ? Promise.resolve(undefined)
        : compressImageDataUrl(currentImage.imageUrl)
    )
      .then((imageDataUrl) =>
        scheduleArtworkMutation.mutateAsync({
          title: postTitle || "Post do Estúdio",
          prompt: lastPrompt,
          caption,
          format: format.id === "story" ? "story" : "post",
          scheduledAt: toScheduledAt(day, time),
          artworkId: currentImage.artworkId,
          imageDataUrl,
        }),
      )
      .catch(() => null);

    if (!result?.isSuccess) {
      showToast(
        result?.errorMessage ??
          "Não conseguimos agendar agora. Confira sua internet e tente de novo.",
      );
      return false;
    }

    setCaption(caption);
    setDialog("none");

    return true;
  };

  const discardAdjustments = () => {
    if (editorOriginalImage) {
      replaceImage(activeVariation, editorOriginalImage);
    }

    setDialog("none");
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
    imageUrls,
    defaultPrompt: pauta,
    selectedVariation: activeVariation,
    isAdjusting,
    isScheduling: scheduleArtworkMutation.isPending,
    postTitle,
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
    regenerate,
    cancelGeneration,
    selectVariation: setSelectedVariation,
    openEditor,
    adjustVariation,
    scheduleArt,
    discardAdjustments,
    openSchedule: () => setDialog("schedule"),
    closeDialog,
    setCaption,
  };
}

export type StudioState = ReturnType<typeof useStudio>;
