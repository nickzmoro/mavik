"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormControl, useFormField } from "@/components/ui/form";
import { readFileAsDataUrl } from "@/lib/read-file-as-data-url";
import { REFERENCE_IMAGE_TYPES } from "@/lib/validations/image-generation";

type ReferenceImagePickerProps = {
  file?: File;
  onFileChange: (file?: File) => void;
  disabled?: boolean;
};

export function ReferenceImagePicker({
  file,
  onFileChange,
  disabled,
}: ReferenceImagePickerProps) {
  const { formItemId } = useFormField();
  const [previewUrl, setPreviewUrl] = useState<string>();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    onFileChange(selectedFile);
    setPreviewUrl(await readFileAsDataUrl(selectedFile).catch(() => undefined));
  };

  const handleRemove = () => {
    onFileChange(undefined);
    setPreviewUrl(undefined);
  };

  return (
    <div>
      <FormControl>
        <input
          type="file"
          accept={REFERENCE_IMAGE_TYPES.join(",")}
          className="peer sr-only"
          disabled={disabled}
          onChange={handleFileSelect}
        />
      </FormControl>

      {file ? (
        <div className="flex items-center gap-3 rounded-(--r-md) border border-border bg-surface p-3">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Prévia da foto de referência"
              width={56}
              height={56}
              unoptimized
              className="size-14 flex-none rounded-(--r-sm) object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-sm leading-normal font-medium text-text">
              {file.name}
            </p>
            <label
              htmlFor={formItemId}
              className="cursor-pointer text-sm leading-normal text-primary underline underline-offset-4"
            >
              Trocar foto
            </label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remover foto"
            disabled={disabled}
            onClick={handleRemove}
          >
            <X size={18} aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={formItemId}
          className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-(--r-md) border border-dashed border-muted bg-surface px-4 py-5 text-center transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-disabled:cursor-not-allowed peer-disabled:opacity-50 hover:border-primary hover:bg-surface-2 motion-reduce:transition-none"
        >
          <ImagePlus size={20} aria-hidden="true" className="text-primary" />
          <span className="text-sm leading-normal font-medium text-text">
            Envie uma foto de referência
          </span>
          <span className="text-xs leading-[1.4] text-muted">
            PNG, JPG ou WEBP até 4 MB
          </span>
        </label>
      )}
    </div>
  );
}
