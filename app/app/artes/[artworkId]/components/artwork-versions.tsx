import Image from "next/image";

import type { ArtworkVersionDetail } from "@/lib/content/get-artwork-detail";
import { cn } from "@/lib/utils";

import { artworkDateFormatter } from "./artwork-date-formatter";

type ArtworkVersionsProps = {
  versions: ArtworkVersionDetail[];
  selectedVersion: number;
  onSelect: (version: number) => void;
};

export function ArtworkVersions({
  versions,
  selectedVersion,
  onSelect,
}: ArtworkVersionsProps) {
  return (
    <section
      aria-labelledby="artwork-versions-title"
      className="flex flex-col gap-2.5"
    >
      <h2
        id="artwork-versions-title"
        className="m-0 font-display text-base leading-[1.4] font-semibold"
      >
        Histórico de ajustes
      </h2>
      <ol className="m-0 flex list-none flex-col gap-2 p-0">
        {versions.map((version) => {
          const isSelected = version.version === selectedVersion;

          return (
            <li key={version.version}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(version.version)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-[14px] border bg-transparent p-2 text-left text-text transition-colors duration-150 hover:bg-hover-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none",
                  isSelected ? "border-primary" : "border-border",
                )}
              >
                <span className="relative size-12 shrink-0 overflow-hidden rounded-(--r-sm)">
                  <Image
                    src={version.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm leading-[1.4] font-semibold">
                    Versão {version.version}
                    {version.version === versions[0].version ? " · atual" : ""}
                  </span>
                  <span className="line-clamp-2 text-xs leading-[1.4] text-muted">
                    {version.editInstruction
                      ? `Ajuste: ${version.editInstruction}`
                      : "Original"}{" "}
                    · {artworkDateFormatter.format(version.createdAt)}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
