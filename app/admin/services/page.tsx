'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { serviceService } from '@/services/serviceService';
import { Button, Badge, EmptyState, LoadingState, PageHeader, Toolbar } from '@/components/admin';
import { Plus, Edit, Trash2, Scissors, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AppIcon from '@/components/AppIcon';

interface Service {
  id: string;
  name: string;
  description: string | null;
  type: string;
  duration: number | null;
  price: number;
  is_active: boolean;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchQuery, typeFilter, services]);

  const loadServices = async () => {
    setLoading(true);
    const response = await serviceService.getServices();
    if (response.success && response.data) {
      setServices(response.data);
      setFilteredServices(response.data);
    }
    setLoading(false);
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(s => s.type === typeFilter);
    }

    setFilteredServices(filtered);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus layanan "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;

    const response = await serviceService.deleteService(id);
    if (response.success) {
      loadServices();
    } else {
      alert(response.error || 'Gagal menghapus layanan');
    }
  };

  const types = Array.from(new Set(services.map(s => s.type).filter(Boolean)));
  const typeOptions = [
    { value: 'all', label: 'Semua Tipe' },
    ...types.map(type => ({ value: type || '', label: type || 'Lainnya' }))
  ];

  if (loading) {
    return <LoadingState message="Memuat layanan..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Layanan"
        subtitle={`Kelola layanan grooming dan perawatan · ${services.length} total layanan`}
        actions={
          <Button onClick={() => router.push('/admin/services/new')} size="lg">
            <AppIcon icon={Plus} size="sm" />
            Tambah Layanan
          </Button>
        }
      />

      {/* Toolbar */}
      <Toolbar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama layanan atau tipe..."
        filters={[
          {
            id: 'type',
            label: 'Tipe',
            value: typeFilter,
            options: typeOptions,
            onChange: setTypeFilter,
            width: 'default',
          },
        ]}
        onReset={() => {
          setSearchQuery('');
          setTypeFilter('all');
        }}
      />

      {/* Services Table/List */}
      {filteredServices.length === 0 ? (
        <div className="bg-surface rounded-lg border border-border">
          <EmptyState
            icon={Scissors}
            title={searchQuery || typeFilter !== 'all' ? 'Layanan tidak ditemukan' : 'Belum ada layanan'}
            description={
              searchQuery || typeFilter !== 'all'
                ? 'Coba sesuaikan filter atau kata kunci pencarian Anda'
                : 'Mulai dengan menambahkan layanan grooming atau perawatan pertama Anda'
            }
            action={
              searchQuery || typeFilter !== 'all'
                ? undefined
                : {
                    label: 'Tambah Layanan',
                    onClick: () => router.push('/admin/services/new'),
                  }
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-surface rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface2 border-b border-border">
                  <tr>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4 w-[40%]">Layanan</th>
                    <th className="text-left text-xs font-semibold text-muted py-3 px-4">Tipe</th>
                    <th className="text-center text-xs font-semibold text-muted py-3 px-4">Durasi</th>
                    <th className="text-right text-xs font-semibold text-muted py-3 px-4">Harga</th>
                    <th className="text-center text-xs font-semibold text-muted py-3 px-4">Status</th>
                    <th className="text-right text-xs font-semibold text-muted py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, index) => (
                    <tr
                      key={service.id}
                      className={`border-b border-border last:border-0 hover:bg-surface2 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-bg'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-semibold text-text">{service.name}</p>
                          {service.description && (
                            <p className="text-xs text-muted line-clamp-1 mt-0.5">{service.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {service.type ? (
                          <Badge size="sm">{service.type}</Badge>
                        ) : (
                          <span className="text-xs text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {service.duration ? (
                          <div className="flex items-center justify-center gap-1 text-sm text-text">
                            <Clock className="w-3.5 h-3.5 text-muted" />
                            <span>{service.duration} menit</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-semibold text-text">
                          {formatCurrency(service.price)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={service.is_active ? 'success' : 'muted'}
                          size="sm"
                        >
                          {service.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                          >
                            <AppIcon icon={Edit} size="sm" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(service.id, service.name)}
                          >
                            <AppIcon icon={Trash2} size="sm" className="text-danger" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-surface rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold text-text flex-1">{service.name}</h3>
                    <Badge
                      variant={service.is_active ? 'success' : 'muted'}
                      size="sm"
                    >
                      {service.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  {service.description && (
                    <p className="text-xs text-muted line-clamp-2">{service.description}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-primary">{formatCurrency(service.price)}</p>
                    {service.duration && (
                      <div className="flex items-center gap-1 text-xs text-muted mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{service.duration} menit</span>
                      </div>
                    )}
                  </div>
                  {service.type && (
                    <Badge size="sm">{service.type}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push(`/admin/services/${service.id}/edit`)}
                    className="flex-1"
                  >
                    <AppIcon icon={Edit} size="sm" />
                    <span className="leading-none">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id, service.name)}
                  >
                    <AppIcon icon={Trash2} size="sm" className="text-danger" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
