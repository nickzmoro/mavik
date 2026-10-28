import type { Metadata } from "next";

import { brandDisplayFont } from "@/lib/brand-display-font";

import { StudioWorkspace } from "./components/studio-workspace";

export const metadata: Metadata = {
  title: "Estúdio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <div className={`${brandDisplayFont.variable} flex flex-col gap-5`}>
      <StudioWorkspace />
    </div>
  );
}
