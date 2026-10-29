"use client";

import { Check, CircleAlert, TriangleAlert, Upload } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";

import type { BrandAssetKind } from "@/actions/upload-brand-asset/schema";
import { RequirementBadge } from "@/components/onboarding/requirement-badge";
import { Button } from "@/components/ui/button";
import { useUploadBrandAsset } from "@/hooks/mutations/use-upload-brand-asset";
import { connectionFailure } from "@/lib/auth-action-result";
import { LOGO_MIME_TYPES } from "@/lib/onboarding/constants";
import type { UploadedBrandAsset } from "@/lib/onboarding/get-step-data";
import {
  analyzeLogo,
  createWhiteLogo,
  type LogoAnalysis,
  type LogoBackground,
} from "@/lib/onboarding/logo-analysis";
import { cn } from "@/lib/utils";

type PendingLogo = {
  file: File;
  previewUrl: string;
  analysis: LogoAnalysis;
};

type LogoUploadCardProps = {
  kind: Exclude<BrandAssetKind, "manual">;
  title: string;
  helper: string;
  requirement: "obrigatorio" | "recomendado";
  background: LogoBackground;
  uploaded?: UploadedBrandAsset;
  onUploaded: (asset: UploadedBrandAsset, file: File) => void;
  onAnalyzed: (analysis: LogoAnalysis | null) => void;
  whiteVersionSource?: File;
};

export function LogoUploadCard({
  kind,
  title,
  helper,
  requirement,
  background,
  uploaded,
  onUploaded,
  onAnalyzed,
  whiteVersionSource,
}: LogoUploadCardProps) {
  const inputId = useId();
  const uploadMutation = useUploadBrandAsset();
  const [pendingLogo, setPendingLogo] = useState<PendingLogo>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isWorking, setIsWorking] = useState(false);

  const blockingMessage = pendingLogo
    ? Object.entries(pendingLogo.analysis.checks)
        .filter(([, status]) => status === "erro")
        .map(
          ([checkId]) =>
            pendingLogo.analysis.messages[
              checkId as keyof LogoAnalysis["messages"]
            ],
        )
        .find(Boolean)
    : undefined;
  const warningMessages = pendingLogo
    ? Object.values(pendingLogo.analysis.messages).filter(
        (message) => message && message !== blockingMessage,
      )
    : [];
  const hasContrastWarning = pendingLogo?.analysis.checks.contraste === "aviso";

  const upload = async (
    file: File,
    analysis: Pick<LogoAnalysis, "width" | "height" | "checks">,
    isGenerated: boolean,
  ) => {
    setErrorMessage(undefined);
    const result = await uploadMutation
      .mutateAsync({
        kind,
        file,
        isGenerated,
        width: analysis.width || undefined,
        height: analysis.height || undefined,
        checks: analysis.checks,
      })
      .catch(connectionFailure);

    if (!result.isSuccess) {
      setErrorMessage(result.errorMessage);
      return;
    }

    if (pendingLogo) {
      URL.revokeObjectURL(pendingLogo.previewUrl);
    }

    setPendingLogo(undefined);
    onUploaded(
      {
        id: result.data.id,
        url: result.data.url,
        fileName: result.data.fileName,
        isGenerated,
        checks: analysis.checks,
      },
      file,
    );
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsWorking(true);
    setErrorMessage(undefined);

    try {
      const analysis = await analyzeLogo(file, background);
      setPendingLogo({ file, previewUrl: URL.createObjectURL(file), analysis });
      onAnalyzed(analysis);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não conseguimos abrir essa imagem.",
      );
    } finally {
      setIsWorking(false);
    }
  };

  const handleUseWhiteVersion = async (sourceFile: File) => {
    setIsWorking(true);

    try {
      const whiteLogo = await createWhiteLogo(sourceFile);
      const analysis = await analyzeLogo(whiteLogo.file, background);
      await upload(whiteLogo.file, analysis, true);
    } catch {
      setErrorMessage(
        "Não conseguimos gerar a versão branca. Envie outra versão.",
      );
    } finally {
      setIsWorking(false);
    }
  };

  const previewUrl = pendingLogo?.previewUrl ?? uploaded?.url;
  const isBusy = isWorking || uploadMutation.isPending;

  return (
    <div className="flex flex-col overflow-hidden rounded-(--r-lg) border border-border bg-bg shadow-(--shadow-sm)">
      <div
        className={cn(
          "flex h-32 items-center justify-center p-4",
          background === "escuro" ? "bg-(--violet-900)" : "bg-white",
        )}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt={`Prévia: ${title}`}
            width={160}
            height={96}
            unoptimized
            className="max-h-24 w-auto max-w-full object-contain"
          />
        ) : (
          <label
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 text-center text-sm",
              background === "escuro" ? "text-white" : "text-muted",
            )}
          >
            <Upload size={20} aria-hidden="true" />
            SVG ou PNG transparente
          </label>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="m-0 text-sm font-semibold text-text">{title}</p>
        <RequirementBadge requirement={requirement} />
        <p className="m-0 text-xs leading-[1.4] text-muted">{helper}</p>

        {uploaded && !pendingLogo && (
          <p className="m-0 flex items-center gap-1.5 text-sm text-text">
            <Check size={16} aria-hidden="true" className="text-success" />
            {uploaded.isGenerated ? "Versão branca aprovada" : "Logo validada"}
          </p>
        )}

        {blockingMessage && (
          <p role="alert" className="m-0 flex gap-1.5 text-sm text-text">
            <CircleAlert
              size={16}
              aria-hidden="true"
              className="mt-0.5 flex-none text-danger"
            />
            {blockingMessage}
          </p>
        )}

        {warningMessages.map((message) => (
          <p key={message} className="m-0 flex gap-1.5 text-sm text-text">
            <TriangleAlert
              size={16}
              aria-hidden="true"
              className="mt-0.5 flex-none text-warning"
            />
            {message}
          </p>
        ))}

        {errorMessage && (
          <p role="alert" className="m-0 flex gap-1.5 text-sm text-text">
            <CircleAlert
              size={16}
              aria-hidden="true"
              className="mt-0.5 flex-none text-danger"
            />
            {errorMessage}
          </p>
        )}

        <input
          id={inputId}
          type="file"
          accept={LOGO_MIME_TYPES.join(",")}
          className="sr-only"
          disabled={isBusy}
          onChange={handleFileSelect}
        />

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {pendingLogo && !blockingMessage && (
            <Button
              type="button"
              size="sm"
              loading={isBusy && !hasContrastWarning}
              disabled={isBusy}
              onClick={() =>
                upload(pendingLogo.file, pendingLogo.analysis, false)
              }
            >
              Aprovar logo
            </Button>
          )}
          {hasContrastWarning && background === "escuro" && pendingLogo && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isBusy}
              onClick={() => handleUseWhiteVersion(pendingLogo.file)}
            >
              Usar versão branca
            </Button>
          )}
          {!uploaded && !pendingLogo && whiteVersionSource && (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              loading={isBusy}
              onClick={() => handleUseWhiteVersion(whiteVersionSource)}
            >
              Gerar versão branca
            </Button>
          )}
          <Button asChild size="sm" variant="outline">
            <label htmlFor={inputId} aria-disabled={isBusy}>
              {uploaded || pendingLogo ? "Enviar outra" : "Enviar arquivo"}
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
}
