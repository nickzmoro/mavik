"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { useGeneratePostCaption } from "@/hooks/mutations/use-generate-post-caption";
import { useGenerateImage } from "@/hooks/mutations/use-generate-image";
import { usePublishArtworkNow } from "@/hooks/mutations/use-publish-artwork-now";
import { useScheduleArtwork } from "@/hooks/mutations/use-schedule-artwork";
import { useArtQuota } from "@/hooks/use-art-quota";
import { useArtworkAdjustment } from "@/hooks/use-artwork-adjustment";
import { useAttachments } from "@/hooks/use-attachments";
import { useCarouselGeneration } from "@/hooks/use-carousel-generation";
import { compressImageDataUrl } from "@/lib/compress-image-data-url";
import { findArtFormat, formatArtCount } from "@/lib/art-options";
import { DEFAULT_CAROUSEL_SLIDES } from "@/lib/carousel/carousel-copy";
import type { StudioArtwork } from "@/lib/content/get-studio-artwork";
import {
  toApprovedCopyEntries,
  type ApprovedCopyEntry,
} from "@/lib/post-copy/approved-copy";
import {
  buildGuidedPrompt,
  skippedAnswer,
  studioQuestions,
  type ArtFormatId,
} from "@/lib/mocks/studio";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { defaultArtFields } from "@/lib/post-draft";
import { routes, STUDIO_PAUTA_PARAM } from "@/lib/routes";
import {
  REFERENCE_IMAGE_MAX_BYTES,
  REFERENCE_IMAGE_TYPES,
  type GenerateImageResult,
} from "@/lib/validations/image-generation";
import type {
  ScheduleArtFormValues,
  StudioPromptFormValues,
} from "@/lib/validations/studio";
import { usePostDraft } from "@/providers/post-draft-provider";
import { useToast } from "@/providers/toast-provider";

import { toScheduledAt } from "@/lib/schedule-days";

export type StudioMode = "guided" | "free";
export type StudioPhase = "idle" | "generating" | "done";
export type StudioDialog = "none" | "editor" | "schedule" | "limit";

type StudioImage = GenerateImageResult & { formatId: ArtFormatId };

