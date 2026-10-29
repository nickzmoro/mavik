"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";

import { useRecentArtworks } from "@/hooks/queries/use-recent-artworks";

import { BrandKitSummaryCard } from "./brand-kit-summary-card";

export function PreviewIdleState() {
  const { data: recentArtworks = [] } = useRecentArtworks();

  return (
    <>
      <div className="dropzone flex flex-col items-center gap-2.5 rounded-[20px] px-6 py-8 text-center">
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-[18px] bg-surface-2 text-primary"
        >
          <Sparkles className="size-6.5" />
        </span>
        <p className="m-0 font-display text-[17px] leading-[1.4] font-semibold">
          Suas variações aparecem aqui
        </p>
        <p className="m-0 max-w-95 text-sm leading-[1.55] text-muted">
          Cada uma já sai com a sua logo, as suas cores e as suas fontes. Você
          escolhe, ajusta e aprova.
        </p>
      </div>
      <BrandKitSummaryCard />
      {recentArtworks.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          <span className="text-xs leading-[1.4] font-semibold text-muted">
            Criadas recentemente
          </span>
          <div className="grid grid-cols-3 gap-2.5">
            {recentArtworks.map((artwork) => (
              <div key={artwork.id} className="flex min-w-0 flex-col gap-1.5">
                <div className="relative aspect-4/5 overflow-hidden rounded-(--r-md)">
                  <Image
                    src={artwork.imageUrl}
                    alt={`Arte recente: ${artwork.title}`}
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <span className="truncate text-xs leading-[1.4] text-muted">
                  {artwork.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
