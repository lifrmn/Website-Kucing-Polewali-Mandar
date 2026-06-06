'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff, Package } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  image_url: string | null;
  is_active: boolean;
  featured: boolean;
  created_at: string;
}

const CATEGORIES = [
  { value: 'ALL', label: 'Semua Kategori' },
  { value: 'MAKANAN', label: 'Makanan' },
  { value: 'ALAT', label: 'Alat' },
  { value: 'OBAT', label: 'Obat' },
  { value: 'AKSESORIS', label: 'Aksesoris' },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadProducts();
  }, [searchQuery, categoryFilter, page]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        all: 'true',
        page: page.toString(),
        limit: '10',
      });
      
      if (searchQuery) params.set('q', searchQuery);
      if (categoryFilter !== 'ALL') params.set('category', categoryFilter);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (data.success && data.data) {
        setProducts(data.data.data);
        setTotalPages(data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      toast('Gagal memuat data produk', 'error');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setPage(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Yakin ingin menghapus produk "${name}"?\n\nTindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast('Produk berhasil dihapus', 'success');
        loadProducts();
      } else {
        toast(data.error || 'Gagal menghapus produk', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast('Gagal menghapus produk', 'error');
    }
  };

  const toast = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Produk</h1>
              <p className="text-slate-600 mt-2">Kelola daftar produk Cikal Pet Care Polman</p>
            </div>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 h-12 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Tambah Produk
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-4 md:p-6 mb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-12 w-full md:w-[220px] rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="h-12 md:h-auto px-4 text-sm text-slate-500 hover:text-slate-700 hover:underline transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 mt-4">Memuat data...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada produk</h3>
              <p className="text-slate-600">
                {searchQuery || categoryFilter !== 'ALL'
                  ? 'Tidak ada produk yang cocok dengan filter'
                  : 'Tambahkan produk pertama Anda'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-slate-600 text-sm">
                    <tr>
                      <th className="text-left p-4 font-semibold">Foto</th>
                      <th className="text-left p-4 font-semibold">Nama</th>
                      <th className="text-left p-4 font-semibold">Kategori</th>
                      <th className="text-left p-4 font-semibold">Harga</th>
                      <th className="text-left p-4 font-semibold">Stok</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">Tanggal</th>
                      <th className="text-right p-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.sku}</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-900 font-medium">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.stock === 0
                                ? 'bg-red-100 text-red-800'
                                : product.stock < 10
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {product.is_active ? (
                              <>
                                <Eye className="w-3 h-3" />
                                ACTIVE
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3 h-3" />
                                INACTIVE
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {formatDate(product.created_at)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-slate-100 p-4 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Halaman {page} dari {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className={`px-6 py-4 rounded-xl shadow-lg ${
              showToast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
}
