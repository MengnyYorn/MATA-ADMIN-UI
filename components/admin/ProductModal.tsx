'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { productFormSchema, type ProductFormValues } from '@/lib/validations/schemas';

const CATEGORIES = ['Dresses', 'Knitwear', 'Tops', 'Bottoms', 'Outerwear'];
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void | Promise<void>;
  product?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Dresses',
    price: 0,
    stock: 0,
    image: DEFAULT_IMAGE,
    description: '',
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    rating: 5,
    reviews: 0,
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        category: 'Dresses',
        price: 0,
        stock: 0,
        image: DEFAULT_IMAGE,
        description: '',
        sizes: ['S', 'M', 'L'],
        colors: ['Black'],
        rating: 5,
        reviews: 0,
      });
    }
    setFieldErrors({});
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const payload = {
      name: formData.name ?? '',
      category: (formData.category ?? 'Dresses') as ProductFormValues['category'],
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      image: formData.image ?? '',
      description: formData.description ?? '',
      sizes: formData.sizes ?? [],
      colors: formData.colors ?? [],
      rating: formData.rating ?? 5,
      reviews: formData.reviews ?? 0,
    };
    const parsed = productFormSchema.safeParse(payload);
    if (!parsed.success) {
      const issues: Partial<Record<keyof ProductFormValues, string>> = {};
      parsed.error.issues.forEach((i) => {
        const path = i.path[0] as keyof ProductFormValues;
        if (path && !issues[path]) issues[path] = i.message;
      });
      setFieldErrors(issues);
      return;
    }
    onSave({
      ...formData,
      ...parsed.data,
      id: product?.id ?? Math.random().toString(36).substring(2, 11),
    } as Product);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Product Name</Label>
              <Input
                className="h-10"
                value={formData.name ?? ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                aria-invalid={!!fieldErrors.name}
              />
              {fieldErrors.name && (
                <p className="text-sm text-destructive">{fieldErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Category</Label>
              <Select
                value={formData.category ?? 'Dresses'}
                onValueChange={(v) => setFormData({ ...formData, category: v ?? 'Dresses' })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Price ($)</Label>
              <Input
                type="number"
                className="h-10"
                value={formData.price ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
                aria-invalid={!!fieldErrors.price}
              />
              {fieldErrors.price && (
                <p className="text-sm text-destructive">{fieldErrors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Stock Quantity</Label>
              <Input
                type="number"
                className="h-10"
                value={formData.stock ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })
                }
                aria-invalid={!!fieldErrors.stock}
              />
              {fieldErrors.stock && (
                <p className="text-sm text-destructive">{fieldErrors.stock}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Image URL</Label>
            <Input
              className="h-10"
              value={formData.image ?? ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Description</Label>
            <Textarea
              rows={4}
              className="min-h-[100px]"
              value={formData.description ?? ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
