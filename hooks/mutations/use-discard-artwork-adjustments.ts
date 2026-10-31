import { useMutation } from "@tanstack/react-query";

import { discardArtworkAdjustments } from "@/actions/discard-artwork-adjustments";

export const getDiscardArtworkAdjustmentsMutationKey = () =>
  ["discard-artwork-adjustments"] as const;

export function useDiscardArtworkAdjustments() {
  return useMutation({
    mutationKey: getDiscardArtworkAdjustmentsMutationKey(),
    mutationFn: discardArtworkAdjustments,
  });
}
