import { useMutation } from "@tanstack/react-query";

import { generatePostCopy } from "@/actions/generate-post-copy";

export const getGeneratePostCopyMutationKey = () =>
  ["generate-post-copy"] as const;

export function useGeneratePostCopy() {
  return useMutation({
    mutationKey: getGeneratePostCopyMutationKey(),
    mutationFn: generatePostCopy,
  });
}
