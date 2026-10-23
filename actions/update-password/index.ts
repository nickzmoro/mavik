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
import { routes } from "@/lib/routes";
import { PASSWORD_RECOVERY_COOKIE } from "@/lib/supabase/password-recovery-cookie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { updatePasswordSchema, type UpdatePasswordInput } from "./schema";

export async function updatePassword(
  input: UpdatePasswordInput,
): Promise<AuthActionResult<{ redirectTo: string }>> {
  const parsedInput = updatePasswordSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (!userId || !cookieStore.has(PASSWORD_RECOVERY_COOKIE)) {
    return authFailure(authErrorMessages.recoveryLinkRequired);
  }

  const userKey = `update-password:user:${userId}`;
  const blockedRemainingMs = await getBlockedRemainingMs([userKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      authErrorMessages.tooManyAttempts(formatRetryAfter(blockedRemainingMs)),
    );
  }

  await registerAttempt(userKey, rateLimitRules.updatePasswordByUser);

  const { error } = await supabase.auth.updateUser({
    password: parsedInput.data.password,
  });

  if (error) {
    return authErrorFailure(error, "nova senha");
  }

  await supabase.auth.signOut({ scope: "others" });
  cookieStore.delete(PASSWORD_RECOVERY_COOKIE);

  return authSuccess({ redirectTo: routes.authenticatedHome });
}
