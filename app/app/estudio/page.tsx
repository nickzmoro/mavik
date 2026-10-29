import type { Metadata } from "next";
import { Suspense } from "react";

import { brandDisplayFont } from "@/lib/brand-display-font";
import { getStudioArtwork } from "@/lib/content/get-studio-artwork";
import { STUDIO_ARTWORK_PARAM } from "@/lib/routes";

import { StudioWorkspace } from "./components/studio-workspace";

export const metadata: Metadata = {
  title: "Estúdio",
  robots: { index: false, follow: false },
};

type StudioPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StudioPage({ searchParams }: StudioPageProps) {
  const artworkId = (await searchParams)[STUDIO_ARTWORK_PARAM];
  const initialArtwork =
    typeof artworkId === "string" ? await getStudioArtwork(artworkId) : null;

  return (
    <div className={`${brandDisplayFont.variable} flex flex-col gap-5`}>
      <Suspense fallback={null}>
        <StudioWorkspace
          key={initialArtwork?.artworkId}
          initialArtwork={initialArtwork}
        />
      </Suspense>
    </div>
  );
}
