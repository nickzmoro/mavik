"use server";

import {
  authErrorMessages,
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import {
  authErrorFailure,
  validationFailure,
} from "@/lib/auth-error-messages";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { routes } from "@/lib/routes";
import { getAuthRedirectUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import {
  requestPasswordResetSchema,
  type RequestPasswordResetInput,
} from "./schema";

export async function requestPasswordReset(
  input: RequestPasswordResetInput,
): Promise<AuthActionResult> {
  const parsedInput = requestPasswordResetSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const { email, captchaToken } = parsedInput.data;
  const clientIp = await getClientIp();
  const ipKey = `password-reset:ip:${clientIp}`;
  const emailKey = `password-reset:email:${email}`;

  const blockedRemainingMs = await getBlockedRemainingMs([ipKey, emailKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      authErrorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
    );
  }

  await Promise.all([
    registerAttempt(ipKey, rateLimitRules.passwordResetByIp),
    registerAttempt(emailKey, rateLimitRules.passwordResetByEmail),
  ]);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    captchaToken,
    redirectTo: getAuthRedirectUrl(routes.resetPassword),
  });

  if (error) {
    return authErrorFailure(error, "pedido de nova senha");
  }

  return authSuccess(undefined);
}
