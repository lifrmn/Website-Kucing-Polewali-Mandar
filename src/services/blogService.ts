/* eslint-disable @typescript-eslint/no-explicit-any */
// No longer directly importing Prisma - using API routes instead
export const blogService = {
  async getPosts(page: number = 1, limit: number = 10) {
    try {
      const response = await fetch('/api/blog');
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengambil artikel blog',
        };
      }

      const posts = result.data || [];
      const total = posts.length;

      return {
        success: true,
        data: {
          data: posts,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return {
        success: false,
        error: 'Gagal mengambil artikel blog',
      };
    }
  },

  async getPostBySlug(slug: string) {
    try {
      const response = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`);
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Artikel tidak ditemukan',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return {
        success: false,
        error: 'Gagal mengambil artikel',
      };
    }
  },

  async getRecentPosts(limit: number = 5) {
    try {
      const response = await fetch('/api/blog');
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengambil artikel terbaru',
        };
      }

      const posts = (result.data || []).slice(0, limit).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        published_at: post.published_at,
      }));

      return {
        success: true,
        data: posts,
      };
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return {
        success: false,
        error: 'Gagal mengambil artikel terbaru',
      };
    }
  },

  async getAllPosts() {
    try {
      const response = await fetch('/api/blog?all=true');
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Gagal mengambil semua artikel',
        };
      }

      return {
        success: true,
        data: result.data || [],
      };
    } catch (error) {
      console.error('Error fetching all posts:', error);
      return {
        success: false,
        error: 'Gagal mengambil semua artikel',
      };
    }
  },

  async getPostById(id: string) {
    try {
      const response = await fetch(`/api/blog/${id}`);
      const result = await response.json();

      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Artikel tidak ditemukan',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return {
        success: false,
        error: 'Gagal mengambil artikel',
      };
    }
  },

  async createPost(data: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    featured_image?: string;
    category?: string;
    tags?: string;
    author?: string;
    is_published?: boolean;
  }) {
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Gagal membuat artikel' };
      }

      return { success: true, data: result.data, message: result.message || 'Artikel berhasil dibuat' };
    } catch (error) {
      console.error('Error creating post:', error);
      return { success: false, error: 'Gagal membuat artikel' };
    }
  },

  async updatePost(id: string, data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    featured_image?: string;
    category?: string;
    tags?: string;
    is_published?: boolean;
  }) {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mengupdate artikel' };
      }

      return { success: true, data: result.data, message: result.message || 'Artikel berhasil diupdate' };
    } catch (error) {
      console.error('Error updating post:', error);
      return { success: false, error: 'Gagal mengupdate artikel' };
    }
  },

  async deletePost(id: string) {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        return { success: false, error: result.error || 'Gagal menghapus artikel' };
      }

      return { success: true, message: result.message || 'Artikel berhasil dihapus' };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: 'Gagal menghapus artikel' };
    }
  },
};
