import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContrastRatio, minimumAaContrast } from "@/lib/color-contrast";
import { contrastPairs, type BrandColor } from "@/lib/mocks/brand";

import { BrandCard } from "./brand-card";

type ColorsTabProps = {
  palette: BrandColor[];
  onEditColor: (color: BrandColor) => void;
  onAddColor: () => void;
};

export function ColorsTab({
  palette,
  onEditColor,
  onAddColor,
}: ColorsTabProps) {
  const contrastRows = contrastPairs.flatMap((pair) => {
    const foreground = palette.find((color) => color.role === pair.foreground);
    const background = palette.find((color) => color.role === pair.background);

    if (!foreground || !background) {
      return [];
    }

    const ratio = getContrastRatio(foreground.hex, background.hex);

    return [
      {
        id: `${foreground.id}-${background.id}`,
        foreground,
        background,
        ratioLabel: `${ratio.toFixed(1).replace(".", ",")}:1`,
        isAccessible: ratio >= minimumAaContrast,
      },
    ];
  });

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <BrandCard
        titleId="palette-title"
        title="Paleta de cores"
        hint="Extraída da sua logo e do site. Clique numa cor para trocar (HEX ou RGB)."
        action={
          <Button variant="outline" onClick={onAddColor}>
            <Plus aria-hidden="true" className="size-4.5" />
            Adicionar cor
          </Button>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(112px,100%),1fr))] gap-3.5">
          {palette.map((color) => (
            <button
              key={color.id}
              type="button"
              aria-label={`Trocar ${color.roleLabel.toLowerCase()}: ${color.name}, ${color.hex}`}
              onClick={() => onEditColor(color)}
              className="group flex cursor-pointer flex-col gap-2 rounded-(--r-lg) border-0 bg-transparent p-0 text-left text-sm text-text focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              <span
                className="h-24 rounded-(--r-lg) border border-brand-tile-border transition-transform duration-150 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                style={{ backgroundColor: color.hex }}
              />
              <b className="font-semibold">{color.roleLabel}</b>
              <span>{color.name}</span>
              <code className="font-sans text-[13px] text-muted">
                {color.hex}
              </code>
            </button>
          ))}
        </div>
      </BrandCard>

      <BrandCard
        titleId="contrast-title"
        title="Contraste (WCAG AA)"
        hint="Combinações abaixo do AA não são usadas em textos pequenos."
      >
        <div className="scrollbar-subtle -mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-115 border-collapse text-sm">
            <thead>
              <tr>
                {["Prévia", "Combinação", "Contraste", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="px-3 pb-2.5 text-left text-[13px] font-medium text-muted"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {contrastRows.map((row) => (
                <tr key={row.id}>
                  <td className="border-t border-brand-tile-border p-3 align-middle">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-14 items-center justify-center rounded-lg border border-brand-tile-border font-(family-name:--font-dm-serif) text-base"
                      style={{
                        backgroundColor: row.background.hex,
                        color: row.foreground.hex,
                      }}
                    >
                      Aa
                    </span>
                  </td>
                  <td className="border-t border-brand-tile-border p-3 align-middle">
                    {row.foreground.roleLabel} sobre {row.background.roleLabel}
                  </td>
                  <td className="border-t border-brand-tile-border p-3 align-middle font-semibold tabular-nums">
                    {row.ratioLabel}
                  </td>
                  <td className="border-t border-brand-tile-border p-3 align-middle">
                    <Badge variant={row.isAccessible ? "success" : "warning"}>
                      {row.isAccessible ? "AA ok" : "Abaixo do AA"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BrandCard>
    </div>
  );
}
