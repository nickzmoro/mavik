import { useMutation } from "@tanstack/react-query";

import { generateCarouselCopy } from "@/actions/generate-carousel-copy";

export const getGenerateCarouselCopyMutationKey = () =>
  ["generate-carousel-copy"] as const;

export function useGenerateCarouselCopy() {
  return useMutation({
    mutationKey: getGenerateCarouselCopyMutationKey(),
    mutationFn: generateCarouselCopy,
  });
}
