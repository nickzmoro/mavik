import { useMutation } from "@tanstack/react-query";

import { updatePassword } from "@/actions/update-password";

export const getUpdatePasswordMutationKey = () => ["update-password"] as const;

export function useUpdatePassword() {
  return useMutation({
    mutationKey: getUpdatePasswordMutationKey(),
    mutationFn: updatePassword,
  });
}
