import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/app/app-shell";
import { routes } from "@/lib/routes";

import { HowItWorksCard } from "./components/how-it-works-card";
import { ImageGenerator } from "./components/image-generator";

export const metadata: Metadata = {
  title: "Estúdio",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <AppShell
      activeHref={routes.studio}
      section="Estúdio"
      title="Crie uma arte"
    >
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Suspense fallback={null}>
          <ImageGenerator />
        </Suspense>
        <aside className="flex flex-col gap-6">
          <HowItWorksCard />
        </aside>
      </div>
    </AppShell>
  );
}
