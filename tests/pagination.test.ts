import assert from 'node:assert/strict';
import test from 'node:test';

import { parsePagination } from '../src/lib/validations/pagination';

test('pagination uses bounded defaults', () => {
  assert.deepEqual(parsePagination(new URLSearchParams()), { page: 1, limit: 50 });
});

test('pagination rejects invalid and excessive values', () => {
  assert.throws(() => parsePagination(new URLSearchParams({ page: '0' })));
  assert.throws(() => parsePagination(new URLSearchParams({ limit: '101' })));
  assert.throws(() => parsePagination(new URLSearchParams({ limit: 'not-a-number' })));
});