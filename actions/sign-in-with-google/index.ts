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
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { getOAuthCallbackUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { signInWithGoogleSchema, type SignInWithGoogleInput } from "./schema";

const providerDisabledPattern = /provider is not enabled/i;

export async function signInWithGoogle(
  input: SignInWithGoogleInput,
): Promise<AuthActionResult<{ url: string }>> {
  const parsedInput = signInWithGoogleSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const clientIp = await getClientIp();
  const ipKey = `google-sign-in:ip:${clientIp}`;
  const blockedRemainingMs = await getBlockedRemainingMs([ipKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      authErrorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
    );
  }

  await registerAttempt(ipKey, rateLimitRules.googleSignInByIp);

  const supabase = await createSupabaseServerClient({ isSessionOnly: false });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getOAuthCallbackUrl(
        getSafeRedirectPath(parsedInput.data.redirectTo),
      ),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error) {
    if (providerDisabledPattern.test(error.message)) {
      return authFailure(authErrorMessages.googleUnavailable);
    }

    return authErrorFailure(error, "login com Google");
  }

  return authSuccess({ url: data.url });
}
