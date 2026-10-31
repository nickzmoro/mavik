import { useMutation } from "@tanstack/react-query";

import type { CarouselSlideCopy } from "@/lib/carousel/carousel-copy";

export const getGenerateCarouselSlideMutationKey = () =>
  ["generate-carousel-slide"] as const;

export type GenerateCarouselSlideInput = {
  artworkId: string;
  position: number;
  slideCount: number;
  slide: CarouselSlideCopy;
  editInstruction?: string;
};

export type GeneratedCarouselSlide = {
  imageUrl: string;
  position: number;
  version: number;
};

const connectionErrorMessage =
  "Não conseguimos conectar. Confira sua internet e tente de novo.";

async function generateCarouselSlide(
  input: GenerateCarouselSlideInput,
): Promise<GeneratedCarouselSlide> {
  const response = await fetch("/api/carousel-slide", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  }).catch(() => {
    throw new Error(connectionErrorMessage);
  });
  const body = await response.json().catch(() => null);

  if (!response.ok || typeof body?.imageUrl !== "string") {
    throw new Error(body?.errorMessage ?? connectionErrorMessage);
  }

  return {
    imageUrl: body.imageUrl,
    position: Number(body.position),
    version: Number(body.version),
  };
}

export function useGenerateCarouselSlide() {
  return useMutation({
    mutationKey: getGenerateCarouselSlideMutationKey(),
    mutationFn: generateCarouselSlide,
  });
}
