import { useMutation } from "@tanstack/react-query";

import { signUp } from "@/actions/sign-up";

export const getSignUpMutationKey = () => ["sign-up"] as const;

export function useSignUp() {
  return useMutation({
    mutationKey: getSignUpMutationKey(),
    mutationFn: signUp,
  });
}
