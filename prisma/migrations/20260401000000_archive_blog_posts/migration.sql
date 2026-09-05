ALTER TABLE "blog_posts" ADD COLUMN "deleted_at" DATETIME;

CREATE INDEX "blog_posts_deleted_at_idx" ON "blog_posts"("deleted_at");