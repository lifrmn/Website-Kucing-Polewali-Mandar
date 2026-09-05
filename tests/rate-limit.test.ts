import assert from 'node:assert/strict';
import test from 'node:test';

import { InMemoryRateLimitStore } from '../src/lib/rate-limit-store';
import { getClientIp } from '../src/lib/client-ip';

test('rate limiter enforces a fixed window and reports retry time', () => {
  const store = new InMemoryRateLimitStore();

  assert.deepEqual(store.consume('login:user', 2, 10_000, 1_000), {
    allowed: true,
    retryAfterSeconds: 0,
  });
  assert.equal(store.consume('login:user', 2, 10_000, 2_000).allowed, true);
  assert.deepEqual(store.consume('login:user', 2, 10_000, 2_500), {
    allowed: false,
    retryAfterSeconds: 9,
  });
  assert.equal(store.consume('login:user', 2, 10_000, 11_000).allowed, true);
});

test('rate limiter reset removes the current penalty', () => {
  const store = new InMemoryRateLimitStore();

  assert.equal(store.consume('login:user', 1, 10_000, 1_000).allowed, true);
  assert.equal(store.consume('login:user', 1, 10_000, 1_001).allowed, false);
  store.reset('login:user');
  assert.equal(store.consume('login:user', 1, 10_000, 1_002).allowed, true);
});

test('rate limiter removes expired entries before enforcing capacity', () => {
  const store = new InMemoryRateLimitStore(2);

  store.consume('expired-a', 1, 100, 1_000);
  store.consume('expired-b', 1, 100, 1_000);
  store.consume('current', 1, 100, 1_101);

  assert.equal(store.size, 1);
});

test('rate limiter evicts the oldest entry when unique keys reach capacity', () => {
  const store = new InMemoryRateLimitStore(2);

  store.consume('oldest', 1, 10_000, 1_000);
  store.consume('newer', 1, 10_000, 1_001);
  store.consume('newest', 1, 10_000, 1_002);

  assert.equal(store.size, 2);
  assert.equal(store.consume('oldest', 1, 10_000, 1_003).allowed, true);
  assert.equal(store.size, 2);
});

test('client IP extraction accepts bounded addresses and rejects arbitrary headers', () => {
  const request = (forwardedFor: string | null, realIp: string | null = null) => ({
    headers: new Headers({
      ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
      ...(realIp ? { 'x-real-ip': realIp } : {}),
    }),
  });

  assert.equal(getClientIp(request('203.0.113.10, 10.0.0.1')), '203.0.113.10');
  assert.equal(getClientIp(request(null, '2001:db8::1')), '2001:db8::1');
  assert.equal(getClientIp(request('attacker-controlled-value')), 'unknown');
  assert.equal(getClientIp(request('1'.repeat(65))), 'unknown');
});