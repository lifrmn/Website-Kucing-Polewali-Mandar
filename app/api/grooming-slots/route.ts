import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { authorizeAdmin } from '@/lib/authorization'
import { BookingStatus } from '@/types/enums'

const slotSchema = z.object({
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  max_bookings: z.coerce.number().int().min(1).max(20),
  is_active: z.boolean().default(true),
}).strict()

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    const serviceId = searchParams.get('serviceId')
    const date = searchParams.get('date')

    if (includeInactive) {
      const authorization = await authorizeAdmin('services:manage')
      if (!authorization.authorized) return authorization.response
    }

    const slots = await prisma.groomingSlot.findMany({
      where: includeInactive ? undefined : { is_active: true },
      orderBy: { time: 'asc' },
    })

    if (!serviceId || !date) {
      return NextResponse.json({ success: true, data: slots })
    }

    dateSchema.parse(date)
    const service = await prisma.service.findFirst({
      where: { id: serviceId, is_active: true, type: { equals: 'grooming' } },
      select: { id: true },
    })
    if (!service) {
      return NextResponse.json({ success: false, error: 'Layanan grooming tidak tersedia' }, { status: 404 })
    }

    const bookingDate = new Date(`${date}T00:00:00.000Z`)
    const counts = await prisma.serviceBooking.groupBy({
      by: ['booking_time'],
      where: {
        service_id: service.id,
        booking_date: bookingDate,
        status: { not: BookingStatus.CANCELED },
      },
      _count: { _all: true },
    })
    const countByTime = new Map(counts.map((entry) => [entry.booking_time, entry._count._all]))

    return NextResponse.json({
      success: true,
      data: slots.map((slot) => ({
        ...slot,
        available: (countByTime.get(slot.time) ?? 0) < slot.max_bookings,
        remaining: Math.max(0, slot.max_bookings - (countByTime.get(slot.time) ?? 0)),
      })),
    })
  } catch (error) {
    console.error('GET grooming slots error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Tanggal tidak valid' }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Gagal mengambil slot grooming' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('services:manage', request)
    if (!authorization.authorized) return authorization.response
    const input = slotSchema.parse(await request.json())
    const slot = await prisma.groomingSlot.create({ data: input })
    return NextResponse.json({ success: true, data: slot }, { status: 201 })
  } catch (error) {
    console.error('POST grooming slot error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Data slot tidak valid', errors: error.issues }, { status: 422 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Jam grooming sudah terdaftar' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Gagal menambah slot grooming' }, { status: 500 })
  }
}