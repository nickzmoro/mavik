"use server";

import { cookies } from "next/headers";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import {
  INSTAGRAM_SCOPES,
  getInstagramApiConfig,
  getOAuthStateSecret,
} from "@/lib/instagram/config";
import { buildAuthorizeUrl } from "@/lib/instagram/instagram-api";
import {
  OAUTH_STATE_COOKIE,
  OAUTH_STATE_TTL_MS,
  createOAuthState,
} from "@/lib/instagram/oauth-state";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { connectInstagramSchema, type ConnectInstagramInput } from "./schema";

export async function connectInstagram(
  input: ConnectInstagramInput,
): Promise<AuthActionResult<{ url: string }>> {
  const parsedInput = connectInstagramSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const store = await getOwnedStore(userId);

  if (!store) {
    return authFailure(onboardingErrorMessages.storeMissing);
  }

  const state = createOAuthState({
    userId,
    storeId: store.id,
    secret: getOAuthStateSecret(),
  });
  const cookieStore = await cookies();

  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/instagram/callback",
    maxAge: OAUTH_STATE_TTL_MS / 1000,
  });

  return authSuccess({
    url: buildAuthorizeUrl(
      getInstagramApiConfig(),
      INSTAGRAM_SCOPES,
      state,
    ).toString(),
  });
}
