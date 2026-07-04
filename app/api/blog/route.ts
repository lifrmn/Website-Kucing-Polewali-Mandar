import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');

    // If slug is provided, get specific post
    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
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
    }

    // Build where clause
    const where: { is_published?: boolean; category?: string } = {};
    
    // If 'all' parameter is not present, only show published posts
    if (all !== 'true') {
      where.is_published = true;
    }
    
    if (category) {
      where.category = category;
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error: unknown) {
    console.error('GET blog posts error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil artikel blog',
      },
      { status: 500 }
    );
  }
}

// POST create blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, category, featured_image } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Judul dan konten harus diisi',
        },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category: category || 'Umum',
        featured_image,
        is_published: true,
        author: 'Admin',
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Artikel berhasil ditambahkan',
    });
  } catch (error: unknown) {
    console.error('POST blog post error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menambahkan artikel',
      },
      { status: 500 }
    );
  }
}
