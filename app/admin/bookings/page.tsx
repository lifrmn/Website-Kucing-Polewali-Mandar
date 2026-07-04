'use client';

import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { Calendar, Search, CheckCircle, XCircle, PawPrint } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import AppIcon from '@/components/AppIcon';

interface Booking {
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
  cat_health_condition?: string;
  check_in_date: string;
  check_out_date: string;
  total_nights: number;
  total_price: number;
  status: string;
  special_requests?: string;
  created_at: string;
}

const statusVariants: Record<string, 'primary' | 'accent' | 'success' | 'danger'> = {
  PENDING: 'accent',
  CONFIRMED: 'primary',
  CHECKED_IN: 'success',
  CHECKED_OUT: 'success',
  CANCELED: 'danger',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.cat_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
        setFilteredBookings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Update booking status to "${newStatus}"?`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchBookings();
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-body text-muted">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-text">Bookings</h1>
          <p className="text-body text-muted">{bookings.length} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Content className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-button text-small font-semibold transition-colors whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-surface2 text-text hover:bg-border'
                }`}
              >
                All
              </button>
              {['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-button text-small font-semibold transition-colors whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-primary text-white'
                      : 'bg-surface2 text-text hover:bg-border'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Card>
          <Card.Content className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-muted mb-4" />
            <p className="text-h3 font-semibold text-text mb-2">No bookings found</p>
            <p className="text-body text-muted">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No bookings yet'}
            </p>
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <Card key={booking.id}>
              <Card.Content className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-body font-mono font-semibold text-primary">
                      #{booking.booking_number}
                    </p>
                    <p className="text-small text-muted">
                      {formatDate(new Date(booking.created_at))}
                    </p>
                  </div>
                  <Badge variant={statusVariants[booking.status] || 'accent'}>
                    {booking.status.replace(/_/g, ' ')}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-surface2 rounded-button">
                  <PawPrint className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-body font-bold text-text">{booking.cat_name}</p>
                    <p className="text-small text-muted">
                      {booking.cat_age} • {booking.cat_gender}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-small">
                    <span className="text-muted">Customer</span>
                    <span className="font-semibold text-text">{booking.customer.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-small">
                    <span className="text-muted">Package</span>
                    <span className="font-semibold text-text">{booking.package.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-small">
                    <span className="text-muted">Check-in</span>
                    <span className="font-semibold text-text">
                      {formatDate(new Date(booking.check_in_date))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-small">
                    <span className="text-muted">Check-out</span>
                    <span className="font-semibold text-text">
                      {formatDate(new Date(booking.check_out_date))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-small pt-2 border-t border-border">
                    <span className="text-muted">Total ({booking.total_nights} nights)</span>
                    <span className="text-h3 font-bold text-primary">
                      {formatCurrency(booking.total_price)}
                    </span>
                  </div>
                </div>

                {booking.status === 'PENDING' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                      className="flex-1"
                    >
                      <AppIcon icon={CheckCircle} size="sm" className="mr-2" />
                      <span className="leading-none">Confirm</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleUpdateStatus(booking.id, 'CANCELED')}
                      className="flex-1"
                    >
                      <AppIcon icon={XCircle} size="sm" className="mr-2" />
                      <span className="leading-none">Cancel</span>
                    </Button>
                  </div>
                )}

                {booking.status === 'CONFIRMED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, 'CHECKED_IN')}
                    className="w-full"
                  >
                    <AppIcon icon={CheckCircle} size="sm" className="mr-2" />
                    <span className="leading-none">Check In</span>
                  </Button>
                )}

                {booking.status === 'CHECKED_IN' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleUpdateStatus(booking.id, 'CHECKED_OUT')}
                    className="w-full"
                  >
                    <AppIcon icon={CheckCircle} size="sm" className="mr-2" />
                    <span className="leading-none">Check Out</span>
                  </Button>
                )}
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
