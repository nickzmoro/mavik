import { Plus, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  fontRoles,
  legibilitySample,
  type BrandFont,
  type FontRole,
} from "@/lib/mocks/brand";

import { BrandCard, BrandSmallText } from "./brand-card";

const legibilitySizes = [12, 14, 16];

const fontRoleHints: Record<FontRole, string> = {
  Títulos: "Para títulos e chamadas principais das artes.",
  Parágrafos: "Para textos de apoio e legendas.",
  Destaque: "Para selos, preços e chamadas. Limite de uma fonte extra.",
};

type FontCardProps = {
  font: BrandFont;
  onReplace: () => void;
  onRemove: () => void;
};

function FontCard({ font, onReplace, onRemove }: FontCardProps) {
  return (
    <div className="brand-tile flex min-w-0 flex-col gap-2.5 rounded-[18px] p-5">
      <div className="flex items-start justify-between gap-4">
        <BrandSmallText>{font.role}</BrandSmallText>
        <Badge variant={font.isDefault ? "outline" : "secondary"}>
          {font.isDefault ? "Padrão" : "Sua fonte"}
        </Badge>
      </div>
      <span
        className="text-[52px] leading-[1.05]"
        style={{ fontFamily: font.family }}
      >
        Aa
      </span>
      <span
        className={
          font.role === "Parágrafos"
            ? "text-[17px] leading-[1.3]"
            : "text-[22px] leading-[1.3]"
        }
        style={{ fontFamily: font.family }}
      >
        {font.sample}
      </span>
      <b className="text-[15px] font-semibold wrap-break-word">
        {font.displayName}
      </b>
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="success">
          {font.isDefault ? "Uso livre" : "Licença confirmada"}
        </Badge>
        <Badge variant="success">Acentos ok</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={onReplace}>
          Substituir
        </Button>
        {font.isDefault ? null : (
          <Button variant="outline" size="sm" onClick={onRemove}>
            {font.role === "Destaque" ? "Remover" : "Voltar ao padrão"}
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyFontSlot({
  role,
  onAdd,
}: {
  role: FontRole;
  onAdd: () => void;
}) {
  return (
    <div className="brand-tile flex min-w-0 flex-col items-start justify-center gap-2.5 rounded-[18px] border-dashed border-muted p-5">
      <div className="flex w-full items-start justify-between gap-4">
        <BrandSmallText>{role}</BrandSmallText>
        <Badge variant="outline">
          {role === "Destaque" ? "Opcional" : "Obrigatório"}
        </Badge>
      </div>
      <b className="text-base font-semibold">Nenhuma fonte enviada</b>
      <BrandSmallText>{fontRoleHints[role]}</BrandSmallText>
      <Button variant="secondary" size="sm" onClick={onAdd}>
        <Plus aria-hidden="true" className="size-4" />
        Adicionar fonte
      </Button>
    </div>
  );
}

type FontsTabProps = {
  fonts: BrandFont[];
  onUploadFont: (role: FontRole) => void;
  onRemoveFont: (role: FontRole) => void;
};

export function FontsTab({ fonts, onUploadFont, onRemoveFont }: FontsTabProps) {
  const titleFont = fonts.find((font) => font.role === "Títulos");
  const bodyFont = fonts.find((font) => font.role === "Parágrafos");
  const nextMissingRole =
    fontRoles.find((role) => !fonts.some((font) => font.role === role)) ??
    "Títulos";

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="fonts-title"
        title="Fontes"
        hint=".ttf, .otf, .woff2 ou Google Fonts. Você confirma a licença de uso no envio."
        action={
          <Button variant="outline" onClick={() => onUploadFont(nextMissingRole)}>
            <Upload aria-hidden="true" className="size-4.5" />
            Enviar fonte
          </Button>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(210px,100%),1fr))] gap-4">
          {fontRoles.map((role) => {
            const font = fonts.find((currentFont) => currentFont.role === role);

            return font ? (
              <FontCard
                key={role}
                font={font}
                onReplace={() => onUploadFont(role)}
                onRemove={() => onRemoveFont(role)}
              />
            ) : (
              <EmptyFontSlot
                key={role}
                role={role}
                onAdd={() => onUploadFont(role)}
              />
            );
          })}
        </div>
      </BrandCard>

      <BrandCard
        titleId="legibility-title"
        title="Teste de legibilidade"
        hint="Acentos do português e tamanhos pequenos."
        action={<Badge variant="success">Legível em tamanho pequeno</Badge>}
      >
        <div className="flex flex-col gap-2">
          {legibilitySizes.map((size) => (
            <div key={size} className="flex items-baseline gap-4">
              <span className="w-11 shrink-0 text-xs text-muted">
                {size} px
              </span>
              <span
                className="min-w-0"
                style={{ fontSize: size, fontFamily: bodyFont?.family }}
              >
                {legibilitySample}
              </span>
            </div>
          ))}
          <div className="flex items-baseline gap-4">
            <span className="w-11 shrink-0 text-xs text-muted">32 px</span>
            <span
              className="min-w-0 text-[32px] leading-tight"
              style={{ fontFamily: titleFont?.family }}
            >
              Ção, ã, é, ô
            </span>
          </div>
        </div>
      </BrandCard>
    </div>
  );
}
