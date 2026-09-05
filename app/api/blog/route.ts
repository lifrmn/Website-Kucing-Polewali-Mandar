import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { authorizeAdmin } from '@/lib/authorization';
import { sanitizeBlogHtml } from '@/lib/sanitize-html';
import { createBlogPostSchema } from '@/lib/validations/blog';
import {
  BlogManagementError,
  createBlogPost,
  findPublishedBlogPostBySlug,
} from '@/services/blogManagementService';

// GET all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const all = searchParams.get('all');
    const pagination = z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(50).default(10),
    }).parse({
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    if (all === 'true') {
      const authorization = await authorizeAdmin('blog:manage');
      if (!authorization.authorized) return authorization.response;
    }

    // If slug is provided, get specific post
    if (slug) {
      const post = all === 'true'
        ? await prisma.blogPost.findFirst({ where: { slug, deleted_at: null } })
        : await findPublishedBlogPostBySlug(prisma, slug);

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
    }

    // Build where clause
    const where: Prisma.BlogPostWhereInput = { deleted_at: null };
    
    // If 'all' parameter is not present, only show published posts
    if (all !== 'true') {
      where.is_published = true;
    }
    
    if (category) {
      where.category = category;
    }

    const listSelection = {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featured_image: true,
      category: true,
      tags: true,
      author: true,
      meta_title: true,
      meta_description: true,
      is_published: true,
      published_at: true,
      view_count: true,
      created_at: true,
      updated_at: true,
    } as const;
    const [posts, total] = all === 'true'
      ? [await prisma.blogPost.findMany({ where, orderBy: { created_at: 'desc' }, select: listSelection }), await prisma.blogPost.count({ where })]
      : await prisma.$transaction([
        prisma.blogPost.findMany({
          where,
          orderBy: { created_at: 'desc' },
          skip: (pagination.page - 1) * pagination.limit,
          take: pagination.limit,
          select: listSelection,
        }),
        prisma.blogPost.count({ where }),
      ]);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page: all === 'true' ? 1 : pagination.page,
        limit: all === 'true' ? total : pagination.limit,
        total,
        totalPages: all === 'true' ? 1 : Math.ceil(total / pagination.limit),
      },
    });
  } catch (error: unknown) {
    console.error('GET blog posts error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Parameter pagination tidak valid', errors: error.issues },
        { status: 422 }
      );
    }
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
    const authorization = await authorizeAdmin('blog:manage');
    if (!authorization.authorized) return authorization.response;

    const input = createBlogPostSchema.parse(await request.json());
    const post = await createBlogPost(
      prisma,
      input,
      authorization.session.user.name || authorization.session.user.email || 'Admin'
    );

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Artikel berhasil ditambahkan',
    });
  } catch (error: unknown) {
    console.error('POST blog post error:', error);
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
    if (error instanceof BlogManagementError && error.code === 'EMPTY_CONTENT') {
      return NextResponse.json({ success: false, error: 'Konten artikel kosong' }, { status: 422 });
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
        error: 'Gagal menambahkan artikel',
      },
      { status: 500 }
    );
  }
}
