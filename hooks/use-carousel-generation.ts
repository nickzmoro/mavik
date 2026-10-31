"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useGenerateCarouselSlide } from "@/hooks/mutations/use-generate-carousel-slide";
import { useStartCarousel } from "@/hooks/mutations/use-start-carousel";
import type { ArtQuota } from "@/hooks/use-art-quota";
import { formatArtCount } from "@/lib/art-options";
import type { CarouselCopy } from "@/lib/carousel/carousel-copy";
import { runWithConcurrency } from "@/lib/carousel/run-with-concurrency";
import { getArtworkRoute } from "@/lib/routes";
import { useToast } from "@/providers/toast-provider";

const SLIDE_CONCURRENCY = 3;

type UseCarouselGenerationOptions = {
  quota: ArtQuota;
  onLimitReached: () => void;
};

type StartCarouselGenerationInput = {
  coverArtworkId: string;
  otherCoverArtworkIds: string[];
  carouselCopy: CarouselCopy;
};

export function useCarouselGeneration({
  quota,
  onLimitReached,
}: UseCarouselGenerationOptions) {
  const router = useRouter();
  const { showToast } = useToast();
  const startCarouselMutation = useStartCarousel();
  const generateCarouselSlideMutation = useGenerateCarouselSlide();
  const isCancelledRef = useRef(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);

  const startCarouselGeneration = async ({
    coverArtworkId,
    otherCoverArtworkIds,
    carouselCopy,
  }: StartCarouselGenerationInput) => {
    const remainingSlides = carouselCopy.slides
      .map((slide, index) => ({ slide, position: index + 1 }))
      .slice(1);

    if (quota.remainingArts < remainingSlides.length) {
      if (quota.remainingArts <= 0) {
        onLimitReached();
      } else {
        showToast(
          `Restam ${formatArtCount(quota.remainingArts)} no teste e faltam ${remainingSlides.length} slides.`,
        );
      }

      return;
    }

    const startResult = await startCarouselMutation
      .mutateAsync({
        artworkId: coverArtworkId,
        carouselCopy,
        discardedArtworkIds: otherCoverArtworkIds,
      })
      .catch(() => null);

    if (!startResult?.isSuccess) {
      showToast(
        startResult?.errorMessage ??
          "Não conseguimos preparar o carrossel. Tente de novo.",
      );
      return;
    }

    isCancelledRef.current = false;
    setProgress({ done: 0, total: remainingSlides.length });

    const results = await runWithConcurrency(
      remainingSlides,
      SLIDE_CONCURRENCY,
      async ({ slide, position }) => {
        if (isCancelledRef.current) {
          throw new Error("cancelado");
        }

        const generatedSlide = await generateCarouselSlideMutation.mutateAsync({
          artworkId: coverArtworkId,
          position,
          slideCount: carouselCopy.slides.length,
          slide,
        });

        quota.registerUsedArts(1);
        setProgress((currentProgress) =>
          currentProgress
            ? { ...currentProgress, done: currentProgress.done + 1 }
            : currentProgress,
        );

        return generatedSlide;
      },
    );
    const failedCount = results.filter(
      ({ status }) => status === "rejected",
    ).length;

    setProgress(null);

    if (isCancelledRef.current) {
      return;
    }

    if (failedCount > 0) {
      showToast(
        `${failedCount} ${failedCount === 1 ? "slide não ficou pronto" : "slides não ficaram prontos"}. Regenere ${failedCount === 1 ? "ele" : "eles"} na página da arte.`,
      );
    }

    router.push(getArtworkRoute(coverArtworkId));
  };

  const cancelCarouselGeneration = () => {
    isCancelledRef.current = true;
  };

  return {
    carouselProgress: progress,
    startCarouselGeneration,
    cancelCarouselGeneration,
  };
}
