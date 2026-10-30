"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { ideaSaves, ideas } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";

import { toggleIdeaSaveSchema, type ToggleIdeaSaveInput } from "./schema";

const ideaNotFoundMessage = "Não encontramos essa ideia. Atualize a página.";

export async function toggleIdeaSave(
  input: ToggleIdeaSaveInput,
): Promise<AuthActionResult> {
  const parsedInput = toggleIdeaSaveSchema.safeParse(input);

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

  const { ideaId, isSaved } = parsedInput.data;

  try {
    const [idea] = await db
      .select({ id: ideas.id })
      .from(ideas)
      .where(and(eq(ideas.id, ideaId), eq(ideas.storeId, store.id)));

    if (!idea) {
      return authFailure(ideaNotFoundMessage);
    }

    if (isSaved) {
      await db
        .insert(ideaSaves)
        .values({ ideaId, userId })
        .onConflictDoNothing();
    } else {
      await db
        .delete(ideaSaves)
        .where(and(eq(ideaSaves.ideaId, ideaId), eq(ideaSaves.userId, userId)));
    }
  } catch (error) {
    console.error("[ideas] falha ao salvar ideia", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess(undefined);
}
