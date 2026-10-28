import type { Metadata } from "next";

import { brandDisplayFont } from "@/lib/brand-display-font";

import { BrandWorkspace } from "./components/brand-workspace";

export const metadata: Metadata = {
  title: "Marca",
  robots: { index: false, follow: false },
};

export default function BrandPage() {
  return (
    <div className={`${brandDisplayFont.variable} flex flex-col gap-6`}>
      <BrandWorkspace />
    </div>
  );
}
