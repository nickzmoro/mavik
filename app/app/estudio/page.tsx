import type { Metadata } from "next";
import { Suspense } from "react";

import { brandDisplayFont } from "@/lib/brand-display-font";

import { StudioWorkspace } from "./components/studio-workspace";

export const metadata: Metadata = {
  title: "Estúdio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <div className={`${brandDisplayFont.variable} flex flex-col gap-5`}>
      <Suspense fallback={null}>
        <StudioWorkspace />
      </Suspense>
    </div>
  );
}
