"use client";

import { Check, Upload } from "lucide-react";
import Image from "next/image";

import { FileUploadButton } from "@/components/common/file-upload-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadFile } from "@/lib/download-file";
import {
  logoValidationChecks,
  mockLogoSlots,
  type LogoSlot,
  type LogoSlotId,
} from "@/lib/mocks/brand";

import type { UploadedFile } from "../hooks/use-brand-kit";
import { BrandCard, BrandSmallText } from "./brand-card";

const logoAccept = "image/svg+xml,image/png";

const requirementBadgeVariants = {
  Obrigatório: "secondary",
  Recomendado: "warning",
  Opcional: "outline",
} as const;

const monochromeFilters = ["brightness(0) invert(1)", "brightness(0)"];

function LogoImage({
  logo,
  alt,
  filter,
}: {
  logo: UploadedFile;
  alt: string;
  filter?: string;
}) {
  return (
    <span className="relative size-full">
      <Image
        src={logo.url}
        alt={alt}
        fill
        unoptimized
        sizes="320px"
        className="object-contain"
        style={filter ? { filter } : undefined}
      />
    </span>
  );
}

const getLogoStatus = (
  slot: LogoSlot,
  logo: UploadedFile | undefined,
  mainLogo: UploadedFile | undefined,
) => {
  if (slot.isGenerated) {
    return mainLogo
      ? "Geradas automaticamente"
      : "Envie a logo para fundo claro para gerar";
  }

  return logo ? `Enviada · ${logo.isSvg ? "SVG" : "PNG"}` : "Ainda não enviada";
};

type LogoTileProps = {
  slot: LogoSlot;
  uploadedLogo?: UploadedFile;
  mainLogo?: UploadedFile;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

function LogoTile({
  slot,
  uploadedLogo,
  mainLogo,
  onUpload,
  onRemove,
}: LogoTileProps) {
  const previewLogo = slot.isGenerated ? mainLogo : uploadedLogo;

  return (
    <div className="brand-tile flex flex-col overflow-hidden rounded-[18px]">
      <div
        className="flex h-30 items-center justify-center gap-4 border-b border-brand-tile-border p-3"
        style={{ background: previewLogo ? slot.previewBackground : undefined }}
      >
        {previewLogo && slot.isGenerated
          ? monochromeFilters.map((filter) => (
              <LogoImage
                key={filter}
                logo={previewLogo}
                alt={`${slot.title} gerada`}
                filter={filter}
              />
            ))
          : null}
        {previewLogo && !slot.isGenerated ? (
          <LogoImage logo={previewLogo} alt={`${slot.title} enviada`} />
        ) : null}
        {previewLogo ? null : (
          <span className="flex size-full items-center justify-center rounded-(--r-md) border-[1.5px] border-dashed border-muted text-[13px] text-muted">
            Nenhuma logo
          </span>
        )}
      </div>
      <div className="flex flex-col items-start gap-2 px-4 py-3.5 text-sm">
        <b className="text-[15px] font-semibold">{slot.title}</b>
        <Badge variant={requirementBadgeVariants[slot.requirement]}>
          {slot.requirement}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-[13px] text-muted">
          {previewLogo ? (
            <Check
              aria-hidden="true"
              className="size-3.5 text-success"
              strokeWidth={2.5}
            />
          ) : null}
          {getLogoStatus(slot, uploadedLogo, mainLogo)}
        </span>
        {slot.isGenerated ? null : (
          <div className="flex flex-wrap gap-2">
            <FileUploadButton
              accept={logoAccept}
              variant="outline"
              size="sm"
              onFileSelected={onUpload}
            >
              {uploadedLogo ? "Substituir" : "Enviar"}
            </FileUploadButton>
            {uploadedLogo ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    downloadFile(uploadedLogo.fileName, uploadedLogo.url)
                  }
                >
                  Baixar original
                </Button>
                <Button variant="outline" size="sm" onClick={onRemove}>
                  Remover
                </Button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

type LogosTabProps = {
  uploadedLogos: Partial<Record<LogoSlotId, UploadedFile>>;
  onUploadLogo: (slotId: LogoSlotId, file: File) => void;
  onRemoveLogo: (slotId: LogoSlotId) => void;
};

export function LogosTab({
  uploadedLogos,
  onUploadLogo,
  onRemoveLogo,
}: LogosTabProps) {
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
              mainLogo={mainLogo}
              onUpload={(file) => onUploadLogo(slot.id, file)}
              onRemove={() => onRemoveLogo(slot.id)}
            />
          ))}
        </div>
      </BrandCard>

      <BrandCard
        titleId="validation-title"
        title="Validação automática"
        hint="Conferido antes de gerar qualquer arte."
        action={
          mainLogo ? (
            <Badge variant="success">Tudo certo</Badge>
          ) : (
            <Badge variant="outline">Aguardando logo</Badge>
          )
        }
      >
        {mainLogo ? (
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
        ) : (
          <BrandSmallText>
            Envie a logo para fundo claro para validarmos o arquivo.
          </BrandSmallText>
        )}
      </BrandCard>
    </div>
  );
}
