'use client';

import { Save } from 'lucide-react';
import type { Settings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AdminSettingsProps {
  settings: Settings;
  onUpdate: (s: Settings) => void;
}

export function AdminSettings({ settings, onUpdate }: AdminSettingsProps) {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-8">Store Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600">
              Store Name
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
              value={settings.storeName}
              onChange={(e) => onUpdate({ ...settings, storeName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Support Email
            </label>
            <input
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
              value={settings.supportEmail}
              onChange={(e) => onUpdate({ ...settings, supportEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Currency
            </label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
              value={settings.currency}
              onChange={(e) => onUpdate({ ...settings, currency: e.target.value })}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Tax Rate (%)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
              value={settings.taxRate}
              onChange={(e) =>
                onUpdate({ ...settings, taxRate: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Default Shipping Fee ($)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:border-brand-accent outline-none transition-all"
              value={settings.shippingFee}
              onChange={(e) =>
                onUpdate({ ...settings, shippingFee: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-50 flex justify-end">
          <button
            type="button"
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Save size={20} /> Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xl font-serif font-bold mb-4 text-red-600">Danger Zone</h3>
        <p className="text-gray-600 text-sm mb-6">
          Once you delete your store, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          className="px-6 py-3 border-2 border-red-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors"
        >
          Delete Store
        </button>
      </div>
    </div>
  );
}
