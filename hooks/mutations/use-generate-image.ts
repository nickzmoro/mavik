import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getRecentArtworksQueryKey } from "@/hooks/queries/use-recent-artworks";

import type {
  GenerateImageInput,
  GenerateImageResult,
} from "@/lib/validations/image-generation";

export const getGenerateImageMutationKey = () => ["generate-image"] as const;

const connectionErrorMessage =
  "Não conseguimos conectar. Confira sua internet e tente de novo.";

async function generateImage(
  input: GenerateImageInput,
): Promise<GenerateImageResult> {
  const response = await fetch("/api/generate", {
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
    artworkId: typeof body.artworkId === "string" ? body.artworkId : undefined,
    version: typeof body.version === "number" ? body.version : undefined,
  };
}

export function useGenerateImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getGenerateImageMutationKey(),
    mutationFn: generateImage,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getRecentArtworksQueryKey() }),
  });
}
