'use client';

import { useAppState } from '@/context/AppStateContext';
import { AdminSettings } from '@/components/admin/AdminSettings';

export function AdminSettingsClient() {
  const { settings, setSettings } = useAppState();
  return <AdminSettings settings={settings} onUpdate={setSettings} />;
}
