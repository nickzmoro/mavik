import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveBrandKit } from "@/actions/save-brand-kit";
import { getBrandKitDataQueryKey } from "@/hooks/queries/use-brand-kit-data";

export const getSaveBrandKitMutationKey = () => ["save-brand-kit"] as const;

export function useSaveBrandKit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getSaveBrandKitMutationKey(),
    mutationFn: saveBrandKit,
    onSuccess: (result) => {
      if (result.isSuccess) {
        void queryClient.invalidateQueries({
          queryKey: getBrandKitDataQueryKey(),
        });
      }
    },
  });
}
