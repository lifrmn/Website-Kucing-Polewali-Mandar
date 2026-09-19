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
import { BookingStatus, PaymentMethod, PaymentStatus, PetType } from '../src/types/enums';
import {
  createServiceBooking,
  ServiceBookingError,
  updateServiceBooking,
} from '../src/services/serviceBookingService';
import { findCustomerBooking } from '../src/services/customerBookingService';

const databasePath = join(tmpdir(), `cikal-booking-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`;
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

before(async () => {
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
  await prisma.settings.createMany({
    data: [
      { key: 'payment_bank_transfer_active', value: 'true' },
      { key: 'payment_bank_name', value: 'Bank Test' },
      { key: 'payment_bank_account', value: '1234567890' },
      { key: 'payment_bank_account_name', value: 'Cikal Test' },
      { key: 'payment_boarding_deposit_percent', value: '30' },
    ],
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
    pet_name: 'Milo',
    pet_type: PetType.CAT,
    pet_age: '2 tahun',
    pet_gender: 'Jantan',
    pet_health_condition: 'Sehat',
    pet_count: 1,
    vaccination_status: 'VACCINATED',
    emergency_contact: '081234567899',
    payment_method: PaymentMethod.BANK_TRANSFER,
    boarding_terms_accepted: true,
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
  assert.equal(first.booking.deposit_amount, 72_000);
  assert.equal(first.booking.payment_method, PaymentMethod.BANK_TRANSFER);

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

  const privateLookup = await findCustomerBooking(prisma, {
    booking_number: first.booking.booking_number,
    customer_phone: input.customer_phone,
  });
  assert.equal(privateLookup?.booking_number, first.booking.booking_number);
  assert.equal('customer' in (privateLookup || {}), false);
  assert.equal(await findCustomerBooking(prisma, {
    booking_number: first.booking.booking_number,
    customer_phone: '081200000000',
  }), null);
});

test('boarding reserves capacity and calculates server price per pet', async () => {
  const pkg = await createPackage(60_000);
  await prisma.penitipanPackage.update({ where: { id: pkg.id }, data: { max_pets: 2 } });
  const input = {
    ...bookingInput(pkg.id, '081234567898'),
    pet_count: 2,
    check_in_date: dateFromToday(20),
    check_out_date: dateFromToday(23),
  };
  const created = await createBoardingBooking(prisma, input, randomUUID());

  assert.equal(created.booking.pet_count, 2);
  assert.equal(created.booking.total_price, 360_000);
  assert.ok(created.booking.boarding_terms_accepted_at);
  assert.deepEqual(
    (await prisma.bookingCapacity.findMany({
      where: {
        date: {
          gte: new Date(`${dateFromToday(20)}T00:00:00.000Z`),
          lt: new Date(`${dateFromToday(23)}T00:00:00.000Z`),
        },
      },
      orderBy: { date: 'asc' },
    })).map((entry) => entry.current_bookings),
    [2, 2, 2]
  );
});

test('admin payment verification records the verified timestamp', async () => {
  const pkg = await createPackage();
  const created = await createBoardingBooking(
    prisma,
    bookingInput(pkg.id, '081234567887'),
    randomUUID()
  );
  const updated = await updateBoardingBooking(prisma, created.booking.id, {
    payment_status: PaymentStatus.PAID,
  });
  assert.equal(updated.payment_status, PaymentStatus.PAID);
  assert.ok(updated.payment_verified_at);
});

test('boarding rejects pet count above the selected package limit', async () => {
  const pkg = await createPackage();
  await assert.rejects(
    createBoardingBooking(prisma, {
      ...bookingInput(pkg.id, '081234567889'),
      pet_count: 2,
    }, randomUUID()),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'TOO_MANY_PETS'
  );
});

test('boarding rejects payment methods that are not actively configured', async () => {
  const pkg = await createPackage();
  await assert.rejects(
    createBoardingBooking(prisma, {
      ...bookingInput(pkg.id, '081234567888'),
      payment_method: PaymentMethod.QRIS,
    }, randomUUID()),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'PAYMENT_METHOD_UNAVAILABLE'
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
  const actor = await prisma.user.create({
    data: {
      email: `booking-audit-${randomUUID()}@example.com`,
      name: 'Booking Audit Admin',
      password: 'test-only',
    },
  });
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
  await updateBoardingBooking(
    prisma,
    created.booking.id,
    { status: BookingStatus.CANCELED },
    { userId: actor.id, ipAddress: '127.0.0.1' }
  );
  const afterCancel = await prisma.bookingCapacity.findMany({
    where: { date: stayDateFilter },
    orderBy: { date: 'asc' },
  });
  assert.deepEqual(
    afterCancel.map((entry) => entry.current_bookings),
    beforeCancel.map((entry) => entry.current_bookings - 1)
  );
  const audit = await prisma.activityLog.findFirstOrThrow({
    where: { booking_id: created.booking.id, user_id: actor.id },
  });
  assert.equal(audit.action, 'UPDATE');
  assert.equal(audit.ip_address, '127.0.0.1');
  assert.match(audit.metadata || '', /"nextStatus":"CANCELED"/);
  assert.doesNotMatch(audit.metadata || '', /Milo|081234567894/);

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

test('boarding and service bookings reject unsupported pet types atomically', async () => {
  const pkg = await createPackage();
  await assert.rejects(
    createBoardingBooking(prisma, {
      ...bookingInput(pkg.id, '081234567873'),
      pet_type: PetType.DOG,
    }, randomUUID()),
    (error: unknown) => error instanceof BoardingBookingError && error.code === 'PET_TYPE_UNSUPPORTED'
  );

  const service = await prisma.service.create({
    data: {
      name: `Layanan Kucing ${randomUUID()}`,
      slug: `layanan-kucing-${randomUUID()}`,
      type: 'konsultasi',
      price: 75_000,
      supported_pet_types: '["CAT"]',
    },
  });
  const input = serviceBookingSchema.parse({
    service_id: service.id,
    customer_name: 'Pemilik Anjing',
    customer_phone: '081234567874',
    booking_date: dateFromToday(11),
    booking_time: '09:00',
    pet_name: 'Bolt',
    pet_type: PetType.DOG,
  });
  await assert.rejects(
    createServiceBooking(prisma, input, randomUUID()),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'PET_TYPE_UNSUPPORTED'
  );
  assert.equal(await prisma.customer.count({
    where: { phone: { in: ['081234567873', '081234567874'] } },
  }), 0);
});

test('service booking requires a species description for OTHER', () => {
  const input = {
    service_id: randomUUID(),
    customer_name: 'Pemilik Hewan',
    customer_phone: '081234567890',
    booking_date: dateFromToday(10),
    booking_time: '09:00',
    pet_name: 'Bubu',
    pet_type: PetType.OTHER,
  };

  assert.equal(serviceBookingSchema.safeParse(input).success, false);
  assert.equal(serviceBookingSchema.safeParse({ ...input, pet_type_other: 'Guinea pig' }).success, true);
});

test('service booking stores OTHER details and clears them for known species', async () => {
  const service = await prisma.service.create({
    data: {
      name: `Konsultasi ${randomUUID()}`,
      slug: `konsultasi-${randomUUID()}`,
      type: 'konsultasi',
      price: 75_000,
      supported_pet_types: '["CAT","OTHER"]',
    },
  });
  const baseInput = {
    service_id: service.id,
    customer_name: 'Pemilik Hewan',
    booking_date: dateFromToday(12),
    booking_time: '09:00',
    pet_name: 'Bubu',
  };

  const otherBooking = await createServiceBooking(prisma, serviceBookingSchema.parse({
    ...baseInput,
    customer_phone: '081234567871',
    pet_type: PetType.OTHER,
    pet_type_other: 'Guinea pig',
  }), randomUUID());
  assert.equal(otherBooking.booking.pet_type_other, 'Guinea pig');

  const catBooking = await createServiceBooking(prisma, serviceBookingSchema.parse({
    ...baseInput,
    customer_phone: '081234567872',
    pet_type: PetType.CAT,
    pet_type_other: 'Tidak boleh tersimpan',
  }), randomUUID());
  assert.equal(catBooking.booking.pet_type_other, null);
});

test('service booking enforces the database daily limit and reuses customers', async () => {
  const actor = await prisma.user.create({
    data: {
      email: `service-booking-audit-${randomUUID()}@example.com`,
      name: 'Service Booking Audit Admin',
      password: 'test-only',
    },
  });
  const service = await prisma.service.create({
    data: {
      name: `Grooming ${randomUUID()}`,
      slug: `grooming-${randomUUID()}`,
      type: 'grooming',
      price: 120_000,
      max_bookings_per_day: 1,
    },
  });
  await prisma.groomingSlot.createMany({
    data: [
      { time: '10:00', max_bookings: 1 },
      { time: '11:00', max_bookings: 1 },
    ],
  });
  const input = serviceBookingSchema.parse({
    service_id: service.id,
    customer_name: 'Customer Booking',
    customer_phone: '081234567890',
    customer_email: 'booking@example.com',
    booking_date: dateFromToday(15),
    booking_time: '10:00',
    pet_name: 'Milo',
    pet_type: PetType.CAT,
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
  await updateServiceBooking(
    prisma,
    replacement.booking.id,
    { status: BookingStatus.CONFIRMED },
    { userId: actor.id, ipAddress: '127.0.0.1' }
  );
  await updateServiceBooking(prisma, replacement.booking.id, { status: BookingStatus.COMPLETED });
  const audit = await prisma.activityLog.findFirstOrThrow({
    where: {
      entity_type: 'ServiceBooking',
      entity_id: replacement.booking.id,
      user_id: actor.id,
    },
  });
  assert.equal(audit.ip_address, '127.0.0.1');
  assert.match(audit.metadata || '', /"nextStatus":"CONFIRMED"/);
  await assert.rejects(
    updateServiceBooking(prisma, replacement.booking.id, { status: BookingStatus.CANCELED }),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'INVALID_STATUS_TRANSITION'
  );
});

test('grooming rejects an unmanaged or full time slot', async () => {
  const service = await prisma.service.create({
    data: {
      name: `Slot Grooming ${randomUUID()}`,
      slug: `slot-grooming-${randomUUID()}`,
      type: 'grooming',
      price: 100_000,
      max_bookings_per_day: 5,
    },
  });
  await prisma.groomingSlot.upsert({
    where: { time: '14:30' },
    update: { is_active: true, max_bookings: 1 },
    create: { time: '14:30', max_bookings: 1 },
  });
  const input = serviceBookingSchema.parse({
    service_id: service.id,
    customer_name: 'Slot Customer',
    customer_phone: '081234567879',
    booking_date: dateFromToday(18),
    booking_time: '14:30',
    pet_name: 'Mimi',
    pet_type: PetType.CAT,
  });

  await createServiceBooking(prisma, input, randomUUID());
  await assert.rejects(
    createServiceBooking(prisma, { ...input, customer_phone: '081234567878' }, randomUUID()),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'SLOT_UNAVAILABLE'
  );
  await assert.rejects(
    createServiceBooking(prisma, { ...input, customer_phone: '081234567877', booking_time: '16:45' }, randomUUID()),
    (error: unknown) => error instanceof ServiceBookingError && error.code === 'SLOT_UNAVAILABLE'
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
    pet_type: PetType.CAT,
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
