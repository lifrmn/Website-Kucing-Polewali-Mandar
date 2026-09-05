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
import { FileBarChart2, TrendingUp, ShoppingCart, Package, Scissors } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
  const [report, setReport] = useState<{
    summary: { totalRevenue: number; totalOrders: number; completedOrders: number; averagePaidOrder: number };
    dailyData: Array<{ tanggal: string; pendapatan: number; pesanan: number }>;
    statusData: Array<{ status: string; value: number }>;
    topProducts: Array<{ nama: string; terjual: number; pendapatan: number }>;
    lowStock: Array<{ id: string; name: string; stock: number; low_stock_alert: number }>;
    recentOrders: Array<{
      id: string;
      order_number: string;
      customer_name: string;
      total_amount: number;
      payment_status: string;
      order_status: string;
      created_at: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState<'7' | '30' | '90' | '365'>('30');

  useEffect(() => {
    let canceled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/dashboard?report=true&period=${periode}`);
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || 'Laporan gagal dimuat');
        if (!canceled) setReport(result.data);
      } catch (error) {
        console.error(error);
        if (!canceled) setReport(null);
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    void loadData();
    return () => {
      canceled = true;
    };
  }, [periode]);

  const summary = report?.summary || { totalRevenue: 0, totalOrders: 0, completedOrders: 0, averagePaidOrder: 0 };
  const dailyData = report?.dailyData || [];
  const pieData = (report?.statusData || []).map((entry) => ({
    name: STATUS_LABEL[entry.status] || entry.status,
    value: entry.value,
    color: STATUS_COLORS[entry.status] || '#6b7280',
  }));
  const topProducts = report?.topProducts || [];
  const lowStock = report?.lowStock || [];
  const recentOrders = report?.recentOrders || [];

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
                  ? 'bg-primary text-[#2A2A1A]'
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
          <p className="text-xl font-bold text-text">{formatCurrency(summary.totalRevenue)}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-xs text-muted mb-1">Total Pesanan</p>
          <p className="text-xl font-bold text-text">{summary.totalOrders}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-surface2 flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-xs text-muted mb-1">Pesanan Selesai</p>
          <p className="text-xl font-bold text-text">{summary.completedOrders}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Scissors className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xs text-muted mb-1">Rata-rata per Pesanan</p>
          <p className="text-xl font-bold text-text">{formatCurrency(summary.averagePaidOrder)}</p>
        </div>
      </div>

      {/* Grafik Pendapatan Harian */}
      <div className="bg-surface rounded-lg border border-border p-5">
        <h2 className="text-sm font-semibold text-text mb-4">
          Grafik Pendapatan Harian ({periode === '7' ? '7 Hari' : periode === '30' ? '30 Hari' : periode === '90' ? '3 Bulan' : '1 Tahun'})
        </h2>
        {dailyData.some((d) => d.pendapatan > 0) ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="tanggal" tick={{ fontSize: 10 }} interval={Math.floor(dailyData.length / 6)} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: unknown) => [formatCurrency(Number(value) || 0), 'Pendapatan']}
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
                <Tooltip formatter={(v: unknown) => [Number(v) || 0, 'Pesanan']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
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
              {lowStock.map((p, i) => (
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
        {recentOrders.length > 0 ? (
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
                {recentOrders.map((order, i) => (
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