export function useStudio(initialArtwork: StudioArtwork | null) {
  const { showToast } = useToast();
  const pauta = useSearchParams().get(STUDIO_PAUTA_PARAM) ?? "";
  const router = useRouter();
  const { draft, startDraft, clearDraft } = usePostDraft();
  const approvedDraft =
    !initialArtwork && draft?.isApproved && (draft.copy || draft.carouselCopy)
      ? draft
      : null;
  const initialPrompt =
    initialArtwork?.prompt ?? approvedDraft?.prompt ?? pauta;
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
  const attachments = useAttachments(approvedDraft?.attachments);
  const [formatId, setFormatId] = useState<ArtFormatId>(
    approvedDraft?.formatId ?? initialArtwork?.formatId ?? "portrait",
  );
  const quota = useArtQuota(approvedDraft?.variationCount);
  const artworkAdjustment = useArtworkAdjustment({
    quota,
    onLimitReached: () => setDialog("limit"),
  });
  const [approvedCopy, setApprovedCopy] = useState<
    ApprovedCopyEntry[] | undefined
  >(() => {
    if (approvedDraft?.copy) {
      return toApprovedCopyEntries(approvedDraft.copy, approvedDraft.artFields);
    }

    const cover = approvedDraft?.carouselCopy?.slides[0];

    return cover
      ? [
          { role: "headline" as const, text: cover.headline },
          ...(cover.body
            ? [{ role: "subtitle" as const, text: cover.body }]
            : []),
        ]
      : undefined;
  });
  const [carouselCopy] = useState(approvedDraft?.carouselCopy ?? null);
  const [slideCount, setSlideCount] = useState(
    approvedDraft?.slideCount ?? DEFAULT_CAROUSEL_SLIDES,
  );
  const carouselGeneration = useCarouselGeneration({
    quota,
    onLimitReached: () => setDialog("limit"),
  });
  const hasStartedApprovedGenerationRef = useRef(false);
  const [phase, setPhase] = useState<StudioPhase>(
    initialArtwork ? "done" : "idle",
  );
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [dialog, setDialog] = useState<StudioDialog>("none");
  const [caption, setCaption] = useState(
    initialArtwork?.caption ??
      approvedDraft?.copy?.caption ??
      approvedDraft?.carouselCopy?.caption ??
      "",
  );
  const [generatedImages, setGeneratedImages] = useState<StudioImage[]>(
    initialArtwork
      ? [
          {
            imageUrl: initialArtwork.imageUrl,
            artworkId: initialArtwork.artworkId,
            version: initialArtwork.version,
            formatId: initialArtwork.formatId,
          },
        ]
      : [],
  );
  const [lastPrompt, setLastPrompt] = useState(initialPrompt);
  const [editorOriginalImage, setEditorOriginalImage] =
    useState<StudioImage | null>(null);

  const imageUrls = generatedImages.map((image) => image.imageUrl);
  const { variationCount, remainingArts } = quota;
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

  const generateArt = async (
    prompt: string,
    copyEntries: ApprovedCopyEntry[] | undefined,
  ) => {
    const quotaError = quota.getQuotaError();

    if (quotaError === "limit") {
      setDialog("limit");
      return;
    }

    if (quotaError) {
      setIsOptionsOpen(true);
      showToast(quotaError);
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
            approvedCopy: copyEntries,
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
    quota.registerUsedArts(generatedResults.length);
    setPhase("done");
  };

  const generate = ({ prompt }: StudioPromptFormValues) => {
    if (format.kind === "carousel") {
      startDraft({
        prompt,
        formatId: format.id,
        variationCount,
        attachments: attachments.attachments,
        artFields: defaultArtFields,
        isApproved: false,
        slideCount,
      });
      router.push(routes.studioApproval);
      return;
    }

    setApprovedCopy(undefined);
    return generateArt(prompt, undefined);
  };

  const startCarouselFromCover = (variationIndex: number) => {
    const coverArtworkId = generatedImages[variationIndex]?.artworkId;

    if (!carouselCopy || !coverArtworkId) {
      showToast("Não encontramos essa capa salva. Gere a capa de novo.");
      return;
    }

    carouselGeneration.startCarouselGeneration({
      coverArtworkId,
      otherCoverArtworkIds: generatedImages.flatMap(({ artworkId }) =>
        artworkId && artworkId !== coverArtworkId ? [artworkId] : [],
      ),
      carouselCopy,
    });
  };

  const regenerate = () => generateArt(lastPrompt, approvedCopy);

  const startApprovedGeneration = useEffectEvent(() => {
    if (!approvedDraft || hasStartedApprovedGenerationRef.current) {
      return;
    }

    hasStartedApprovedGenerationRef.current = true;
    generateArt(approvedDraft.prompt, approvedCopy);
    clearDraft();
  });

  useEffect(() => startApprovedGeneration(), []);

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

    const adjustedImage = await artworkAdjustment.adjustArtwork({
      artworkId: generatedImages[activeVariation]?.artworkId,
      imageUrl: currentImageUrl,
      prompt: lastPrompt,
      editInstruction,
      formatId: resultFormat.id,
      variationIndex: activeVariation,
    });

    if (!adjustedImage) {
      return false;
    }

    replaceImage(activeVariation, {
      ...adjustedImage,
      formatId: resultFormat.id,
    });

    return true;
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
    const currentImage = generatedImages[activeVariation];

    if (editorOriginalImage) {
      replaceImage(activeVariation, editorOriginalImage);
    }

    if (
      editorOriginalImage?.artworkId &&
      editorOriginalImage.version &&
      currentImage?.version !== editorOriginalImage.version
    ) {
      artworkAdjustment.discardAdjustments({
        artworkId: editorOriginalImage.artworkId,
        keepVersion: editorOriginalImage.version,
      });
    }

    setDialog("none");
  };

  const changeVariationCount = (count: number) => {
    quota.setVariationCount(count);
    setSelectedVariation(0);
  };

  const closeDialog = () => setDialog("none");

  return {
    carouselCopy,
    slideCount,
    setSlideCount,
    carouselProgress: carouselGeneration.carouselProgress,
    cancelCarouselGeneration: carouselGeneration.cancelCarouselGeneration,
    startCarouselFromCover,
    mode,
    guidedStep,
    guidedAnswers,
    guidedPrompt: buildGuidedPrompt(guidedAnswers),
    isGuidedComplete,
    attachments,
    format,
    resultFormat,
    usedArts: quota.usedArts,
    artLimit: quota.artLimit,
    remainingArts,
    variationCount,
    phase,
    imageUrls,
    defaultPrompt: initialPrompt,
    selectedVariation: activeVariation,
    isAdjusting: artworkAdjustment.isAdjusting,
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
