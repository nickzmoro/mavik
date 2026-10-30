import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBrandArtRule } from "@/actions/delete-brand-art-rule";
import { getBrandKitDataQueryKey } from "@/hooks/queries/use-brand-kit-data";

export const getDeleteBrandArtRuleMutationKey = () =>
  ["delete-brand-art-rule"] as const;

export function useDeleteBrandArtRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getDeleteBrandArtRuleMutationKey(),
    mutationFn: deleteBrandArtRule,
    onSuccess: (result) => {
      if (result.isSuccess) {
        void queryClient.invalidateQueries({
          queryKey: getBrandKitDataQueryKey(),
        });
      }
    },
  });
}
