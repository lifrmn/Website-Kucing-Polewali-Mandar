'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

// Validation schema
const productSchema = z.object({
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  sku: z.string().min(3, 'SKU minimal 3 karakter'),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1000, {
    message: 'Harga minimal Rp 1.000',
  }),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Stok tidak boleh negatif',
  }),
  category: z.enum(['MAKANAN', 'ALAT', 'OBAT', 'AKSESORIS'], {
    message: 'Pilih kategori yang valid',
  }),
  is_active: z.boolean(),
  image_url: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      sku: '',
      price: '',
      stock: '0',
      category: 'MAKANAN',
      is_active: true,
      image_url: '',
    },
  });

  const watchImageUrl = watch('image_url');

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
      fetchProduct(resolvedParams.id);
    });
  }, []);

  const fetchProduct = async (productId: string) => {
    setFetchingProduct(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (data.success && data.data) {
        const product = data.data;
        reset({
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          sku: product.sku,
          price: product.price.toString(),
          stock: product.stock.toString(),
          category: product.category,
          is_active: product.is_active,
          image_url: product.image_url || '',
        });
        
        if (product.image_url) {
          setImagePreview(product.image_url);
        }
      } else {
        toast('Produk tidak ditemukan', 'error');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast('Gagal memuat data produk', 'error');
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setValue('slug', slug);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast('Hanya file JPG/PNG yang diperbolehkan', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast('Ukuran file maksimal 2MB', 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        setValue('image_url', data.data.url);
        setImagePreview(data.data.url);
        toast('Gambar berhasil diupload', 'success');
      } else {
        toast(data.error || 'Gagal mengupload gambar', 'error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast('Gagal mengupload gambar', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setValue('image_url', '');
    setImagePreview(null);
  };

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast('Produk berhasil diperbarui!', 'success');
        setTimeout(() => {
          router.push('/admin/products');
        }, 1000);
      } else {
        toast(result.error || 'Gagal memperbarui produk', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast('Gagal memperbarui produk', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toast = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 3000);
  };

  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Daftar Produk
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Edit Produk</h1>
          <p className="text-slate-600 mt-2">Perbarui informasi produk</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Informasi Dasar</h2>
                
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name')}
                      onChange={(e) => {
                        register('name').onChange(e);
                        handleNameChange(e);
                      }}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                      placeholder="Contoh: Royal Canin Persian 2kg"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('slug')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                      placeholder="royal-canin-persian-2kg"
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      URL-friendly version (otomatis dari nama)
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('description')}
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none resize-none"
                      placeholder="Deskripsi lengkap produk..."
                    />
                    {errors.description && (
                      <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('sku')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                      placeholder="PRD-001"
                    />
                    {errors.sku && (
                      <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Harga & Stok</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Harga (Rp) <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('price')}
                      type="number"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                      placeholder="50000"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stok <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('stock')}
                      type="number"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                      placeholder="0"
                    />
                    {errors.stock && (
                      <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category & Status */}
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Kategori & Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('category')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                    >
                      <option value="MAKANAN">Makanan</option>
                      <option value="ALAT">Alat</option>
                      <option value="OBAT">Obat</option>
                      <option value="AKSESORIS">Aksesoris</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center h-12">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          {...register('is_active')}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        <span className="ml-3 text-sm font-medium text-slate-700">
                          {watch('is_active') ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image Upload */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Foto Produk</h2>
                
                {/* Upload Area */}
                <div className="space-y-4">
                  {!imagePreview && !watchImageUrl ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-12 h-12 text-slate-400 mb-3" />
                        <p className="mb-2 text-sm text-slate-600">
                          <span className="font-semibold">Klik untuk upload</span>
                        </p>
                        <p className="text-xs text-slate-500">JPG atau PNG (Max. 2MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-100">
                      <Image
                        src={imagePreview || watchImageUrl || ''}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {uploadingImage && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 text-green-600 animate-spin" />
                      <span className="ml-2 text-sm text-slate-600">Mengupload...</span>
                    </div>
                  )}

                  {/* Manual URL Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Atau masukkan URL gambar
                    </label>
                    <input
                      {...register('image_url')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-green-500/30 focus:border-green-500 focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </button>
          </div>
        </form>
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
