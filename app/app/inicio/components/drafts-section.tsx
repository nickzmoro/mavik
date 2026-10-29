import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getRecentArtworks } from "@/lib/content/get-recent-artworks";
import { getStudioUrlForArtwork, routes } from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

const draftsLimit = 4;

export const postCardLinkClassName =
  "glass flex flex-col gap-3 rounded-[20px] p-2.5 text-inherit no-underline transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const createdAtFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export async function DraftsSection() {
  const drafts = await getRecentArtworks({
    limit: draftsLimit,
    onlyDrafts: true,
  });

  if (drafts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="drafts-title" className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3">
        <HomeSectionTitle id="drafts-title">Rascunhos</HomeSectionTitle>
        <Link
          href={routes.studio}
          className="inline-flex min-h-11 items-center gap-1 rounded-(--r-sm) text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          Abrir Estúdio
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 max-[420px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {drafts.map((draft) => (
          <Link
            key={draft.id}
            href={getStudioUrlForArtwork(draft.id)}
            aria-label={`Abrir rascunho no Estúdio: ${draft.title}`}
            className={postCardLinkClassName}
          >
            <div className="relative aspect-4/5 overflow-hidden rounded-[14px]">
              <Image
                src={draft.imageUrl}
                alt={`Rascunho: ${draft.title}`}
                fill
                unoptimized
                sizes="240px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 px-1.5 pb-1.5">
              <b className="line-clamp-2 text-[15px] leading-[1.35] font-semibold">
                {draft.title}
              </b>
              <span className="text-sm leading-[1.4] text-muted">
                Criado em {createdAtFormatter.format(draft.createdAt)}
              </span>
              <div>
                <Badge variant="outline">Rascunho</Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
