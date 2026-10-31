"use server";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import {
  buildFeedbackEmailHtml,
  buildFeedbackEmailSubject,
  buildFeedbackEmailText,
} from "@/lib/email/feedback-email";
import { sendContactEmail } from "@/lib/email/send-contact-email";
import { getCurrentUserId } from "@/lib/onboarding/store-access";
import { getCurrentUserProfile } from "@/lib/supabase/get-current-user-profile";

import { sendFeedbackSchema, type SendFeedbackInput } from "./schema";

const feedbackErrorMessages = {
  sessionExpired: "Sua sessão expirou. Entre de novo para enviar a mensagem.",
  sendFailed:
    "Não conseguimos enviar sua mensagem agora. Tente de novo em alguns minutos.",
};

export async function sendFeedback(
  input: SendFeedbackInput,
): Promise<AuthActionResult> {
  const parsedInput = sendFeedbackSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(feedbackErrorMessages.sessionExpired);
  }

  const { fullName, email } = await getCurrentUserProfile();
  const emailParams = { ...parsedInput.data, fullName, email };

  try {
    await sendContactEmail({
      subject: buildFeedbackEmailSubject(emailParams),
      html: buildFeedbackEmailHtml(emailParams),
      text: buildFeedbackEmailText(emailParams),
      replyTo: email || undefined,
    });
  } catch (error) {
    console.error("[feedback] falha ao enviar mensagem", error);
    return authFailure(feedbackErrorMessages.sendFailed);
  }

  return authSuccess(undefined);
}
