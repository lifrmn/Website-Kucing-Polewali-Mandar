'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { FileBarChart2, Download, TrendingUp, ShoppingCart, Package, Scissors, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { orderService } from '@/services/orderService';
import { productService } from '@/services/productService';
import { serviceService } from '@/services/serviceService';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: '#22c55e',
  PAID: '#3b82f6',
  PROCESSING: '#6366f1',
  PENDING: '#f59e0b',
  WAITING_VERIFICATION: '#f59e0b',
  CANCELED: '#ef4444',
  REFUNDED: '#8b5cf6',
};

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: 'Selesai',
  PAID: 'Dibayar',
  PROCESSING: 'Diproses',
  PENDING: 'Menunggu',
  WAITING_VERIFICATION: 'Verifikasi',
  CANCELED: 'Dibatalkan',
  REFUNDED: 'Dikembalikan',
};

export default function LaporanPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState<'7' | '30' | '90' | '365'>('30');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, servicesRes] = await Promise.all([
        orderService.getOrders(),
        productService.getProducts(),
        serviceService.getServices(),
      ]);
      setOrders(ordersRes.success && ordersRes.data ? ordersRes.data.data : []);
      setProducts(productsRes.success && productsRes.data ? productsRes.data.data : []);
      setServices(servicesRes.success && servicesRes.data ? servicesRes.data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ─── Filter berdasarkan periode ──────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    const diff = (Date.now() - new Date(o.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= Number(periode);
  });

  // ─── Ringkasan statistik ─────────────────────────────────────────
  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total_amount, 0);
  const totalPesanan = filteredOrders.length;
  const totalSelesai = filteredOrders.filter((o) => o.order_status === 'COMPLETED').length;
  const rataOrder = totalPesanan > 0 ? totalRevenue / totalPesanan : 0;

  // ─── Pendapatan harian ───────────────────────────────────────────
  const dailyMap: Record<string, { tanggal: string; pendapatan: number; pesanan: number }> = {};
  const days = Number(periode) <= 30 ? Number(periode) : 30;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    dailyMap[key] = { tanggal: label, pendapatan: 0, pesanan: 0 };
  }
  filteredOrders.forEach((o) => {
    const key = new Date(o.created_at).toISOString().slice(0, 10);
    if (dailyMap[key]) {
      dailyMap[key].pendapatan += o.total_amount;
      dailyMap[key].pesanan += 1;
    }
  });
  const dailyData = Object.values(dailyMap);

  // ─── Distribusi status ───────────────────────────────────────────
  const statusCount: Record<string, number> = {};
  filteredOrders.forEach((o) => {
    statusCount[o.order_status] = (statusCount[o.order_status] || 0) + 1;
  });
  const pieData = Object.entries(statusCount).map(([k, v]) => ({
    name: STATUS_LABEL[k] || k,
    value: v,
    color: STATUS_COLORS[k] || '#6b7280',
  }));

  // ─── Produk terlaris (berdasarkan jumlah order items) ────────────
  const productSales: Record<string, { nama: string; terjual: number; pendapatan: number }> = {};
  filteredOrders.forEach((order) => {
    (order.orderItems || order.items || []).forEach((item: any) => {
      const name = item.product_name || item.service_name || 'Produk';
      if (!productSales[name]) productSales[name] = { nama: name, terjual: 0, pendapatan: 0 };
      productSales[name].terjual += item.quantity || 1;
      productSales[name].pendapatan += (item.price || 0) * (item.quantity || 1);
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.terjual - a.terjual)
    .slice(0, 5);

  // ─── Stok produk rendah ──────────────────────────────────────────
  const lowStock = products
    .filter((p: any) => p.stock <= (p.low_stock_alert || 5))
    .sort((a: any, b: any) => a.stock - b.stock)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted">Memuat laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-primary" />
            Laporan Sistem
          </h1>
          <p className="text-sm text-muted mt-1">
            Laporan manajemen — Cikal Pet Care Polewali Mandar
          </p>
        </div>
        {/* Filter Periode */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Periode:</span>
          {(['7', '30', '90', '365'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                periode === p
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-muted hover:text-text'
              }`}
            >
              {p === '7' ? '7 Hari' : p === '30' ? '30 Hari' : p === '90' ? '3 Bulan' : '1 Tahun'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xs text-muted mb-1">Total Pendapatan</p>
          <p className="text-xl font-bold text-text">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-muted mb-1">Total Pesanan</p>
          <p className="text-xl font-bold text-text">{totalPesanan}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xs text-muted mb-1">Pesanan Selesai</p>
          <p className="text-xl font-bold text-text">{totalSelesai}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Scissors className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xs text-muted mb-1">Rata-rata per Pesanan</p>
          <p className="text-xl font-bold text-text">{formatCurrency(rataOrder)}</p>
        </div>
      </div>

      {/* Grafik Pendapatan Harian */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-text mb-4">
          Grafik Pendapatan Harian ({periode === '7' ? '7 Hari' : periode === '30' ? '30 Hari' : periode === '90' ? '3 Bulan (30 hari terakhir)' : '1 Tahun (30 hari terakhir)'})
        </h2>
        {dailyData.some((d) => d.pendapatan > 0) ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} interval={Math.floor(dailyData.length / 6)} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Pendapatan']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="pendapatan" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted text-sm">
            Belum ada transaksi dalam periode ini
          </div>
        )}
      </div>

      {/* Grafik Bar Pesanan per Hari & Pie Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar: jumlah pesanan harian */}
        <div className="bg-surface rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold text-text mb-4">Jumlah Pesanan Harian</h2>
          {dailyData.some((d) => d.pesanan > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} interval={Math.floor(dailyData.length / 6)} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="pesanan" fill="#6366f1" radius={[4, 4, 0, 0]} name="Pesanan" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted text-sm">Belum ada data</div>
          )}
        </div>

        {/* Pie: status pesanan */}
        <div className="bg-surface rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold text-text mb-4">Distribusi Status Pesanan</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'Pesanan']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted text-sm">Belum ada data</div>
          )}
        </div>
      </div>

      {/* Produk Terlaris & Stok Rendah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produk terlaris */}
        <div className="bg-surface rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold text-text mb-4">Produk / Layanan Terlaris</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-text truncate">{item.nama}</p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-sm font-semibold text-text">{item.terjual}x</p>
                    <p className="text-xs text-muted">{formatCurrency(item.pendapatan)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-sm text-muted">
              Belum ada data penjualan
            </div>
          )}
        </div>

        {/* Stok rendah */}
        <div className="bg-surface rounded-lg border border-border p-5">
          <h2 className="text-sm font-semibold text-text mb-4">Peringatan Stok Produk</h2>
          {lowStock.length > 0 ? (
            <div className="space-y-3">
              {lowStock.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.stock === 0 ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <p className="text-sm text-text truncate">{p.name}</p>
                  </div>
                  <span
                    className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                      p.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {p.stock === 0 ? 'Habis' : `${p.stock} sisa`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-sm text-green-600 font-medium">
              Semua stok dalam kondisi baik ✓
            </div>
          )}
        </div>
      </div>

      {/* Tabel Rekap Pesanan */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-text mb-4">Rekap Pesanan — {periode === '7' ? '7 Hari' : periode === '30' ? '30 Hari' : periode === '90' ? '3 Bulan' : '1 Tahun'} Terakhir</h2>
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted">ID Pesanan</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted">Pelanggan</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted">Total</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted">Status</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.slice(0, 20).map((order, i) => (
                  <tr key={order.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-bg'}`}>
                    <td className="py-2 px-3 font-mono text-xs text-primary">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="py-2 px-3 text-text">{order.customer_name}</td>
                    <td className="py-2 px-3 text-right font-semibold text-text">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          background: (STATUS_COLORS[order.order_status] || '#6b7280') + '20',
                          color: STATUS_COLORS[order.order_status] || '#6b7280',
                        }}
                      >
                        {STATUS_LABEL[order.order_status] || order.order_status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-muted text-xs">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length > 20 && (
              <p className="text-xs text-muted text-center mt-3 py-2 border-t border-border">
                Menampilkan 20 dari {filteredOrders.length} pesanan. Lihat semua di halaman Pesanan.
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-sm text-muted">
            Tidak ada pesanan dalam periode ini
          </div>
        )}
      </div>

      {/* Footer info skripsi */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
        <p className="text-xs text-muted">
          <span className="font-semibold text-primary">Cikal Pet Care Polman</span> — Sistem Informasi Manajemen Layanan Perawatan Kucing Berbasis Web
        </p>
        <p className="text-xs text-muted mt-0.5">Studi Kasus: Cikal Pet Care Polewali Mandar · Laporan digenerate otomatis oleh sistem</p>
      </div>
    </div>
  );
}
