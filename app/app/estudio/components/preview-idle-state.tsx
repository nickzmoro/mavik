"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useRecentArtworks } from "@/hooks/queries/use-recent-artworks";
import { getStudioUrlForArtwork, routes } from "@/lib/routes";

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
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs leading-[1.4] font-semibold text-muted">
              Criadas recentemente
            </span>
            <Link
              href={routes.artworks}
              className="rounded-(--r-sm) text-xs leading-[1.4] font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            >
              Ver todas
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {recentArtworks.map((artwork) => (
              <Link
                key={artwork.id}
                href={getStudioUrlForArtwork(artwork.id)}
                aria-label={`Abrir no Estúdio: ${artwork.title}`}
                className="group flex min-w-0 flex-col gap-1.5 rounded-(--r-md) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              >
                <div className="relative aspect-4/5 overflow-hidden rounded-(--r-md) transition-transform duration-150 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                  <Image
                    src={artwork.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <span className="truncate text-xs leading-[1.4] text-muted group-hover:text-text">
                  {artwork.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
