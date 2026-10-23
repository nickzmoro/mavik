import type { RateLimitEntry, RateLimitStore } from "./store";

const MAX_ENTRIES = 50_000;
const CLEANUP_INTERVAL_MS = 60_000;

type StoredEntry = {
  entry: RateLimitEntry;
  expiresAt: number;
};

export class MemoryRateLimitStore implements RateLimitStore {
  private entries = new Map<string, StoredEntry>();
  private lastCleanupAt = 0;

  async get(key: string) {
    const storedEntry = this.entries.get(key);

    if (!storedEntry) {
      return undefined;
    }

    if (storedEntry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    return storedEntry.entry;
  }

  async set(key: string, entry: RateLimitEntry, ttlMs: number) {
    this.removeExpiredEntries();
    this.entries.delete(key);
    this.entries.set(key, { entry, expiresAt: Date.now() + ttlMs });
    this.enforceMaxEntries();
  }

  async delete(key: string) {
    this.entries.delete(key);
  }

  private removeExpiredEntries() {
    const now = Date.now();

    if (now - this.lastCleanupAt < CLEANUP_INTERVAL_MS) {
      return;
    }

    this.lastCleanupAt = now;
    this.entries.forEach((storedEntry, key) => {
      if (storedEntry.expiresAt <= now) {
        this.entries.delete(key);
      }
    });
  }

  private enforceMaxEntries() {
    while (this.entries.size > MAX_ENTRIES) {
      const oldestKey = this.entries.keys().next().value;

      if (oldestKey === undefined) {
        return;
      }

      this.entries.delete(oldestKey);
    }
  }
}
