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

import { signUpSchema, type SignUpInput } from "./schema";

const userAlreadyExistsCodes = new Set(["user_already_exists", "email_exists"]);

function userAlreadyExists() {
  return authFailure(authErrorMessages.userAlreadyExists, "email");
}

export async function signUp(input: SignUpInput): Promise<AuthActionResult> {
  const parsedInput = signUpSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      captchaToken,
      emailRedirectTo: getAuthRedirectUrl(routes.authenticatedHome),
      data: { full_name: name },
    },
  });

  if (error) {
    if (error.code && userAlreadyExistsCodes.has(error.code)) {
      return userAlreadyExists();
    }

    return authErrorFailure(error, "cadastro");
  }

  if (data.user?.identities?.length === 0) {
    return userAlreadyExists();
  }

  return authSuccess(undefined);
}
