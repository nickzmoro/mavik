import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/db";
import { brandKits, storeMembers, stores } from "@/db/schema";
import { getCurrentUserClaims } from "@/lib/supabase/get-current-user-claims";

export async function getCurrentUserId() {
  const claims = await getCurrentUserClaims();

  return claims?.sub ?? null;
}

export const getOwnedStore = cache(async (userId: string) => {
  const [ownedStore] = await db
    .select({ store: stores })
    .from(stores)
    .innerJoin(storeMembers, eq(storeMembers.storeId, stores.id))
    .where(and(eq(storeMembers.userId, userId), eq(storeMembers.role, "owner")))
    .orderBy(desc(stores.createdAt))
    .limit(1);

  return ownedStore?.store ?? null;
});

async function findCurrentBrandKit(storeId: string) {
  const [brandKit] = await db
    .select()
    .from(brandKits)
    .where(and(eq(brandKits.storeId, storeId), eq(brandKits.isCurrent, true)))
    .limit(1);

  return brandKit ?? null;
}

export const getCurrentBrandKit = cache(findCurrentBrandKit);

export async function getOrCreateCurrentBrandKit(
  storeId: string,
  userId: string,
) {
  const brandKit = await findCurrentBrandKit(storeId);

  if (brandKit) {
    return brandKit;
  }

  const [createdBrandKit] = await db
    .insert(brandKits)
    .values({ storeId, version: 1, isCurrent: true, createdBy: userId })
    .onConflictDoNothing()
    .returning();

  return createdBrandKit ?? (await findCurrentBrandKit(storeId));
}
