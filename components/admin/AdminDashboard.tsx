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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard Overview</h2>
          <p className="text-muted-foreground mt-1">Welcome back, here&apos;s what&apos;s happening today.</p>
        </div>
        <Button variant="outline" size="default">
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
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
                      stat.trend === 'up' ? 'text-emerald-600' : 'text-destructive'
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 'var(--radius)',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'hsl(var(--foreground))' }}
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
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusToBadgeVariant(order.status)} className="uppercase text-[10px]">
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
