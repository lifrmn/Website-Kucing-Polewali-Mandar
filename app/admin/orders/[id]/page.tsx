'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { orderService } from '@/services/orderService';
import { Card, Badge, Button, Modal } from '@/components/ui';
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { OrderStatus } from '@/types/enums';

interface OrderDetail {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  shipping_address?: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  payment_proof_url?: string;
  payment_verified_at?: string;
  order_status: string;
  tracking_number?: string;
  admin_notes?: string;
  notes?: string;
  created_at: string | Date;
  items?: Array<{
    id: string;
    product_name: string;
    variant_name?: string;
    quantity: number;
    price: number;
  }>;
}

const statusVariants: Record<string, 'primary' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'accent',
  WAITING_VERIFICATION: 'accent',
  PAID: 'success',
  PROCESSING: 'primary',
  SHIPPED: 'primary',
  COMPLETED: 'success',
  CANCELED: 'danger',
  REFUNDED: 'danger',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPaymentProof, setShowPaymentProof] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    const response = await orderService.getOrderById(id);
    if (response.success && response.data) {
      setOrder(response.data);
      setAdminNotes(response.data.admin_notes || '');
      setTrackingNumber(response.data.tracking_number || '');
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    if (!confirm(`Update order status to "${newStatus.replace(/_/g, ' ')}"?`)) return;

    setUpdating(true);
    // Convert OrderStatus enum value to lowercase for API
    const apiStatus = newStatus.toLowerCase() as 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
    const response = await orderService.updateOrderStatus(order.id, apiStatus);
    if (response.success) {
      await loadOrder();
    } else {
      alert(response.error || 'Failed to update status');
    }
    setUpdating(false);
  };

  const handleVerifyPayment = async (verified: boolean) => {
    if (!order) return;
    if (!confirm(`${verified ? 'Verify' : 'Reject'} payment?`)) return;

    setUpdating(true);
    const response = await orderService.updatePaymentStatus(
      order.id,
      verified ? 'paid' : 'failed'
    );
    if (response.success) {
      await loadOrder();
    } else {
      alert(response.error || 'Failed to update payment status');
    }
    setUpdating(false);
  };

  const handleSaveNotes = async () => {
    if (!order) return;

    setUpdating(true);
    const response = await orderService.updateOrder(order.id, {
      admin_notes: adminNotes,
      tracking_number: trackingNumber,
    });
    if (response.success) {
      alert('Notes and tracking updated successfully');
      await loadOrder();
    } else {
      alert(response.error || 'Failed to update');
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-body text-muted">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card>
        <Card.Content className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-muted mb-4" />
          <p className="text-h3 font-semibold text-text mb-2">Order not found</p>
          <Link href="/admin/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-h1 font-bold text-text">Order #{order.order_number}</h1>
            <p className="text-small text-muted">{formatDate(new Date(order.created_at))}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusVariants[order.order_status] || 'accent'}>
            {order.order_status.replace(/_/g, ' ')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <Card.Header>
              <Card.Title>Order Items</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-surface2 rounded-button"
                  >
                    <div className="flex-1">
                      <p className="text-body font-semibold text-text">{item.product_name}</p>
                      {item.variant_name && (
                        <p className="text-small text-muted">Variant: {item.variant_name}</p>
                      )}
                      <p className="text-small text-muted">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-body font-bold text-text">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                      <p className="text-caption text-muted">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-h3 font-bold text-text">Total</p>
                  <p className="text-h2 font-bold text-primary">
                    {formatCurrency(order.total_amount)}
                  </p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Payment Information */}
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <div>
                  <Card.Title>Payment Information</Card.Title>
                  <Card.Description>Payment method and verification</Card.Description>
                </div>
                <Badge variant={order.payment_status === 'PAID' ? 'success' : 'accent'}>
                  {order.payment_status}
                </Badge>
              </div>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted" />
                <div>
                  <p className="text-small text-muted">Payment Method</p>
                  <p className="text-body font-semibold text-text">{order.payment_method}</p>
                </div>
              </div>

              {order.payment_proof_url && (
                <div>
                  <p className="text-small font-semibold text-text mb-2">Payment Proof</p>
                  <button
                    onClick={() => setShowPaymentProof(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface2 hover:bg-border rounded-button transition-colors"
                  >
                    <ImageIcon className="w-4 h-4" />
                    View Payment Proof
                  </button>
                </div>
              )}

              {order.payment_status === 'PENDING' && order.payment_proof_url && (
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="primary"
                    onClick={() => handleVerifyPayment(true)}
                    isLoading={updating}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Payment
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleVerifyPayment(false)}
                    isLoading={updating}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}

              {order.payment_verified_at && (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-4 h-4" />
                  <p className="text-small">
                    Verified on {formatDate(new Date(order.payment_verified_at))}
                  </p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Admin Notes & Tracking */}
          <Card>
            <Card.Header>
              <Card.Title>Admin Notes & Tracking</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <label className="block text-small font-semibold text-text mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number..."
                  className="w-full px-4 py-2 border border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-small font-semibold text-text mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes..."
                  className="w-full px-4 py-2 border border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                />
              </div>

              <Button onClick={handleSaveNotes} isLoading={updating}>
                Save Notes & Tracking
              </Button>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <Card.Header>
              <Card.Title>Customer</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted mt-0.5" />
                <div>
                  <p className="text-small text-muted">Name</p>
                  <p className="text-body font-semibold text-text">{order.customer_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted mt-0.5" />
                <div>
                  <p className="text-small text-muted">Email</p>
                  <p className="text-body text-text">{order.customer_email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted mt-0.5" />
                <div>
                  <p className="text-small text-muted">Phone</p>
                  <p className="text-body text-text">{order.customer_phone}</p>
                </div>
              </div>

              {order.shipping_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted mt-0.5" />
                  <div>
                    <p className="text-small text-muted">Shipping Address</p>
                    <p className="text-body text-text">{order.shipping_address}</p>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-muted mt-0.5" />
                  <div>
                    <p className="text-small text-muted">Customer Notes</p>
                    <p className="text-body text-text">{order.notes}</p>
                  </div>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Order Status Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Update Status</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-2">
              {Object.values(OrderStatus).map((status) => (
                <Button
                  key={status}
                  variant={order.order_status === status ? 'primary' : 'outline'}
                  onClick={() => handleUpdateStatus(status)}
                  disabled={order.order_status === status}
                  isLoading={updating}
                  className="w-full justify-start"
                  size="sm"
                >
                  {status === OrderStatus.PROCESSING && <Clock className="w-4 h-4 mr-2" />}
                  {status === OrderStatus.SHIPPED && <Truck className="w-4 h-4 mr-2" />}
                  {status === OrderStatus.COMPLETED && <CheckCircle className="w-4 h-4 mr-2" />}
                  {status === OrderStatus.CANCELED && <XCircle className="w-4 h-4 mr-2" />}
                  {status.replace(/_/g, ' ')}
                </Button>
              ))}
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showPaymentProof && order.payment_proof_url && (
        <Modal
          isOpen={showPaymentProof}
          onClose={() => setShowPaymentProof(false)}
          title="Payment Proof"
        >
          <div className="p-4">
            <img
              src={order.payment_proof_url}
              alt="Payment Proof"
              className="w-full rounded-button"
            />
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setShowPaymentProof(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
