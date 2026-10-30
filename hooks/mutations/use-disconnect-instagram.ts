import { useMutation } from "@tanstack/react-query";

import { disconnectInstagram } from "@/actions/disconnect-instagram";

export const getDisconnectInstagramMutationKey = () =>
  ["disconnect-instagram"] as const;

export function useDisconnectInstagram() {
  return useMutation({
    mutationKey: getDisconnectInstagramMutationKey(),
    mutationFn: disconnectInstagram,
  });
}
