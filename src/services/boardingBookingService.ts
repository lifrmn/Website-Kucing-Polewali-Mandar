import { Prisma, PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';

import { createActivityLog, type AuditContext } from '@/lib/audit';
import type {
  BoardingBookingInput,
  BoardingBookingUpdateInput,
} from '@/lib/validations/booking';
import { BookingStatus, PaymentMethod, PaymentStatus } from '@/types/enums';

export type BoardingBookingErrorCode =
  | 'PACKAGE_UNAVAILABLE'
  | 'INVALID_DATE_RANGE'
  | 'PAST_CHECK_IN'
  | 'CAPACITY_FULL'
  | 'TOO_MANY_CATS'
  | 'PAYMENT_METHOD_UNAVAILABLE'
  | 'BOOKING_NOT_FOUND'
  | 'INVALID_STATUS_TRANSITION';

export class BoardingBookingError extends Error {
  constructor(public readonly code: BoardingBookingErrorCode) {
    super(code);
    this.name = 'BoardingBookingError';
  }
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function getStayDates(
  checkInValue: string,
  checkOutValue: string,
  options: { allowPast?: boolean } = {}
) {
  const checkIn = parseDate(checkInValue);
  const checkOut = parseDate(checkOutValue);
  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
  if (nights < 1 || nights > 30) throw new BoardingBookingError('INVALID_DATE_RANGE');
  if (!options.allowPast && checkIn < todayUtc()) {
    throw new BoardingBookingError('PAST_CHECK_IN');
  }
  return Array.from({ length: nights }, (_, index) =>
    new Date(checkIn.getTime() + index * 86_400_000)
  );
}

const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.CANCELED],
  [BookingStatus.CONFIRMED]: [BookingStatus.CHECKED_IN, BookingStatus.CANCELED],
  [BookingStatus.CHECKED_IN]: [BookingStatus.CHECKED_OUT],
  [BookingStatus.CHECKED_OUT]: [BookingStatus.COMPLETED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELED]: [],
};

export async function createBoardingBooking(
  database: PrismaClient,
  input: BoardingBookingInput,
  idempotencyKey: string
) {
  const replay = await database.penitipanBooking.findUnique({
    where: { idempotency_key: idempotencyKey },
    include: { customer: true, package: true },
  });
  if (replay) return { booking: replay, replayed: true };

  const stayDates = getStayDates(input.check_in_date, input.check_out_date);
  try {
    const booking = await database.$transaction(async (tx) => {
      const pkg = await tx.penitipanPackage.findFirst({
        where: { id: input.package_id, is_active: true },
      });
      if (!pkg) throw new BoardingBookingError('PACKAGE_UNAVAILABLE');
      if (input.cat_count > pkg.max_cats) {
        throw new BoardingBookingError('TOO_MANY_CATS');
      }
      const paymentSettings = await tx.settings.findMany({
        where: {
          key: {
            in: [
              'payment_bank_transfer_active',
              'payment_bank_name',
              'payment_bank_account',
              'payment_bank_account_name',
              'payment_qris_active',
              'payment_qris_image_url',
              'payment_cod_active',
              'payment_boarding_deposit_percent',
            ],
          },
        },
        select: { key: true, value: true },
      });
      const paymentValues = new Map(paymentSettings.map((setting) => [setting.key, setting.value]));
      const paymentAvailable = input.payment_method === PaymentMethod.BANK_TRANSFER
        ? paymentValues.get('payment_bank_transfer_active') === 'true'
          && Boolean(paymentValues.get('payment_bank_name'))
          && Boolean(paymentValues.get('payment_bank_account'))
          && Boolean(paymentValues.get('payment_bank_account_name'))
        : input.payment_method === PaymentMethod.QRIS
          ? paymentValues.get('payment_qris_active') === 'true'
            && Boolean(paymentValues.get('payment_qris_image_url'))
          : paymentValues.get('payment_cod_active') === 'true';
      if (!paymentAvailable) throw new BoardingBookingError('PAYMENT_METHOD_UNAVAILABLE');

      for (const date of stayDates) {
        let capacity = await tx.bookingCapacity.findUnique({ where: { date } });
        if (!capacity) {
          const existingBookings = await tx.penitipanBooking.aggregate({
            where: {
              status: { not: BookingStatus.CANCELED },
              check_in_date: { lte: date },
              check_out_date: { gt: date },
            },
            _sum: { cat_count: true },
          });
          const occupiedCapacity = existingBookings._sum.cat_count ?? 0;
          capacity = await tx.bookingCapacity.create({
            data: {
              date,
              current_bookings: occupiedCapacity,
              is_available: occupiedCapacity < 10,
            },
          });
        }

        if (
          !capacity.is_available ||
          capacity.current_bookings + input.cat_count > capacity.max_capacity
        ) {
          throw new BoardingBookingError('CAPACITY_FULL');
        }
        const incremented = await tx.bookingCapacity.updateMany({
          where: {
            id: capacity.id,
            current_bookings: capacity.current_bookings,
            is_available: true,
          },
          data: {
            current_bookings: { increment: input.cat_count },
            is_available: capacity.current_bookings + input.cat_count < capacity.max_capacity,
          },
        });
        if (incremented.count !== 1) throw new BoardingBookingError('CAPACITY_FULL');
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
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
      const bookingNumber = `BOK-${datePart}-${randomBytes(6).toString('hex').toUpperCase()}`;
      const totalPrice = pkg.price_per_night * stayDates.length * input.cat_count;
      const configuredDepositPercent = Number(paymentValues.get('payment_boarding_deposit_percent') ?? 30);
      const depositPercent = Number.isFinite(configuredDepositPercent)
        ? Math.min(100, Math.max(0, configuredDepositPercent))
        : 30;
      const depositAmount = input.payment_method === PaymentMethod.COD
        ? 0
        : Math.round(totalPrice * depositPercent / 100);

      return tx.penitipanBooking.create({
        data: {
          booking_number: bookingNumber,
          idempotency_key: idempotencyKey,
          customer_id: customer.id,
          package_id: pkg.id,
          cat_name: input.cat_name,
          cat_age: input.cat_age,
          cat_gender: input.cat_gender,
          cat_breed: input.cat_breed,
          cat_health_condition: input.cat_health_condition,
          cat_count: input.cat_count,
          vaccination_status: input.vaccination_status,
          routine_medication: input.routine_medication,
          allergies: input.allergies,
          special_food: input.special_food,
          check_in_date: parseDate(input.check_in_date),
          check_out_date: parseDate(input.check_out_date),
          total_nights: stayDates.length,
          total_price: totalPrice,
          status: BookingStatus.PENDING,
          payment_method: input.payment_method,
          deposit_amount: depositAmount,
          special_requests: input.special_requests,
          emergency_contact: input.emergency_contact,
          boarding_terms_accepted_at: new Date(),
        },
        include: { customer: true, package: true },
      });
    }, { isolationLevel: 'Serializable', timeout: 10_000 });

    return { booking, replayed: false };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const replayedBooking = await database.penitipanBooking.findUnique({
        where: { idempotency_key: idempotencyKey },
        include: { customer: true, package: true },
      });
      if (replayedBooking) return { booking: replayedBooking, replayed: true };
    }
    throw error;
  }
}

