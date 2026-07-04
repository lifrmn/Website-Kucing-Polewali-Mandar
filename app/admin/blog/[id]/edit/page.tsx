'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { blogService } from '@/services/blogService';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    is_published: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPost();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    const response = await blogService.getPostById(id);
    if (response.success && response.data) {
      const post = response.data;
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        category: post.category || '',
        tags: post.tags || '',
        meta_title: post.meta_title || '',
        meta_description: post.meta_description || '',
        is_published: post.is_published,
      });
    } else {
      setError('Post not found');
    }
    setFetchLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await blogService.updatePost(id, {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || undefined,
        featured_image: formData.featured_image || undefined,
        category: formData.category || undefined,
        tags: formData.tags || undefined,
        is_published: formData.is_published,
      });

      if (response.success) {
        router.push('/admin/blog');
      } else {
        setError(response.error || 'Failed to update post');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-body text-muted">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-h1 font-bold text-text">Edit Blog Post</h1>
          <p className="text-body text-muted">Update blog post details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Post Content</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                {error && (
                  <div className="p-4 bg-danger/10 border border-danger rounded-button text-danger text-small">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Post title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Slug *
                  </label>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="post-slug"
                    required
                  />
                  <p className="text-caption text-muted mt-1">URL: /blog/{formData.slug || 'post-slug'}</p>
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Content *
                  </label>
                  <Textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your post content..."
                    rows={12}
                    required
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Excerpt
                  </label>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    placeholder="Brief summary..."
                    rows={3}
                  />
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>SEO Settings</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Meta Title
                  </label>
                  <Input
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder="SEO title (max 60 chars)"
                    maxLength={60}
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Meta Description
                  </label>
                  <Textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    placeholder="SEO description (max 160 chars)"
                    rows={3}
                    maxLength={160}
                  />
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Post Settings</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">Select category</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                    <option value="Pet Care">Pet Care</option>
                    <option value="News">News</option>
                    <option value="Product Review">Product Review</option>
                    <option value="Health">Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Tags
                  </label>
                  <Input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-caption text-muted mt-1">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Featured Image URL
                  </label>
                  <Input
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                {formData.featured_image && (
                  <div className="relative w-full h-48 rounded-button overflow-hidden bg-surface2">
                    <img
                      src={formData.featured_image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center pt-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="is_published" className="ml-2 text-small font-medium text-text">
                    Published
                  </label>
                </div>
              </Card.Content>
            </Card>

            <div className="flex gap-3">
              <Link href="/admin/blog" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" isLoading={loading}>
                Update Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
