'use client';

import { useAppState } from '@/context/AppStateContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export function AdminDashboardClient() {
  const { orders } = useAppState();
  return <AdminDashboard orders={orders} />;
}
