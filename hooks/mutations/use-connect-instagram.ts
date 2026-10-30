import { useMutation } from "@tanstack/react-query";

import { connectInstagram } from "@/actions/connect-instagram";

export const getConnectInstagramMutationKey = () =>
  ["connect-instagram"] as const;

export function useConnectInstagram() {
  return useMutation({
    mutationKey: getConnectInstagramMutationKey(),
    mutationFn: connectInstagram,
  });
}
