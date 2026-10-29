import type { Metadata } from "next";
import { Suspense } from "react";

import { brandDisplayFont } from "@/lib/brand-display-font";
import { getBrandKitData } from "@/lib/brand/get-brand-kit-data";

import { BrandWorkspace } from "./components/brand-workspace";

export const metadata: Metadata = {
  title: "Marca",
  robots: { index: false, follow: false },
};

async function BrandWorkspaceLoader() {
  const brandKitData = await getBrandKitData();

  return <BrandWorkspace initialData={brandKitData} />;
}

export default function BrandPage() {
  return (
    <div className={`${brandDisplayFont.variable} flex flex-col gap-6`}>
      <Suspense
        fallback={
          <p className="m-0 text-sm text-muted">Carregando sua marca…</p>
        }
      >
        <BrandWorkspaceLoader />
      </Suspense>
    </div>
  );
}
