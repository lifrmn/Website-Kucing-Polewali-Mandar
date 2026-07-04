import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
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
      data: post,
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
    const { id } = await params;
    const body = await request.json();
    const { title, content, excerpt, category, featured_image, is_published } = body;

    // Generate new slug if title changed
    let slug;
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        featured_image,
        is_published,
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Artikel berhasil diupdate',
    });
  } catch (error: unknown) {
    console.error('PUT blog post error:', error);
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
    const { id } = await params;
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Artikel berhasil dihapus',
    });
  } catch (error: unknown) {
    console.error('DELETE blog post error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus artikel',
      },
      { status: 500 }
    );
  }
}
