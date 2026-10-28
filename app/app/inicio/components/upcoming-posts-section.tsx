import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { PostArtPreview } from "@/components/common/post-art-preview";
import {
  mockUpcomingPosts,
  type UpcomingPost,
  type UpcomingPostStatus,
} from "@/lib/mocks/home";
import { routes } from "@/lib/routes";

import { HomeSectionTitle } from "./home-section-title";

const postStatusBadges: Record<
  UpcomingPostStatus,
  { label: string; variant: "success" | "warning" | "outline" }
> = {
  approved: { label: "Aprovado", variant: "success" },
  awaitingApproval: { label: "Aguardando você", variant: "warning" },
  draft: { label: "Rascunho", variant: "outline" },
};

function UpcomingPostCard({ post }: { post: UpcomingPost }) {
  const statusBadge = postStatusBadges[post.status];

  return (
    <article className="glass flex flex-col gap-3 rounded-[20px] p-2.5">
      <PostArtPreview art={post.art} label={post.previewLabel} />
      <div className="flex flex-col gap-1.5 px-1 pb-1">
        <span className="flex items-center gap-1.5 text-sm leading-[1.4] font-semibold">
          <Clock aria-hidden="true" className="size-3.5 shrink-0 text-muted" />
          {post.scheduleLabel}
        </span>
        <div>
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
        </div>
      </div>
    </article>
  );
}

export function UpcomingPostsSection() {
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
        {mockUpcomingPosts.map((post) => (
          <UpcomingPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
