import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { sanitizeBlogHtml } from '@/lib/sanitize-html';
import { updateBlogPostSchema } from '@/lib/validations/blog';
import {
  archiveBlogPost,
  BlogManagementError,
  updateBlogPost,
} from '@/services/blogManagementService';
import { getRequestIp } from '@/lib/audit';

// GET single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('blog:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const post = await prisma.blogPost.findFirst({
      where: { id, deleted_at: null },
    });

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Artikel tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...post, content: sanitizeBlogHtml(post.content) },
    });
  } catch (error: unknown) {
    console.error('GET blog post error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil artikel',
      },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('blog:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    const input = updateBlogPostSchema.parse(await request.json());
    const post = await updateBlogPost(prisma, id, input);

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Artikel berhasil diupdate',
    });
  } catch (error: unknown) {
    console.error('PUT blog post error:', error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Format JSON tidak valid' },
        { status: 400 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Data artikel tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
    if (error instanceof BlogManagementError) {
      const notFound = error.code === 'NOT_FOUND';
      return NextResponse.json(
        { success: false, error: notFound ? 'Artikel tidak ditemukan' : 'Konten artikel kosong' },
        { status: notFound ? 404 : 422 }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Slug artikel sudah digunakan' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengupdate artikel',
      },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization = await authorizeAdmin('blog:manage');
    if (!authorization.authorized) return authorization.response;

    const { id } = await params;
    await archiveBlogPost(prisma, id, new Date(), {
      userId: authorization.session.user.id,
      ipAddress: getRequestIp(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Artikel berhasil diarsipkan',
    });
  } catch (error: unknown) {
    console.error('DELETE blog post error:', error);
    if (error instanceof BlogManagementError && error.code === 'NOT_FOUND') {
      return NextResponse.json(
        { success: false, error: 'Artikel tidak ditemukan' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus artikel',
      },
      { status: 500 }
    );
  }
}
