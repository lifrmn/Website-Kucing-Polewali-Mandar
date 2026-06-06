'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Textarea } from '@/components/ui';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { serviceService } from '@/services/serviceService';

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    duration: '',
    price: '',
    is_active: true,
  });

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const response = await serviceService.getServiceById(id);
      if (response.success && response.data) {
        const service = response.data;
        setFormData({
          name: service.name || '',
          description: service.description || '',
          type: service.type || '',
          duration: service.duration?.toString() || '',
          price: service.price?.toString() || '',
          is_active: service.is_active ?? true,
        });
      } else {
        setError('Service not found');
      }
    } catch (err) {
      setError('Failed to load service');
    } finally {
      setLoading(false);
    }
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
    setSaving(true);

    try {
      const response = await serviceService.updateService(id, {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        price: parseFloat(formData.price),
        is_active: formData.is_active,
      });

      if (response.success) {
        router.push('/admin/services');
      } else {
        setError(response.error || 'Failed to update service');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-body text-muted">Loading service...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/services">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-h1 font-bold text-text">Edit Service</h1>
          <p className="text-body text-muted">Update service information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Basic Information</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                {error && (
                  <div className="p-4 bg-danger/10 border border-danger rounded-button text-danger text-small">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Service Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Basic Grooming"
                    required
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Service details..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Service Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-button focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option value="">Select type</option>
                    <option value="grooming">Grooming</option>
                    <option value="medical">Medical</option>
                    <option value="boarding">Boarding</option>
                    <option value="daycare">Daycare</option>
                    <option value="training">Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </Card.Content>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Pricing & Duration</Card.Title>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Price (Rp) *
                  </label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="50000"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-small font-semibold text-text mb-2">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="60"
                    min="0"
                  />
                  <p className="text-xs text-muted mt-1">
                    Optional: Estimated service duration
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-body text-text cursor-pointer">
                    Active (visible in public listing)
                  </label>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Content className="space-y-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Service
                    </>
                  )}
                </Button>

                <Link href="/admin/services">
                  <Button variant="outline" type="button" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
