import { useMutation } from "@tanstack/react-query";

import { startCarousel } from "@/actions/start-carousel";

export const getStartCarouselMutationKey = () => ["start-carousel"] as const;

export function useStartCarousel() {
  return useMutation({
    mutationKey: getStartCarouselMutationKey(),
    mutationFn: startCarousel,
  });
}
