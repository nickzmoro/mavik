"use server";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { artworks } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { startCarousel as saveCoverSlide } from "@/lib/content/artwork-slides";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { startCarouselSchema, type StartCarouselInput } from "./schema";

const startFailedMessage =
  "Não conseguimos preparar o carrossel. Gere a capa de novo.";

export async function startCarousel(
  input: StartCarouselInput,
): Promise<AuthActionResult> {
  const parsedInput = startCarouselSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;

  if (!userId || !store) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const { artworkId, carouselCopy, discardedArtworkIds } = parsedInput.data;

  try {
    if (!(await saveCoverSlide(userId, artworkId, carouselCopy))) {
      return authFailure(startFailedMessage);
    }

    const otherCoverIds = discardedArtworkIds.filter((id) => id !== artworkId);

    if (otherCoverIds.length > 0) {
      await db
        .update(artworks)
        .set({ status: "descartada" })
        .where(
          and(
            eq(artworks.storeId, store.id),
            inArray(artworks.id, otherCoverIds),
          ),
        );
    }

    return authSuccess(undefined);
  } catch (error) {
    console.error("[carrossel] falha ao preparar carrossel", error);
    return authFailure(startFailedMessage);
  }
}
