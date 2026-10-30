"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { useGeneratePostCaption } from "@/hooks/mutations/use-generate-post-caption";
import { useGenerateImage } from "@/hooks/mutations/use-generate-image";
import { usePublishArtworkNow } from "@/hooks/mutations/use-publish-artwork-now";
import { useScheduleArtwork } from "@/hooks/mutations/use-schedule-artwork";
import { useAttachments } from "@/hooks/use-attachments";
import { compressImageDataUrl } from "@/lib/compress-image-data-url";
import type { StudioArtwork } from "@/lib/content/get-studio-artwork";
import {
  artFormats,
  buildGuidedPrompt,
  maxVariationsPerGeneration,
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

type StudioImage = GenerateImageResult & { formatId: ArtFormatId };

const findArtFormat = (formatId?: ArtFormatId) =>
  artFormats.find((artFormat) => artFormat.id === formatId) ?? artFormats[1];

export const formatArtCount = (count: number) =>
  count === 1 ? "1 arte" : `${count} artes`;

export const formatVariationCount = (count: number) =>
  count === 1 ? "1 variação" : `${count} variações`;

export function useStudio(initialArtwork: StudioArtwork | null) {
  const { showToast } = useToast();
  const pauta = useSearchParams().get(STUDIO_PAUTA_PARAM) ?? "";
  const initialPrompt = initialArtwork?.prompt ?? pauta;
  const generateImageMutation = useGenerateImage();
  const generatePostCaptionMutation = useGeneratePostCaption();
  const scheduleArtworkMutation = useScheduleArtwork();
  const publishArtworkNowMutation = usePublishArtworkNow();
  const generationIdRef = useRef(0);
  const [mode, setMode] = useState<StudioMode | null>(
    initialPrompt || initialArtwork ? "free" : null,
  );
  const [guidedStep, setGuidedStep] = useState(0);
  const [guidedAnswers, setGuidedAnswers] = useState<string[]>([]);
  const attachments = useAttachments();
  const [formatId, setFormatId] = useState<ArtFormatId>(
    initialArtwork?.isStory ? "story" : "portrait",
  );
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
  const [phase, setPhase] = useState<StudioPhase>(
    initialArtwork ? "done" : "idle",
  );
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [dialog, setDialog] = useState<StudioDialog>("none");
  const [caption, setCaption] = useState(initialArtwork?.caption ?? "");
  const [generatedImages, setGeneratedImages] = useState<StudioImage[]>(
    initialArtwork
      ? [
          {
            imageUrl: initialArtwork.imageUrl,
            artworkId: initialArtwork.artworkId,
            formatId: initialArtwork.isStory ? "story" : "portrait",
          },
        ]
      : [],
  );
  const [lastPrompt, setLastPrompt] = useState(initialPrompt);
  const [editorOriginalImage, setEditorOriginalImage] =
    useState<StudioImage | null>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const imageUrls = generatedImages.map((image) => image.imageUrl);
  const artLimit = mockTrialUsage.total;
  const remainingArts = mockTrialUsage.isLimitEnabled
    ? Math.max(0, artLimit - usedArts)
    : Number.POSITIVE_INFINITY;
  const format = findArtFormat(formatId);
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
    const generationFormatId = format.id;
    const results = await Promise.allSettled(
      Array.from({ length: variationCount }, (_, variationIndex) =>
        generateImageMutation
          .mutateAsync({
            prompt,
            referenceImage,
            format: generationFormatId,
            variationIndex,
          })
          .then((result) => ({ ...result, formatId: generationFormatId })),
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
  const resultFormat = findArtFormat(
    generatedImages[activeVariation]?.formatId,
  );

  const openEditor = (variationIndex = activeVariation) => {
    setSelectedVariation(variationIndex);
    setEditorOriginalImage(generatedImages[variationIndex] ?? null);
    setDialog("editor");
  };

  const replaceImage = (variationIndex: number, generatedImage: StudioImage) =>
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
        format: resultFormat.id,
        variationIndex: activeVariation,
      });

      replaceImage(activeVariation, {
        ...adjustedImage,
        formatId: resultFormat.id,
      });
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

  const saveApprovedArt = async (
    caption: string,
    scheduledAt: string | null,
  ) => {
    const currentImage = generatedImages[activeVariation];

    if (!currentImage) {
      showToast("Gere uma arte antes de agendar.");
      return false;
    }

    const approvedArt = (imageDataUrl?: string) => ({
      title: postTitle || "Post do Estúdio",
      prompt: lastPrompt,
      caption,
      format:
        currentImage.formatId === "story"
          ? ("story" as const)
          : ("post" as const),
      artworkId: currentImage.artworkId,
      contentId: initialArtwork?.contentId,
      imageDataUrl,
    });
    const result = await (
      currentImage.artworkId
        ? Promise.resolve(undefined)
        : compressImageDataUrl(currentImage.imageUrl)
    )
      .then((imageDataUrl) =>
        scheduledAt
          ? scheduleArtworkMutation.mutateAsync({
              ...approvedArt(imageDataUrl),
              scheduledAt,
            })
          : publishArtworkNowMutation.mutateAsync(approvedArt(imageDataUrl)),
      )
      .catch(() => null);

    if (!result?.isSuccess) {
      showToast(
        result?.errorMessage ??
          "Não conseguimos salvar agora. Confira sua internet e tente de novo.",
      );
      return false;
    }

    setCaption(caption);
    setDialog("none");

    return true;
  };

  const scheduleArt = ({ day, time, caption }: ScheduleArtFormValues) =>
    saveApprovedArt(caption, toScheduledAt(day, time));

  const publishArtNow = (caption: string) => saveApprovedArt(caption, null);

  const generateCaption = async () => {
    const currentImageUrl = imageUrls[activeVariation];

    if (!currentImageUrl) {
      showToast("Gere uma arte antes de pedir a legenda.");
      return;
    }

    const imageDataUrl = await compressImageDataUrl(
      currentImageUrl,
      512,
      0.8,
    ).catch(() => undefined);
    const result = await generatePostCaptionMutation
      .mutateAsync({
        prompt: lastPrompt,
        imageDataUrl,
        previousCaption: caption,
      })
      .catch(() => null);

    if (!result?.isSuccess) {
      showToast(
        result?.errorMessage ??
          "Não conseguimos gerar a legenda agora. Tente de novo.",
      );
      return;
    }

    setCaption(result.data.caption);
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
    resultFormat,
    usedArts,
    artLimit,
    remainingArts,
    variationCount,
    phase,
    imageUrls,
    defaultPrompt: initialPrompt,
    selectedVariation: activeVariation,
    isAdjusting,
    isScheduling: scheduleArtworkMutation.isPending,
    isPublishing: publishArtworkNowMutation.isPending,
    isGeneratingCaption: generatePostCaptionMutation.isPending,
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
    publishArtNow,
    discardAdjustments,
    generateCaption,
    openSchedule: () => setDialog("schedule"),
    closeDialog,
    setCaption,
  };
}

export type StudioState = ReturnType<typeof useStudio>;
