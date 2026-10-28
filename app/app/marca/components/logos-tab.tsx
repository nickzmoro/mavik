"use client";

import { Check, Upload } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/download-file";
import {
  logoValidationChecks,
  mockBrandInitials,
  mockLogoSlots,
  type LogoSlot,
  type LogoSlotId,
} from "@/lib/mocks/brand";

import type { UploadedFile } from "../hooks/use-brand-kit";
import { BrandCard } from "./brand-card";
import { BrandMark } from "./brand-mark";

const logoAccept = "image/svg+xml,image/png";

const requirementBadgeVariants = {
  Obrigatório: "secondary",
  Recomendado: "warning",
  Opcional: "outline",
} as const;

const buildMarkSvg = (background: string, color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><rect width="1024" height="1024" rx="224" fill="${background}"/><text x="512" y="512" dominant-baseline="central" text-anchor="middle" font-family="DM Serif Display, Georgia, serif" font-size="440" fill="${color}">${mockBrandInitials}</text></svg>`;

const downloadSvg = (fileName: string, svg: string) =>
  downloadFile(fileName, new Blob([svg], { type: "image/svg+xml" }));

type LogoTileProps = {
  slot: LogoSlot;
  uploadedLogo?: UploadedFile;
  onUpload: (file: File) => void;
};

function LogoTile({ slot, uploadedLogo, onUpload }: LogoTileProps) {
  const handleDownload = () => {
    if (uploadedLogo) {
      downloadFile(uploadedLogo.fileName, uploadedLogo.url);
      return;
    }

    if (slot.isGenerated) {
      downloadSvg(
        "logo-monocromatica-clara.svg",
        buildMarkSvg("transparent", "#FFFFFF"),
      );
      downloadSvg(
        "logo-monocromatica-escura.svg",
        buildMarkSvg("transparent", "#1B1530"),
      );
      return;
    }

    downloadSvg(
      `logo-${slot.id}.svg`,
      buildMarkSvg(slot.markBackground, slot.markColor),
    );
  };

  return (
    <div className="brand-tile flex flex-col overflow-hidden rounded-[18px]">
      <div
        className="flex h-30 items-center justify-center gap-4 border-b border-brand-tile-border p-3"
        style={{ background: slot.previewBackground }}
      >
        {uploadedLogo ? (
          <span className="relative size-full">
            <Image
              src={uploadedLogo.url}
              alt={`${slot.title} enviada`}
              fill
              unoptimized
              sizes="320px"
              className="object-contain"
            />
          </span>
        ) : slot.isGenerated ? (
          <>
            <BrandMark size="md" background="transparent" color="#FFFFFF" />
            <BrandMark size="md" background="transparent" color="#1B1530" />
          </>
        ) : (
          <BrandMark
            size={slot.markSize === "lg" ? "lg" : "sm"}
            background={slot.markBackground}
            color={slot.markColor}
          />
        )}
      </div>
      <div className="flex flex-col items-start gap-2 px-4 py-3.5 text-sm">
        <b className="text-[15px] font-semibold">{slot.title}</b>
        <Badge variant={requirementBadgeVariants[slot.requirement]}>
          {slot.requirement}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
          <Check
            aria-hidden="true"
            className="size-3.5 text-success"
            strokeWidth={2.5}
          />
          {uploadedLogo
            ? `Enviada · ${uploadedLogo.isSvg ? "SVG" : "PNG"}`
            : slot.status}
        </span>
        <div className="-ml-2 flex flex-wrap gap-1">
          {slot.isGenerated ? null : (
            <FileUploadButton
              accept={logoAccept}
              variant="ghost"
              size="sm"
              onFileSelected={onUpload}
            >
              Substituir
            </FileUploadButton>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            {slot.isGenerated ? "Baixar" : "Baixar original"}
          </Button>
        </div>
      </div>
    </div>
  );
}

type LogosTabProps = {
  uploadedLogos: Partial<Record<LogoSlotId, UploadedFile>>;
  onUploadLogo: (slotId: LogoSlotId, file: File) => void;
};

export function LogosTab({ uploadedLogos, onUploadLogo }: LogosTabProps) {
  const mainLogo = uploadedLogos.light;
  const validationChecks = [
    {
      label: "Formato",
      detail: mainLogo && !mainLogo.isSvg ? "PNG aceito" : "SVG aceito",
    },
    ...logoValidationChecks,
  ];

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="logos-title"
        title="Logos"
        hint="SVG (ideal) ou PNG transparente, com pelo menos 1000 px. O arquivo original é sempre guardado."
        action={
          <FileUploadButton
            accept={logoAccept}
            variant="outline"
            onFileSelected={(file) => onUploadLogo("light", file)}
          >
            <Upload aria-hidden="true" className="size-4.5" />
            Enviar nova logo
          </FileUploadButton>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mockLogoSlots.map((slot) => (
            <LogoTile
              key={slot.id}
              slot={slot}
              uploadedLogo={uploadedLogos[slot.id]}
              onUpload={(file) => onUploadLogo(slot.id, file)}
            />
          ))}
        </div>
      </BrandCard>

      <BrandCard
        titleId="validation-title"
        title="Validação automática"
        hint="Conferido antes de gerar qualquer arte."
        action={<Badge variant="success">Tudo certo</Badge>}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(190px,100%),1fr))] gap-2.5">
          {validationChecks.map((check) => (
            <div
              key={check.label}
              className="brand-tile flex items-center gap-3 rounded-[18px] px-3.5 py-3 text-sm"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-on-primary">
                <Check
                  aria-hidden="true"
                  className="size-3.5"
                  strokeWidth={3}
                />
              </span>
              <span>
                {check.label}
                <small className="block text-xs text-muted">
                  {check.detail}
                </small>
              </span>
            </div>
          ))}
        </div>
      </BrandCard>
    </div>
  );
}
