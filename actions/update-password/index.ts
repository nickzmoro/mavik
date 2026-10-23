"use server";

import { cookies } from "next/headers";

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
import {
  PASSWORD_RECOVERY_COOKIE,
  passwordRecoveryCookieOptions,
} from "@/lib/supabase/password-recovery-cookie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { updatePasswordSchema, type UpdatePasswordInput } from "./schema";

type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

async function hasRecoverySession(supabase: SupabaseServerClient) {
  const cookieStore = await cookies();

  if (!cookieStore.has(PASSWORD_RECOVERY_COOKIE)) {
    return false;
  }

  const { data } = await supabase.auth.getClaims();

  return Boolean(data?.claims);
}

async function startRecoverySession(
  supabase: SupabaseServerClient,
  tokenHash: string,
) {
  const { error } = await supabase.auth.verifyOtp({
    type: "recovery",
    token_hash: tokenHash,
  });

  if (error) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(PASSWORD_RECOVERY_COOKIE, "1", passwordRecoveryCookieOptions);

  return true;
}

export async function updatePassword(
  input: UpdatePasswordInput,
): Promise<AuthActionResult<{ redirectTo: string }>> {
  const parsedInput = updatePasswordSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const { password, tokenHash } = parsedInput.data;
  const clientIp = await getClientIp();
  const ipKey = `update-password:ip:${clientIp}`;
  const blockedRemainingMs = await getBlockedRemainingMs([ipKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      authErrorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
    );
  }

  await registerAttempt(ipKey, rateLimitRules.updatePasswordByIp);

  const supabase = await createSupabaseServerClient();
  const isRecoveryAllowed =
    (await hasRecoverySession(supabase)) ||
    (tokenHash ? await startRecoverySession(supabase, tokenHash) : false);

  if (!isRecoveryAllowed) {
    return authFailure(
      tokenHash
        ? authErrorMessages.recoveryLinkInvalid
        : authErrorMessages.recoveryLinkRequired,
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return authErrorFailure(error, "nova senha");
  }

  await supabase.auth.signOut({ scope: "others" });
  const cookieStore = await cookies();
  cookieStore.delete(PASSWORD_RECOVERY_COOKIE);

  return authSuccess({ redirectTo: routes.authenticatedHome });
}
