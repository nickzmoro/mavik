import { Plus, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  legibilitySample,
  type BrandFont,
  type FontRole,
} from "@/lib/mocks/brand";

import { BrandCard, BrandSmallText } from "./brand-card";

const legibilitySizes = [12, 14, 16];

type FontCardProps = {
  font: BrandFont;
};

function FontCard({ font }: FontCardProps) {
  return (
    <div className="brand-tile flex min-w-0 flex-col gap-2.5 rounded-[18px] p-5">
      <div className="flex items-start justify-between gap-4">
        <BrandSmallText>{font.role}</BrandSmallText>
        <Badge variant={font.isRequired ? "secondary" : "outline"}>
          {font.isRequired ? "Obrigatório" : "Opcional"}
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
        <Badge variant="success">Licença confirmada</Badge>
        <Badge variant="success">Acentos ok</Badge>
      </div>
    </div>
  );
}

type FontsTabProps = {
  fonts: BrandFont[];
  onUploadFont: (role: FontRole) => void;
};

export function FontsTab({ fonts, onUploadFont }: FontsTabProps) {
  const titleFont = fonts.find((font) => font.role === "Títulos");
  const bodyFont = fonts.find((font) => font.role === "Parágrafos");
  const highlightFont = fonts.find((font) => font.role === "Destaque");
  const orderedFonts = [titleFont, bodyFont].filter((font): font is BrandFont =>
    Boolean(font),
  );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="fonts-title"
        title="Fontes"
        hint=".ttf, .otf, .woff2 ou Google Fonts. Você confirma a licença de uso no envio."
        action={
          <Button variant="outline" onClick={() => onUploadFont("Títulos")}>
            <Upload aria-hidden="true" className="size-4.5" />
            Enviar fonte
          </Button>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(210px,100%),1fr))] gap-4">
          {orderedFonts.map((font) => (
            <FontCard key={font.role} font={font} />
          ))}
          {highlightFont ? (
            <FontCard font={highlightFont} />
          ) : (
            <div className="brand-tile flex min-w-0 flex-col items-start justify-center gap-2.5 rounded-[18px] border-dashed border-muted p-5">
              <div className="flex w-full items-start justify-between gap-4">
                <BrandSmallText>Destaque</BrandSmallText>
                <Badge variant="outline">Opcional</Badge>
              </div>
              <b className="text-base font-semibold">
                Falta a fonte de destaque
              </b>
              <BrandSmallText>
                Para selos, preços e chamadas. Limite de uma fonte extra.
              </BrandSmallText>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onUploadFont("Destaque")}
              >
                <Plus aria-hidden="true" className="size-4" />
                Adicionar fonte
              </Button>
            </div>
          )}
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
