import { z } from "zod";

import { feedbackTypeValues } from "@/lib/feedback/feedback-types";

export const sendFeedbackFormSchema = z.object({
  type: z.enum(feedbackTypeValues, {
    error: "Escolha o tipo da sua mensagem.",
  }),
  message: z
    .string()
    .trim()
    .min(10, { error: "Conte um pouco mais. Use pelo menos 10 caracteres." })
    .max(2000, { error: "Use até 2000 caracteres." }),
});

export const sendFeedbackSchema = sendFeedbackFormSchema.extend({
  pagePath: z
    .string()
    .trim()
    .max(300)
    .refine((pagePath) => pagePath.startsWith("/app"), {
      error: "Não conseguimos identificar a página.",
    }),
});

export type SendFeedbackFormValues = z.infer<typeof sendFeedbackFormSchema>;
export type SendFeedbackInput = z.infer<typeof sendFeedbackSchema>;
