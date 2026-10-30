import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const OAUTH_STATE_COOKIE = "ig_oauth_state";
export const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

type OAuthStatePayload = {
  nonce: string;
  userId: string;
  storeId: string;
  expiresAt: number;
};

const sign = (encodedPayload: string, secret: string) =>
  createHmac("sha256", secret).update(encodedPayload).digest("base64url");

const isSameText = (first: string, second: string) => {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  return (
    firstBuffer.length === secondBuffer.length &&
    timingSafeEqual(firstBuffer, secondBuffer)
  );
};

export function createOAuthState({
  userId,
  storeId,
  secret,
  now = Date.now(),
}: {
  userId: string;
  storeId: string;
  secret: string;
  now?: number;
}) {
  const payload: OAuthStatePayload = {
    nonce: randomBytes(16).toString("base64url"),
    userId,
    storeId,
    expiresAt: now + OAUTH_STATE_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );

  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyOAuthState({
  state,
  cookieState,
  userId,
  secret,
  now = Date.now(),
}: {
  state: string | null;
  cookieState: string | undefined;
  userId: string;
  secret: string;
  now?: number;
}) {
  if (!state || !cookieState || !isSameText(state, cookieState)) {
    return null;
  }

  const [encodedPayload, signature] = state.split(".");

  if (
    !encodedPayload ||
    !signature ||
    !isSameText(signature, sign(encodedPayload, secret))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as OAuthStatePayload;

    return payload.userId === userId && payload.expiresAt > now
      ? { storeId: payload.storeId }
      : null;
  } catch {
    return null;
  }
}
