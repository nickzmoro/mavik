"use client";

import { Check, LoaderCircle, Trash2, Upload } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { BrandAssetItem } from "../hooks/use-brand-assets";

type LogoUploadTileProps = {
  title: string;
  requirement: "Obrigatório" | "Recomendado";
  emptyLabel: string;
  accept: string;
  previewClassName: string;
  asset: BrandAssetItem | undefined;
  isUploading: boolean;
  onSelectFile: (file: File) => void;
  onRemove: () => void;
};

export function LogoUploadTile({
  title,
  requirement,
  emptyLabel,
  accept,
  previewClassName,
  asset,
  isUploading,
  onSelectFile,
  onRemove,
}: LogoUploadTileProps) {
  return (
    <div className="tile flex flex-col overflow-hidden rounded-(--r-lg)">
      <div
        className={cn(
          "relative flex h-32 items-center justify-center border-b border-border",
          previewClassName,
        )}
      >
        {asset ? (
          <Image
            unoptimized
            fill
            src={asset.url}
            alt={`Prévia: ${title}`}
            sizes="(min-width: 768px) 240px, 100vw"
            className="object-contain p-4"
          />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-center text-sm text-muted">
            <Upload aria-hidden="true" className="size-5.5" />
            {emptyLabel}
          </span>
        )}
        {isUploading ? (
          <span
            role="status"
            className="absolute inset-0 flex items-center justify-center gap-2 bg-bg/80 text-sm font-medium text-text"
          >
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
            Verificando a logo…
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col items-start gap-2 p-4">
        <b className="font-display text-sm font-semibold">{title}</b>
        <Badge
          variant={requirement === "Obrigatório" ? "secondary" : "warning"}
        >
          {requirement}
        </Badge>
        {asset ? (
          <span className="flex max-w-full items-center gap-1.5 text-sm text-success">
            <Check aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{asset.fileName}</span>
          </span>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-2">
          <FileUploadButton
            accept={accept}
            variant="outline"
            size="sm"
            disabled={isUploading}
            onFileSelected={onSelectFile}
          >
            {asset ? "Trocar arquivo" : "Enviar arquivo"}
          </FileUploadButton>
          {asset ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isUploading}
              onClick={onRemove}
            >
              <Trash2 aria-hidden="true" className="size-4" />
              Remover
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
