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

test('staff cannot access admin APIs', () => {
  for (const permission of allAdminPermissions) {
    assert.equal(getAdminAuthorizationStatus(UserRole.STAFF, permission), 403);
  }
});

test('admin and super admin have every declared permission', () => {
  for (const role of [UserRole.ADMIN, UserRole.SUPER_ADMIN]) {
    for (const permission of allAdminPermissions) {
      assert.equal(getAdminAuthorizationStatus(role, permission), 200);
    }
  }
});