"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  brandTerms,
  brandVoice,
  competitors,
  personas,
  storePositioning,
  stores,
} from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { onboardingSteps } from "@/lib/onboarding/constants";
import { generateOnboardingDiagnosis } from "@/lib/onboarding/generate-diagnosis";
import {
  getCurrentBrandKit,
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import {
  saveOnboardingVoiceSchema,
  type SaveOnboardingVoiceInput,
} from "./schema";

export async function saveOnboardingVoice(
  input: SaveOnboardingVoiceInput,
): Promise<AuthActionResult<{ redirectTo?: string }>> {
  const parsedInput = saveOnboardingVoiceSchema.safeParse(input);

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

  const brandKit = await getCurrentBrandKit(store.id);

  if (!brandKit) {
    return authFailure(onboardingErrorMessages.previousStepMissing);
  }

  const { tone, shouldAdvance, ...voice } = parsedInput.data;
  const competitorHandles = voice.competitors
    .filter(Boolean)
    .map((handle) => `@${handle.replace(/^@/, "")}`);
  const brandKitId = brandKit.id;

  try {
    await db.transaction(async (tx) => {
      const voiceValues = {
        ...tone,
        sampleCaption: voice.sampleCaption,
        sampleApproved: voice.sampleApproved,
      };

      await tx
        .insert(brandVoice)
        .values({ brandKitId, ...voiceValues })
        .onConflictDoUpdate({
          target: brandVoice.brandKitId,
          set: voiceValues,
        });

      await tx.delete(brandTerms).where(eq(brandTerms.brandKitId, brandKitId));
      const terms = [
        ...voice.lovedTerms.map((term) => ({ kind: "amada" as const, term })),
        ...voice.forbiddenTerms.map((term) => ({
          kind: "proibida" as const,
          term,
        })),
      ];

      if (terms.length > 0) {
        await tx
          .insert(brandTerms)
          .values(terms.map((term) => ({ ...term, brandKitId })));
      }

      await tx.delete(personas).where(eq(personas.brandKitId, brandKitId));

      if (voice.personas.length > 0) {
        await tx
          .insert(personas)
          .values(
            voice.personas.map((persona) => ({ ...persona, brandKitId })),
          );
      }

      const positioningValues = {
        differentiators: voice.differentiators || null,
        objections: voice.objections || null,
      };

      await tx
        .insert(storePositioning)
        .values({ storeId: store.id, ...positioningValues })
        .onConflictDoUpdate({
          target: storePositioning.storeId,
          set: positioningValues,
        });

      await tx.delete(competitors).where(eq(competitors.storeId, store.id));

      if (competitorHandles.length > 0) {
        await tx.insert(competitors).values(
          competitorHandles.map((handle) => ({
            storeId: store.id,
            name: handle,
            handle,
          })),
        );
      }

      if (shouldAdvance) {
        await tx
          .update(stores)
          .set({ onboardingStep: 4 })
          .where(eq(stores.id, store.id));
      }
    });

    if (shouldAdvance) {
      await generateOnboardingDiagnosis(store, brandKit);
    }
  } catch (error) {
    console.error("[onboarding] falha ao salvar voz", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess({
    redirectTo: shouldAdvance ? onboardingSteps[3].href : undefined,
  });
}
