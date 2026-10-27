"use client";

import { CircleAlert, Upload } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { useUploadBrandAsset } from "@/hooks/mutations/use-upload-brand-asset";
import { connectionFailure } from "@/lib/auth-action-result";
import { cn } from "@/lib/utils";

export function ManualUpload({
  uploadedFileName,
}: {
  uploadedFileName?: string;
}) {
  const inputId = useId();
  const uploadMutation = useUploadBrandAsset();
  const [fileName, setFileName] = useState(uploadedFileName);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);

  const uploadManual = async (file?: File) => {
    if (!file) {
      return;
    }

    setErrorMessage(undefined);
    const result = await uploadMutation
      .mutateAsync({ kind: "manual", file, isGenerated: false, checks: {} })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      setErrorMessage(result.errorMessage);
      return;
    }

    setFileName(result.data.fileName);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        uploadManual(event.dataTransfer.files[0]);
      }}
      className={cn(
        "flex flex-col gap-3 rounded-(--r-lg) border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between",
        isDragging ? "border-primary bg-surface-2" : "border-muted bg-bg",
      )}
    >
      <div className="flex items-start gap-3">
        <Upload
          size={20}
          aria-hidden="true"
          className="mt-0.5 flex-none text-primary"
        />
        <div>
          <p className="m-0 text-sm font-medium text-text">
            Arraste o manual da marca aqui
          </p>
          <p className="m-0 text-sm text-muted">
            PDF ou ZIP com logos, fontes e regras
          </p>
          {fileName && (
            <p className="m-0 mt-2 inline-flex items-center gap-1.5 rounded-full border border-success bg-success-bg px-2.5 py-0.5 text-xs font-medium text-text">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-success"
              />
              {fileName} · recebido
            </p>
          )}
          {fileName && (
            <p className="m-0 mt-2 text-xs text-muted">
              Guardamos seu manual. Na próxima arte, lemos as regras dele e
              criamos os posts seguindo o que ele diz.
            </p>
          )}
          {errorMessage && (
            <p role="alert" className="m-0 mt-2 flex gap-1.5 text-sm text-text">
              <CircleAlert
                size={16}
                aria-hidden="true"
                className="mt-0.5 flex-none text-danger"
              />
              {errorMessage}
            </p>
          )}
        </div>
      </div>
      <input
        id={inputId}
        type="file"
        accept=".pdf,.zip,application/pdf,application/zip"
        className="sr-only"
        onChange={(event) => {
          uploadManual(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <Button asChild variant="outline" size="sm">
        <label htmlFor={inputId} aria-disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? "Enviando..." : "Escolher arquivo"}
        </label>
      </Button>
    </div>
  );
}
