import type { Metadata } from "next";
import { Suspense } from "react";

import { ZaionPageLoader } from "@/components/common/zaion-loader/zaion-page-loader";
import { brandDisplayFont } from "@/lib/brand-display-font";
import { getBrandKitData } from "@/lib/brand/get-brand-kit-data";
import { getInstagramConnection } from "@/lib/instagram/accounts";
import { getCurrentUserId, getOwnedStore } from "@/lib/onboarding/store-access";
import {
  BRAND_TAB_PARAM,
  INSTAGRAM_RESULT_PARAM,
  type InstagramConnectResult,
} from "@/lib/routes";

import { BrandWorkspace } from "./components/brand-workspace";

export const metadata: Metadata = {
  title: "Marca",
  robots: { index: false, follow: false },
};

type SearchParams = Record<string, string | string[] | undefined>;

const instagramResults: InstagramConnectResult[] = [
  "conectado",
  "erro",
  "negado",
  "sem_conta",
];

async function BrandWorkspaceLoader({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [brandKitData, params, userId] = await Promise.all([
    getBrandKitData(),
    searchParams,
    getCurrentUserId(),
  ]);
  const store = userId ? await getOwnedStore(userId) : null;
  const instagramConnection = store
    ? await getInstagramConnection(store.id)
    : null;
  const instagramResult = instagramResults.find(
    (result) => result === params[INSTAGRAM_RESULT_PARAM],
  );

  return (
    <BrandWorkspace
      initialData={brandKitData}
      initialTab={
        params[BRAND_TAB_PARAM] === "conexoes" ? "connections" : "logos"
      }
      instagramConnection={instagramConnection}
      instagramResult={instagramResult}
    />
  );
}

export default function BrandPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <div className={`${brandDisplayFont.variable} flex flex-col gap-6`}>
      <Suspense fallback={<ZaionPageLoader />}>
        <BrandWorkspaceLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
