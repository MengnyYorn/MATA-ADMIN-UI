'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { fetchOrders, fetchOrder, updateOrderStatus } from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Delivered: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Shipped: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  Cancelled: 'bg-destructive/10 text-destructive',
};

export function AdminOrdersClient() {
  const { token, status } = useAdminSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchOrders(token)
        .then(setOrders)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load orders'));
    }
  }, [token, status]);

  useEffect(() => {
    if (!detailOrderId || !token) {
      setDetailOrder(null);
      return;
    }
    fetchOrder(detailOrderId, token)
      .then(setDetailOrder)
      .catch(() => setDetailOrder(null));
  }, [detailOrderId, token]);

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
    <>
      <Dialog open={!!detailOrderId} onOpenChange={(open) => !open && setDetailOrderId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order #{detailOrder?.id ?? detailOrderId}</DialogTitle>
          </DialogHeader>
          {detailOrder ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Customer:</span> {detailOrder.customerName}</p>
              <p><span className="font-medium">Date:</span> {detailOrder.date}</p>
              <p><span className="font-medium">Items:</span> {detailOrder.items}</p>
              <p><span className="font-medium">Total:</span> ${detailOrder.total.toFixed(2)}</p>
              <p><span className="font-medium">Status:</span> {detailOrder.status}</p>
              {token && (
                <Select
                  value={detailOrder.status}
                  onValueChange={(v) => {
                    handleStatusChange(detailOrder.id, v as Order['status']);
                    setDetailOrder((o) => o ? { ...o, status: v as Order['status'] } : null);
                  }}
                >
                  <SelectTrigger className={cn('w-[140px] mt-2', statusStyles[detailOrder.status] ?? 'bg-muted')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : detailOrderId ? (
            <p className="text-muted-foreground">Loading order…</p>
          ) : null}
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Order Management</CardTitle>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDetailOrderId(order.id)}
                    aria-label="View order details"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
