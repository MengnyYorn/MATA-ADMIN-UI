'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  fetchCustomer,
  updateCustomer,
} from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminCustomers } from '@/components/admin/AdminCustomers';
import { CustomerModal } from '@/components/admin/CustomerModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Customer } from '@/lib/types';
import type { CustomerCreateFormValues, CustomerUpdateFormValues } from '@/lib/validations/schemas';

export function AdminCustomersClient() {
  const { token, status } = useAdminSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [detailCustomerId, setDetailCustomerId] = useState<string | null>(null);
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const loadCustomers = useCallback(() => {
    if (!token) return;
    fetchCustomers(token)
      .then(setCustomers)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load customers'));
  }, [token]);

  useEffect(() => {
    if (status === 'authenticated' && token) loadCustomers();
  }, [token, status, loadCustomers]);

  useEffect(() => {
    if (!detailCustomerId || !token) {
      setDetailCustomer(null);
      return;
    }
    fetchCustomer(detailCustomerId, token)
      .then(setDetailCustomer)
      .catch(() => setDetailCustomer(null));
  }, [detailCustomerId, token]);

  const handleSave = async (
    payload: CustomerCreateFormValues | CustomerUpdateFormValues,
    mode: 'create' | 'edit'
  ) => {
    if (!token) return;
    setError(null);
    try {
      if (mode === 'create') {
        const p = payload as CustomerCreateFormValues;
        await createCustomer(
          {
            name: p.name,
            email: p.email,
            password: p.password,
            avatar: p.avatar?.trim() || undefined,
          },
          token
        );
      } else if (editingCustomer) {
        const p = payload as CustomerUpdateFormValues;
        await updateCustomer(
          editingCustomer.id,
          {
            name: p.name,
            email: p.email,
            avatar: p.avatar,
          },
          token
        );
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      loadCustomers();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const handleDelete = async (c: Customer) => {
    if (!token) return;
    if (!window.confirm(`Delete customer ${c.name} (${c.email})? This cannot be undone.`)) return;
    setError(null);
    try {
      await deleteCustomer(c.id, token);
      loadCustomers();
      if (detailCustomerId === c.id) setDetailCustomerId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
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
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        onSave={handleSave}
        customer={editingCustomer}
      />
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
        onEditCustomer={(c) => {
          setEditingCustomer(c);
          setIsModalOpen(true);
        }}
        onDeleteCustomer={handleDelete}
        onAddCustomer={() => {
          setEditingCustomer(null);
          setIsModalOpen(true);
        }}
      />
    </>
  );
}
