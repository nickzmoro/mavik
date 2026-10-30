import { ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { postCardLinkClassName } from "@/components/common/artwork-card";
import { Badge } from "@/components/ui/badge";
import {
  getUpcomingContents,
  type UpcomingContent,
} from "@/lib/content/get-upcoming-contents";
import {
  getStudioUrlForArtwork,
  getStudioUrlForPauta,
  routes,
} from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

const postStatusBadges: Record<
  UpcomingContent["status"],
  { label: string; variant: "success" | "warning" | "outline" }
> = {
  ideia: { label: "Rascunho", variant: "outline" },
  em_producao: { label: "Em produção", variant: "outline" },
  em_revisao: { label: "Aguardando você", variant: "warning" },
  aprovado: { label: "Aprovado", variant: "success" },
  publicado: { label: "Publicado", variant: "success" },
};

const formatLabels: Record<UpcomingContent["format"], string> = {
  post: "Post",
  story: "Story",
  reels: "Reels",
  carrossel: "Carrossel",
};

const scheduleFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

function UpcomingPostCard({ post }: { post: UpcomingContent }) {
  const statusBadge = postStatusBadges[post.status];

  return (
    <Link
      href={
        post.artworkId
          ? getStudioUrlForArtwork(post.artworkId)
          : getStudioUrlForPauta(post.title)
      }
      aria-label={`Abrir post no Estúdio: ${post.title}`}
      className={postCardLinkClassName}
    >
      {post.imageUrl ? (
        <div className="relative aspect-4/5 overflow-hidden rounded-[14px]">
          <Image
            src={post.imageUrl}
            alt={`Prévia do post: ${post.title}`}
            fill
            unoptimized
            sizes="240px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-col gap-2 px-1.5 pb-1.5">
        <b className="line-clamp-2 text-[15px] leading-[1.35] font-semibold">
          {post.title}
        </b>
        <span className="flex items-center gap-1.5 text-sm leading-[1.4] text-muted">
          <Clock aria-hidden="true" className="size-3.5 shrink-0" />
          {scheduleFormatter.format(post.scheduledAt)} ·{" "}
          {formatLabels[post.format]}
        </span>
        <div>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
      </div>
    </Link>
  );
}

export async function UpcomingPostsSection() {
  const upcomingPosts = await getUpcomingContents();

  if (upcomingPosts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="next-title" className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3">
        <HomeSectionTitle id="next-title">Próximos posts</HomeSectionTitle>
        <Link
          href={routes.schedule}
          className="inline-flex min-h-11 items-center gap-1 rounded-(--r-sm) text-sm font-semibold text-primary no-underline transition-colors duration-150 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        >
          Ver agenda
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 max-[420px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
        {upcomingPosts.map((post) => (
          <UpcomingPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
