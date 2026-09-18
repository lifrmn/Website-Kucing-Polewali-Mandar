import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { consumeRateLimit } from '@/lib/rate-limit'
import { getClientIp } from '@/lib/client-ip'
import { customerBookingLookupSchema } from '@/lib/validations/customer-booking'
import { findCustomerBooking } from '@/services/customerBookingService'
import { deleteImage, ImageValidationError, uploadImage, validateImageFile } from '@/lib/image-upload'
import { BookingStatus, PaymentMethod, PaymentStatus } from '@/types/enums'

const PAYMENT_PROOF_FOLDER = 'cikal-pet-care/boarding-payment-proofs'

function lookupDigest(bookingNumber: string, phone: string) {
  return createHash('sha256').update(`${bookingNumber}:${phone}`).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const input = customerBookingLookupSchema.parse(await request.json())
    const digest = lookupDigest(input.booking_number, input.customer_phone)
    const limit = consumeRateLimit(`customer-booking:${getClientIp(request)}:${digest}`, 10, 15 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Terlalu banyak percobaan. Silakan coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    const booking = await findCustomerBooking(prisma, input)
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking tidak ditemukan atau nomor telepon tidak cocok' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: booking })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Nomor booking atau telepon tidak valid' },
        { status: 422 }
      )
    }
    console.error('Customer booking lookup error:', error)
    return NextResponse.json({ success: false, error: 'Gagal memeriksa booking' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  let uploadedPublicId: string | null = null
  try {
    const formData = await request.formData()
    const input = customerBookingLookupSchema.parse({
      booking_number: formData.get('booking_number'),
      customer_phone: formData.get('customer_phone'),
    })
    const digest = lookupDigest(input.booking_number, input.customer_phone)
    const limit = consumeRateLimit(`boarding-payment-proof:${getClientIp(request)}:${digest}`, 5, 60 * 60 * 1000)
    if (!limit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Batas upload bukti pembayaran tercapai. Coba lagi nanti.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    const booking = await prisma.penitipanBooking.findFirst({
      where: {
        booking_number: input.booking_number,
        customer: { phone: input.customer_phone },
      },
      select: { id: true, status: true, payment_method: true, payment_status: true },
    })
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking tidak ditemukan atau nomor telepon tidak cocok' },
        { status: 404 }
      )
    }
    if (booking.payment_method === PaymentMethod.COD) {
      return NextResponse.json({ success: false, error: 'Booking COD dibayar di lokasi dan tidak memerlukan bukti transfer' }, { status: 409 })
    }
    if ([BookingStatus.CANCELED, BookingStatus.COMPLETED].includes(booking.status as BookingStatus) || booking.payment_status === PaymentStatus.PAID) {
      return NextResponse.json({ success: false, error: 'Status booking tidak menerima bukti pembayaran baru' }, { status: 409 })
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'File bukti pembayaran wajib diisi' }, { status: 400 })
    }
    const buffer = await validateImageFile(file)
    const uploaded = await uploadImage(buffer, PAYMENT_PROOF_FOLDER)
    uploadedPublicId = uploaded.public_id

    const updated = await prisma.penitipanBooking.updateMany({
      where: {
        id: booking.id,
        status: { notIn: [BookingStatus.CANCELED, BookingStatus.COMPLETED] },
        payment_method: { not: PaymentMethod.COD },
        payment_status: { not: PaymentStatus.PAID },
      },
      data: {
        payment_proof_url: uploaded.secure_url,
        payment_status: PaymentStatus.VERIFYING,
      },
    })
    if (updated.count !== 1) {
      await deleteImage(uploaded.public_id)
      uploadedPublicId = null
      return NextResponse.json({ success: false, error: 'Status booking berubah. Muat ulang sebelum mengunggah.' }, { status: 409 })
    }

    return NextResponse.json({
      success: true,
      data: await findCustomerBooking(prisma, input),
      message: 'Bukti pembayaran berhasil dikirim untuk verifikasi',
    })
  } catch (error) {
    if (uploadedPublicId) {
      try {
        await deleteImage(uploadedPublicId)
      } catch (cleanupError) {
        console.error('Boarding payment proof cleanup error:', cleanupError)
      }
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Nomor booking atau telepon tidak valid' }, { status: 422 })
    }
    if (error instanceof ImageValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    console.error('Boarding payment proof upload error:', error)
    return NextResponse.json({ success: false, error: 'Gagal mengunggah bukti pembayaran' }, { status: 500 })
  }
}