'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import { ProductModal } from '@/components/admin/ProductModal';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export function AdminProductsClient() {
  const { products, setProducts } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSave = (product: Product) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      setProducts((prev) => [...prev, product]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
      />
      <div className="p-8 bg-white rounded-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Product Management</h2>
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:opacity-90 flex items-center gap-2"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-600 uppercase tracking-widest">
              <th className="pb-4 font-medium">Product</th>
              <th className="pb-4 font-medium">Category</th>
              <th className="pb-4 font-medium">Price</th>
              <th className="pb-4 font-medium">Stock</th>
              <th className="pb-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-semibold text-gray-900">{p.name}</span>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-600">{p.category}</td>
                <td className="py-4 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                <td className="py-4">
                  <span
                    className={cn(
                      'text-xs font-bold px-2 py-1 rounded-full',
                      p.stock < 20 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    )}
                  >
                    {p.stock} in stock
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(p);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
