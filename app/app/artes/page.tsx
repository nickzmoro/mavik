import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ArtworkCard } from "@/components/common/artwork-card";
import { getFilterPillClassName } from "@/components/common/filter-pill";
import {
  artworkDisplayStatusLabels,
  artworkStatusFilters,
  type ArtworkStatusFilter,
} from "@/lib/content/artwork-status";
import {
  getRecentArtworks,
  type ArtworkListFormat,
} from "@/lib/content/get-recent-artworks";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Artes",
  robots: { index: false, follow: false },
};

const ARTWORKS_PER_PAGE = 24;
const PAGE_PARAM = "pagina";
const FORMAT_PARAM = "formato";
const STATUS_PARAM = "status";

const formatFilters: { value: ArtworkListFormat; label: string }[] = [
  { value: "post", label: "Post" },
  { value: "story", label: "Story" },
  { value: "banner", label: "Banner" },
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type ArtworkFilters = {
  format?: ArtworkListFormat;
  status?: ArtworkStatusFilter;
};

const pageLinkClassName =
  "inline-flex min-h-11 items-center gap-1 rounded-(--r-sm) px-2 text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none";

const pickValue = <TValue extends string>(
  value: string | string[] | undefined,
  allowedValues: readonly TValue[],
) => allowedValues.find((allowedValue) => allowedValue === value);

const getArtworksUrl = ({ format, status }: ArtworkFilters, page = 1) => {
  const params = new URLSearchParams();

  if (format) {
    params.set(FORMAT_PARAM, format);
  }

  if (status) {
    params.set(STATUS_PARAM, status);
  }

  if (page > 1) {
    params.set(PAGE_PARAM, String(page));
  }

  const query = params.toString();

  return query ? `${routes.artworks}?${query}` : routes.artworks;
};

function FilterLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`${getFilterPillClassName({ isActive, size: "sm" })} inline-flex items-center no-underline`}
    >
      {children}
    </Link>
  );
}

function ArtworkFiltersNav({ format, status }: ArtworkFilters) {
  return (
    <nav aria-label="Filtros" className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs leading-[1.4] font-semibold text-muted">
          Formato
        </span>
        <FilterLink href={getArtworksUrl({ status })} isActive={!format}>
          Todos
        </FilterLink>
        {formatFilters.map((formatFilter) => (
          <FilterLink
            key={formatFilter.value}
            href={getArtworksUrl({ format: formatFilter.value, status })}
            isActive={format === formatFilter.value}
          >
            {formatFilter.label}
          </FilterLink>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs leading-[1.4] font-semibold text-muted">
          Status
        </span>
        <FilterLink href={getArtworksUrl({ format })} isActive={!status}>
          Todos
        </FilterLink>
        {artworkStatusFilters.map((statusFilter) => (
          <FilterLink
            key={statusFilter}
            href={getArtworksUrl({ format, status: statusFilter })}
            isActive={status === statusFilter}
          >
            {artworkDisplayStatusLabels[statusFilter]}
          </FilterLink>
        ))}
      </div>
    </nav>
  );
}

async function ArtworksList({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const requestedPage = Number(params[PAGE_PARAM]);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 1 ? requestedPage : 1;
  const filters: ArtworkFilters = {
    format: pickValue(
      params[FORMAT_PARAM],
      formatFilters.map(({ value }) => value),
    ),
    status: pickValue(params[STATUS_PARAM], artworkStatusFilters),
  };
  const hasFilters = Boolean(filters.format || filters.status);
  const pageArtworks = await getRecentArtworks({
    limit: ARTWORKS_PER_PAGE + 1,
    offset: (page - 1) * ARTWORKS_PER_PAGE,
    ...filters,
  });
  const artworks = pageArtworks.slice(0, ARTWORKS_PER_PAGE);
  const hasNextPage = pageArtworks.length > ARTWORKS_PER_PAGE;

  const getEmptyState = () => {
    if (page > 1) {
      return {
        title: "Não há mais posts",
        href: getArtworksUrl(filters),
        linkLabel: "Voltar para a primeira página",
      };
    }

    return hasFilters
      ? {
          title: "Nenhuma arte com esses filtros",
          href: routes.artworks,
          linkLabel: "Limpar filtros",
        }
      : {
          title: "Você ainda não gerou posts",
          href: routes.studio,
          linkLabel: "Criar no Estúdio",
        };
  };

  if (artworks.length === 0) {
    const emptyState = getEmptyState();

    return (
      <>
        <ArtworkFiltersNav {...filters} />
        <div className="glass flex flex-col items-center gap-3 rounded-3xl px-6 py-12 text-center">
          <p className="m-0 font-display text-xl leading-[1.3] font-semibold">
            {emptyState.title}
          </p>
          <Link href={emptyState.href} className={pageLinkClassName}>
            {emptyState.linkLabel}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ArtworkFiltersNav {...filters} />
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
            <Link
              href={getArtworksUrl(filters, page - 1)}
              className={pageLinkClassName}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Anteriores
            </Link>
          ) : (
            <span />
          )}
          {hasNextPage ? (
            <Link
              href={getArtworksUrl(filters, page + 1)}
              className={pageLinkClassName}
            >
              Mais posts
              <ChevronRight aria-hidden="true" className="size-4" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}

export default function ArtworksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs leading-[1.4] font-semibold text-muted">
            Criadas no Estúdio
          </span>
          <h1 className="m-0 font-display text-[26px] leading-[1.2] font-bold sm:text-[32px]">
            Artes
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
