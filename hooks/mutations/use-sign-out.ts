import { useMutation } from "@tanstack/react-query";

import { signOut } from "@/actions/sign-out";

export const getSignOutMutationKey = () => ["sign-out"] as const;

export function useSignOut() {
  return useMutation({
    mutationKey: getSignOutMutationKey(),
    mutationFn: signOut,
  });
}
