import { Prisma, PrismaClient } from '@prisma/client';

import { createActivityLog, type AuditContext } from '@/lib/audit';
import type {
  ServiceBookingInput,
  ServiceBookingUpdateInput,
} from '@/lib/validations/booking';
import { BookingStatus } from '@/types/enums';

export type ServiceBookingErrorCode =
  | 'SERVICE_UNAVAILABLE'
  | 'PAST_BOOKING_SLOT'
  | 'DAILY_LIMIT_REACHED'
  | 'BOOKING_NOT_FOUND'
  | 'INVALID_STATUS_TRANSITION';

export class ServiceBookingError extends Error {
  constructor(public readonly code: ServiceBookingErrorCode) {
    super(code);
    this.name = 'ServiceBookingError';
  }
}

function parseBookingDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function isPastMakassarSlot(dateValue: string, timeValue: string) {
  const [year, month, day] = dateValue.split('-').map(Number);
  const [hours, minutes] = timeValue.split(':').map(Number);
  const slotUtc = Date.UTC(year, month - 1, day, hours - 8, minutes);
  return slotUtc <= Date.now();
}

export async function createServiceBooking(
  database: PrismaClient,
  input: ServiceBookingInput,
  idempotencyKey: string
) {
  const replay = await database.serviceBooking.findUnique({
    where: { idempotency_key: idempotencyKey },
    include: { customer: true, service: true },
  });
  if (replay) return { booking: replay, replayed: true };
  if (isPastMakassarSlot(input.booking_date, input.booking_time)) {
    throw new ServiceBookingError('PAST_BOOKING_SLOT');
  }

  try {
    const booking = await database.$transaction(async (tx) => {
      const service = await tx.service.findFirst({
        where: { id: input.service_id, is_active: true },
      });
      if (!service) throw new ServiceBookingError('SERVICE_UNAVAILABLE');

      const bookingDate = parseBookingDate(input.booking_date);
      const activeBookings = await tx.serviceBooking.count({
        where: {
          service_id: service.id,
          booking_date: bookingDate,
          status: { not: BookingStatus.CANCELED },
        },
      });
      if (activeBookings >= service.max_bookings_per_day) {
        throw new ServiceBookingError('DAILY_LIMIT_REACHED');
      }

      const customer = await tx.customer.upsert({
        where: { phone: input.customer_phone },
        update: {
          name: input.customer_name,
          email: input.customer_email || null,
        },
        create: {
          name: input.customer_name,
          phone: input.customer_phone,
          email: input.customer_email || null,
        },
      });

      return tx.serviceBooking.create({
        data: {
          idempotency_key: idempotencyKey,
          service_id: service.id,
          customer_id: customer.id,
          booking_date: bookingDate,
          booking_time: input.booking_time,
          pet_name: input.pet_name,
          pet_type: input.pet_type,
          notes: input.notes,
          status: BookingStatus.PENDING,
        },
        include: { customer: true, service: true },
      });
    }, { isolationLevel: 'Serializable', timeout: 10_000 });

    return { booking, replayed: false };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const replayedBooking = await database.serviceBooking.findUnique({
        where: { idempotency_key: idempotencyKey },
        include: { customer: true, service: true },
      });
      if (replayedBooking) return { booking: replayedBooking, replayed: true };
    }
    throw error;
  }
}

const serviceTransitions: Partial<Record<BookingStatus, BookingStatus[]>> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELED],
  [BookingStatus.CONFIRMED]: [BookingStatus.COMPLETED, BookingStatus.CANCELED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELED]: [],
};

export async function updateServiceBooking(
  database: PrismaClient,
  bookingId: string,
  input: ServiceBookingUpdateInput,
  auditContext?: AuditContext
) {
  return database.$transaction(async (tx) => {
    const booking = await tx.serviceBooking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new ServiceBookingError('BOOKING_NOT_FOUND');

    const currentStatus = booking.status as BookingStatus;
    if (
      input.status !== currentStatus &&
      !serviceTransitions[currentStatus]?.includes(input.status)
    ) {
      throw new ServiceBookingError('INVALID_STATUS_TRANSITION');
    }

    const updated = await tx.serviceBooking.update({
      where: { id: bookingId },
      data: { status: input.status },
      include: { customer: true, service: true },
    });

    if (auditContext) {
      await createActivityLog(tx, {
        ...auditContext,
        entityType: 'ServiceBooking',
        entityId: bookingId,
        action: 'UPDATE',
        description: 'Booking layanan diperbarui',
        metadata: { previousStatus: currentStatus, nextStatus: updated.status },
      });
    }

    return updated;
  }, { isolationLevel: 'Serializable', timeout: 10_000 });
}
