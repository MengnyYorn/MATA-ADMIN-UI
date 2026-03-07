'use client';

import { ChevronRight } from 'lucide-react';
import { useAppState } from '@/context/AppStateContext';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export function AdminOrdersClient() {
  const { orders, updateOrderStatus } = useAppState();

  return (
    <div className="p-8 bg-white rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Order Management</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-4 border border-gray-100 rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">
                #{order.id.split('-')[1]}
              </div>
              <div>
                <p className="font-bold text-gray-900">{order.customerName}</p>
                <p className="text-xs text-gray-600">
                  {order.date} • {order.items} items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                <select
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider outline-none border-none cursor-pointer',
                    statusStyles[order.status] ?? 'bg-gray-100 text-gray-700'
                  )}
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(order.id, e.target.value as Order['status'])
                  }
                >
                  {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
