import { useMutation } from "@tanstack/react-query";

import { uploadBrandAsset } from "@/actions/upload-brand-asset";
import {
  toUploadBrandAssetFormData,
  type UploadBrandAssetInput,
} from "@/actions/upload-brand-asset/schema";

export const getUploadBrandAssetMutationKey = () =>
  ["upload-brand-asset"] as const;

export function useUploadBrandAsset() {
  return useMutation({
    mutationKey: getUploadBrandAssetMutationKey(),
    mutationFn: (input: UploadBrandAssetInput) =>
      uploadBrandAsset(toUploadBrandAssetFormData(input)),
  });
}
