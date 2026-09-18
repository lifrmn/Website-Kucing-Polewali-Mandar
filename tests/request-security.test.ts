import assert from 'node:assert/strict';
import test from 'node:test';

import { isTrustedMutationRequest } from '../src/lib/request-security';

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