'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import type { Settings } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { settingsSchema, type SettingsFormValues } from '@/lib/validations/schemas';

interface AdminSettingsProps {
  settings: Settings;
  onUpdate: (s: Settings) => void;
  onSave?: (s: Settings) => void;
}

export function AdminSettings({ settings, onUpdate, onSave }: AdminSettingsProps) {
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SettingsFormValues, string>>>({});

  const handleSave = () => {
    if (!onSave) return;
    setFieldErrors({});
    const payload = {
      storeName: settings.storeName,
      supportEmail: settings.supportEmail,
      currency: settings.currency as SettingsFormValues['currency'],
      taxRate: Number(settings.taxRate) || 0,
      shippingFee: Number(settings.shippingFee) || 0,
    };
    const parsed = settingsSchema.safeParse(payload);
    if (!parsed.success) {
      const issues: Partial<Record<keyof SettingsFormValues, string>> = {};
      parsed.error.issues.forEach((i) => {
        const path = i.path[0] as keyof SettingsFormValues;
        if (path && !issues[path]) issues[path] = i.message;
      });
      setFieldErrors(issues);
      return;
    }
    onSave(settings);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold tracking-tight">Store Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Store Name
              </Label>
              <Input
                className="h-10"
                value={settings.storeName}
                onChange={(e) => onUpdate({ ...settings, storeName: e.target.value })}
                aria-invalid={!!fieldErrors.storeName}
              />
              {fieldErrors.storeName && (
                <p className="text-sm text-destructive">{fieldErrors.storeName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Support Email
              </Label>
              <Input
                className="h-10"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => onUpdate({ ...settings, supportEmail: e.target.value })}
                aria-invalid={!!fieldErrors.supportEmail}
              />
              {fieldErrors.supportEmail && (
                <p className="text-sm text-destructive">{fieldErrors.supportEmail}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Tax Rate (%)
              </Label>
              <Input
                type="number"
                className="h-10"
                value={settings.taxRate}
                onChange={(e) =>
                  onUpdate({ ...settings, taxRate: parseFloat(e.target.value) || 0 })
                }
                aria-invalid={!!fieldErrors.taxRate}
              />
              {fieldErrors.taxRate && (
                <p className="text-sm text-destructive">{fieldErrors.taxRate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Default Shipping Fee ($)
              </Label>
              <Input
                type="number"
                className="h-10"
                value={settings.shippingFee}
                onChange={(e) =>
                  onUpdate({ ...settings, shippingFee: parseFloat(e.target.value) || 0 })
                }
                aria-invalid={!!fieldErrors.shippingFee}
              />
              {fieldErrors.shippingFee && (
                <p className="text-sm text-destructive">{fieldErrors.shippingFee}</p>
              )}
            </div>
          </div>
          <div className="pt-6 border-t flex justify-end">
            <Button onClick={handleSave}>
              <Save className="size-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
