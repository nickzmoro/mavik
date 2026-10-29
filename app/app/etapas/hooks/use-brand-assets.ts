import { useState } from "react";

import {
  isPostExampleKind,
  uploadBrandAssetSchema,
  type BrandAssetKind,
} from "@/actions/upload-brand-asset/schema";
import { useDeleteBrandAsset } from "@/hooks/mutations/use-delete-brand-asset";
import { useUploadBrandAsset } from "@/hooks/mutations/use-upload-brand-asset";
import { connectionFailure } from "@/lib/auth-action-result";
import { analyzeLogo, type CheckStatus } from "@/lib/onboarding/analyze-logo";
import { MAX_POST_EXAMPLES } from "@/lib/onboarding/constants";
import type {
  PostExample,
  UploadedBrandAsset,
} from "@/lib/onboarding/get-step-data";

export type BrandAssetItem = {
  id: string;
  url: string;
  fileName: string;
  checks: Record<string, CheckStatus>;
};

export type BrandAssetsState = Partial<Record<BrandAssetKind, BrandAssetItem[]>>;

type AssetResult =
  | { isSuccess: true; item: BrandAssetItem }
  | { isSuccess: false; error: string };

const logoKinds = ["logo_claro", "logo_escuro", "simbolo"] as const;

type LogoKind = (typeof logoKinds)[number];

const isLogoKind = (kind: BrandAssetKind): kind is LogoKind =>
  logoKinds.some((logoKind) => logoKind === kind);

export function toInitialBrandAssets(
  uploadedAssets: Partial<Record<BrandAssetKind, UploadedBrandAsset>> = {},
  postExamples: PostExample[] = [],
): BrandAssetsState {
  const initialAssets: BrandAssetsState = {};

  Object.entries(uploadedAssets).forEach(([kind, asset]) => {
    initialAssets[kind as BrandAssetKind] = [
      {
        id: asset.id,
        url: asset.url,
        fileName: asset.fileName,
        checks: asset.checks as Record<string, CheckStatus>,
      },
    ];
  });

  postExamples.forEach(({ id, kind, url, fileName }) => {
    initialAssets[kind] = [
      ...(initialAssets[kind] ?? []),
      { id, url, fileName, checks: {} },
    ];
  });

  return initialAssets;
}

export function useBrandAssets(initialAssets: BrandAssetsState) {
  const [assets, setAssets] = useState(initialAssets);
  const [pendingKinds, setPendingKinds] = useState<BrandAssetKind[]>([]);
  const uploadMutation = useUploadBrandAsset();
  const deleteMutation = useDeleteBrandAsset();

  const setKindPending = (kind: BrandAssetKind, isPending: boolean) =>
    setPendingKinds((currentKinds) =>
      isPending
        ? [...currentKinds, kind]
        : currentKinds.filter((pendingKind) => pendingKind !== kind),
    );

  const uploadAsset = async (
    kind: BrandAssetKind,
    file: File,
  ): Promise<AssetResult> => {
    const validation = uploadBrandAssetSchema.safeParse({
      kind,
      file,
      isGenerated: false,
      checks: {},
    });

    if (!validation.success) {
      return { isSuccess: false, error: validation.error.issues[0].message };
    }

    if (
      isPostExampleKind(kind) &&
      (assets[kind]?.length ?? 0) >= MAX_POST_EXAMPLES
    ) {
      return {
        isSuccess: false,
        error: `Envie até ${MAX_POST_EXAMPLES} exemplos por tipo.`,
      };
    }

    setKindPending(kind, true);

    try {
      const analysis = isLogoKind(kind)
        ? await analyzeLogo(file, kind).catch(() => null)
        : null;
      const checks = analysis?.checks ?? {};

      const result = await uploadMutation
        .mutateAsync({
          kind,
          file,
          isGenerated: false,
          width: analysis?.width || undefined,
          height: analysis?.height || undefined,
          checks,
        })
        .catch(connectionFailure);

      if (!result.isSuccess) {
        return { isSuccess: false, error: result.errorMessage };
      }

      const item: BrandAssetItem = {
        id: result.data.id,
        url: result.data.url,
        fileName: result.data.fileName,
        checks,
      };

      setAssets((currentAssets) => ({
        ...currentAssets,
        [kind]: isPostExampleKind(kind)
          ? [...(currentAssets[kind] ?? []), item]
          : [item],
      }));

      return { isSuccess: true, item };
    } finally {
      setKindPending(kind, false);
    }
  };

  const removeAsset = async (
    kind: BrandAssetKind,
    assetId: string,
  ): Promise<{ isSuccess: true } | { isSuccess: false; error: string }> => {
    const result = await deleteMutation
      .mutateAsync({ assetId })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      return { isSuccess: false, error: result.errorMessage };
    }

    setAssets((currentAssets) => ({
      ...currentAssets,
      [kind]: (currentAssets[kind] ?? []).filter(({ id }) => id !== assetId),
    }));

    return { isSuccess: true };
  };

  return { assets, pendingKinds, uploadAsset, removeAsset };
}

export type BrandAssetsController = ReturnType<typeof useBrandAssets>;
