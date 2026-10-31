"use client";

import { useState } from "react";

import { useDiscardArtworkAdjustments } from "@/hooks/mutations/use-discard-artwork-adjustments";
import { useGenerateImage } from "@/hooks/mutations/use-generate-image";
import type { ArtQuota } from "@/hooks/use-art-quota";
import { compressImageDataUrl } from "@/lib/compress-image-data-url";
import {
  toAdjustImageInput,
  type ArtworkAdjustment,
} from "@/lib/content/adjust-artwork";
import { useToast } from "@/providers/toast-provider";

const adjustFailedMessage = "Não conseguimos ajustar a arte. Tente de novo.";
const discardFailedMessage =
  "Não conseguimos descartar os ajustes. Tente de novo.";

type UseArtworkAdjustmentOptions = {
  quota: ArtQuota;
  onLimitReached: () => void;
};

export type ArtworkAdjustmentTarget = Omit<
  ArtworkAdjustment,
  "imageDataUrl"
> & {
  imageUrl: string;
};

export function useArtworkAdjustment({
  quota,
  onLimitReached,
}: UseArtworkAdjustmentOptions) {
  const { showToast } = useToast();
  const generateImageMutation = useGenerateImage();
  const discardArtworkAdjustmentsMutation = useDiscardArtworkAdjustments();
  const [isAdjusting, setIsAdjusting] = useState(false);

  const adjustArtwork = async ({
    imageUrl,
    ...adjustment
  }: ArtworkAdjustmentTarget) => {
    if (quota.getQuotaError() === "limit") {
      onLimitReached();
      return null;
    }

    setIsAdjusting(true);

    try {
      const imageDataUrl = adjustment.artworkId
        ? undefined
        : await compressImageDataUrl(imageUrl);
      const adjustedImage = await generateImageMutation.mutateAsync(
        toAdjustImageInput({ ...adjustment, imageDataUrl }),
      );

      quota.registerUsedArts(1);

      return adjustedImage;
    } catch (error) {
      showToast(error instanceof Error ? error.message : adjustFailedMessage);

      return null;
    } finally {
      setIsAdjusting(false);
    }
  };

  const discardAdjustments = async (input: {
    artworkId: string;
    keepVersion: number;
  }) => {
    const result = await discardArtworkAdjustmentsMutation
      .mutateAsync(input)
      .catch(() => null);

    if (!result?.isSuccess) {
      showToast(result?.errorMessage ?? discardFailedMessage);
      return false;
    }

    return true;
  };

  return { isAdjusting, adjustArtwork, discardAdjustments };
}
