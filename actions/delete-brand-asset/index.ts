"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { brandAssets } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { BRAND_ASSETS_BUCKET } from "@/lib/onboarding/brand-assets";
import {
  getCurrentBrandKit,
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { deleteBrandAssetSchema, type DeleteBrandAssetInput } from "./schema";

export async function deleteBrandAsset(
  input: DeleteBrandAssetInput,
): Promise<AuthActionResult> {
  const parsedInput = deleteBrandAssetSchema.safeParse(input);

  if (!parsedInput.success) {
    return validationFailure(parsedInput.error);
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return authFailure(onboardingErrorMessages.sessionExpired);
  }

  const store = await getOwnedStore(userId);
  const brandKit = store ? await getCurrentBrandKit(store.id) : null;

  if (!brandKit) {
    return authFailure(onboardingErrorMessages.storeMissing);
  }

  try {
    const [deletedAsset] = await db
      .delete(brandAssets)
      .where(
        and(
          eq(brandAssets.id, parsedInput.data.assetId),
          eq(brandAssets.brandKitId, brandKit.id),
        ),
      )
      .returning({ storagePath: brandAssets.storagePath });

    if (deletedAsset) {
      const supabase = await createSupabaseServerClient();
      await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .remove([deletedAsset.storagePath]);
    }
  } catch (error) {
    console.error("[onboarding] falha ao remover arquivo da marca", error);
    return authFailure(onboardingErrorMessages.saveFailed);
  }

  return authSuccess(undefined);
}
