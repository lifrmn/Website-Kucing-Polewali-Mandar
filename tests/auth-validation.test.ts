import assert from 'node:assert/strict';
import test from 'node:test';

import { isStrongAdminPassword, loginSchema } from '../src/lib/validations/auth';

test('login validation normalizes email and bounds credential size', () => {
  const credentials = loginSchema.parse({
    email: '  ADMIN@Example.com ',
    password: 'existing-password',
  });

  assert.equal(credentials.email, 'admin@example.com');
  assert.throws(() => loginSchema.parse({
    email: 'not-an-email',
    password: 'password',
  }));
  assert.throws(() => loginSchema.parse({
    email: 'admin@example.com',
    password: 'x'.repeat(257),
  }));
});

test('initial admin password policy requires mixed character classes', () => {
  assert.equal(isStrongAdminPassword('short-A1!'), false);
  assert.equal(isStrongAdminPassword('alllowercase1!'), false);
  assert.equal(isStrongAdminPassword('No-Symbol-Password1'), true);
  assert.equal(isStrongAdminPassword('Strong Admin 1!'), true);
});