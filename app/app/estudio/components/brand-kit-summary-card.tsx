import Link from "next/link";

import { mockBrandInitials, mockBrandPalette } from "@/lib/mocks/brand";
import { routes } from "@/lib/routes";

import { BrandAssuranceNote } from "./brand-assurance-note";

export function BrandKitSummaryCard() {
  const paletteNames = mockBrandPalette.map((color) => color.name);

  return (
    <div className="tile flex flex-col gap-3 rounded-[18px] px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm leading-[1.4] font-semibold">
          Brand Kit v3 em uso
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
          className="flex size-10 items-center justify-center rounded-(--r-md) bg-[#2e2a27] font-display text-sm font-semibold text-[#f4ede4]"
        >
          {mockBrandInitials}
        </span>
        <span
          role="img"
          aria-label={`Paleta: ${paletteNames.join(", ")}`}
          className="flex gap-1.5"
        >
          {mockBrandPalette.map((color) => (
            <span
              key={color.id}
              title={color.name}
              className="size-7 rounded-full border border-[rgba(127,117,160,.3)]"
              style={{ background: color.hex }}
            />
          ))}
        </span>
        <span className="text-[13px] leading-[1.4] text-muted">
          <span className="font-(family-name:--font-dm-serif) text-base text-text">
            DM Serif Display
          </span>{" "}
          · Inter
        </span>
      </div>
      <BrandAssuranceNote>
        5 regras ativas: logo no canto inferior direito, só cores da paleta, sem
        “barato”…
      </BrandAssuranceNote>
    </div>
  );
}
