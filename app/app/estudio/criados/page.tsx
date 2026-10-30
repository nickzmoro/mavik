import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ArtworkCard } from "@/components/common/artwork-card";
import { getRecentArtworks } from "@/lib/content/get-recent-artworks";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Posts gerados",
  robots: { index: false, follow: false },
};

const ARTWORKS_PER_PAGE = 24;
const PAGE_PARAM = "pagina";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const pageLinkClassName =
  "inline-flex min-h-11 items-center gap-1 rounded-(--r-sm) px-2 text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none";

const getPageUrl = (page: number) =>
  `${routes.studioArtworks}?${new URLSearchParams({ [PAGE_PARAM]: String(page) })}`;

async function ArtworksList({ searchParams }: { searchParams: SearchParams }) {
  const requestedPage = Number((await searchParams)[PAGE_PARAM]);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;
  const pageArtworks = await getRecentArtworks({
    limit: ARTWORKS_PER_PAGE + 1,
    offset: (page - 1) * ARTWORKS_PER_PAGE,
  });
  const artworks = pageArtworks.slice(0, ARTWORKS_PER_PAGE);
  const hasNextPage = pageArtworks.length > ARTWORKS_PER_PAGE;

  if (artworks.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
        <p className="m-0 font-display text-xl leading-[1.3] font-semibold">
          {page === 1 ? "Você ainda não gerou posts" : "Não há mais posts"}
        </p>
        <Link
          href={page === 1 ? routes.studio : routes.studioArtworks}
          className={pageLinkClassName}
        >
          {page === 1 ? "Criar no Estúdio" : "Voltar para a primeira página"}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 max-[420px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
      {page > 1 || hasNextPage ? (
        <nav
          aria-label="Páginas"
          className="flex items-center justify-between gap-3"
        >
          {page > 1 ? (
            <Link href={getPageUrl(page - 1)} className={pageLinkClassName}>
              <ChevronLeft aria-hidden="true" className="size-4" />
              Anteriores
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage ? (
            <Link href={getPageUrl(page + 1)} className={pageLinkClassName}>
              Mais posts
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

export default function StudioArtworksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs leading-[1.4] font-semibold text-muted">
            Estúdio
          </span>
          <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
            Posts gerados
          </h1>
        </div>
        <Link href={routes.studio} className={pageLinkClassName}>
          Criar novo post
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </header>
      <Suspense
        fallback={
          <p className="m-0 text-sm text-muted">Carregando seus posts…</p>
        }
      >
        <ArtworksList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
