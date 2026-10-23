import "server-only";

import { isAuthRetryableFetchError, type AuthError } from "@supabase/supabase-js";
import type { z } from "zod";

import { authErrorMessages, authFailure } from "./auth-action-result";

const authErrorMessagesByCode: Record<string, string> = {
  captcha_failed: authErrorMessages.captchaFailed,
  email_not_confirmed: authErrorMessages.emailNotConfirmed,
  invalid_credentials: authErrorMessages.invalidCredentials,
  user_already_exists: authErrorMessages.userAlreadyExists,
  email_exists: authErrorMessages.userAlreadyExists,
  weak_password: authErrorMessages.weakPassword,
  same_password: authErrorMessages.samePassword,
  over_email_send_rate_limit: authErrorMessages.emailSendLimit,
  over_request_rate_limit: authErrorMessages.rateLimited,
  email_address_invalid: authErrorMessages.emailAddressInvalid,
  email_address_not_authorized: authErrorMessages.emailNotAuthorized,
  signup_disabled: authErrorMessages.signUpDisabled,
  email_provider_disabled: authErrorMessages.signUpDisabled,
  user_banned: authErrorMessages.userBanned,
  session_not_found: authErrorMessages.sessionExpired,
  session_expired: authErrorMessages.sessionExpired,
  reauthentication_needed: authErrorMessages.sessionExpired,
  request_timeout: authErrorMessages.serverUnavailable,
};

export function getAuthErrorMessage(error: AuthError, context: string) {
  const knownMessage = error.code && authErrorMessagesByCode[error.code];

  if (knownMessage) {
    return knownMessage;
  }

  if (isAuthRetryableFetchError(error)) {
    return authErrorMessages.serverUnavailable;
  }

  console.error(`[auth] erro inesperado: ${context}`, {
    code: error.code,
    status: error.status,
    message: error.message,
  });

  return authErrorMessages.unexpected(error.code ?? String(error.status ?? ""));
}

export function authErrorFailure(error: AuthError, context: string) {
  return authFailure(getAuthErrorMessage(error, context));
}

export function validationFailure(error: z.ZodError) {
  const [firstIssue] = error.issues;

  return authFailure(firstIssue?.message ?? authErrorMessages.invalidInput);
}
