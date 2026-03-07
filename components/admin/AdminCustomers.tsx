'use client';

import { Plus, Edit3, Trash2 } from 'lucide-react';
import type { Customer } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AdminCustomersProps {
  customers: Customer[];
}

export function AdminCustomers({ customers }: AdminCustomersProps) {
  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Customer Management</h2>
        <button
          type="button"
          className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={16} /> Add Customer
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-widest">
            <th className="pb-4 font-medium">Customer</th>
            <th className="pb-4 font-medium">Email</th>
            <th className="pb-4 font-medium">Orders</th>
            <th className="pb-4 font-medium">Total Spent</th>
            <th className="pb-4 font-medium">Last Order</th>
            <th className="pb-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {customers.map((c) => (
            <tr key={c.id} className="group hover:bg-gray-50/50 transition-colors">
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold text-xs">
                    {c.avatar ?? c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900">{c.name}</span>
                </div>
              </td>
              <td className="py-4 text-sm text-gray-600">{c.email}</td>
              <td className="py-4 text-sm font-medium text-gray-900">{c.orders}</td>
              <td className="py-4 font-bold text-gray-900">${c.totalSpent.toFixed(2)}</td>
              <td className="py-4 text-sm text-gray-600">{c.lastOrder}</td>
              <td className="py-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
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
  );
}
