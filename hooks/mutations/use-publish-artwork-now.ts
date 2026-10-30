import { useMutation } from "@tanstack/react-query";

import { publishArtworkNow } from "@/actions/publish-artwork-now";

export const getPublishArtworkNowMutationKey = () =>
  ["publish-artwork-now"] as const;

export function usePublishArtworkNow() {
  return useMutation({
    mutationKey: getPublishArtworkNowMutationKey(),
    mutationFn: publishArtworkNow,
  });
}
