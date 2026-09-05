import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import { PrismaClient } from '@prisma/client';

import { getDashboardData, getReportData } from '../src/services/dashboardService';
import { BookingStatus, OrderStatus, PaymentStatus } from '../src/types/enums';

const databasePath = join(tmpdir(), `cikal-dashboard-${randomUUID()}.db`);
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

test('dashboard counts only authoritative active and paid records', async () => {
  const customer = await prisma.customer.create({
    data: { name: 'Dashboard Customer', phone: '081200000001' },
  });
  await prisma.product.createMany({ data: [
    { name: 'Active product', slug: 'active-product', sku: 'ACTIVE-1', price: 10_000, stock: 1, category: 'test' },
    { name: 'Inactive product', slug: 'inactive-product', sku: 'INACTIVE-1', price: 10_000, stock: 1, category: 'test', is_active: false },
  ] });
  const activeService = await prisma.service.create({
    data: { name: 'Active service', slug: 'active-service', type: 'test', price: 20_000 },
  });
  await prisma.service.create({
    data: { name: 'Inactive service', slug: 'inactive-service', type: 'test', price: 20_000, is_active: false },
  });

  const orders = [
    [OrderStatus.PENDING, PaymentStatus.PENDING, 100_000],
    [OrderStatus.WAITING_VERIFICATION, PaymentStatus.VERIFYING, 200_000],
    [OrderStatus.PAID, PaymentStatus.PAID, 300_000],
    [OrderStatus.CANCELED, PaymentStatus.PENDING, 400_000],
    [OrderStatus.REFUNDED, PaymentStatus.REFUNDED, 500_000],
    [OrderStatus.COMPLETED, PaymentStatus.PAID, 600_000],
  ] as const;
  await prisma.order.createMany({
    data: orders.map(([status, paymentStatus, total], index) => ({
      order_number: `DASH-${index + 1}`,
      customer_id: customer.id,
      subtotal: total,
      total_amount: total,
      payment_method: 'BANK_TRANSFER',
      payment_status: paymentStatus,
      status,
      created_at: new Date(`2026-03-${String(index + 1).padStart(2, '0')}T08:00:00.000Z`),
    })),
  });

  const boardingPackage = await prisma.penitipanPackage.create({
    data: { name: 'Dashboard package', slug: 'dashboard-package', price_per_night: 50_000, features: 'Makan' },
  });
  await prisma.penitipanBooking.createMany({ data: [
    {
      booking_number: 'BOARD-ACTIVE', customer_id: customer.id, package_id: boardingPackage.id,
      cat_name: 'Milo', check_in_date: new Date('2026-03-20'), check_out_date: new Date('2026-03-21'),
      total_nights: 1, total_price: 50_000, status: BookingStatus.CONFIRMED,
    },
    {
      booking_number: 'BOARD-DONE', customer_id: customer.id, package_id: boardingPackage.id,
      cat_name: 'Mimi', check_in_date: new Date('2026-03-10'), check_out_date: new Date('2026-03-11'),
      total_nights: 1, total_price: 50_000, status: BookingStatus.CHECKED_OUT,
    },
  ] });
  await prisma.serviceBooking.createMany({ data: [
    {
      service_id: activeService.id, customer_id: customer.id, booking_date: new Date('2026-03-20'),
      booking_time: '10:00', pet_name: 'Milo', pet_type: 'Kucing', status: BookingStatus.PENDING,
    },
    {
      service_id: activeService.id, customer_id: customer.id, booking_date: new Date('2026-03-21'),
      booking_time: '11:00', pet_name: 'Mimi', pet_type: 'Kucing', status: BookingStatus.COMPLETED,
    },
  ] });

  const dashboard = await getDashboardData(prisma, new Date('2026-03-15T12:00:00.000Z'));

  assert.deepEqual(dashboard.stats, {
    totalProducts: 1,
    totalServices: 1,
    totalOrders: 6,
    totalRevenue: 900_000,
    pendingOrders: 2,
    completedOrders: 1,
    canceledOrders: 2,
    processingOrders: 1,
    activeBookings: 2,
  });
  const currentMonth = dashboard.monthlyData[dashboard.monthlyData.length - 1];
  assert.equal(currentMonth?.pendapatan, 900_000);
  assert.equal(currentMonth?.pesanan, 2);
  assert.equal(dashboard.recentOrders.length, 5);
  assert.deepEqual(
    dashboard.recentOrders.map((order) => order.order_number),
    ['DASH-6', 'DASH-5', 'DASH-4', 'DASH-3', 'DASH-2']
  );
});

test('report revenue excludes unpaid, canceled, and refunded orders', async () => {
  const report = await getReportData(prisma, 30, new Date('2026-03-15T23:59:59.000Z'));

  assert.equal(report.summary.totalOrders, 6);
  assert.equal(report.summary.totalRevenue, 900_000);
  assert.equal(report.summary.averagePaidOrder, 450_000);
  assert.equal(report.dailyData.length, 30);
  assert.equal(
    report.dailyData.reduce((sum, day) => sum + day.pendapatan, 0),
    900_000
  );
  assert.equal(report.recentOrders.length, 6);
});