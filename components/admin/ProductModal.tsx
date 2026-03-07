'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import type { Product } from '@/lib/types';

const CATEGORIES = ['Dresses', 'Knitwear', 'Tops', 'Bottoms', 'Outerwear'];
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
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
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: product?.id ?? Math.random().toString(36).substring(2, 11),
    } as Product);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Product Name
              </label>
              <input
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
                value={formData.name ?? ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Category
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
                value={formData.category ?? 'Dresses'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Price ($)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
                value={formData.price ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Stock Quantity
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
                value={formData.stock ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Image URL
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
              value={formData.image ?? ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all resize-none"
              value={formData.description ?? ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl bg-brand-primary text-white font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
