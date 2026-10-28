import Image from "next/image";

import { readableTextColor } from "@/lib/color";
import type { ColorRole } from "@/lib/onboarding/constants";

import { fontFamilyStyles } from "./font-options";

type BrandPreviewProps = {
  storeName: string;
  products: string[];
  colors: Record<ColorRole, string>;
  titleFont: string;
  bodyFont: string;
  lightLogoUrl?: string;
  darkLogoUrl?: string;
};

function LogoMark({
  logoUrl,
  storeName,
  backgroundHex,
}: {
  logoUrl?: string;
  storeName: string;
  backgroundHex: string;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={28}
        height={28}
        unoptimized
        className="size-7 object-contain"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-7 items-center justify-center rounded-full text-xs font-semibold"
      style={{
        backgroundColor: backgroundHex,
        color: readableTextColor(backgroundHex),
      }}
    >
      {storeName.charAt(0).toUpperCase()}
    </span>
  );
}

export function BrandPreview({
  storeName,
  products,
  colors,
  titleFont,
  bodyFont,
  lightLogoUrl,
  darkLogoUrl,
}: BrandPreviewProps) {
  const titleStyle = { fontFamily: fontFamilyStyles[titleFont] };
  const bodyStyle = { fontFamily: fontFamilyStyles[bodyFont] };
  const [firstProduct = "Seu serviço", secondProduct = firstProduct] = products;
  const tileClassName =
    "relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-(--r-md) p-3";

  return (
    <div
      aria-label="Prévia de posts com a sua marca"
      role="img"
      className="grid grid-cols-2 gap-3"
    >
      <div
        className={tileClassName}
        style={{ backgroundColor: colors.primaria }}
      >
        <p
          className="m-0 text-lg leading-tight"
          style={{ ...titleStyle, color: readableTextColor(colors.primaria) }}
        >
          Feito com cuidado de verdade
        </p>
        <div className="flex items-end justify-between gap-2">
          <span
            className="text-[11px] leading-tight"
            style={{ ...bodyStyle, color: readableTextColor(colors.primaria) }}
          >
            Agende seu horário
          </span>
          <LogoMark
            logoUrl={darkLogoUrl}
            storeName={storeName}
            backgroundHex={colors.fundo}
          />
        </div>
      </div>

      <div
        className={tileClassName}
        style={{
          backgroundColor: colors.fundo,
          border: `1px solid ${colors.secundaria}`,
        }}
      >
        <span
          className="h-1/3 rounded-(--r-sm)"
          style={{ backgroundColor: colors.secundaria }}
        />
        <p
          className="m-0 text-base leading-tight"
          style={{ ...titleStyle, color: colors.texto }}
        >
          {firstProduct}
        </p>
        <div className="flex items-end justify-between gap-2">
          <span
            className="rounded-(--r-sm) px-1.5 py-0.5 text-[10px] font-semibold"
            style={{
              ...bodyStyle,
              backgroundColor: colors.destaque,
              color: readableTextColor(colors.destaque),
            }}
          >
            [PREÇO]
          </span>
          <LogoMark
            logoUrl={lightLogoUrl}
            storeName={storeName}
            backgroundHex={colors.primaria}
          />
        </div>
      </div>

      <div className={tileClassName} style={{ backgroundColor: colors.texto }}>
        <span
          className="mx-auto mt-2 size-12 rounded-full"
          style={{ backgroundColor: colors.secundaria }}
        />
        <p
          className="m-0 text-center text-base leading-tight"
          style={{ ...titleStyle, color: readableTextColor(colors.texto) }}
        >
          {secondProduct}
        </p>
        <div className="flex justify-center">
          <LogoMark
            logoUrl={darkLogoUrl}
            storeName={storeName}
            backgroundHex={colors.fundo}
          />
        </div>
      </div>

      <div
        className={tileClassName}
        style={{ backgroundColor: colors.secundaria }}
      >
        <span
          className="text-[10px]"
          style={{ ...bodyStyle, color: readableTextColor(colors.secundaria) }}
        >
          Carrossel · 1/5
        </span>
        <p
          className="m-0 text-base leading-tight"
          style={{ ...titleStyle, color: colors.texto }}
        >
          3 dicas sobre {firstProduct.toLowerCase()}
        </p>
        <LogoMark
          logoUrl={lightLogoUrl}
          storeName={storeName}
          backgroundHex={colors.primaria}
        />
      </div>
    </div>
  );
}
