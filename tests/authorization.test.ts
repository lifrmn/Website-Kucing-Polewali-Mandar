import assert from 'node:assert/strict';
import test from 'node:test';

import {
  allAdminPermissions,
  getAdminAuthorizationStatus,
} from '../src/lib/admin-permissions';
import { UserRole } from '../src/types/enums';

test('anonymous admin requests are unauthorized', () => {
  for (const permission of allAdminPermissions) {
    assert.equal(getAdminAuthorizationStatus(null, permission), 401);
  }
});

test('staff cannot mutate catalog, blog, settings, or uploads', () => {
  for (const permission of [
    'products:manage',
    'services:manage',
    'packages:manage',
    'blog:manage',
    'settings:manage',
    'uploads:manage',
  ] as const) {
    assert.equal(getAdminAuthorizationStatus(UserRole.STAFF, permission), 403);
  }
});

test('staff can manage only operational orders and bookings', () => {
  for (const permission of [
    'orders:read',
    'orders:manage',
    'bookings:read',
    'bookings:manage',
  ] as const) {
    assert.equal(getAdminAuthorizationStatus(UserRole.STAFF, permission), 200);
  }
});

test('admin and super admin have every declared permission', () => {
  for (const role of [UserRole.ADMIN, UserRole.SUPER_ADMIN]) {
    for (const permission of allAdminPermissions) {
      assert.equal(getAdminAuthorizationStatus(role, permission), 200);
    }
  }
});