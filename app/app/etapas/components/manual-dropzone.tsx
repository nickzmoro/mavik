"use client";

import { FileText, LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { BrandAssetItem } from "../hooks/use-brand-assets";

type ManualDropzoneProps = {
  asset: BrandAssetItem | undefined;
  busyLabel: string | null;
  onSelectFile: (file: File) => void;
};

export function ManualDropzone({
  asset,
  busyLabel,
  onSelectFile,
}: ManualDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const isBusy = busyLabel !== null;

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const [droppedFile] = Array.from(event.dataTransfer.files);

    if (droppedFile && !isBusy) {
      onSelectFile(droppedFile);
    }
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "dropzone flex flex-wrap items-center gap-4 rounded-(--r-lg) p-5 transition-colors duration-150 motion-reduce:transition-none",
        isDragging && "border-primary bg-brand-selected",
      )}
    >
      {isBusy ? (
        <LoaderCircle
          aria-hidden="true"
          className="size-6 shrink-0 animate-spin text-primary motion-reduce:animate-none"
        />
      ) : asset ? (
        <FileText aria-hidden="true" className="size-6 shrink-0 text-primary" />
      ) : (
        <Upload aria-hidden="true" className="size-6 shrink-0 text-primary" />
      )}
      <span
        role="status"
        className="flex min-w-0 flex-1 basis-56 flex-col gap-0.5 text-sm text-muted"
      >
        <b className="text-[15px] font-semibold text-text">
          {busyLabel ?? "Arraste o manual da marca aqui"}
        </b>
        {isBusy
          ? "Isso leva alguns segundos."
          : "PDF ou ZIP com logos, fontes e regras. O PDF é lido para preencher os campos."}
      </span>
      {asset && !isBusy ? (
        <Badge variant="success" className="max-w-full">
          <span className="truncate">{asset.fileName}</span>
        </Badge>
      ) : null}
      <FileUploadButton
        accept="application/pdf,application/zip,.pdf,.zip"
        variant="outline"
        size="sm"
        disabled={isBusy}
        onFileSelected={onSelectFile}
      >
        {asset ? "Trocar arquivo" : "Escolher arquivo"}
      </FileUploadButton>
    </div>
  );
}
