import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getArtworkDetail } from "@/lib/content/get-artwork-detail";

import { ArtworkDetailView } from "./components/artwork-detail-view";

export const instant = false;

type ArtworkPageProps = {
  params: Promise<{ artworkId: string }>;
};

export async function generateMetadata({
  params,
}: ArtworkPageProps): Promise<Metadata> {
  const { artworkId } = await params;
  const artwork = await getArtworkDetail(artworkId);

  return {
    title: artwork?.title ?? "Arte",
    robots: { index: false, follow: false },
  };
}

async function ArtworkDetailLoader({ params }: ArtworkPageProps) {
  const { artworkId } = await params;
  const artwork = await getArtworkDetail(artworkId);

  if (!artwork) {
    notFound();
  }

  return (
    <ArtworkDetailView key={artwork.versions[0].version} artwork={artwork} />
  );
}

export default function ArtworkPage({ params }: ArtworkPageProps) {
  return (
    <div className="flex flex-col gap-5">
      <Suspense
        fallback={<p className="m-0 text-sm text-muted">Carregando a arte…</p>}
      >
        <ArtworkDetailLoader params={params} />
      </Suspense>
    </div>
  );
}
