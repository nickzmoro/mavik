"use server";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { reorderSlides } from "@/lib/content/artwork-slides";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId } from "@/lib/onboarding/store-access";

import {
  reorderCarouselSlidesSchema,
  type ReorderCarouselSlidesInput,
} from "./schema";

const reorderFailedMessage =
  "Não conseguimos mudar a ordem dos slides. Tente de novo.";

export async function reorderCarouselSlides(
  input: ReorderCarouselSlidesInput,
): Promise<AuthActionResult> {
  const parsedInput = reorderCarouselSlidesSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  try {
    const isReordered = await reorderSlides(
      userId,
      parsedInput.data.artworkId,
      parsedInput.data.newOrder,
    );

    return isReordered
      ? authSuccess(undefined)
      : authFailure(reorderFailedMessage);
  } catch (error) {
    console.error("[carrossel] falha ao reordenar slides", error);
    return authFailure(reorderFailedMessage);
  }
}
