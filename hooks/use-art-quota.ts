"use client";

import { useState } from "react";

import {
  formatArtCount,
  formatVariationCount,
  getInitialVariationCount,
} from "@/lib/art-options";
import { mockTrialUsage } from "@/lib/mocks/sidebar";

export type ArtQuotaError = "limit" | string | null;

export function useArtQuota(initialVariationCount?: number) {
  const [usedArts, setUsedArts] = useState(mockTrialUsage.used);
  const [variationCount, setVariationCount] = useState(
    initialVariationCount ??
      getInitialVariationCount(mockTrialUsage.total - mockTrialUsage.used),
  );

  const artLimit = mockTrialUsage.total;
  const remainingArts = mockTrialUsage.isLimitEnabled
    ? Math.max(0, artLimit - usedArts)
    : Number.POSITIVE_INFINITY;

  const registerUsedArts = (count: number) =>
    setUsedArts((currentUsed) => currentUsed + count);

  const getQuotaError = (): ArtQuotaError => {
    if (remainingArts <= 0) {
      return "limit";
    }

    if (variationCount > remainingArts) {
      return `Restam ${formatArtCount(remainingArts)} no teste. Escolha até ${formatVariationCount(remainingArts)}.`;
    }

    return null;
  };

  return {
    usedArts,
    artLimit,
    remainingArts,
    variationCount,
    setVariationCount,
    registerUsedArts,
    getQuotaError,
  };
}
