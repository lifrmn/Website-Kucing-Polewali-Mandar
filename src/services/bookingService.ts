/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../lib/prisma';
import type { ApiResponse } from '@/types';

interface CreateBookingData {
  package_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  cat_name: string;
  cat_age?: string;
  cat_gender?: string;
  cat_health_condition?: string;
  check_in_date: string;
  check_out_date: string;
  special_requests?: string;
}

export const bookingService = {
  async getPackages(): Promise<ApiResponse<any[]>> {
    try {
      const packages = await prisma.penitipanPackage.findMany({
        where: { is_active: true },
        orderBy: { price_per_night: 'asc' },
      });

      // Parse features JSON string
      const packagesWithFeatures = packages.map((pkg) => ({
        ...pkg,
        features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features,
      }));

      return {
        success: true,
        data: packagesWithFeatures,
      };
    } catch (error) {
      console.error('Error fetching packages:', error);
      return {
        success: false,
        error: 'Gagal mengambil paket penitipan',
      };
    }
  },

  async getPackageById(id: string): Promise<ApiResponse<any>> {
    try {
      const pkg = await prisma.penitipanPackage.findUnique({
        where: { id },
      });

      if (!pkg) {
        return {
          success: false,
          error: 'Paket tidak ditemukan',
        };
      }

      return {
        success: true,
        data: {
          ...pkg,
          features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features,
        },
      };
    } catch (error) {
      console.error('Error fetching package:', error);
      return {
        success: false,
        error: 'Gagal mengambil detail paket',
      };
    }
  },

  calculateTotalNights(checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  async createBooking(bookingData: CreateBookingData): Promise<ApiResponse<any>> {
    try {
      // Get package to calculate price
      const packageResult = await this.getPackageById(bookingData.package_id);
      if (!packageResult.success || !packageResult.data) {
        return {
          success: false,
          error: 'Paket tidak ditemukan',
        };
      }

      const pkg = packageResult.data;
      const totalNights = this.calculateTotalNights(bookingData.check_in_date, bookingData.check_out_date);
      
      if (totalNights <= 0) {
        return {
          success: false,
          error: 'Tanggal check-out harus setelah tanggal check-in',
        };
      }

      const totalPrice = pkg.price_per_night * totalNights;
      const bookingNumber = await this.generateBookingNumber();

      // Create customer first
      const customer = await prisma.customer.create({
        data: {
          name: bookingData.customer_name,
          phone: bookingData.customer_phone,
          email: bookingData.customer_email,
        },
      });

      // Create booking
      const booking = await prisma.penitipanBooking.create({
        data: {
          booking_number: bookingNumber,
          customer_id: customer.id,
          package_id: bookingData.package_id,
          cat_name: bookingData.cat_name,
          cat_age: bookingData.cat_age,
          cat_gender: bookingData.cat_gender,
          cat_health_condition: bookingData.cat_health_condition,
          check_in_date: bookingData.check_in_date,
          check_out_date: bookingData.check_out_date,
          total_nights: totalNights,
          total_price: totalPrice,
          status: 'pending',
          special_requests: bookingData.special_requests,
        },
      });

      return {
        success: true,
        data: booking,
        message: 'Booking berhasil dibuat',
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: 'Gagal membuat booking',
      };
    }
  },

  async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `BOOK-${year}${month}${day}-${random}`;
  },

  async getBookingByNumber(bookingNumber: string): Promise<ApiResponse<any>> {
    try {
      const booking = await prisma.penitipanBooking.findUnique({
        where: { booking_number: bookingNumber },
        include: {
          customer: true,
          package: true,
        },
      });

      if (!booking) {
        return {
          success: false,
          error: 'Booking tidak ditemukan',
        };
      }

      return {
        success: true,
        data: {
          ...booking,
          package: {
            ...booking.package,
            features: typeof booking.package.features === 'string' 
              ? JSON.parse(booking.package.features) 
              : booking.package.features,
          },
        },
      };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return {
        success: false,
        error: 'Booking tidak ditemukan',
      };
    }
  },

  async checkAvailability(packageId: string, checkInDate: string, checkOutDate: string): Promise<ApiResponse<boolean>> {
    try {
      // Simple availability check - can be enhanced with actual booking conflicts
      const conflictingBookings = await prisma.penitipanBooking.count({
        where: {
          package_id: packageId,
          status: { not: 'cancelled' },
          OR: [
            {
              AND: [
                { check_in_date: { lte: checkInDate } },
                { check_out_date: { gte: checkInDate } },
              ],
            },
            {
              AND: [
                { check_in_date: { lte: checkOutDate } },
                { check_out_date: { gte: checkOutDate } },
              ],
            },
          ],
        },
      });

      return {
        success: true,
        data: conflictingBookings === 0,
      };
    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        success: false,
        error: 'Gagal memeriksa ketersediaan',
      };
    }
  },
};
