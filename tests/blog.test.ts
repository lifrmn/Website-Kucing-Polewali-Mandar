import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';

import { PrismaClient } from '@prisma/client';

import {
  createBlogPostSchema,
  updateBlogPostSchema,
} from '../src/lib/validations/blog';
import {
  archiveBlogPost,
  BlogManagementError,
  createBlogPost,
  findPublishedBlogPostBySlug,
  updateBlogPost,
} from '../src/services/blogManagementService';

const databasePath = join(tmpdir(), `cikal-blog-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath.replace(/\\/g, '/')}`;
const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });

before(() => {
  execFileSync(process.execPath, [resolve('node_modules/prisma/build/index.js'), 'migrate', 'deploy'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'pipe',
  });
});

after(async () => {
  await prisma.$disconnect();
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
});

test('blog lifecycle keeps drafts private and preserves first publication time', async () => {
  const actor = await prisma.user.create({
    data: {
      email: `blog-audit-${randomUUID()}@example.com`,
      name: 'Blog Audit Admin',
      password: 'test-only',
    },
  });
  const input = createBlogPostSchema.parse({
    title: 'Panduan Aman Merawat Kucing',
    slug: 'panduan-aman-merawat-kucing',
    content: '<h2>Panduan</h2><script>alert(1)</script><p onclick="alert(1)">Aman.</p>',
    excerpt: 'Ringkasan artikel',
    featured_image: 'https://example.com/cat.jpg',
    category: 'Perawatan',
    tags: 'kucing,perawatan',
    meta_title: 'Panduan Merawat Kucing',
    meta_description: 'Panduan aman untuk merawat kucing sehari-hari.',
    is_published: false,
  });

  const draft = await createBlogPost(prisma, input, 'Trusted Admin');

  assert.equal(draft.author, 'Trusted Admin');
  assert.equal(draft.published_at, null);
  assert.equal(draft.meta_title, input.meta_title);
  assert.equal(draft.meta_description, input.meta_description);
  assert.equal(draft.tags, input.tags);
  assert.doesNotMatch(draft.content, /script|onclick/i);
  assert.equal(await findPublishedBlogPostBySlug(prisma, draft.slug), null);
  assert.equal((await prisma.blogPost.findUniqueOrThrow({ where: { id: draft.id } })).view_count, 0);

  const firstPublishedAt = new Date('2026-03-10T02:00:00.000Z');
  const published = await updateBlogPost(
    prisma,
    draft.id,
    updateBlogPostSchema.parse({ is_published: true }),
    firstPublishedAt
  );
  assert.equal(published.published_at?.toISOString(), firstPublishedAt.toISOString());
  const publicPost = await findPublishedBlogPostBySlug(prisma, draft.slug);
  assert.equal(publicPost?.id, draft.id);
  assert.equal(publicPost?.view_count, 1);

  const laterEdit = await updateBlogPost(
    prisma,
    draft.id,
    updateBlogPostSchema.parse({ title: 'Panduan Aman Merawat Kucing Terbaru', is_published: true }),
    new Date('2026-04-01T02:00:00.000Z')
  );
  assert.equal(laterEdit.published_at?.toISOString(), firstPublishedAt.toISOString());

  await assert.rejects(
    createBlogPost(prisma, input, 'Other Admin'),
    (error: unknown) => (
      typeof error === 'object'
      && error !== null
      && 'code' in error
      && error.code === 'P2002'
    )
  );

  const archivedAt = new Date('2026-04-02T02:00:00.000Z');
  await archiveBlogPost(prisma, draft.id, archivedAt, { userId: actor.id });
  assert.equal(await findPublishedBlogPostBySlug(prisma, draft.slug), null);
  const archived = await prisma.blogPost.findUniqueOrThrow({ where: { id: draft.id } });
  assert.equal(archived.deleted_at?.toISOString(), archivedAt.toISOString());
  assert.equal(archived.is_published, false);
  const audit = await prisma.activityLog.findFirstOrThrow({
    where: { user_id: actor.id, entity_type: 'blog', entity_id: draft.id },
  });
  assert.equal(audit.action, 'DELETE');
  await assert.rejects(
    archiveBlogPost(prisma, draft.id, new Date(), { userId: actor.id }),
    (error: unknown) => error instanceof BlogManagementError && error.code === 'NOT_FOUND'
  );
  assert.equal(await prisma.activityLog.count({ where: { user_id: actor.id } }), 1);
});