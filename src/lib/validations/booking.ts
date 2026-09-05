import { z } from 'zod';

import { BookingStatus } from '@/types/enums';

const phoneSchema = z.string().trim()
  .transform((value) => value.replace(/\s+/g, ''))
  .pipe(z.string().regex(/^(?:\+62|62|0)[0-9]{9,13}$/));

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((value) => {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value;
}, 'Tanggal kalender tidak valid');

export const boardingBookingSchema = z.object({
  package_id: z.string().uuid(),
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: phoneSchema,
  customer_email: z.string().trim().email().max(254).optional().or(z.literal('')),
  cat_name: z.string().trim().min(1).max(100),
  cat_age: z.string().trim().max(50).optional(),
  cat_gender: z.string().trim().max(30).optional(),
  cat_breed: z.string().trim().max(100).optional(),
  cat_health_condition: z.string().trim().max(1_000).optional(),
  check_in_date: dateSchema,
  check_out_date: dateSchema,
  special_requests: z.string().trim().max(1_000).optional(),
  emergency_contact: z.string().trim().max(100).optional(),
}).strict();

export const boardingBookingUpdateSchema = z.object({
  status: z.enum(BookingStatus).optional(),
  admin_notes: z.string().trim().max(2_000).nullable().optional(),
}).strict().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  { message: 'Tidak ada perubahan yang dikirim' }
);

export const serviceBookingSchema = z.object({
  service_id: z.string().uuid(),
  customer_name: z.string().trim().min(2).max(100),
  customer_phone: phoneSchema,
  customer_email: z.string().trim().email().max(254).optional().or(z.literal('')),
  booking_date: dateSchema,
  booking_time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  pet_name: z.string().trim().min(1).max(100),
  pet_type: z.string().trim().min(1).max(50),
  notes: z.string().trim().max(1_000).optional(),
}).strict();

export const serviceBookingUpdateSchema = z.object({
  status: z.enum(BookingStatus),
}).strict();

export type BoardingBookingInput = z.infer<typeof boardingBookingSchema>;
export type BoardingBookingUpdateInput = z.infer<typeof boardingBookingUpdateSchema>;
export type ServiceBookingInput = z.infer<typeof serviceBookingSchema>;
export type ServiceBookingUpdateInput = z.infer<typeof serviceBookingUpdateSchema>;
