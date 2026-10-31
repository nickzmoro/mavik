import type { Metadata } from "next";
import { Suspense } from "react";

import { ZaionPageLoader } from "@/components/common/zaion-loader/zaion-page-loader";

import { AgentSuggestionCard } from "./components/agent-suggestion-card";
import { BrandSummaryCard } from "./components/brand-summary-card";
import { CreatePostCard } from "./components/create-post-card";
import { DraftsSection } from "./components/drafts-section";
import { HomeHeader } from "./components/home-header";
import { ShortcutsCard } from "./components/shortcuts-card";
import { UpcomingPostsSection } from "./components/upcoming-posts-section";
import { WeeklySummaryCard } from "./components/weekly-summary-card";

export const metadata: Metadata = {
  title: "Início",
  robots: { index: false, follow: false },
};

const sectionLoaderClassName = "min-h-64 flex-none";

export default function HomePage() {
  return (
    <>
      <HomeHeader />
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-6">
          <CreatePostCard />
          <AgentSuggestionCard />
          <Suspense
            fallback={<ZaionPageLoader className={sectionLoaderClassName} />}
          >
            <UpcomingPostsSection />
          </Suspense>
          <Suspense
            fallback={<ZaionPageLoader className={sectionLoaderClassName} />}
          >
            <DraftsSection />
          </Suspense>
        </div>
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-6">
          <WeeklySummaryCard />
          <Suspense
            fallback={<ZaionPageLoader className={sectionLoaderClassName} />}
          >
            <BrandSummaryCard />
          </Suspense>
          <ShortcutsCard />
        </div>
      </div>
    </>
  );
}
