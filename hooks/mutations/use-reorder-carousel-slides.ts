import { useMutation } from "@tanstack/react-query";

import { reorderCarouselSlides } from "@/actions/reorder-carousel-slides";

export const getReorderCarouselSlidesMutationKey = () =>
  ["reorder-carousel-slides"] as const;

export function useReorderCarouselSlides() {
  return useMutation({
    mutationKey: getReorderCarouselSlidesMutationKey(),
    mutationFn: reorderCarouselSlides,
  });
}
