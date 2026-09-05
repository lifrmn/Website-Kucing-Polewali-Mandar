import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import { PrismaClient } from '@prisma/client';

import {
  boardingBookingSchema,
  serviceBookingSchema,
} from '../src/lib/validations/booking';
import {
  BoardingBookingError,
  createBoardingBooking,
  updateBoardingBooking,
} from '../src/services/boardingBookingService';
import { BookingStatus } from '../src/types/enums';
import {
  createServiceBooking,
  ServiceBookingError,
  updateServiceBooking,
} from '../src/services/serviceBookingService';

const databasePath = join(tmpdir(), `cikal-booking-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`;
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

before(() => {
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
});

after(async () => {
  await prisma.$disconnect();
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
});

function dateFromToday(offset: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

async function createPackage(price = 75_000, isActive = true) {
  const id = randomUUID();
  return prisma.penitipanPackage.create({
    data: {
      id,
      name: `Package ${id}`,
      slug: `package-${id}`,
      price_per_night: price,
      features: 'Makan, kandang',
      is_active: isActive,
    },
  });
}

function bookingInput(packageId: string, phone = '081234567890') {
  return boardingBookingSchema.parse({
    package_id: packageId,
    customer_name: 'Customer Booking',
    customer_phone: phone,
    customer_email: '',
    cat_name: 'Milo',
    cat_age: '2 tahun',
    cat_gender: 'Jantan',
    check_in_date: dateFromToday(5),
    check_out_date: dateFromToday(8),
  });
}

test('boarding uses server price, reserves every night, and replays idempotently', async () => {
  const pkg = await createPackage(80_000);
  const input = bookingInput(pkg.id);
  const idempotencyKey = randomUUID();

  const first = await createBoardingBooking(prisma, input, idempotencyKey);
  assert.equal(first.replayed, false);
  assert.equal(first.booking.status, BookingStatus.PENDING);
  assert.equal(first.booking.total_nights, 3);
  assert.equal(first.booking.total_price, 240_000);

  const capacities = await prisma.bookingCapacity.findMany({ orderBy: { date: 'asc' } });
  assert.equal(capacities.length, 3);
  assert.deepEqual(capacities.map((entry) => entry.current_bookings), [1, 1, 1]);

  const replay = await createBoardingBooking(prisma, input, idempotencyKey);
  assert.equal(replay.replayed, true);
  assert.equal(replay.booking.id, first.booking.id);
  assert.equal(await prisma.penitipanBooking.count({ where: { package_id: pkg.id } }), 1);
  assert.deepEqual(
    (await prisma.bookingCapacity.findMany({ orderBy: { date: 'asc' } }))
      .map((entry) => entry.current_bookings),
    [1, 1, 1]
  );
});

test('overlapping stays share nightly capacity and a full night rolls back all changes', async () => {
  const pkg = await createPackage();
  await createBoardingBooking(prisma, bookingInput(pkg.id, '081234567891'), randomUUID());
  const overlapDate = new Date(`${dateFromToday(7)}T00:00:00.000Z`);
  const beforeOverlap = await prisma.bookingCapacity.findUniqueOrThrow({
    where: { date: overlapDate },
  });
  await createBoardingBooking(prisma, {
    ...bookingInput(pkg.id, '081234567892'),
    check_in_date: dateFromToday(7),
    check_out_date: dateFromToday(9),
  }, randomUUID());

  assert.equal(
    (await prisma.bookingCapacity.findUniqueOrThrow({ where: { date: overlapDate } })).current_bookings,
    beforeOverlap.current_bookings + 1
  );

  const fullDate = new Date(`${dateFromToday(12)}T00:00:00.000Z`);
  await prisma.bookingCapacity.create({
    data: { date: fullDate, max_capacity: 1, current_bookings: 1, is_available: false },
  });
  const bookingCount = await prisma.penitipanBooking.count();
  await assert.rejects(
    createBoardingBooking(prisma, {
      ...bookingInput(pkg.id, '081234567893'),
      check_in_date: dateFromToday(11),
      check_out_date: dateFromToday(13),
    }, randomUUID()),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'CAPACITY_FULL'
  );
  assert.equal(await prisma.penitipanBooking.count(), bookingCount);
  assert.equal(
    await prisma.bookingCapacity.count({
      where: { date: new Date(`${dateFromToday(11)}T00:00:00.000Z`) },
    }),
    0
  );
  assert.equal(await prisma.customer.count({ where: { phone: '081234567893' } }), 0);
});

test('cancellation releases capacity once and terminal state cannot be reopened', async () => {
  const pkg = await createPackage();
  const created = await createBoardingBooking(
    prisma,
    bookingInput(pkg.id, '081234567894'),
    randomUUID()
  );
  const stayDateFilter = {
    gte: new Date(`${dateFromToday(5)}T00:00:00.000Z`),
    lt: new Date(`${dateFromToday(8)}T00:00:00.000Z`),
  };
  const beforeCancel = await prisma.bookingCapacity.findMany({
    where: { date: stayDateFilter },
    orderBy: { date: 'asc' },
  });
  await updateBoardingBooking(prisma, created.booking.id, { status: BookingStatus.CANCELED });
  const afterCancel = await prisma.bookingCapacity.findMany({
    where: { date: stayDateFilter },
    orderBy: { date: 'asc' },
  });
  assert.deepEqual(
    afterCancel.map((entry) => entry.current_bookings),
    beforeCancel.map((entry) => entry.current_bookings - 1)
  );

  await updateBoardingBooking(prisma, created.booking.id, { status: BookingStatus.CANCELED });
  assert.deepEqual(
    (await prisma.bookingCapacity.findMany({
      where: { date: stayDateFilter },
      orderBy: { date: 'asc' },
    })).map((entry) => entry.current_bookings),
    afterCancel.map((entry) => entry.current_bookings)
  );
  await assert.rejects(
    updateBoardingBooking(prisma, created.booking.id, { status: BookingStatus.CONFIRMED }),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'INVALID_STATUS_TRANSITION'
  );
});

test('inactive package and invalid dates are rejected before persistence', async () => {
  const pkg = await createPackage(50_000, false);
  await assert.rejects(
    createBoardingBooking(prisma, bookingInput(pkg.id, '081234567895'), randomUUID()),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'PACKAGE_UNAVAILABLE'
  );
  assert.equal(await prisma.customer.count({ where: { phone: '081234567895' } }), 0);

  await assert.rejects(
    createBoardingBooking(prisma, {
      ...bookingInput(pkg.id),
      check_in_date: dateFromToday(10),
      check_out_date: dateFromToday(10),
    }, randomUUID()),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'INVALID_DATE_RANGE'
  );
  assert.throws(() => boardingBookingSchema.parse({
    ...bookingInput(pkg.id),
    check_in_date: '2026-02-31',
  }));
});

test('service booking enforces the database daily limit and reuses customers', async () => {
  const service = await prisma.service.create({
    data: {
      name: `Grooming ${randomUUID()}`,
      slug: `grooming-${randomUUID()}`,
      type: 'grooming',
      price: 120_000,
      max_bookings_per_day: 1,
    },
  });
  const input = serviceBookingSchema.parse({
    service_id: service.id,
    customer_name: 'Customer Booking',
    customer_phone: '081234567890',
    customer_email: 'booking@example.com',
    booking_date: dateFromToday(15),
    booking_time: '10:00',
    pet_name: 'Milo',
    pet_type: 'Kucing',
  });
  const idempotencyKey = randomUUID();

  const first = await createServiceBooking(prisma, input, idempotencyKey);
  assert.equal(first.replayed, false);
  assert.equal(first.booking.service.price, 120_000);
  assert.equal(first.booking.status, BookingStatus.PENDING);

  const replay = await createServiceBooking(prisma, input, idempotencyKey);
  assert.equal(replay.replayed, true);
  assert.equal(replay.booking.id, first.booking.id);

  await assert.rejects(
    createServiceBooking(prisma, {
      ...input,
      customer_phone: '081234567896',
      booking_time: '11:00',
    }, randomUUID()),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'DAILY_LIMIT_REACHED'
  );
  assert.equal(await prisma.customer.count({ where: { phone: '081234567896' } }), 0);
  assert.equal(await prisma.customer.count({ where: { phone: '081234567890' } }), 1);

  await prisma.serviceBooking.update({
    where: { id: first.booking.id },
    data: { status: BookingStatus.CANCELED },
  });
  const replacement = await createServiceBooking(prisma, {
    ...input,
    customer_phone: '081234567896',
    booking_time: '11:00',
  }, randomUUID());
  assert.equal(replacement.booking.status, BookingStatus.PENDING);
  await updateServiceBooking(prisma, replacement.booking.id, { status: BookingStatus.CONFIRMED });
  await updateServiceBooking(prisma, replacement.booking.id, { status: BookingStatus.COMPLETED });
  await assert.rejects(
    updateServiceBooking(prisma, replacement.booking.id, { status: BookingStatus.CANCELED }),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'INVALID_STATUS_TRANSITION'
  );
});

test('service booking rejects inactive services and past slots', async () => {
  const service = await prisma.service.create({
    data: {
      name: `Inactive ${randomUUID()}`,
      slug: `inactive-${randomUUID()}`,
      type: 'medical',
      price: 90_000,
      is_active: false,
    },
  });
  const input = serviceBookingSchema.parse({
    service_id: service.id,
    customer_name: 'Inactive Customer',
    customer_phone: '081234567897',
    booking_date: dateFromToday(16),
    booking_time: '09:00',
    pet_name: 'Luna',
    pet_type: 'Kucing',
  });

  await assert.rejects(
    createServiceBooking(prisma, input, randomUUID()),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'SERVICE_UNAVAILABLE'
  );
  await assert.rejects(
    createServiceBooking(prisma, {
      ...input,
      booking_date: dateFromToday(-1),
    }, randomUUID()),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'PAST_BOOKING_SLOT'
  );
});
