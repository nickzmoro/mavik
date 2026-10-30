import { useMutation } from "@tanstack/react-query";

import { generatePostCaption } from "@/actions/generate-post-caption";

export const getGeneratePostCaptionMutationKey = () =>
  ["generate-post-caption"] as const;

export function useGeneratePostCaption() {
  return useMutation({
    mutationKey: getGeneratePostCaptionMutationKey(),
    mutationFn: generatePostCaption,
  });
}
