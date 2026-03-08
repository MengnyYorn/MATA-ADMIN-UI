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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusToBadgeVariant = (status: string): 'success' | 'info' | 'warning' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'Delivered': return 'success';
    case 'Shipped': return 'info';
    case 'Pending': return 'warning';
    case 'Cancelled': return 'destructive';
    default: return 'secondary';
  }
};

export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface DashboardOrder {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface AdminDashboardProps {
  orders: DashboardOrder[];
  stats: DashboardStat[];
  salesData: { name: string; sales: number }[];
}

export function AdminDashboard({ orders, stats, salesData }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <Button variant="outline" size="default">
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                {stat.change && (
                  <span
                    className={cn(
                      'text-xs font-bold',
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <Badge variant={statusToBadgeVariant(order.status)} className="uppercase text-[10px]">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
