'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Order } from '@/lib/types';
import { DASHBOARD_STATS, SALES_DATA } from '@/lib/data';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
  orders: Order[];
}

const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export function AdminDashboard({ orders }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Download Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <span
                className={cn(
                  'text-xs font-bold',
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Performance</h3>
          <div className="h-[300px] min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#1a1a1a"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1a1a1a' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-600">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                  <span
                    className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider',
                      statusStyles[order.status] ?? 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
