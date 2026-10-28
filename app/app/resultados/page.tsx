import type { Metadata } from "next";

import { ResultsWorkspace } from "./components/results-workspace";

export const metadata: Metadata = {
  title: "Resultados",
  robots: { index: false, follow: false },
};

export default function ResultsPage() {
  return (
    <div className="flex flex-col gap-5">
      <ResultsWorkspace />
    </div>
  );
}
