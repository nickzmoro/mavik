"use server";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  brandAssets,
  brandColors,
  brandFonts,
  brandKits,
  brandRestrictions,
  stores,
} from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { colorRoles, onboardingSteps } from "@/lib/onboarding/constants";
import {
  getCurrentUserId,
  getOrCreateCurrentBrandKit,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import {
  saveOnboardingBrandKitSchema,
  type SaveOnboardingBrandKitInput,
} from "./schema";

const requiredLogoKinds = ["logo_claro", "logo_escuro"] as const;

export async function saveOnboardingBrandKit(
  input: SaveOnboardingBrandKitInput,
): Promise<AuthActionResult<{ redirectTo?: string }>> {
  const parsedInput = saveOnboardingBrandKitSchema.safeParse(input);

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

  const { colors, shouldAdvance, ...brandKitValues } = parsedInput.data;

  try {
    const brandKit = await getOrCreateCurrentBrandKit(store.id, userId);

    if (!brandKit) {
      return authFailure(onboardingErrorMessages.saveFailed);
    }

    await db.transaction(async (tx) => {
      const uploadedLogos = await tx
        .select({ kind: brandAssets.kind })
        .from(brandAssets)
        .where(
          and(
            eq(brandAssets.brandKitId, brandKit.id),
            inArray(brandAssets.kind, [...requiredLogoKinds]),
          ),
        );
      const uploadedLogoKinds = new Set(uploadedLogos.map(({ kind }) => kind));
      const completeness =
        requiredLogoKinds.filter((kind) => uploadedLogoKinds.has(kind)).length +
        3;

      await tx
        .update(brandKits)
        .set({
          source: brandKitValues.source,
          imageStyle: brandKitValues.imageStyle ?? null,
          completeness,
        })
        .where(eq(brandKits.id, brandKit.id));

      await tx
        .delete(brandColors)
        .where(eq(brandColors.brandKitId, brandKit.id));
      await tx.insert(brandColors).values(
        colorRoles.map(({ value: role, label }, position) => ({
          brandKitId: brandKit.id,
          role,
          name: label,
          hex: colors[role].toUpperCase(),
          position,
        })),
      );

      await tx.delete(brandFonts).where(eq(brandFonts.brandKitId, brandKit.id));
      await tx.insert(brandFonts).values(
        [
          { role: "titulo" as const, family: brandKitValues.titleFont },
          { role: "paragrafo" as const, family: brandKitValues.bodyFont },
          ...(brandKitValues.highlightFont
            ? [
                {
                  role: "destaque" as const,
                  family: brandKitValues.highlightFont,
                },
              ]
            : []),
        ].map((font) => ({
          ...font,
          brandKitId: brandKit.id,
          source: "google" as const,
          licenseConfirmed: brandKitValues.licenseConfirmed,
        })),
      );

      await tx
        .delete(brandRestrictions)
        .where(eq(brandRestrictions.brandKitId, brandKit.id));

      if (brandKitValues.restrictions.length > 0) {
        await tx.insert(brandRestrictions).values(
          brandKitValues.restrictions.map((value) => ({
            brandKitId: brandKit.id,
            kind: /^#[0-9a-f]{6}$/i.test(value)
              ? ("cor" as const)
              : ("elemento" as const),
            value,
          })),
        );
      }

      if (shouldAdvance) {
        await tx
          .update(stores)
          .set({ onboardingStep: Math.max(store.onboardingStep, 3) })
          .where(eq(stores.id, store.id));
      }
    });
  } catch (error) {
    console.error("[onboarding] falha ao salvar brand kit", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess({
    redirectTo: shouldAdvance ? onboardingSteps[2].href : undefined,
  });
}
