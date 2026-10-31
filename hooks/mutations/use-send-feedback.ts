import { useMutation } from "@tanstack/react-query";

import { sendFeedback } from "@/actions/send-feedback";

export const getSendFeedbackMutationKey = () => ["send-feedback"] as const;

export function useSendFeedback() {
  return useMutation({
    mutationKey: getSendFeedbackMutationKey(),
    mutationFn: sendFeedback,
  });
}
