import { useMutation } from "@tanstack/react-query";

import { generateSampleCaption } from "@/actions/generate-sample-caption";

export const getGenerateSampleCaptionMutationKey = () =>
  ["generate-sample-caption"] as const;

export function useGenerateSampleCaption() {
  return useMutation({
    mutationKey: getGenerateSampleCaptionMutationKey(),
    mutationFn: generateSampleCaption,
  });
}
