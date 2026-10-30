"use server";

import OpenAI from "openai";

import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import {
  generateStoreIdeas,
  ideasErrorMessages,
} from "@/lib/ideas/generate-ideas";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";
import {
  formatRetryAfter,
  getBlockedRemainingMs,
  rateLimitRules,
  registerAttempt,
} from "@/lib/rate-limit";

import {
  generateIdeasSchema,
  type GenerateIdeasInput,
  type GenerateIdeasResult,
} from "./schema";

export async function generateIdeas(
  input: GenerateIdeasInput,
): Promise<AuthActionResult<GenerateIdeasResult>> {
  const parsedInput = generateIdeasSchema.safeParse(input);

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

  const rateLimitKey = `generate-ideas:user:${userId}`;
  const blockedRemainingMs = await getBlockedRemainingMs([rateLimitKey]);

  if (blockedRemainingMs > 0) {
    return authFailure(
      `Você pediu muitas ideias seguidas. Tente de novo em ${formatRetryAfter(blockedRemainingMs)}.`,
    );
  }

  await registerAttempt(rateLimitKey, rateLimitRules.generateIdeasByUser);

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return authFailure(ideasErrorMessages.failed);
  }

  const result = await generateStoreIdeas({
    store,
    userId,
    input: parsedInput.data,
    openai: new OpenAI({ apiKey }),
    now: new Date(),
  });

  return result.isSuccess
    ? authSuccess(result.data)
    : authFailure(result.errorMessage);
}
