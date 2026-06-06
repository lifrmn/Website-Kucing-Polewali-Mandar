'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/orderService';
import { Button, Badge, Tabs, EmptyState, LoadingState, PageHeader, Toolbar } from '@/components/admin';
import { Search, Eye, Package, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatus, PaymentStatus } from '@/types/enums';
import AppIcon from '@/components/AppIcon';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string | Date;
}

const orderStatusLabels: Record<string, string> = {
  all: 'Semua',
  PENDING: 'Menunggu',
  WAITING_VERIFICATION: 'Verifikasi',
  PAID: 'Dibayar',
  PROCESSING: 'Diproses',
  SHIPPED: 'Dikirim',
  COMPLETED: 'Selesai',
  CANCELED: 'Dibatalkan',
  REFUNDED: 'Refund',
};

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

const paymentColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700' },
  PAID: { bg: 'bg-green-50', text: 'text-green-700' },
  FAILED: { bg: 'bg-red-50', text: 'text-red-700' },
  REFUNDED: { bg: 'bg-purple-50', text: 'text-purple-700' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async () => {
    setLoading(true);
    const response = await orderService.getOrders();
    if (response.success && response.data) {
      setOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.order_status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = {
      all: orders.length,
    };
    
    Object.values(OrderStatus).forEach(status => {
      counts[status] = orders.filter(o => o.order_status === status).length;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const tabs = [
    { id: 'all', label: 'Semua', count: statusCounts.all },
    ...Object.values(OrderStatus).map(status => ({
      id: status,
      label: orderStatusLabels[status],
      count: statusCounts[status],
    })),
  ];

  if (loading) {
    return <LoadingState message="Memuat pesanan..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Pesanan"
        subtitle={`Kelola dan pantau status pesanan · ${orders.length} total pesanan`}
        actions={
          <Button variant="secondary">
            <AppIcon icon={Download} size="sm" />
            Ekspor
          </Button>
        }
      />

      {/* Status Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Toolbar */}
      <Toolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nomor pesanan, nama, email, atau telepon..."
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
        }}
      />

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border">
          <EmptyState
            icon={Package}
            title={searchQuery || statusFilter !== 'all' ? 'Pesanan tidak ditemukan' : 'Belum ada pesanan'}
            description={
              searchQuery || statusFilter !== 'all'
                ? 'Coba sesuaikan filter atau kata kunci pencarian Anda'
                : 'Pesanan akan muncul di sini setelah pelanggan melakukan pembelian'
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface2 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">No. Pesanan</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Pelanggan</th>
                    <th className="text-right text-xs font-semibold text-muted py-3 px-4">Total</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Pembayaran</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Status</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Tanggal</th>
                    <th className="text-right text-xs font-semibold text-muted py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => {
                    const statusColor = statusColors[order.order_status] || { bg: 'bg-gray-50', text: 'text-gray-700' };
                    const paymentColor = paymentColors[order.payment_status] || { bg: 'bg-gray-50', text: 'text-gray-700' };
                    
                    return (
                      <tr
                        key={order.id}
                        className={`border-b border-border last:border-0 hover:bg-surface2 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-bg'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-mono font-semibold text-primary hover:text-primary-hover"
                          >
                            #{order.order_number}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-text">{order.customer_name}</p>
                            <p className="text-xs text-muted">{order.customer_email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-semibold text-text">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentColor.bg} ${paymentColor.text}`}>
                            {order.payment_status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor.bg} ${statusColor.text}`}>
                            {orderStatusLabels[order.order_status] || order.order_status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted">
                            {new Date(order.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                          >
                            <AppIcon icon={Eye} size="sm" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order) => {
              const statusColor = statusColors[order.order_status] || { bg: 'bg-gray-50', text: 'text-gray-700' };
              const paymentColor = paymentColors[order.payment_status] || { bg: 'bg-gray-50', text: 'text-gray-700' };
              
              return (
                <div
                  key={order.id}
                  className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-mono font-semibold text-primary hover:text-primary-hover"
                      >
                        #{order.order_number}
                      </Link>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColor.bg} ${statusColor.text}`}>
                      {orderStatusLabels[order.order_status] || order.order_status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm font-medium text-text">{order.customer_name}</p>
                    <p className="text-xs text-muted">{order.customer_email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-text">{formatCurrency(order.total_amount)}</p>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${paymentColor.bg} ${paymentColor.text}`}>
                        {order.payment_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                    >
                      <AppIcon icon={Eye} size="sm" />
                      <span className="leading-none">Lihat</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
