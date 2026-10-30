import "server-only";

import { and, eq, inArray, lte } from "drizzle-orm";

import { db } from "@/db";
import { socialAccounts, socialAccountTokens } from "@/db/schema";

import { getInstagramApiConfig, getTokenKey } from "./config";
import {
  InstagramApiError,
  revokeAppPermissions,
  type InstagramPage,
} from "./instagram-api";
import { decryptToken, encryptToken } from "./token-crypto";

export type InstagramConnection = {
  username: string;
  status: "conectado" | "expirado" | "desconectado";
  accountType: string | null;
  lastError: string | null;
};

const reconnectMessage =
  "O Facebook pediu uma nova autorização. Conecte a conta de novo.";

const isInstagramAccount = (storeId: string) =>
  and(
    eq(socialAccounts.storeId, storeId),
    eq(socialAccounts.provider, "instagram"),
  );

export async function getInstagramConnection(
  storeId: string,
): Promise<InstagramConnection | null> {
  const [account] = await db
    .select({
      username: socialAccounts.handle,
      status: socialAccounts.status,
      accountType: socialAccounts.accountType,
      lastError: socialAccounts.lastError,
    })
    .from(socialAccounts)
    .where(isInstagramAccount(storeId));

  return account && account.status !== "desconectado"
    ? { ...account, username: account.username ?? "" }
    : null;
}

export async function saveInstagramConnection({
  storeId,
  userId,
  page,
  facebookUserId,
  scopes,
  expiresAt,
}: {
  storeId: string;
  userId: string;
  page: InstagramPage;
  facebookUserId: string | null;
  scopes: string[];
  expiresAt: Date | null;
}) {
  const accessTokenEncrypted = encryptToken(
    page.pageAccessToken,
    getTokenKey(),
  );
  const now = new Date();

  await db.transaction(async (tx) => {
    const accountValues = {
      externalId: page.igUserId,
      providerUserId: facebookUserId,
      handle: page.username,
      accountType: "Business",
      scopes,
      status: "conectado" as const,
      lastError: null,
      connectedBy: userId,
      updatedAt: now,
    };
    const [account] = await tx
      .insert(socialAccounts)
      .values({ storeId, provider: "instagram", ...accountValues })
      .onConflictDoUpdate({
        target: [socialAccounts.storeId, socialAccounts.provider],
        set: accountValues,
      })
      .returning({ id: socialAccounts.id });
    const tokenValues = {
      accessTokenEncrypted,
      expiresAt,
      refreshedAt: now,
      updatedAt: now,
    };

    await tx
      .insert(socialAccountTokens)
      .values({ socialAccountId: account.id, ...tokenValues })
      .onConflictDoUpdate({
        target: socialAccountTokens.socialAccountId,
        set: tokenValues,
      });
  });
}

async function disconnectAccounts(condition: ReturnType<typeof and>) {
  const accounts = await db
    .update(socialAccounts)
    .set({ status: "desconectado", lastError: null, updatedAt: new Date() })
    .where(condition)
    .returning({ id: socialAccounts.id });

  if (accounts.length > 0) {
    await db.delete(socialAccountTokens).where(
      inArray(
        socialAccountTokens.socialAccountId,
        accounts.map(({ id }) => id),
      ),
    );
  }
}

export async function disconnectInstagram(storeId: string) {
  const [account] = await db
    .select({ facebookUserId: socialAccounts.providerUserId })
    .from(socialAccounts)
    .where(isInstagramAccount(storeId));

  if (account?.facebookUserId) {
    await revokeAppPermissions(
      getInstagramApiConfig(),
      account.facebookUserId,
    ).catch((error) =>
      console.error(
        "[instagram] falha ao revogar permissões",
        error instanceof InstagramApiError
          ? { status: error.status, code: error.code }
          : "erro desconhecido",
      ),
    );
  }

  await disconnectAccounts(isInstagramAccount(storeId));
}

export const disconnectInstagramByFacebookUser = (facebookUserId: string) =>
  disconnectAccounts(
    and(
      eq(socialAccounts.provider, "instagram"),
      eq(socialAccounts.providerUserId, facebookUserId),
    ),
  );

export const markInstagramForReconnect = (socialAccountId: string) =>
  db
    .update(socialAccounts)
    .set({
      status: "expirado",
      lastError: reconnectMessage,
      updatedAt: new Date(),
    })
    .where(eq(socialAccounts.id, socialAccountId));

export async function getInstagramAccessToken(storeId: string) {
  const [account] = await db
    .select({
      socialAccountId: socialAccounts.id,
      igUserId: socialAccounts.externalId,
      accessTokenEncrypted: socialAccountTokens.accessTokenEncrypted,
    })
    .from(socialAccounts)
    .innerJoin(
      socialAccountTokens,
      eq(socialAccountTokens.socialAccountId, socialAccounts.id),
    )
    .where(
      and(isInstagramAccount(storeId), eq(socialAccounts.status, "conectado")),
    );

  return account
    ? {
        socialAccountId: account.socialAccountId,
        igUserId: account.igUserId,
        accessToken: decryptToken(account.accessTokenEncrypted, getTokenKey()),
      }
    : null;
}

export async function expireStaleInstagramConnections(now = new Date()) {
  const expiredTokens = await db
    .select({ socialAccountId: socialAccountTokens.socialAccountId })
    .from(socialAccountTokens)
    .innerJoin(
      socialAccounts,
      eq(socialAccounts.id, socialAccountTokens.socialAccountId),
    )
    .where(
      and(
        eq(socialAccounts.status, "conectado"),
        lte(socialAccountTokens.expiresAt, now),
      ),
    );

  await Promise.all(
    expiredTokens.map(({ socialAccountId }) =>
      markInstagramForReconnect(socialAccountId),
    ),
  );

  return { expired: expiredTokens.length };
}
