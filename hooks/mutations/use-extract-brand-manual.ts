import { useMutation } from "@tanstack/react-query";

import { extractBrandManual } from "@/actions/extract-brand-manual";

export const getExtractBrandManualMutationKey = () =>
  ["extract-brand-manual"] as const;

export function useExtractBrandManual() {
  return useMutation({
    mutationKey: getExtractBrandManualMutationKey(),
    mutationFn: extractBrandManual,
  });
}
