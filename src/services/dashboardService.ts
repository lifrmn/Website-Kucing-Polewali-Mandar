import type { PrismaClient } from '@prisma/client';

import { BookingStatus, OrderStatus, PaymentStatus } from '@/types/enums';

export async function getDashboardData(prisma: PrismaClient, now = new Date()) {
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const [
    totalProducts,
    totalServices,
    totalOrders,
    paidRevenue,
    statuses,
    recentOrders,
    monthlyOrders,
    boardingBookings,
    serviceBookings,
  ] = await prisma.$transaction([
    prisma.product.count({ where: { is_active: true } }),
    prisma.service.count({ where: { is_active: true } }),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { payment_status: PaymentStatus.PAID },
      _sum: { total_amount: true },
    }),
    prisma.order.findMany({ select: { status: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        order_number: true,
        total_amount: true,
        status: true,
        created_at: true,
        customer: { select: { name: true } },
      },
    }),
    prisma.order.findMany({
      where: {
        payment_status: PaymentStatus.PAID,
        created_at: { gte: sixMonthsAgo },
      },
      select: { total_amount: true, created_at: true },
    }),
    prisma.penitipanBooking.count({
      where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } },
    }),
    prisma.serviceBooking.count({
      where: { status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] } },
    }),
  ]);

  const statusCounts = new Map<string, number>();
  for (const entry of statuses) {
    statusCounts.set(entry.status, (statusCounts.get(entry.status) || 0) + 1);
  }
  const pendingOrders = (statusCounts.get(OrderStatus.PENDING) || 0)
    + (statusCounts.get(OrderStatus.WAITING_VERIFICATION) || 0);
  const processingOrders = (statusCounts.get(OrderStatus.PAID) || 0)
    + (statusCounts.get(OrderStatus.PROCESSING) || 0)
    + (statusCounts.get(OrderStatus.SHIPPED) || 0);
  const completedOrders = statusCounts.get(OrderStatus.COMPLETED) || 0;
  const canceledOrders = (statusCounts.get(OrderStatus.CANCELED) || 0)
    + (statusCounts.get(OrderStatus.REFUNDED) || 0);

  const months: Record<string, { bulan: string; pendapatan: number; pesanan: number }> = {};
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    months[key] = {
      bulan: date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      pendapatan: 0,
      pesanan: 0,
    };
  }
  for (const order of monthlyOrders) {
    const date = new Date(order.created_at);
    const bucket = months[`${date.getFullYear()}-${date.getMonth()}`];
    if (bucket) {
      bucket.pendapatan += order.total_amount;
      bucket.pesanan += 1;
    }
  }

  return {
    stats: {
      totalProducts,
      totalServices,
      totalOrders,
      totalRevenue: paidRevenue._sum.total_amount || 0,
      pendingOrders,
      completedOrders,
      canceledOrders,
      processingOrders,
      activeBookings: boardingBookings + serviceBookings,
    },
    statusData: [
      { name: 'Selesai', value: completedOrders, color: '#22c55e' },
      { name: 'Diproses', value: processingOrders, color: '#3b82f6' },
      { name: 'Menunggu', value: pendingOrders, color: '#f59e0b' },
      { name: 'Dibatalkan', value: canceledOrders, color: '#ef4444' },
    ].filter((entry) => entry.value > 0),
    monthlyData: Object.values(months),
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer.name,
      total_amount: order.total_amount,
      order_status: order.status,
      created_at: order.created_at,
    })),
  };
}

export const REPORT_PERIODS = [7, 30, 90, 365] as const;
export type ReportPeriod = (typeof REPORT_PERIODS)[number];

export async function getReportData(
  prisma: PrismaClient,
  period: ReportPeriod,
  now = new Date()
) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - period + 1);

  const validRevenueOrder = {
    payment_status: PaymentStatus.PAID,
    status: { notIn: [OrderStatus.CANCELED, OrderStatus.REFUNDED] },
    created_at: { gte: start, lte: now },
  };

  const [periodOrders, paidOrders, lowStockProducts] = await prisma.$transaction([
    prisma.order.findMany({
      where: { created_at: { gte: start, lte: now } },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        order_number: true,
        total_amount: true,
        status: true,
        payment_status: true,
        created_at: true,
        customer: { select: { name: true } },
      },
    }),
    prisma.order.findMany({
      where: validRevenueOrder,
      select: {
        total_amount: true,
        created_at: true,
        orderItems: {
          select: { name: true, quantity: true, subtotal: true },
        },
      },
    }),
    prisma.product.findMany({
      where: { is_active: true },
      orderBy: [{ stock: 'asc' }, { name: 'asc' }],
      select: { id: true, name: true, stock: true, low_stock_alert: true },
    }),
  ]);

  const dailyData: Array<{ tanggal: string; pendapatan: number; pesanan: number }> = [];
  const dailyIndex = new Map<string, (typeof dailyData)[number]>();
  for (let offset = 0; offset < period; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const key = date.toISOString().slice(0, 10);
    const entry = {
      tanggal: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      pendapatan: 0,
      pesanan: 0,
    };
    dailyData.push(entry);
    dailyIndex.set(key, entry);
  }
  for (const order of paidOrders) {
    const bucket = dailyIndex.get(order.created_at.toISOString().slice(0, 10));
    if (bucket) {
      bucket.pendapatan += order.total_amount;
      bucket.pesanan += 1;
    }
  }

  const statusCounts = new Map<string, number>();
  for (const order of periodOrders) {
    statusCounts.set(order.status, (statusCounts.get(order.status) || 0) + 1);
  }

  const productSales = new Map<string, { nama: string; terjual: number; pendapatan: number }>();
  for (const order of paidOrders) {
    for (const item of order.orderItems) {
      const current = productSales.get(item.name) || { nama: item.name, terjual: 0, pendapatan: 0 };
      current.terjual += item.quantity;
      current.pendapatan += item.subtotal;
      productSales.set(item.name, current);
    }
  }

  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total_amount, 0);
  return {
    period,
    summary: {
      totalRevenue,
      totalOrders: periodOrders.length,
      completedOrders: periodOrders.filter((order) => order.status === OrderStatus.COMPLETED).length,
      averagePaidOrder: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
    },
    dailyData,
    statusData: Array.from(statusCounts, ([status, value]) => ({ status, value })),
    topProducts: Array.from(productSales.values())
      .sort((left, right) => right.terjual - left.terjual)
      .slice(0, 5),
    lowStock: lowStockProducts
      .filter((product) => product.stock <= product.low_stock_alert)
      .slice(0, 5),
    recentOrders: periodOrders.slice(0, 20).map((order) => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer.name,
      total_amount: order.total_amount,
      payment_status: order.payment_status,
      order_status: order.status,
      created_at: order.created_at,
    })),
  };
}