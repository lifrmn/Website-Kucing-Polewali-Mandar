import { UserRole } from '@/types/enums';

export type AdminPermission =
  | 'products:manage'
  | 'services:manage'
  | 'packages:manage'
  | 'orders:read'
  | 'orders:manage'
  | 'bookings:read'
  | 'bookings:manage'
  | 'blog:manage'
  | 'settings:manage'
  | 'uploads:manage';

export const allAdminPermissions: readonly AdminPermission[] = [
  'products:manage',
  'services:manage',
  'packages:manage',
  'orders:read',
  'orders:manage',
  'bookings:read',
  'bookings:manage',
  'blog:manage',
  'settings:manage',
  'uploads:manage',
];

const rolePermissions: Record<UserRole, ReadonlySet<AdminPermission>> = {
  [UserRole.SUPER_ADMIN]: new Set(allAdminPermissions),
  [UserRole.ADMIN]: new Set(allAdminPermissions),
  [UserRole.STAFF]: new Set([
    'orders:read',
    'orders:manage',
    'bookings:read',
    'bookings:manage',
  ]),
};

export function getAdminAuthorizationStatus(
  role: UserRole | null | undefined,
  permission: AdminPermission
): 200 | 401 | 403 {
  if (!role) return 401;
  return rolePermissions[role]?.has(permission) ? 200 : 403;
}