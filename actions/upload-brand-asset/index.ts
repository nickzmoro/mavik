"use server";

import { createHash } from "node:crypto";

import { and, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { brandAssets } from "@/db/schema";
import {
  authFailure,
  authSuccess,
  type AuthActionResult,
} from "@/lib/auth-action-result";
import { validationFailure } from "@/lib/auth-error-messages";
import { onboardingErrorMessages } from "@/lib/onboarding/action-messages";
import { deleteManualRules } from "@/lib/brand/manual-guidelines";
import { BRAND_ASSETS_BUCKET } from "@/lib/onboarding/brand-assets";
import {
  getCurrentUserId,
  getOrCreateCurrentBrandKit,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { MAX_POST_EXAMPLES } from "@/lib/onboarding/constants";

import {
  allowsMultipleAssets,
  fromUploadBrandAssetFormData,
  getFileExtension,
  isPostExampleKind,
  uploadBrandAssetSchema,
} from "./schema";

const fileExtensions: Record<string, string> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};

const fontContentTypes: Record<string, string> = {
  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",
};

export async function uploadBrandAsset(
  formData: FormData,
): Promise<AuthActionResult<{ id: string; url: string; fileName: string }>> {
  const parsedInput = uploadBrandAssetSchema.safeParse(
    fromUploadBrandAssetFormData(formData),
  );

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

  const { kind, file, isGenerated, width, height, checks } = parsedInput.data;
  const supabase = await createSupabaseServerClient();
  const fileBytes = Buffer.from(await file.arrayBuffer());
  const sha256 = createHash("sha256").update(fileBytes).digest("hex");
  const isFont = kind === "fonte";
  const fileExtension = isFont
    ? getFileExtension(file.name)
    : fileExtensions[file.type];
  const contentType = isFont ? fontContentTypes[fileExtension] : file.type;
  const storagePath = `${store.id}/brand-kit/${kind}-${crypto.randomUUID()}.${fileExtension}`;

  try {
    const brandKit = await getOrCreateCurrentBrandKit(store.id, userId);

    if (!brandKit) {
      return authFailure(onboardingErrorMessages.uploadFailed);
    }

    const isPostExample = isPostExampleKind(kind);

    if (isPostExample) {
      const [{ total }] = await db
        .select({ total: count() })
        .from(brandAssets)
        .where(
          and(
            eq(brandAssets.brandKitId, brandKit.id),
            eq(brandAssets.kind, kind),
          ),
        );

      if (total >= MAX_POST_EXAMPLES) {
        return authFailure(
          `Você já enviou ${MAX_POST_EXAMPLES} exemplos. Remova um para enviar outro.`,
        );
      }
    }

    const { error: uploadError } = await supabase.storage
      .from(BRAND_ASSETS_BUCKET)
      .upload(storagePath, fileBytes, { contentType });

    if (uploadError) {
      console.error("[onboarding] falha no upload", uploadError.message);
      return authFailure(onboardingErrorMessages.uploadFailed);
    }

    const { previousAssets, assetId } = await db.transaction(async (tx) => {
      const deletedAssets = allowsMultipleAssets(kind)
        ? []
        : await tx
            .delete(brandAssets)
            .where(
              and(
                eq(brandAssets.brandKitId, brandKit.id),
                eq(brandAssets.kind, kind),
              ),
            )
            .returning({ storagePath: brandAssets.storagePath });

      const [insertedAsset] = await tx
        .insert(brandAssets)
        .values({
          brandKitId: brandKit.id,
          kind,
          storagePath,
          mimeType: contentType,
          width,
          height,
          isGenerated,
          status: "validado",
          validation: { checks, sha256 },
          label: file.name.slice(0, 120),
        })
        .returning({ id: brandAssets.id });

      return { previousAssets: deletedAssets, assetId: insertedAsset.id };
    });

    if (kind === "manual") {
      await deleteManualRules(brandKit.id);
    }

    if (previousAssets.length > 0) {
      await supabase.storage
        .from(BRAND_ASSETS_BUCKET)
        .remove(previousAssets.map((asset) => asset.storagePath));
    }

    const { data: signedUrl } = await supabase.storage
      .from(BRAND_ASSETS_BUCKET)
      .createSignedUrl(storagePath, 60 * 60);

    return authSuccess({
      id: assetId,
      url: signedUrl?.signedUrl ?? "",
      fileName: file.name,
    });
  } catch (error) {
    console.error("[onboarding] falha ao salvar arquivo da marca", error);
    return authFailure(onboardingErrorMessages.uploadFailed);
  }
}
