'use client';

import { useState } from 'react';
import type { Customer } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  customerCreateSchema,
  customerUpdateSchema,
  type CustomerCreateFormValues,
  type CustomerUpdateFormValues,
} from '@/lib/validations/schemas';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CustomerCreateFormValues | CustomerUpdateFormValues, mode: 'create' | 'edit') => void | Promise<void>;
  customer?: Customer | null;
}

export function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
  const mode = customer ? 'edit' : 'create';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <CustomerModalForm
          key={customer?.id ?? 'new'}
          customer={customer}
          mode={mode}
          onClose={onClose}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}

function CustomerModalForm({
  customer,
  mode,
  onSave,
  onClose,
}: {
  customer?: Customer | null;
  mode: 'create' | 'edit';
  onSave: CustomerModalProps['onSave'];
  onClose: () => void;
}) {
  const [name, setName] = useState(customer?.name ?? '');
  const [email, setEmail] = useState(customer?.email ?? '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(customer?.avatar ?? '');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (mode === 'create') {
      const parsed = customerCreateSchema.safeParse({
        name,
        email,
        password,
        avatar: avatar.trim() || undefined,
      });
      if (!parsed.success) {
        const err: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          const k = String(i.path[0]);
          if (!err[k]) err[k] = i.message;
        });
        setFieldErrors(err);
        return;
      }
      onSave(parsed.data, 'create');
      return;
    }

    const parsed = customerUpdateSchema.safeParse({
      name,
      email,
      avatar,
    });
    if (!parsed.success) {
      const err: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = String(i.path[0]);
        if (!err[k]) err[k] = i.message;
      });
      setFieldErrors(err);
      return;
    }
    onSave(parsed.data, 'edit');
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold tracking-tight">
          {mode === 'edit' ? 'Edit customer' : 'Add customer'}
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="cust-name">Name</Label>
          <Input
            id="cust-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          {fieldErrors.name && (
            <p className="text-xs text-destructive">{fieldErrors.name}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cust-email">Email</Label>
          <Input
            id="cust-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {fieldErrors.email && (
            <p className="text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>
        {mode === 'create' && (
          <div className="grid gap-2">
            <Label htmlFor="cust-password">Password</Label>
            <Input
              id="cust-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="cust-avatar">Avatar (optional, max 10 chars)</Label>
          <Input
            id="cust-avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="e.g. AB"
            maxLength={10}
          />
          {fieldErrors.avatar && (
            <p className="text-xs text-destructive">{fieldErrors.avatar}</p>
          )}
        </div>
      </div>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{mode === 'edit' ? 'Save' : 'Create'}</Button>
      </DialogFooter>
    </form>
  );
}
