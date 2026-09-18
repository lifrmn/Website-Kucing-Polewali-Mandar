import type { PrismaClient } from '@prisma/client'
import type { CustomerBookingLookupInput } from '@/lib/validations/customer-booking'

export function findCustomerBooking(database: PrismaClient, input: CustomerBookingLookupInput) {
  return database.penitipanBooking.findFirst({
    where: {
      booking_number: input.booking_number,
      customer: { phone: input.customer_phone },
    },
    select: {
      booking_number: true,
      cat_name: true,
      cat_count: true,
      check_in_date: true,
      check_out_date: true,
      total_nights: true,
      total_price: true,
      status: true,
      payment_method: true,
      payment_status: true,
      deposit_amount: true,
      created_at: true,
      package: { select: { name: true } },
    },
  })
}