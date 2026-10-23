import { useMutation } from "@tanstack/react-query";

import { signIn } from "@/actions/sign-in";

export const getSignInMutationKey = () => ["sign-in"] as const;

export function useSignIn() {
  return useMutation({
    mutationKey: getSignInMutationKey(),
    mutationFn: signIn,
  });
}
