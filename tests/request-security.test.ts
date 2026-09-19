import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getRequestBodyLimit,
  isRequestBodyWithinLimit,
  isTrustedMutationRequest,
} from '../src/lib/request-security';

test('same-origin mutation requests are accepted', () => {
  const request = new Request('https://cikal.example.com/api/orders/1', {
    method: 'PUT',
    headers: { origin: 'https://cikal.example.com', 'sec-fetch-site': 'same-origin' },
  });
  assert.equal(isTrustedMutationRequest(request), true);
});

test('cross-origin browser mutation requests are rejected', () => {
  const request = new Request('https://cikal.example.com/api/orders/1', {
    method: 'PUT',
    headers: { origin: 'https://attacker.example', 'sec-fetch-site': 'cross-site' },
  });
  assert.equal(isTrustedMutationRequest(request), false);
});

test('authenticated non-browser clients and safe methods remain supported', () => {
  assert.equal(isTrustedMutationRequest(new Request('https://cikal.example.com/api/orders/1', {
    method: 'PUT',
  })), true);
  assert.equal(isTrustedMutationRequest(new Request('https://cikal.example.com/api/orders/1', {
    method: 'GET',
    headers: { origin: 'https://attacker.example' },
  })), true);
});

test('normal API mutations are limited to 100 KB with or without content-length', async () => {
  const declaredOversize = new Request('https://cikal.example.com/api/orders', {
    method: 'POST',
    headers: { 'content-length': String(100 * 1024 + 1) },
  });
  const streamedOversize = new Request('https://cikal.example.com/api/orders', {
    method: 'POST',
    body: 'x'.repeat(100 * 1024 + 1),
  });

  assert.equal(getRequestBodyLimit(declaredOversize), 100 * 1024);
  assert.equal(await isRequestBodyWithinLimit(declaredOversize), false);
  assert.equal(await isRequestBodyWithinLimit(streamedOversize), false);
});

test('image upload mutations use a separate 6 MB transport envelope', async () => {
  const upload = new Request('https://cikal.example.com/api/upload', {
    method: 'POST',
    headers: { 'content-length': String(5 * 1024 * 1024 + 512) },
  });
  const ordinaryMutation = new Request('https://cikal.example.com/api/products', {
    method: 'POST',
    headers: { 'content-length': String(5 * 1024 * 1024 + 512) },
  });

  assert.equal(getRequestBodyLimit(upload), 6 * 1024 * 1024);
  assert.equal(await isRequestBodyWithinLimit(upload), true);
  assert.equal(await isRequestBodyWithinLimit(ordinaryMutation), false);
});