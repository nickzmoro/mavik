"use client";

import Image from "next/image";
import Link from "next/link";

import { useBrandKitData } from "@/hooks/queries/use-brand-kit-data";
import { mockBrandRules } from "@/lib/mocks/brand";
import { routes } from "@/lib/routes";

import { BrandAssuranceNote } from "@/components/common/brand-assurance-note";

const summaryColorRoles = ["primary", "secondary", "accent", "background"];

export function BrandKitSummaryCard() {
  const { data: brandKit } = useBrandKitData();

  if (!brandKit) {
    return null;
  }

  const logo = brandKit.logos.symbol ?? brandKit.logos.light;
  const summaryColors = brandKit.palette.filter((color) =>
    summaryColorRoles.includes(color.role),
  );
  const fontNames = brandKit.fonts
    .filter((font) => font.role !== "Destaque")
    .map((font) => font.displayName);
  const titleFont = brandKit.fonts.find((font) => font.role === "Títulos");
  const activeRules = mockBrandRules.filter((rule) =>
    brandKit.activeRuleIds.includes(rule.id),
  );

  return (
    <div className="tile flex flex-col gap-3 rounded-[18px] px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm leading-[1.4] font-semibold">
          Brand Kit em uso
        </span>
        <Link
          href={routes.brand}
          className="rounded-(--r-sm) text-sm leading-[1.4] font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          Editar marca
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3.5">
        <span
          aria-hidden="true"
          className="relative flex size-10 items-center justify-center overflow-hidden rounded-(--r-md) border-[1.5px] border-dashed border-muted"
        >
          {logo ? (
            <Image
              src={logo.url}
              alt=""
              fill
              unoptimized
              sizes="40px"
              className="object-contain p-0.5"
            />
          ) : null}
        </span>
        <span
          role="img"
          aria-label={`Paleta: ${summaryColors.map((color) => color.name).join(", ")}`}
          className="flex gap-1.5"
        >
          {summaryColors.map((color) => (
            <span
              key={color.id}
              title={color.name}
              className="size-7 rounded-full border border-[rgba(127,117,160,.3)]"
              style={{ background: color.hex }}
            />
          ))}
        </span>
        <span className="text-[13px] leading-[1.4] text-muted">
          <span
            className="text-base text-text"
            style={{ fontFamily: titleFont?.family }}
          >
            {fontNames[0]}
          </span>
          {fontNames[1] ? ` · ${fontNames[1]}` : null}
        </span>
      </div>
      <BrandAssuranceNote>
        {activeRules.length === 0
          ? "Nenhuma regra ativa. Ative regras na página Marca."
          : `${activeRules.length} ${activeRules.length === 1 ? "regra ativa" : "regras ativas"}: ${activeRules
              .slice(0, 2)
              .map((rule) => rule.label.toLowerCase())
              .join(", ")}${activeRules.length > 2 ? "…" : "."}`}
      </BrandAssuranceNote>
    </div>
  );
}
