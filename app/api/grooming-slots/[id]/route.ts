import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authorizeAdmin } from '@/lib/authorization'

const updateSlotSchema = z.object({
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).optional(),
  max_bookings: z.coerce.number().int().min(1).max(20).optional(),
  is_active: z.boolean().optional(),
}).strict().refine((input) => Object.keys(input).length > 0, 'Tidak ada perubahan')

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authorization = await authorizeAdmin('services:manage', request)
    if (!authorization.authorized) return authorization.response
    const { id } = await params
    const input = updateSlotSchema.parse(await request.json())
    const slot = await prisma.groomingSlot.update({ where: { id }, data: input })
    return NextResponse.json({ success: true, data: slot })
  } catch (error) {
    console.error('PATCH grooming slot error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Data slot tidak valid', errors: error.issues }, { status: 422 })
    }
    return NextResponse.json({ success: false, error: 'Gagal memperbarui slot grooming' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authorization = await authorizeAdmin('services:manage', request)
    if (!authorization.authorized) return authorization.response
    const { id } = await params
    await prisma.groomingSlot.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE grooming slot error:', error)
    return NextResponse.json({ success: false, error: 'Gagal menghapus slot grooming' }, { status: 500 })
  }
}