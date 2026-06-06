// No longer directly importing Prisma - using API routes instead
import type { ApiResponse } from '@/types';
import { emailService } from './emailService';

interface CreateOrderData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  order_type: 'product' | 'service' | 'penitipan';
  items: Array<{
    item_type: 'product' | 'service';
    item_id: string;
    item_name: string;
    quantity: number;
    unit_price: number;
  }>;
  payment_method?: 'qris' | 'transfer' | 'cod';
  notes?: string;
}

export const orderService = {
  async createOrder(orderData: CreateOrderData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal membuat pesanan',
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || 'Pesanan berhasil dibuat',
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: 'Gagal membuat pesanan',
      };
    }
  },

  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `INV-${year}${month}${day}-${random}`;
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`);
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Pesanan tidak ditemukan',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: 'Pesanan tidak ditemukan',
      };
    }
  },

  async getOrderItems(orderId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        return {
          success: false,
          error: 'Gagal mengambil item pesanan',
        };
      }

      return {
        success: true,
        data: result.data.orderItems || [],
      };
    } catch (error) {
      console.error('Error fetching order items:', error);
      return {
        success: false,
        error: 'Gagal mengambil item pesanan',
      };
    }
  },

  async updatePaymentProof(orderNumber: string, imageUrl: string): Promise<ApiResponse<string>> {
    try {
      // First, get order by number to get the ID
      const orderResponse = await fetch(`/api/orders?orderNumber=${encodeURIComponent(orderNumber)}`);
      const orderResult = await orderResponse.json();

      if (!orderResult.success || !orderResult.data) {
        return {
          success: false,
          error: 'Pesanan tidak ditemukan',
        };
      }

      const orderId = orderResult.data.id;

      // Update payment proof using PATCH
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_proof_url: imageUrl }),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal menyimpan bukti pembayaran',
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || 'Bukti pembayaran berhasil disimpan',
      };
    } catch (error) {
      console.error('Error updating payment proof:', error);
      return {
        success: false,
        error: 'Gagal menyimpan bukti pembayaran',
      };
    }
  },

  async getOrders(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengambil data pesanan',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        success: false,
        error: 'Gagal mengambil data pesanan',
      };
    }
  },

  async getOrderById(orderId: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Pesanan tidak ditemukan',
        };
      }

      // Transform to match frontend expected format
      const order = result.data;
      const transformedOrder = {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer.name,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        customer_address: order.customer.address,
        order_type: 'product',
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        payment_proof_url: order.payment_proof_url,
        order_status: order.status,
        notes: order.notes,
        created_at: order.created_at,
        items: order.orderItems,
      };

      return {
        success: true,
        data: transformedOrder,
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      return {
        success: false,
        error: 'Gagal mengambil detail pesanan',
      };
    }
  },

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: 'pending' | 'paid' | 'failed'
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: paymentStatus }),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengupdate status pembayaran',
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || `Status pembayaran berhasil diupdate menjadi ${paymentStatus}`,
      };
    } catch (error) {
      console.error('Error updating payment status:', error);
      return {
        success: false,
        error: 'Gagal mengupdate status pembayaran',
      };
    }
  },

  async updateOrderStatus(
    orderId: string,
    orderStatus: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled'
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: orderStatus }),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengupdate status pesanan',
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || `Status pesanan berhasil diupdate menjadi ${orderStatus}`,
      };
    } catch (error) {
      console.error('Error updating order status:', error);
      return {
        success: false,
        error: 'Gagal mengupdate status pesanan',
      };
    }
  },

  async updateOrder(
    orderId: string,
    data: Partial<{
      admin_notes: string;
      tracking_number: string;
      customer_notes: string;
      [key: string]: any;
    }>
  ): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengupdate pesanan',
        };
      }

      return {
        success: true,
        data: result.data,
        message: result.message || 'Pesanan berhasil diupdate',
      };
    } catch (error) {
      console.error('Error updating order:', error);
      return {
        success: false,
        error: 'Gagal mengupdate pesanan',
      };
    }
  },
};
