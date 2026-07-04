'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  DollarSign,
  ArrowUpRight,
  Scissors,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { productService } from '@/services/productService';
import { serviceService } from '@/services/serviceService';
import { orderService } from '@/services/orderService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700' },
  WAITING_VERIFICATION: { bg: 'bg-amber-50', text: 'text-amber-700' },
  PAID: { bg: 'bg-green-50', text: 'text-green-700' },
  PROCESSING: { bg: 'bg-blue-50', text: 'text-blue-700' },
  SHIPPED: { bg: 'bg-blue-50', text: 'text-blue-700' },
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700' },
  CANCELED: { bg: 'bg-red-50', text: 'text-red-700' },
  REFUNDED: { bg: 'bg-red-50', text: 'text-red-700' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalServices: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    canceledOrders: 0,
    processingOrders: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderStatusData, setOrderStatusData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    
    try {
      // Load products
      const productsRes = await productService.getProducts();
      const productsCount = productsRes.success && productsRes.data ? productsRes.data.data.length : 0;

      // Load services
      const servicesRes = await serviceService.getServices();
      const servicesCount = servicesRes.success && servicesRes.data ? servicesRes.data.length : 0;

      // Load orders
      const ordersRes = await orderService.getOrders();
      const orders = ordersRes.success && ordersRes.data ? ordersRes.data.data : [];
      const ordersCount = orders.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const revenue = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pending = orders.filter((o: any) => 
        o.order_status === 'PENDING' || o.order_status === 'WAITING_VERIFICATION'
      ).length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const completed = orders.filter((o: any) => o.order_status === 'COMPLETED').length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const canceled = orders.filter((o: any) => o.order_status === 'CANCELED').length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const processing = orders.filter((o: any) => o.order_status === 'PROCESSING' || o.order_status === 'PAID').length;

      // Order status pie data
      const statusData = [
        { name: 'Selesai', value: completed, color: '#22c55e' },
        { name: 'Diproses', value: processing, color: '#3b82f6' },
        { name: 'Menunggu', value: pending, color: '#f59e0b' },
        { name: 'Dibatalkan', value: canceled, color: '#ef4444' },
      ].filter(d => d.value > 0);

      // Monthly revenue data (last 6 months)
      const now = new Date();
      const months: Record<string, { bulan: string; pendapatan: number; pesanan: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        months[key] = { bulan: label, pendapatan: 0, pesanan: 0 };
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      orders.forEach((order: any) => {
        const d = new Date(order.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (months[key]) {
          months[key].pendapatan += order.total_amount;
          months[key].pesanan += 1;
        }
      });

      setOrderStatusData(statusData);
      setMonthlyData(Object.values(months));

      setStats({
        totalProducts: productsCount,
        totalServices: servicesCount,
        totalOrders: ordersCount,
        totalRevenue: revenue,
        pendingOrders: pending,
        completedOrders: completed,
        canceledOrders: canceled,
        processingOrders: processing,
      });

      // Set recent orders (top 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text mb-1">Dashboard</h1>
        <p className="text-sm text-muted">
          Ringkasan aktivitas dan statistik toko Anda hari ini
        </p>
      </div>

      {/* Stats Grid - 4 Kolom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-surface rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xs text-muted mb-1">Total Pendapatan</p>
          <p className="text-2xl font-bold text-text mb-1">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-green-600 font-medium">Semua transaksi</p>
        </div>

        {/* Total Orders */}
        <div className="bg-surface rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            {stats.pendingOrders > 0 && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                {stats.pendingOrders} baru
              </span>
            )}
          </div>
          <p className="text-xs text-muted mb-1">Total Pesanan</p>
          <p className="text-2xl font-bold text-text mb-1">{stats.totalOrders}</p>
          <p className="text-xs text-muted">{stats.pendingOrders} menunggu verifikasi</p>
        </div>

        {/* Products */}
        <div className="bg-surface rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-muted mb-1">Produk Aktif</p>
          <p className="text-2xl font-bold text-text mb-1">{stats.totalProducts}</p>
          <p className="text-xs text-muted">Item tersedia</p>
        </div>

        {/* Services */}
        <div className="bg-surface rounded-lg border border-border p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-muted mb-1">Layanan</p>
          <p className="text-2xl font-bold text-text mb-1">{stats.totalServices}</p>
          <p className="text-xs text-muted">Layanan tersedia</p>
        </div>
      </div>

      {/* Quick Actions - Informative Cards */}
      <div>
        <h2 className="text-lg font-bold text-text mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Produk */}
          <Link href="/admin/products">
            <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md hover:border-primary transition-all group min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Package className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text mb-1">Kelola Produk</p>
                <p className="text-xs text-muted mb-2">Tambah, edit, dan atur stok produk</p>
                <p className="text-xs font-medium text-primary">{stats.totalProducts} produk aktif</p>
              </div>
            </div>
          </Link>

          {/* Layanan */}
          <Link href="/admin/services">
            <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md hover:border-primary transition-all group min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:scale-110 transition-all">
                  <Scissors className="w-5 h-5 text-amber-600 group-hover:text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text mb-1">Kelola Layanan</p>
                <p className="text-xs text-muted mb-2">Atur layanan grooming dan konsultasi</p>
                <p className="text-xs font-medium text-amber-600">{stats.totalServices} layanan</p>
              </div>
            </div>
          </Link>

          {/* Pesanan */}
          <Link href="/admin/orders">
            <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md hover:border-primary transition-all group min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                  <ShoppingCart className="w-5 h-5 text-blue-600 group-hover:text-white" />
                </div>
                {stats.pendingOrders > 0 && (
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                    {stats.pendingOrders}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-text mb-1">Kelola Pesanan</p>
                <p className="text-xs text-muted mb-2">Verifikasi dan proses pesanan</p>
                <p className="text-xs font-medium text-blue-600">{stats.pendingOrders} menunggu</p>
              </div>
            </div>
          </Link>

          {/* Booking */}
          <Link href="/admin/bookings">
            <div className="bg-surface rounded-lg border border-border p-4 hover:shadow-md hover:border-primary transition-all group min-h-[120px] flex flex-col justify-between">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-500 group-hover:scale-110 transition-all">
                  <Calendar className="w-5 h-5 text-green-600 group-hover:text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text mb-1">Jadwal Booking</p>
                <p className="text-xs text-muted mb-2">Lihat dan kelola appointment</p>
                <p className="text-xs font-medium text-green-600">Lihat jadwal</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ==================== GRAFIK STATISTIK ==================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text">Grafik & Statistik</h2>
          <Link
            href="/admin/laporan"
            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
          >
            Lihat Laporan Lengkap
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Pendapatan Bulanan */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-text mb-4">Pendapatan 6 Bulan Terakhir</h3>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Pendapatan']}
                    labelStyle={{ fontSize: 12 }}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Bar dataKey="pendapatan" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted text-sm">Belum ada data pesanan</div>
            )}
          </div>

          {/* Pie Chart - Status Pesanan */}
          <div className="bg-surface rounded-lg border border-border p-5">
            <h3 className="text-sm font-semibold text-text mb-4">Distribusi Status Pesanan</h3>
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [Number(value ?? 0), 'Pesanan']}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted text-sm">Belum ada data pesanan</div>
            )}
          </div>
        </div>

        {/* Ringkasan Statistik Pesanan */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          {[
            { label: 'Selesai', value: stats.completedOrders, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Diproses', value: stats.processingOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Menunggu', value: stats.pendingOrders, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Dibatalkan', value: stats.canceledOrders, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} rounded-lg p-4 text-center`}>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Table */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">Pesanan Terbaru</h2>
            <Link 
              href="/admin/orders" 
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1"
            >
              Lihat Semua
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface2 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">ID Pesanan</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Pelanggan</th>
                    <th className="text-right text-xs font-semibold text-muted py-3 px-4">Total</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Status</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => {
                    const colors = statusColors[order.order_status] || { bg: 'bg-gray-50', text: 'text-gray-700' };
                    
                    return (
                      <tr 
                        key={order.id} 
                        className={`border-b border-border last:border-0 hover:bg-surface2 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-bg'}`}
                      >
                        <td className="py-3 px-4">
                          <Link 
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-mono font-semibold text-primary hover:text-primary-hover"
                          >
                            #{order.id}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-text">{order.customer_name}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold text-text">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
                            {order.order_status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted">
                            {new Date(order.created_at).toLocaleDateString('id-ID', { 
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric' 
                            })}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
