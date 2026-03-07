'use client';

import { useAppState } from '@/context/AppStateContext';
import { AdminCustomers } from '@/components/admin/AdminCustomers';

export function AdminCustomersClient() {
  const { customers } = useAppState();
  return <AdminCustomers customers={customers} />;
}
