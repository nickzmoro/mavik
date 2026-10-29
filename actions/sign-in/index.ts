"use server";

import {
  authErrorMessages,
  authFailure,
  authSuccess,
  maskEmail,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import {
  authErrorFailure,
  validationFailure,
} from "@/lib/auth-error-messages";
import { getPostAuthRoute } from "@/lib/onboarding/get-post-auth-route";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
  resetAttempts,
} from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-ip";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import {
  createSupabaseServerClient,
  setSessionPersistence,
} from "@/lib/supabase/server";

import { signInSchema, type SignInInput } from "./schema";

type SignInResult = AuthActionResult<{ redirectTo: string }>;

function tooManyAttempts(remainingMs: number) {
  return authFailure(
    authErrorMessages.tooManyAttempts(formatRetryAfter(remainingMs)),
  );
}

export async function signIn(input: SignInInput): Promise<SignInResult> {
  const parsedInput = signInSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const { email, password, remember, captchaToken, redirectTo } =
    parsedInput.data;
  const clientIp = await getClientIp();

  const ipKey = `sign-in:ip:${clientIp}`;
  const ipAndEmailKey = `sign-in:ip-email:${clientIp}:${email}`;
  const emailKey = `sign-in:email:${email}`;

  const blockedRemainingMs = await getBlockedRemainingMs([
    ipKey,
    ipAndEmailKey,
    emailKey,
  ]);

  if (blockedRemainingMs > 0) {
    return tooManyAttempts(blockedRemainingMs);
  }

  await registerAttempt(ipKey, rateLimitRules.signInByIp);

  const supabase = await createSupabaseServerClient({
    isSessionOnly: !remember,
  });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });

  if (!error) {
    await resetAttempts(ipAndEmailKey);
    await setSessionPersistence(remember);

    return authSuccess({
      redirectTo: redirectTo
        ? getSafeRedirectPath(redirectTo)
        : await getPostAuthRoute(data.user?.id),
    });
  }

  if (error.code === "invalid_credentials") {
    const [ipAndEmailBlockMs, emailBlockMs] = await Promise.all([
      registerAttempt(ipAndEmailKey, rateLimitRules.signInByIpAndEmail),
      registerAttempt(emailKey, rateLimitRules.signInByEmail),
    ]);
    const newBlockMs = Math.max(ipAndEmailBlockMs, emailBlockMs);

    console.warn("[auth] falha de login", {
      email: maskEmail(email),
      ip: clientIp,
      isBlocked: newBlockMs > 0,
    });

    if (newBlockMs > 0) {
      return tooManyAttempts(newBlockMs);
    }
  }

  return authErrorFailure(error, "login");
}
