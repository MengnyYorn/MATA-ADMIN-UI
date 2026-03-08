'use client';

import { useEffect, useState } from 'react';
import { fetchDashboard } from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminDashboardClient() {
  const { token, status } = useAdminSession();
  const [dashboard, setDashboard] = useState<{
    totalRevenue: number;
    activeOrders: number;
    totalCustomers: number;
    conversionRate: number;
    salesData: { name: string; sales: number }[];
    recentOrders: { id: string; customerName: string; date: string; total: number; status: string; items: number }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !token) return;
    fetchDashboard(token)
      .then(setDashboard)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load dashboard'));
  }, [token, status]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const orders = dashboard?.recentOrders ?? [];
  const stats = dashboard
    ? [
        { label: 'Total Revenue', value: `$${dashboard.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, change: '', trend: 'up' as const },
        { label: 'Active Orders', value: String(dashboard.activeOrders), change: '', trend: 'up' as const },
        { label: 'Customers', value: String(dashboard.totalCustomers), change: '', trend: 'up' as const },
        { label: 'Conversion Rate', value: `${dashboard.conversionRate.toFixed(2)}%`, change: '', trend: 'up' as const },
      ]
    : [];
  const salesData = dashboard?.salesData ?? [];

  return (
    <AdminDashboard
      orders={orders}
      stats={stats}
      salesData={salesData}
    />
  );
}
