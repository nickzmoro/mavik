import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ArtworkCard } from "@/components/common/artwork-card";
import { getRecentArtworks } from "@/lib/content/get-recent-artworks";
import { routes } from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

const draftsLimit = 4;

export async function DraftsSection() {
  const drafts = await getRecentArtworks({
    limit: draftsLimit,
    status: "rascunho",
  });

  if (drafts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="drafts-title" className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3">
        <HomeSectionTitle id="drafts-title">Rascunhos</HomeSectionTitle>
        <Link
          href={routes.artworks}
          className="inline-flex min-h-11 items-center gap-1 rounded-(--r-sm) text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          Ver todos os posts
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 max-[420px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {drafts.map((draft) => (
          <ArtworkCard key={draft.id} artwork={draft} />
        ))}
      </div>
    </section>
  );
}
