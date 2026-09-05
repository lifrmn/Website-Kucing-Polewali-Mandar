import 'server-only';

import { InMemoryRateLimitStore } from '@/lib/rate-limit-store';

const store = new InMemoryRateLimitStore();

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  return store.consume(key, limit, windowMs);
}

export function resetRateLimit(key: string) {
  store.reset(key);
}