export function updateBoardingBooking(
  database: PrismaClient,
  bookingId: string,
  input: BoardingBookingUpdateInput,
  auditContext?: AuditContext
) {
  return database.$transaction(async (tx) => {
    const current = await tx.penitipanBooking.findUnique({ where: { id: bookingId } });
    if (!current) throw new BoardingBookingError('BOOKING_NOT_FOUND');

    const currentStatus = current.status as BookingStatus;
    if (
      input.status &&
      input.status !== currentStatus &&
      !allowedTransitions[currentStatus]?.includes(input.status)
    ) {
      throw new BoardingBookingError('INVALID_STATUS_TRANSITION');
    }

    if (input.status === BookingStatus.CANCELED && currentStatus !== BookingStatus.CANCELED) {
      const stayDates = getStayDates(
        current.check_in_date.toISOString().slice(0, 10),
        current.check_out_date.toISOString().slice(0, 10),
        { allowPast: true }
      );
      for (const date of stayDates) {
        await tx.bookingCapacity.updateMany({
          where: { date, current_bookings: { gte: current.cat_count } },
          data: { current_bookings: { decrement: current.cat_count }, is_available: true },
        });
      }
    }

    const now = new Date();
    const data: Prisma.PenitipanBookingUncheckedUpdateInput = {};
    if (input.status !== undefined) data.status = input.status;
    if (input.payment_status !== undefined) data.payment_status = input.payment_status;
    if (input.admin_notes !== undefined) data.admin_notes = input.admin_notes || null;
    if (input.payment_status === PaymentStatus.PAID) data.payment_verified_at = now;
    if (input.status === BookingStatus.CONFIRMED) data.confirmed_at = current.confirmed_at ?? now;
    if (input.status === BookingStatus.CHECKED_IN) data.checked_in_at = current.checked_in_at ?? now;
    if (input.status === BookingStatus.CHECKED_OUT) data.checked_out_at = current.checked_out_at ?? now;

    const updated = await tx.penitipanBooking.update({
      where: { id: bookingId },
      data,
      include: { customer: true, package: true },
    });

    if (auditContext) {
      await createActivityLog(tx, {
        ...auditContext,
        entityType: 'PenitipanBooking',
        entityId: bookingId,
        bookingId,
        action: 'UPDATE',
        description: 'Booking penitipan diperbarui',
        metadata: {
          previousStatus: currentStatus,
          nextStatus: updated.status,
          previousPaymentStatus: current.payment_status,
          nextPaymentStatus: updated.payment_status,
          adminNotesChanged: input.admin_notes !== undefined,
        },
      });
    }

    return updated;
  }, { isolationLevel: 'Serializable', timeout: 10_000 });
}
