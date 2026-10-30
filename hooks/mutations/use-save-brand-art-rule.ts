import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveBrandArtRule } from "@/actions/save-brand-art-rule";
import { getBrandKitDataQueryKey } from "@/hooks/queries/use-brand-kit-data";

export const getSaveBrandArtRuleMutationKey = () =>
  ["save-brand-art-rule"] as const;

export function useSaveBrandArtRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getSaveBrandArtRuleMutationKey(),
    mutationFn: saveBrandArtRule,
    onSuccess: (result) => {
      if (result.isSuccess) {
        void queryClient.invalidateQueries({
          queryKey: getBrandKitDataQueryKey(),
        });
      }
    },
  });
}
