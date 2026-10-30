import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { RecentArtwork } from "@/lib/content/get-recent-artworks";
import { getStudioUrlForArtwork } from "@/lib/routes";

export const postCardLinkClassName =
  "glass flex flex-col gap-3 rounded-[20px] p-2.5 text-inherit no-underline transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export const artworkStatusLabels: Record<RecentArtwork["status"], string> = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  aprovada: "Aprovada",
  descartada: "Descartada",
};

const createdAtFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

export function ArtworkCard({ artwork }: { artwork: RecentArtwork }) {
  return (
    <Link
      href={getStudioUrlForArtwork(artwork.id)}
      aria-label={`Abrir no Estúdio: ${artwork.title}`}
      className={postCardLinkClassName}
    >
      <div className="relative aspect-4/5 overflow-hidden rounded-[14px]">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          unoptimized
          sizes="240px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 px-1.5 pb-1.5">
        <b className="line-clamp-2 text-[15px] leading-[1.35] font-semibold">
          {artwork.title}
        </b>
        <span className="text-sm leading-[1.4] text-muted">
          Criado em {createdAtFormatter.format(artwork.createdAt)}
        </span>
        <div>
          <Badge variant="outline">{artworkStatusLabels[artwork.status]}</Badge>
        </div>
      </div>
    </Link>
  );
}
