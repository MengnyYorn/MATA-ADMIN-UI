'use client';

import { useEffect, useState } from 'react';
import { fetchCustomers, fetchCustomer } from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminCustomers } from '@/components/admin/AdminCustomers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Customer } from '@/lib/types';

export function AdminCustomersClient() {
  const { token, status } = useAdminSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchCustomers(token)
        .then(setCustomers)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load customers'));
    }
  }, [token, status]);

  useEffect(() => {
    if (!detailCustomerId || !token) {
      setDetailCustomer(null);
      return;
    }
    fetchCustomer(detailCustomerId, token)
      .then(setDetailCustomer)
      .catch(() => setDetailCustomer(null));
  }, [detailCustomerId, token]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <>
      <Dialog open={!!detailCustomerId} onOpenChange={(open) => !open && setDetailCustomerId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer details</DialogTitle>
          </DialogHeader>
          {detailCustomer ? (
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {detailCustomer.name}</p>
              <p><span className="font-medium">Email:</span> {detailCustomer.email}</p>
              <p><span className="font-medium">Orders:</span> {detailCustomer.orders}</p>
              <p><span className="font-medium">Total spent:</span> ${detailCustomer.totalSpent.toFixed(2)}</p>
              <p><span className="font-medium">Last order:</span> {detailCustomer.lastOrder || '—'}</p>
            </div>
          ) : detailCustomerId ? (
            <p className="text-muted-foreground">Loading customer…</p>
          ) : null}
        </DialogContent>
      </Dialog>
      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}
      <AdminCustomers
        customers={customers}
        onViewCustomer={(id) => setDetailCustomerId(id)}
      />
    </>
  );
}
