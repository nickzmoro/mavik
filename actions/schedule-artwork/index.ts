"use server";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { saveApprovedContent } from "@/lib/content/save-approved-content";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { scheduleArtworkSchema, type ScheduleArtworkInput } from "./schema";

const scheduleFailedMessage =
  "Não conseguimos agendar o post agora. Tente de novo em alguns minutos.";

export async function scheduleArtwork(
  input: ScheduleArtworkInput,
): Promise<AuthActionResult<{ contentId: string }>> {
  const parsedInput = scheduleArtworkSchema.safeParse(input);

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

  const savedContent = await saveApprovedContent({
    storeId: store.id,
    userId,
    input: {
      ...parsedInput.data,
      scheduledAt: new Date(parsedInput.data.scheduledAt),
    },
  });

  return savedContent
    ? authSuccess(savedContent)
    : authFailure(scheduleFailedMessage);
}
