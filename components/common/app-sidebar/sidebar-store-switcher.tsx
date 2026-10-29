import { and, eq } from "drizzle-orm";
import { ChevronsUpDown } from "lucide-react";
import Image from "next/image";

import { db } from "@/db";
import { brandAssets } from "@/db/schema";
import { getInitials } from "@/lib/get-initials";
import { signStoragePaths } from "@/lib/onboarding/get-step-data";
import {
  getCurrentBrandKit,
  getCurrentUserId,
  getOwnedStore,
} from "@/lib/onboarding/store-access";
import { cn } from "@/lib/utils";

const storeCardClassName =
  "relative flex min-h-14 w-full items-center gap-3 rounded-(--r-lg) border border-white/14 bg-white/8 px-2.5 py-2 text-left text-white";

async function getSymbolUrl(storeId: string) {
  const brandKit = await getCurrentBrandKit(storeId);

  if (!brandKit) {
    return null;
  }

  const [symbol] = await db
    .select({ storagePath: brandAssets.storagePath })
    .from(brandAssets)
    .where(
      and(
        eq(brandAssets.brandKitId, brandKit.id),
        eq(brandAssets.kind, "simbolo"),
      ),
    )
    .limit(1);
  const [signed] = symbol ? await signStoragePaths([symbol.storagePath]) : [];

  return signed?.signedUrl ?? null;
}

export async function SidebarStoreSwitcher() {
  const userId = await getCurrentUserId();
  const store = userId ? await getOwnedStore(userId) : null;
  const storeName = store?.name.trim() ?? "";
  const symbolUrl = store ? await getSymbolUrl(store.id) : null;

  return (
    <button
      type="button"
      aria-label="Trocar de loja"
      className={cn(
        storeCardClassName,
        "cursor-pointer transition-colors duration-150 hover:bg-white/14 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-[10px] font-display text-sm font-semibold",
          symbolUrl
            ? "relative overflow-hidden bg-white"
            : storeName
              ? "bg-[#2e2a27] text-[#f4ede4]"
              : "border-[1.5px] border-dashed border-white/30",
        )}
      >
        {symbolUrl ? (
          <Image
            src={symbolUrl}
            alt=""
            fill
            unoptimized
            sizes="36px"
            className="object-contain p-1"
          />
        ) : storeName ? (
          getInitials(storeName)
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs leading-[1.4] font-medium text-(--violet-200)">
          Loja
        </span>
        <span
          className={cn(
            "truncate font-display text-sm leading-[1.3] font-semibold",
            !storeName && "text-(--violet-200)",
          )}
        >
          {storeName || "Ainda sem dados"}
        </span>
      </span>
      <ChevronsUpDown
        aria-hidden="true"
        className="size-4 shrink-0 text-(--violet-200)"
      />
    </button>
  );
}

export function SidebarStoreSwitcherSkeleton() {
  return (
    <div aria-hidden="true" className={storeCardClassName}>
      <span className="size-9 shrink-0 animate-pulse rounded-[10px] bg-white/16 motion-reduce:animate-none" />
      <span className="flex flex-1 flex-col gap-1.5">
        <span className="h-3 w-10 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
        <span className="h-3.5 w-28 animate-pulse rounded-full bg-white/16 motion-reduce:animate-none" />
      </span>
    </div>
  );
}
