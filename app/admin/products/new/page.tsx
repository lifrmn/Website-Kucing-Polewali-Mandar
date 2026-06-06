'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Input, Textarea, Button } from '@/components/ui';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image_url: '',
    sku: '',
    is_active: true,
  });
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await productService.createProduct(formData);
      
      if (response.success) {
        router.push('/admin/products');
      } else {
        alert(response.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        id: `temp-${Date.now()}`,
        name: '',
        sku: '',
        price: formData.price,
        stock: 0,
        attributes: {},
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-h1 font-bold text-text">Add New Product</h1>
            <p className="text-small text-muted">Create a new product listing</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <Card.Header>
            <Card.Title>Basic Information</Card.Title>
            <Card.Description>Product name, description, and category</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4 p-6">
            <Input
              label="Product Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Premium Dog Food 10kg"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Food, Toys, Accessories"
              />

              <Input
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., DOG-FOOD-001"
              />
            </div>

            <Input
              label="Image URL"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              helperText="Enter image URL or use upload service"
            />
          </Card.Content>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <Card.Header>
            <Card.Title>Pricing & Inventory</Card.Title>
            <Card.Description>Set price and stock quantity</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price (IDR)"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="50000"
              />

              <Input
                label="Stock"
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="100"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <label htmlFor="is_active" className="text-body text-text">
                Active (visible in store)
              </label>
            </div>
          </Card.Content>
        </Card>

        {/* Product Variants (Future Enhancement) */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <Card.Title>Product Variants</Card.Title>
                <Card.Description>Add size, color, or other variants (optional)</Card.Description>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </Card.Header>
          {variants.length > 0 && (
            <Card.Content className="p-6 space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="p-4 border border-border rounded-button space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-small font-semibold text-text">Variant {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="p-1 text-danger hover:bg-danger/10 rounded-button transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      label="Variant Name"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      placeholder="e.g., Large, Red"
                      size={3}
                    />
                    <Input
                      label="Price"
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      size={3}
                    />
                    <Input
                      label="Stock"
                      type="number"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', Number(e.target.value))}
                      size={3}
                    />
                  </div>
                </div>
              ))}
            </Card.Content>
          )}
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button type="submit" isLoading={loading} className="min-w-32">
            <Save className="w-4 h-4 mr-2" />
            Create Product
          </Button>
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
