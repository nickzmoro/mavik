import { useMutation } from "@tanstack/react-query";

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

  return { imageUrl: body.imageUrl };
}

export function useGenerateImage() {
  return useMutation({
    mutationKey: getGenerateImageMutationKey(),
    mutationFn: generateImage,
  });
}
