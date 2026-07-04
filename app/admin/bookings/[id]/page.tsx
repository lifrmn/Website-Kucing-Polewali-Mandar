'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui';
import { ArrowLeft, Calendar, User, Phone, Mail, PawPrint, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface BookingDetail {
  id: string;
  booking_number: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  package: {
    name: string;
    price_per_night: number;
  };
  cat_name: string;
  cat_age: string;
  cat_gender: string;
  cat_breed?: string;
  cat_health_condition?: string;
  check_in_date: string;
  check_out_date: string;
  total_nights: number;
  total_price: number;
  status: string;
  special_requests?: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

const statusVariants: Record<string, 'primary' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'accent',
  CONFIRMED: 'primary',
  CHECKED_IN: 'success',
  CHECKED_OUT: 'success',
  CANCELED: 'danger',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  CANCELED: 'Canceled',
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadBooking();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBooking = async () => {
    try {
      const res = await fetch(`/api/bookings/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setBooking(data.data);
        setAdminNotes(data.data.admin_notes || '');
      }
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!booking) return;
    if (!confirm(`Update booking status to "${statusLabels[newStatus]}"?`)) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        await loadBooking();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!booking) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Notes saved successfully');
        await loadBooking();
      } else {
        alert(data.error || 'Failed to save notes');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-body text-muted">Loading booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-h2 font-bold text-text">Booking Not Found</p>
          <Link href="/admin/bookings">
            <Button>Back to Bookings</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/bookings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-h1 font-bold text-text">{booking.booking_number}</h1>
            <Badge variant={statusVariants[booking.status]}>
              {statusLabels[booking.status]}
            </Badge>
          </div>
          <p className="text-body text-muted">
            Created {formatDate(new Date(booking.created_at))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Package & Dates */}
          <Card>
            <Card.Header>
              <Card.Title>Booking Details</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div>
                <p className="text-small text-muted">Package</p>
                <p className="text-h3 font-bold text-text">{booking.package.name}</p>
                <p className="text-body text-muted">
                  {formatCurrency(booking.package.price_per_night)} per night
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-small text-muted">Check-in Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-body font-semibold text-text">
                      {formatDate(new Date(booking.check_in_date))}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-small text-muted">Check-out Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-body font-semibold text-text">
                      {formatDate(new Date(booking.check_out_date))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface2 rounded-button">
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted">Total Nights</span>
                  <span className="text-h3 font-bold text-text">{booking.total_nights}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-body font-semibold text-text">Total Price</span>
                  <span className="text-h2 font-bold text-primary">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Cat Information */}
          <Card>
            <Card.Header>
              <Card.Title>Cat Information</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-3">
              <div className="flex items-center gap-3">
                <PawPrint className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-small text-muted">Cat Name</p>
                  <p className="text-body font-semibold text-text">{booking.cat_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-small text-muted">Age</p>
                  <p className="text-body text-text">{booking.cat_age}</p>
                </div>
                <div>
                  <p className="text-small text-muted">Gender</p>
                  <p className="text-body text-text">{booking.cat_gender}</p>
                </div>
              </div>

              {booking.cat_breed && (
                <div>
                  <p className="text-small text-muted">Breed</p>
                  <p className="text-body text-text">{booking.cat_breed}</p>
                </div>
              )}

              {booking.cat_health_condition && (
                <div>
                  <p className="text-small text-muted">Health Condition</p>
                  <p className="text-body text-text">{booking.cat_health_condition}</p>
                </div>
              )}

              {booking.special_requests && (
                <div>
                  <p className="text-small text-muted">Special Requests</p>
                  <p className="text-body text-text">{booking.special_requests}</p>
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Admin Notes */}
          <Card>
            <Card.Header>
              <Card.Title>Admin Notes</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4">
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes..."
                className="w-full px-4 py-2 border border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
              />
              <Button onClick={handleSaveNotes} isLoading={updating}>
                Save Notes
              </Button>
            </Card.Content>
          </Card>
        </div>

        {/* Right Column - Customer & Actions */}
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
                  <p className="text-body font-semibold text-text">{booking.customer.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted mt-0.5" />
                <div>
                  <p className="text-small text-muted">Email</p>
                  <p className="text-body text-text">{booking.customer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted mt-0.5" />
                <div>
                  <p className="text-small text-muted">Phone</p>
                  <p className="text-body text-text">{booking.customer.phone}</p>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Status Actions */}
          <Card>
            <Card.Header>
              <Card.Title>Update Status</Card.Title>
            </Card.Header>
            <Card.Content className="space-y-2">
              {Object.entries(statusLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={booking.status === key ? 'primary' : 'outline'}
                  onClick={() => handleUpdateStatus(key)}
                  disabled={booking.status === key}
                  isLoading={updating}
                  className="w-full justify-start"
                  size="sm"
                >
                  {key === 'PENDING' && <Clock className="w-4 h-4 mr-2" />}
                  {key === 'CONFIRMED' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {key === 'CHECKED_IN' && <PawPrint className="w-4 h-4 mr-2" />}
                  {key === 'CHECKED_OUT' && <CheckCircle className="w-4 h-4 mr-2" />}
                  {key === 'CANCELED' && <XCircle className="w-4 h-4 mr-2" />}
                  {label}
                </Button>
              ))}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
}
