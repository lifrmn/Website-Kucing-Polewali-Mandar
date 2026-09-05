'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Check, LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  features: string | string[];
  max_cats: number;
  is_active: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_per_night: '',
    features: '',
    max_cats: '1',
    is_active: true,
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      if (data.success) {
        setPackages(data.data);
      }
    } catch {
      toast.error('Gagal memuat paket');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingPackage ? `/api/packages/${editingPackage.id}` : '/api/packages';
      const method = editingPackage ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price_per_night: parseFloat(formData.price_per_night),
          max_cats: parseInt(formData.max_cats),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setIsModalOpen(false);
        resetForm();
        fetchPackages();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Gagal menyimpan paket');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price_per_night: pkg.price_per_night.toString(),
      features: Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features,
      max_cats: pkg.max_cats.toString(),
      is_active: pkg.is_active,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus paket ini?')) return;

    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        fetchPackages();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error('Gagal menghapus paket');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price_per_night: '',
      features: '',
      max_cats: '1',
      is_active: true,
    });
    setEditingPackage(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (loading && packages.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-primary-dark" />
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold">Kelola Paket Penitipan</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex min-h-11 items-center gap-2 rounded-button bg-primary px-5 py-2 font-semibold text-[#2A2A1A] transition-colors hover:bg-primary-hover"
        >
          <Plus className="h-4 w-4" />
          Tambah Paket
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded-card border border-border bg-white p-6 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{pkg.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  pkg.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {pkg.is_active ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{pkg.description}</p>

            <div className="mb-4">
              <p className="text-2xl font-bold text-secondary">
                Rp {pkg.price_per_night.toLocaleString('id-ID')}
                <span className="text-sm text-gray-500">/malam</span>
              </p>
              <p className="text-sm text-gray-500">Max {pkg.max_cats} kucing</p>
            </div>

            <div className="mb-4">
              <p className="font-semibold text-sm mb-2">Fitur:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {(Array.isArray(pkg.features)
                  ? pkg.features
                  : pkg.features.split(',').map((f) => f.trim())
                ).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-dark" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(pkg)}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-button border border-border bg-white py-2 font-medium text-text hover:bg-surface2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-button bg-danger py-2 font-medium text-white hover:bg-danger/90"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-card border border-border bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">
              {editingPackage ? 'Edit Paket' : 'Tambah Paket Baru'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nama Paket</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-premium"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-premium"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Harga per Malam (Rp)
                </label>
                <input
                  type="number"
                  value={formData.price_per_night}
                  onChange={(e) =>
                    setFormData({ ...formData, price_per_night: e.target.value })
                  }
                  className="input-premium"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Fitur (pisahkan dengan koma)
                </label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="input-premium"
                  rows={3}
                  placeholder="Makanan premium, Kandang pribadi, Grooming dasar"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Maksimal Kucing
                </label>
                <input
                  type="number"
                  value={formData.max_cats}
                  onChange={(e) => setFormData({ ...formData, max_cats: e.target.value })}
                  className="input-premium"
                  min="1"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Paket Aktif</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-button bg-primary py-2 font-semibold text-[#2A2A1A] hover:bg-primary-hover disabled:bg-gray-300 disabled:text-gray-500"
                >
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
