interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export class InMemoryRateLimitStore {
  private readonly entries = new Map<string, RateLimitEntry>();
  private operations = 0;

  constructor(private readonly maxEntries = 10_000) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError('maxEntries harus bilangan bulat minimal 1');
    }
  }

  consume(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
    if (!key || !Number.isInteger(limit) || limit < 1 || !Number.isFinite(windowMs) || windowMs < 1) {
      throw new RangeError('Konfigurasi rate limit tidak valid');
    }

    this.operations += 1;
    if (this.operations % 100 === 0) this.removeExpired(now);

    const existing = this.entries.get(key);
    if (!existing || existing.resetAt <= now) {
      if (existing) this.entries.delete(key);
      this.ensureCapacity(now);
      this.entries.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }

    existing.count += 1;
    if (existing.count <= limit) {
      return { allowed: true, retryAfterSeconds: 0 };
    }

    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  reset(key: string): void {
    this.entries.delete(key);
  }

  get size(): number {
    return this.entries.size;
  }

  private ensureCapacity(now: number): void {
    if (this.entries.size < this.maxEntries) return;

    this.removeExpired(now);
    while (this.entries.size >= this.maxEntries) {
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey === undefined) return;
      this.entries.delete(oldestKey);
    }
  }

  private removeExpired(now: number): void {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key);
    }
  }
}