import assert from 'node:assert/strict';
import test from 'node:test';

import { getProductionEnvironmentErrors } from '../src/lib/environment';

test('production environment rejects missing and documented placeholder secrets', () => {
  const missing = getProductionEnvironmentErrors({ NODE_ENV: 'production' });
  assert.equal(missing.length, 3);

  const placeholder = getProductionEnvironmentErrors({
    NODE_ENV: 'production',
    DATABASE_URL: 'file:./production.db',
    AUTH_SECRET: 'generate-with-openssl-rand-base64-32',
    AUTH_URL: 'https://cikal.example.com',
  });
  assert.deepEqual(placeholder, ['AUTH_SECRET harus acak dan minimal 32 karakter']);
});

test('production environment accepts a durable database URL and HTTPS auth URL', () => {
  assert.deepEqual(getProductionEnvironmentErrors({
    NODE_ENV: 'production',
    DATABASE_URL: 'file:/data/cikal.db',
    AUTH_SECRET: 'a-unique-production-secret-with-more-than-32-characters',
    AUTH_URL: 'https://cikal.example.com',
  }), []);
  assert.deepEqual(getProductionEnvironmentErrors({
    NODE_ENV: 'production',
    DATABASE_URL: 'file:./smoke-test.db',
    AUTH_SECRET: 'a-unique-production-secret-with-more-than-32-characters',
    AUTH_URL: 'http://localhost:3000',
  }), []);
  assert.deepEqual(getProductionEnvironmentErrors({
    NODE_ENV: 'production',
    DATABASE_URL: 'file:/data/cikal.db',
    AUTH_SECRET: 'a-unique-production-secret-with-more-than-32-characters',
    AUTH_URL: 'http://cikal.example.com',
  }), ['AUTH_URL production harus menggunakan HTTPS']);
});

test('development environment does not require production credentials', () => {
  assert.deepEqual(getProductionEnvironmentErrors({ NODE_ENV: 'development' }), []);
});