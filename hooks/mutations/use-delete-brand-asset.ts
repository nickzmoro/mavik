import { useMutation } from "@tanstack/react-query";

import { deleteBrandAsset } from "@/actions/delete-brand-asset";

export const getDeleteBrandAssetMutationKey = () =>
  ["delete-brand-asset"] as const;

export function useDeleteBrandAsset() {
  return useMutation({
    mutationKey: getDeleteBrandAssetMutationKey(),
    mutationFn: deleteBrandAsset,
  });
}
