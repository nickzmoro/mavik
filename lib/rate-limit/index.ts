import "server-only";

import { MemoryRateLimitStore } from "./memory-store";
import type { RateLimitEntry, RateLimitStore } from "./store";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const STRIKE_MEMORY_MS = 24 * HOUR_MS;

export type RateLimitRule = {
  limit: number;
  windowMs: number;
  blockMs: number;
  maxBlockMs: number;
};

export const rateLimitRules = {
  signInByIpAndEmail: {
    limit: 5,
    windowMs: 15 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  signInByIp: {
    limit: 20,
    windowMs: 10 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  signInByEmail: {
    limit: 10,
    windowMs: HOUR_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  signUpByIp: {
    limit: 3,
    windowMs: HOUR_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  passwordResetByIp: {
    limit: 5,
    windowMs: HOUR_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  passwordResetByEmail: {
    limit: 3,
    windowMs: HOUR_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  updatePasswordByIp: {
    limit: 10,
    windowMs: 15 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  googleSignInByIp: {
    limit: 20,
    windowMs: 10 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  extractBrandManualByUser: {
    limit: 8,
    windowMs: HOUR_MS,
    blockMs: 5 * MINUTE_MS,
    maxBlockMs: 24 * HOUR_MS,
  },
  generateSampleCaptionByUser: {
    limit: 40,
    windowMs: 10 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: HOUR_MS,
  },
  generatePostCaptionByUser: {
    limit: 30,
    windowMs: 10 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: HOUR_MS,
  },
  generateIdeasByUser: {
    limit: 6,
    windowMs: 10 * MINUTE_MS,
    blockMs: MINUTE_MS,
    maxBlockMs: HOUR_MS,
  },
} satisfies Record<string, RateLimitRule>;

const globalForRateLimit = globalThis as typeof globalThis & {
  rateLimitStore?: RateLimitStore;
};

const store = (globalForRateLimit.rateLimitStore ??=
  new MemoryRateLimitStore());

function createEmptyEntry(now: number): RateLimitEntry {
  return { attempts: 0, windowStartedAt: now, blockedUntil: 0, strikes: 0 };
}

export async function getBlockedRemainingMs(keys: string[]) {
  const now = Date.now();
  const entries = await Promise.all(keys.map((key) => store.get(key)));

  return entries.reduce(
    (longestBlockMs, entry) =>
      Math.max(longestBlockMs, (entry?.blockedUntil ?? 0) - now),
    0,
  );
}

export async function registerAttempt(key: string, rule: RateLimitRule) {
  const now = Date.now();
  const entry = (await store.get(key)) ?? createEmptyEntry(now);
  const isWindowExpired = now - entry.windowStartedAt >= rule.windowMs;

  const nextEntry: RateLimitEntry = {
    ...entry,
    attempts: isWindowExpired ? 1 : entry.attempts + 1,
    windowStartedAt: isWindowExpired ? now : entry.windowStartedAt,
  };

  if (nextEntry.attempts >= rule.limit) {
    nextEntry.strikes += 1;
    nextEntry.attempts = 0;
    nextEntry.windowStartedAt = now;
    nextEntry.blockedUntil =
      now +
      Math.min(rule.blockMs * 2 ** (nextEntry.strikes - 1), rule.maxBlockMs);
  }

  const blockedRemainingMs = Math.max(nextEntry.blockedUntil - now, 0);
  const ttlMs = Math.max(rule.windowMs, blockedRemainingMs, STRIKE_MEMORY_MS);

  await store.set(key, nextEntry, ttlMs);

  return blockedRemainingMs;
}

export async function resetAttempts(key: string) {
  await store.delete(key);
}

export function formatRetryAfter(remainingMs: number) {
  const remainingMinutes = Math.max(Math.ceil(remainingMs / MINUTE_MS), 1);

  if (remainingMinutes < 60) {
    return remainingMinutes === 1 ? "1 minuto" : `${remainingMinutes} minutos`;
  }

  const remainingHours = Math.ceil(remainingMinutes / 60);

  return remainingHours === 1 ? "1 hora" : `${remainingHours} horas`;
}
