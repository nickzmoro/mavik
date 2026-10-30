"use server";

import { and, eq, inArray, ne } from "drizzle-orm";

import { db } from "@/db";
import {
  brandAssets,
  brandColors,
  brandFonts,
  brandKits,
  brandLayouts,
  brandRestrictions,
  brandRules,
  brandTerms,
  brandVoice,
  personas,
} from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import {
  colorRoleColumns,
  fontRoleColumns,
  imageStyleColumns,
  ruleSourceColumns,
} from "@/lib/brand/brand-kit-data";
import { mockBrandRules } from "@/lib/mocks/brand";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import {
  getCurrentUserId,
  getOrCreateCurrentBrandKit,
  getOwnedStore,
} from "@/lib/onboarding/store-access";

import { saveBrandKitSchema, type SaveBrandKitInput } from "./schema";

export async function saveBrandKit(
  input: SaveBrandKitInput,
): Promise<AuthActionResult> {
  const parsedInput = saveBrandKitSchema.safeParse(input);

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

  const brandKitValues = parsedInput.data;

  try {
    const brandKit = await getOrCreateCurrentBrandKit(store.id, userId);

    if (!brandKit) {
      return authFailure(onboardingErrorMessages.saveFailed);
    }

    const referencedAssetIds = [
      ...brandKitValues.fonts.flatMap((font) => font.assetId ?? []),
      ...brandKitValues.layouts.flatMap((layout) => layout.sourceAssetId ?? []),
    ];
    const ownedAssets = referencedAssetIds.length
      ? await db
          .select({ id: brandAssets.id })
          .from(brandAssets)
          .where(
            and(
              eq(brandAssets.brandKitId, brandKit.id),
              inArray(brandAssets.id, referencedAssetIds),
            ),
          )
      : [];
    const ownedAssetIds = new Set(ownedAssets.map((asset) => asset.id));
    const getOwnedAssetId = (assetId?: string) =>
      assetId && ownedAssetIds.has(assetId) ? assetId : null;

    await db.transaction(async (tx) => {
      const brandKitId = brandKit.id;

      await tx
        .update(brandKits)
        .set({
          imageStyle: brandKitValues.imageStyle
            ? imageStyleColumns[brandKitValues.imageStyle]
            : null,
        })
        .where(eq(brandKits.id, brandKitId));

      await tx
        .delete(brandColors)
        .where(eq(brandColors.brandKitId, brandKitId));

      if (brandKitValues.palette.length > 0) {
        await tx.insert(brandColors).values(
          brandKitValues.palette.map((color, position) => ({
            brandKitId,
            role: colorRoleColumns[color.role],
            name: color.name,
            hex: color.hex.toUpperCase(),
            position,
          })),
        );
      }

      await tx.delete(brandFonts).where(eq(brandFonts.brandKitId, brandKitId));

      if (brandKitValues.fonts.length > 0) {
        await tx.insert(brandFonts).values(
          brandKitValues.fonts.map((font) => {
            const assetId = getOwnedAssetId(font.assetId);

            return {
              brandKitId,
              role: fontRoleColumns[font.role],
              family: font.family,
              source: assetId ? ("upload" as const) : ("google" as const),
              assetId,
              licenseConfirmed: true,
            };
          }),
        );
      }

      await tx
        .delete(brandLayouts)
        .where(eq(brandLayouts.brandKitId, brandKitId));

      if (brandKitValues.layouts.length > 0) {
        await tx.insert(brandLayouts).values(
          brandKitValues.layouts.map((layout) => ({
            id: layout.id,
            brandKitId,
            name: layout.name,
            format: layout.format,
            sourceAssetId: getOwnedAssetId(layout.sourceAssetId),
            structure: { layoutModes: layout.layoutModes },
          })),
        );
      }

      const voiceValues = {
        formalCasual: brandKitValues.voice.formality,
        seriousFun: brandKitValues.voice.humor,
        technicalSimple: brandKitValues.voice.complexity,
        educationalSales: brandKitValues.voice.intent,
        toneLabel: brandKitValues.voice.toneLabel,
        sampleCaption: brandKitValues.voice.sampleCaption,
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
        ...brandKitValues.lovedWords.map((term) => ({
          kind: "amada" as const,
          term,
        })),
        ...brandKitValues.bannedWords.map((term) => ({
          kind: "proibida" as const,
          term,
        })),
      ];

      if (terms.length > 0) {
        await tx
          .insert(brandTerms)
          .values(terms.map((term) => ({ brandKitId, ...term })));
      }

      await tx.delete(personas).where(eq(personas.brandKitId, brandKitId));

      if (brandKitValues.personas.length > 0) {
        await tx.insert(personas).values(
          brandKitValues.personas.map((persona) => ({
            brandKitId,
            ...persona,
            confirmed: true,
          })),
        );
      }

      await tx
        .delete(brandRules)
        .where(
          and(
            eq(brandRules.brandKitId, brandKitId),
            ne(brandRules.source, "manual"),
          ),
        );
      await tx.insert(brandRules).values(
        mockBrandRules.map((rule) => ({
          brandKitId,
          rule: rule.label,
          source:
            ruleSourceColumns[rule.source as keyof typeof ruleSourceColumns],
          isActive: brandKitValues.activeRuleIds.includes(rule.id),
        })),
      );

      await tx
        .delete(brandRestrictions)
        .where(eq(brandRestrictions.brandKitId, brandKitId));

      const restrictions = [
        ...brandKitValues.avoidedColors.map((color) => ({
          kind: "cor" as const,
          value: color.hex.toUpperCase(),
        })),
        ...brandKitValues.avoidedElements.map((value) => ({
          kind: "elemento" as const,
          value,
        })),
        ...brandKitValues.avoidedStyles.map((value) => ({
          kind: "estilo" as const,
          value,
        })),
      ];

      if (restrictions.length > 0) {
        await tx
          .insert(brandRestrictions)
          .values(
            restrictions.map((restriction) => ({ brandKitId, ...restriction })),
          );
      }
    });
  } catch (error) {
    console.error("[brand] falha ao salvar brand kit", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess(undefined);
}
