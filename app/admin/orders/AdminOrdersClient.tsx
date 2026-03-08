'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusOptions: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
const statusStyles: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export function AdminOrdersClient() {
  const { token, status } = useAdminSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchOrders(token)
        .then(setOrders)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load orders'));
    }
  }, [token, status]);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    if (!token) return;
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-serif font-bold">Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border border-border rounded-xl flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground">
                  #{order.id}
                </div>
                <div>
                  <p className="font-bold">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.date} • {order.items} items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right flex items-center gap-2">
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                  <Select
                    value={order.status}
                    onValueChange={(v) => handleStatusChange(order.id, v as Order['status'])}
                  >
                    <SelectTrigger
                      className={cn(
                        'w-[120px] text-[10px] font-bold uppercase tracking-wider',
                        statusStyles[order.status] ?? 'bg-muted'
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="size-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
