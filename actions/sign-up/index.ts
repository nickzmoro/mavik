"use server";

import {
  authErrorMessages,
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { routes } from "@/lib/routes";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signUpSchema, type SignUpInput } from "./schema";

const silentSuccessCodes = new Set(["user_already_exists", "email_exists"]);

function getEmailRedirectUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const redirectUrl = new URL(routes.authConfirm, siteUrl);
  redirectUrl.searchParams.set("next", routes.authenticatedHome);

  return redirectUrl.toString();
}

export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
  const parsedInput = signUpSchema.safeParse(input);

  if (!parsedInput.success) {
    return authFailure(authErrorMessages.invalidInput);
  }

  const { name, email, password, captchaToken } = parsedInput.data;
  const clientIp = await getClientIp();
  const ipKey = `sign-up:ip:${clientIp}`;

  const blockedRemainingMs = await getBlockedRemainingMs([ipKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      authErrorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
    );
  }

  await registerAttempt(ipKey, rateLimitRules.signUpByIp);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
      emailRedirectTo: getEmailRedirectUrl(),
      data: { full_name: name },
    },
  });

  if (!error || (error.code && silentSuccessCodes.has(error.code))) {
    return authSuccess(undefined);
  }

  if (error.code === "captcha_failed") {
    return authFailure(authErrorMessages.captchaFailed);
  }

  if (error.code === "weak_password") {
    return authFailure(authErrorMessages.weakPassword);
  }

  if (error.code === "over_email_send_rate_limit") {
    return authFailure(authErrorMessages.emailSendLimit);
  }

  if (error.code === "over_request_rate_limit") {
    return authFailure(authErrorMessages.tooManyAttempts("alguns minutos"));
  }

  console.error("[auth] erro inesperado no cadastro", {
    code: error.code,
    status: error.status,
    message: error.message,
  });

  return authFailure(authErrorMessages.unexpected);
}
