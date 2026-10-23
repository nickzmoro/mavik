export type RateLimitEntry = {
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number;
  strikes: number;
};

export interface RateLimitStore {
  get(key: string): Promise<RateLimitEntry | undefined>;
  set(key: string, entry: RateLimitEntry, ttlMs: number): Promise<void>;
  delete(key: string): Promise<void>;
}
