import type { PrismaClient } from '@prisma/client';

import { sanitizeBlogHtml } from '@/lib/sanitize-html';
import type {
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from '@/lib/validations/blog';
import { createActivityLog, type AuditContext } from '@/lib/audit';

type BlogManagementErrorCode = 'EMPTY_CONTENT' | 'NOT_FOUND';

export class BlogManagementError extends Error {
  constructor(public readonly code: BlogManagementErrorCode) {
    super(code);
    this.name = 'BlogManagementError';
  }
}

export async function createBlogPost(
  prisma: PrismaClient,
  input: CreateBlogPostInput,
  author: string,
  now = new Date()
) {
  const content = sanitizeBlogHtml(input.content);
  if (!content.trim()) throw new BlogManagementError('EMPTY_CONTENT');

  return prisma.blogPost.create({
    data: {
      title: input.title,
      slug: input.slug,
      content,
      excerpt: input.excerpt || null,
      category: input.category || 'Umum',
      featured_image: input.featured_image || null,
      tags: input.tags || null,
      meta_title: input.meta_title || null,
      meta_description: input.meta_description || null,
      is_published: input.is_published,
      published_at: input.is_published ? now : null,
      author,
    },
  });
}

export async function updateBlogPost(
  prisma: PrismaClient,
  id: string,
  input: UpdateBlogPostInput,
  now = new Date()
) {
  const current = await prisma.blogPost.findFirst({ where: { id, deleted_at: null } });
  if (!current) throw new BlogManagementError('NOT_FOUND');

  const content = input.content === undefined ? undefined : sanitizeBlogHtml(input.content);
  if (content !== undefined && !content.trim()) {
    throw new BlogManagementError('EMPTY_CONTENT');
  }

  return prisma.blogPost.update({
    where: { id },
    data: {
      ...input,
      content,
      excerpt: input.excerpt === undefined ? undefined : input.excerpt || null,
      category: input.category === undefined ? undefined : input.category || null,
      featured_image: input.featured_image === undefined ? undefined : input.featured_image || null,
      tags: input.tags === undefined ? undefined : input.tags || null,
      meta_title: input.meta_title === undefined ? undefined : input.meta_title || null,
      meta_description: input.meta_description === undefined ? undefined : input.meta_description || null,
      published_at: input.is_published && !current.published_at ? now : undefined,
    },
  });
}

export async function findPublishedBlogPostBySlug(prisma: PrismaClient, slug: string) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, is_published: true, deleted_at: null },
  });
  if (!post) return null;

  await prisma.blogPost.update({
    where: { id: post.id },
    data: { view_count: { increment: 1 } },
  });
  return {
    ...post,
    view_count: post.view_count + 1,
    content: sanitizeBlogHtml(post.content),
  };
}

export async function archiveBlogPost(
  prisma: PrismaClient,
  id: string,
  now = new Date(),
  audit?: AuditContext
) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.blogPost.updateMany({
      where: { id, deleted_at: null },
      data: { deleted_at: now, is_published: false },
    });
    if (result.count === 0) throw new BlogManagementError('NOT_FOUND');
    if (audit) {
      await createActivityLog(tx, {
        ...audit,
        entityType: 'blog',
        entityId: id,
        action: 'DELETE',
        description: 'Admin mengarsipkan artikel blog',
      });
    }
  });
}