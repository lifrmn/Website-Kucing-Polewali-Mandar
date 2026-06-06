// No longer directly importing Prisma - using API routes instead
export const productService = {
  async getProducts(page: number = 1, limit: number = 12, category?: string) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      
      const response = await fetch(`/api/products?${params}`);
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mengambil data produk' };
      }

      // Add pagination info
      const products = result.data.data || [];
      return {
        success: true,
        data: {
          data: products,
          total: result.data.total || products.length,
          page,
          totalPages: Math.ceil((result.data.total || products.length) / limit),
        },
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { success: false, error: 'Gagal mengambil data produk' };
    }
  },

  async getProductById(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`);
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Produk tidak ditemukan' };
      }
      
      return { success: true, data: result.data };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil detail produk' };
    }
  },

  async getFeaturedProducts(limit: number = 6) {
    try {
      const response = await fetch(`/api/products?featured=true`);
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mengambil produk unggulan' };
      }
      
      // Limit the results
      const products = (result.data.data || []).slice(0, limit);
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil produk unggulan' };
    }
  },

  async searchProducts(query: string) {
    try {
      // For now, get all products and filter client-side
      // TODO: Add search endpoint to API
      const response = await fetch(`/api/products`);
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mencari produk' };
      }
      
      const products = result.data.data || [];
      const filtered = products.filter((p: any) => 
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase()) ||
        p.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 20);
      
      return { success: true, data: filtered };
    } catch (error) {
      return { success: false, error: 'Gagal mencari produk' };
    }
  },

  async getProductsByCategory(category: string) {
    try {
      const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mengambil produk berdasarkan kategori' };
      }
      
      return { success: true, data: result.data.data || [] };
    } catch (error) {
      return { success: false, error: 'Gagal mengambil produk berdasarkan kategori' };
    }
  },

  async checkStock(productId: string) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();
      
      if (!result.success || !result.data) {
        return { success: false, error: 'Produk tidak ditemukan' };
      }
      
      return { success: true, data: result.data.stock };
    } catch (error) {
      return { success: false, error: 'Gagal memeriksa stok' };
    }
  },

  async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category: string;
    image_url?: string;
    is_active?: boolean;
    sku?: string;
  }) {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal menambahkan produk' };
      }
      
      return { success: true, data: result.data, message: result.message || 'Produk berhasil ditambahkan' };
    } catch (error) {
      console.error('Error creating product:', error);
      return { success: false, error: 'Gagal menambahkan produk' };
    }
  },

  async updateProduct(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    image_url?: string;
    is_active?: boolean;
  }) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal mengupdate produk' };
      }
      
      return { success: true, data: result.data, message: result.message || 'Produk berhasil diupdate' };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: 'Gagal mengupdate produk' };
    }
  },

  async deleteProduct(id: string) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        return { success: false, error: result.error || 'Gagal menghapus produk' };
      }
      
      return { success: true, message: result.message || 'Produk berhasil dihapus' };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: 'Gagal menghapus produk' };
    }
  },
};
