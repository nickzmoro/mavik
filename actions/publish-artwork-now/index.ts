"use server";

import { revalidatePath } from "next/cache";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { saveApprovedContent } from "@/lib/content/save-approved-content";
import { publishContentNow } from "@/lib/instagram/publish-content";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";
import { routes } from "@/lib/routes";

import { publishArtworkNowSchema, type PublishArtworkNowInput } from "./schema";

export async function publishArtworkNow(
  input: PublishArtworkNowInput,
): Promise<AuthActionResult<{ contentId: string; permalink: string | null }>> {
  const parsedInput = publishArtworkNowSchema.safeParse(input);

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
    input: { ...parsedInput.data, scheduledAt: new Date() },
  });

  if (!savedContent) {
    return authFailure(
      "Não conseguimos preparar o post agora. Tente de novo em alguns minutos.",
    );
  }

  const published = await publishContentNow({
    storeId: store.id,
    contentId: savedContent.contentId,
    userId,
  });

  revalidatePath(routes.authenticatedHome);

  return published.isSuccess
    ? authSuccess({
        contentId: savedContent.contentId,
        permalink: published.permalink,
      })
    : authFailure(published.errorMessage);
}
