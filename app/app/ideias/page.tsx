import type { Metadata } from "next";
import { Suspense } from "react";

import {
  IDEA_DATES_WINDOW_DAYS,
  getIdeasData,
} from "@/lib/ideas/get-ideas-data";

import { IdeasLibrary } from "./components/ideas-library";

export const metadata: Metadata = {
  title: "Ideias",
  robots: { index: false, follow: false },
};

async function IdeasLibraryLoader() {
  return (
    <IdeasLibrary
      initialData={await getIdeasData()}
      datesWindowDays={IDEA_DATES_WINDOW_DAYS}
    />
  );
}

export default function IdeasPage() {
  return (
    <div className="flex flex-col gap-5">
      <Suspense
        fallback={
          <p className="m-0 text-sm text-muted">Carregando suas ideias…</p>
        }
      >
        <IdeasLibraryLoader />
      </Suspense>
    </div>
  );
}
