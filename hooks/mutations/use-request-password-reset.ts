import { useMutation } from "@tanstack/react-query";

import { requestPasswordReset } from "@/actions/request-password-reset";

export const getRequestPasswordResetMutationKey = () =>
  ["request-password-reset"] as const;

export function useRequestPasswordReset() {
  return useMutation({
    mutationKey: getRequestPasswordResetMutationKey(),
    mutationFn: requestPasswordReset,
  });
}
