'use client';

import { useEffect, useState } from 'react';
import { fetchCustomers } from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminCustomers } from '@/components/admin/AdminCustomers';

export function AdminCustomersClient() {
  const { token, status } = useAdminSession();
  const [customers, setCustomers] = useState<import('@/lib/types').Customer[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchCustomers(token)
        .then(setCustomers)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load customers'));
    }
  }, [token, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}
      <AdminCustomers customers={customers} />
    </>
  );
}
