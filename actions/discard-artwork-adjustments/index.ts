"use server";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { deleteArtworkVersionsAfter } from "@/lib/content/artwork-versions";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId } from "@/lib/onboarding/store-access";

import {
  discardArtworkAdjustmentsSchema,
  type DiscardArtworkAdjustmentsInput,
} from "./schema";

const discardFailedMessage =
  "Não conseguimos descartar os ajustes. Tente de novo.";

export async function discardArtworkAdjustments(
  input: DiscardArtworkAdjustmentsInput,
): Promise<AuthActionResult> {
  const parsedInput = discardArtworkAdjustmentsSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  try {
    const isDiscarded = await deleteArtworkVersionsAfter(
      userId,
      parsedInput.data.artworkId,
      parsedInput.data.keepVersion,
    );

    return isDiscarded
      ? authSuccess(undefined)
      : authFailure("Não encontramos essa arte.");
  } catch (error) {
    console.error("[artes] falha ao descartar ajustes", error);
    return authFailure(discardFailedMessage);
  }
}
