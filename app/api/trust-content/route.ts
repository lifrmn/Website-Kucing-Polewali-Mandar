import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authorizeAdmin } from '@/lib/authorization'
import { getRequestIp } from '@/lib/audit'
import { createActivityLog } from '@/lib/audit'
import {
  parseTrustContentUpdate,
  trustContentCreateSchema,
  trustContentDeleteSchema,
} from '@/lib/validations/trust-content'

export async function GET() {
  const authorization = await authorizeAdmin('content:manage')
  if (!authorization.authorized) return authorization.response
  const [gallery, team, testimonials] = await Promise.all([
    prisma.galleryItem.findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }),
    prisma.teamMember.findMany({ orderBy: [{ sort_order: 'asc' }, { created_at: 'desc' }] }),
    prisma.testimonial.findMany({ orderBy: { created_at: 'desc' } }),
  ])
  return NextResponse.json({ success: true, data: { gallery, team, testimonials } })
}

export async function POST(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('content:manage', request)
    if (!authorization.authorized) return authorization.response
    const input = trustContentCreateSchema.parse(await request.json())
    const created = await prisma.$transaction(async (tx) => {
      const record = input.resource === 'gallery'
        ? await tx.galleryItem.create({ data: input.data })
        : input.resource === 'team'
          ? await tx.teamMember.create({ data: input.data })
          : await tx.testimonial.create({ data: input.data })
      await createActivityLog(tx, {
        userId: authorization.session.user.id,
        ipAddress: getRequestIp(request),
        entityType: input.resource,
        entityId: record.id,
        action: 'CREATE',
        description: 'Konten kepercayaan dibuat',
        metadata: { resource: input.resource },
      })
      return record
    })
    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    return handleError(error, 'membuat')
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('content:manage', request)
    if (!authorization.authorized) return authorization.response
    const input = parseTrustContentUpdate(await request.json())
    const updated = await prisma.$transaction(async (tx) => {
      const record = input.resource === 'gallery'
        ? await tx.galleryItem.update({ where: { id: input.id }, data: input.data })
        : input.resource === 'team'
          ? await tx.teamMember.update({ where: { id: input.id }, data: input.data })
          : await tx.testimonial.update({ where: { id: input.id }, data: input.data })
      await createActivityLog(tx, {
        userId: authorization.session.user.id,
        ipAddress: getRequestIp(request),
        entityType: input.resource,
        entityId: input.id,
        action: 'UPDATE',
        description: 'Konten kepercayaan diperbarui',
        metadata: { resource: input.resource, changedFields: Object.keys(input.data) },
      })
      return record
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    return handleError(error, 'memperbarui')
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authorization = await authorizeAdmin('content:manage', request)
    if (!authorization.authorized) return authorization.response
    const input = trustContentDeleteSchema.parse(Object.fromEntries(request.nextUrl.searchParams))
    await prisma.$transaction(async (tx) => {
      if (input.resource === 'gallery') await tx.galleryItem.delete({ where: { id: input.id } })
      else if (input.resource === 'team') await tx.teamMember.delete({ where: { id: input.id } })
      else await tx.testimonial.delete({ where: { id: input.id } })
      await createActivityLog(tx, {
        userId: authorization.session.user.id,
        ipAddress: getRequestIp(request),
        entityType: input.resource,
        entityId: input.id,
        action: 'DELETE',
        description: 'Konten kepercayaan dihapus',
        metadata: { resource: input.resource },
      })
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleError(error, 'menghapus')
  }
}

function handleError(error: unknown, action: string) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ success: false, error: 'Data konten tidak valid', errors: error.issues }, { status: 422 })
  }
  console.error(`Gagal ${action} konten:`, error)
  return NextResponse.json({ success: false, error: `Gagal ${action} konten` }, { status: 500 })
}