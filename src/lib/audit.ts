import type { Prisma } from '@prisma/client';

import { getClientIp } from '@/lib/client-ip';

export interface AuditContext {
  userId: string;
  ipAddress?: string;
}

interface ActivityInput extends AuditContext {
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown>;
  orderId?: string;
  bookingId?: string;
}

export function createActivityLog(
  database: Prisma.TransactionClient,
  input: ActivityInput
) {
  const metadata = input.metadata ? JSON.stringify(input.metadata) : null;
  if (metadata && metadata.length > 4_000) {
    throw new Error('Audit metadata melebihi batas 4000 karakter');
  }

  return database.activityLog.create({
    data: {
      user_id: input.userId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      action: input.action,
      description: input.description,
      metadata,
      ip_address: input.ipAddress || null,
      order_id: input.orderId || null,
      booking_id: input.bookingId || null,
    },
  });
}

export function getRequestIp(request: Request): string | undefined {
  const address = getClientIp(request);
  return address === 'unknown' ? undefined : address;
}