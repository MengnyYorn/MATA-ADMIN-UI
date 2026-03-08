'use client';

import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminSettings } from '@/components/admin/AdminSettings';
import type { Settings } from '@/lib/types';

const defaultSettings: Settings = {
  storeName: '',
  currency: 'USD',
  taxRate: 0,
  shippingFee: 0,
  supportEmail: '',
};

export function AdminSettingsClient() {
  const { token, status } = useAdminSession();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && token) {
      fetchSettings(token)
        .then((s) => s && setSettings(s))
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load settings'));
    }
  }, [token, status]);

  const handleUpdate = async (next: Settings) => {
    if (!token) return;
    try {
      const updated = await updateSettings(next, token);
      if (updated) setSettings(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
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
      {error && (
        <p className="text-sm text-destructive mb-4">{error}</p>
      )}
      <AdminSettings settings={settings} onUpdate={setSettings} onSave={handleUpdate} />
    </>
  );
}
