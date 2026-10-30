"use server";

import { revalidatePath } from "next/cache";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { disconnectInstagram as disconnectStoreInstagram } from "@/lib/instagram/accounts";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import {
  disconnectInstagramSchema,
  type DisconnectInstagramInput,
} from "./schema";

export async function disconnectInstagram(
  input: DisconnectInstagramInput,
): Promise<AuthActionResult> {
  const parsedInput = disconnectInstagramSchema.safeParse(input);

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

  try {
    await disconnectStoreInstagram(store.id);
  } catch (error) {
    console.error("[instagram] falha ao desconectar", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  revalidatePath(routes.brand);

  return authSuccess(undefined);
}
