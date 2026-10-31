"use client";

import { Check, Copy } from "lucide-react";
import { useId } from "react";

import { SegmentedControl } from "@/components/common/segmented-control";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatArtCount, formatVariationCount } from "@/lib/art-options";
import {
  artFormats,
  maxVariationsPerGeneration,
  variationCountOptions,
  type ArtFormat,
  type ArtFormatId,
} from "@/lib/mocks/studio";
import { cn } from "@/lib/utils";

type FormatOptionsPopoverProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  format: ArtFormat;
  onFormatChange: (formatId: ArtFormatId) => void;
  variationCount: number;
  onVariationCountChange: (count: number) => void;
  remainingArts: number;
};

const formatGroups = [
  {
    label: "Instagram",
    formats: artFormats.filter(({ kind }) => kind !== "banner"),
  },
  {
    label: "Banner",
    formats: artFormats.filter(({ kind }) => kind === "banner"),
  },
];

const getVariationHint = (remainingArts: number) =>
  remainingArts > 0 && remainingArts < maxVariationsPerGeneration
    ? `Restam ${formatArtCount(remainingArts)} no teste`
    : `Até ${maxVariationsPerGeneration} por geração`;

export function FormatOptionsPopover({
  open,
  onOpenChange,
  format,
  onFormatChange,
  variationCount,
  onVariationCountChange,
  remainingArts,
}: FormatOptionsPopoverProps) {
  const formatLabelId = useId();
  const variationOptions = variationCountOptions.map((count) => {
    const isBlocked = remainingArts > 0 && count > remainingArts;

    return {
      value: String(count),
      label: String(count),
      isDisabled: isBlocked,
      title: isBlocked ? "Indisponível no teste" : formatVariationCount(count),
    };
  });

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Formato e variações: ${format.label} ${format.ratioLabel}, ${formatVariationCount(variationCount)}`}
          className="chip-surface ml-0.5 inline-flex min-h-9 cursor-pointer items-center gap-1.75 rounded-full px-3 text-[13px] font-semibold text-text! transition-[border-color] duration-150 hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          <span
            aria-hidden="true"
            className={cn(
              "block rounded-[3px] border-[1.5px] border-current",
              format.chipIconClassName,
            )}
          />
          {format.ratioLabel}
          <span aria-hidden="true" className="h-3.5 w-px bg-border" />
          <Copy aria-hidden="true" className="size-3.5 text-muted" />
          {variationCount}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={14}
        aria-label="Formato e variações"
        className="scrollbar-subtle flex max-h-[min(36rem,80vh)] w-85 max-w-[calc(100vw-2rem)] flex-col gap-0.5 overflow-y-auto"
      >
        <span
          id={formatLabelId}
          className="px-3 pt-2 pb-1.5 text-xs leading-[1.4] font-semibold text-muted"
        >
          Formato
        </span>
        <div
          role="radiogroup"
          aria-labelledby={formatLabelId}
          className="flex flex-col gap-0.5"
        >
          {formatGroups.map((formatGroup) => (
            <div
              key={formatGroup.label}
              role="group"
              aria-label={formatGroup.label}
              className="flex flex-col gap-0.5"
            >
              <span
                aria-hidden="true"
                className="px-3 pt-1.5 pb-0.5 text-[11px] leading-[1.4] font-semibold tracking-wide text-muted uppercase"
              >
                {formatGroup.label}
              </span>
              {formatGroup.formats.map((artFormat) => {
                const isSelected = artFormat.id === format.id;

                return (
                  <button
                    key={artFormat.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => onFormatChange(artFormat.id)}
                    className="flex min-h-13 w-full cursor-pointer items-center gap-3 rounded-[14px] border-0 bg-transparent px-3 py-1.5 text-left text-text transition-colors duration-150 hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-(--r-md) bg-surface-2 text-primary"
                    >
                      <span
                        className={cn(
                          "block rounded-sm border-2 border-current",
                          artFormat.iconClassName,
                        )}
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm leading-[1.4] font-semibold">
                        {artFormat.label}
                      </span>
                      <span className="text-xs leading-[1.4] text-muted">
                        {artFormat.description}
                      </span>
                    </span>
                    {isSelected ? (
                      <Check
                        aria-hidden="true"
                        className="size-4.5 shrink-0 text-primary"
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="mx-3 my-1.5 h-px bg-border" />
        <div className="flex flex-col gap-2 px-3 pt-1 pb-2">
          <span className="flex items-baseline justify-between gap-2 text-xs leading-[1.4] text-muted">
            <span className="font-semibold">Variações</span>
            <span>{getVariationHint(remainingArts)}</span>
          </span>
          <SegmentedControl
            label="Variações"
            options={variationOptions}
            value={String(variationCount)}
            onChange={(count) => onVariationCountChange(Number(count))}
            className="flex w-full"
            itemClassName="min-h-10 flex-1"
          />
          <span className="text-xs leading-normal text-muted">
            Cada variação usa 1 arte do seu plano.
          </span>
        </div>
        <div className="flex justify-end px-1 pb-1">
          <PopoverClose asChild>
            <button
              type="button"
              className="min-h-9 cursor-pointer rounded-full border-0 bg-transparent px-3 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              Pronto
            </button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
}
