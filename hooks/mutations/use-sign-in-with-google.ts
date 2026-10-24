import { useMutation } from "@tanstack/react-query";

import { signInWithGoogle } from "@/actions/sign-in-with-google";

export const getSignInWithGoogleMutationKey = () =>
  ["sign-in-with-google"] as const;

export function useSignInWithGoogle() {
  return useMutation({
    mutationKey: getSignInWithGoogleMutationKey(),
    mutationFn: signInWithGoogle,
  });
}
