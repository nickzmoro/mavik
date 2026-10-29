"use client";

import { Ban, Heart, X } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { MAX_POST_EXAMPLES, POST_EXAMPLE_MIME_TYPES } from "@/lib/onboarding/constants";

import type { BrandAssetItem } from "../hooks/use-brand-assets";

const tileVariants = {
  positive: { icon: Heart, iconClassName: "text-success" },
  negative: { icon: Ban, iconClassName: "text-danger" },
};

type ExampleUploadTileProps = {
  title: string;
  variant: keyof typeof tileVariants;
  assets: BrandAssetItem[];
  isUploading: boolean;
  onSelectFile: (file: File) => void;
  onRemoveAsset: (assetId: string) => void;
};

export function ExampleUploadTile({
  title,
  variant,
  assets,
  isUploading,
  onSelectFile,
  onRemoveAsset,
}: ExampleUploadTileProps) {
  const { icon: TileIcon, iconClassName } = tileVariants[variant];

  return (
    <div className="dropzone flex flex-col gap-3 rounded-(--r-lg) p-4">
      <div className="flex flex-wrap items-center gap-3">
        <TileIcon
          aria-hidden="true"
          className={`size-5.5 shrink-0 ${iconClassName}`}
        />
        <span className="flex min-w-0 flex-1 basis-32 flex-col text-sm text-muted">
          <b className="font-display text-[15px] font-semibold text-text">
            {title}
          </b>
          PNG, JPG ou WebP · até {MAX_POST_EXAMPLES}
        </span>
        <FileUploadButton
          accept={POST_EXAMPLE_MIME_TYPES.join(",")}
          variant="outline"
          size="sm"
          disabled={isUploading || assets.length >= MAX_POST_EXAMPLES}
          loading={isUploading}
          onFileSelected={onSelectFile}
        >
          Enviar
        </FileUploadButton>
      </div>
      {assets.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {assets.map(({ id, fileName, url }) => (
            <li
              key={id}
              className="relative size-16 overflow-hidden rounded-(--r-md) border border-border"
            >
              <Image
                unoptimized
                fill
                src={url}
                alt={fileName}
                sizes="64px"
                className="object-cover"
              />
              <button
                type="button"
                aria-label={`Remover ${fileName}`}
                onClick={() => onRemoveAsset(id)}
                className="absolute top-0.5 right-0.5 flex size-5 cursor-pointer items-center justify-center rounded-full border-0 bg-black/65 p-0 text-white focus-visible:outline-2 focus-visible:outline-focus"
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
