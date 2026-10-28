import type { Metadata } from "next";

import { IdeasLibrary } from "./components/ideas-library";

export const metadata: Metadata = {
  title: "Ideias",
  robots: { index: false, follow: false },
};

export default function IdeasPage() {
  return (
    <div className="flex flex-col gap-5">
      <IdeasLibrary />
    </div>
  );
}
