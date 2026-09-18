import 'server-only';

import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import {
  getAdminAuthorizationStatus,
  type AdminPermission,
} from '@/lib/admin-permissions';
import { UserRole } from '@/types/enums';
import { isTrustedMutationRequest } from '@/lib/request-security';
import { NextResponse } from 'next/server';

export type { AdminPermission } from '@/lib/admin-permissions';

export async function authorizeAdmin(permission: AdminPermission, request?: Request) {
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

  if (request && !isTrustedMutationRequest(request)) {
    return {
      authorized: false as const,
      response: NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { is_active: true, role: true },
  });

  if (
    !user?.is_active ||
    getAdminAuthorizationStatus(user.role as UserRole, permission) === 403
  ) {
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