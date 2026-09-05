import 'server-only';

import { auth } from '@/auth';
import {
  getAdminAuthorizationStatus,
  type AdminPermission,
} from '@/lib/admin-permissions';
import { NextResponse } from 'next/server';

export type { AdminPermission } from '@/lib/admin-permissions';

export async function authorizeAdmin(permission: AdminPermission) {
  const session = await auth();

  if (!session?.user) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  if (getAdminAuthorizationStatus(session.user.role, permission) === 403) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      ),
    };
  }

  return { authorized: true as const, session };
}