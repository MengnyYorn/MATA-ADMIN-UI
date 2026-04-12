'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';
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
import { Textarea } from '@/components/ui/textarea';
import { categoryFormSchema, type CategoryFormValues } from '@/lib/validations/schemas';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: CategoryFormValues, category?: Category | null) => void | Promise<void>;
  category?: Category | null;
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <CategoryModalForm
          key={category?.id ?? 'new'}
          category={category}
          onClose={onClose}
          onSave={onSave}
        />
      </DialogContent>
    </Dialog>
  );
}

function CategoryModalForm({
  category,
  onSave,
  onClose,
}: {
  category?: Category | null;
  onClose: () => void;
  onSave: CategoryModalProps['onSave'];
}) {
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CategoryFormValues, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    const parsed = categoryFormSchema.safeParse({
      name,
      description: description.trim() || undefined,
      sortOrder: Number(sortOrder) || 0,
    });
    if (!parsed.success) {
      const issues: Partial<Record<keyof CategoryFormValues, string>> = {};
      parsed.error.issues.forEach((i) => {
        const path = i.path[0] as keyof CategoryFormValues;
        if (path && !issues[path]) issues[path] = i.message;
      });
      setFieldErrors(issues);
      return;
    }
    onSave(parsed.data, category ?? undefined);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold tracking-tight">
          {category ? 'Edit category' : 'Add category'}
        </DialogTitle>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Name</Label>
          <Input
            className="h-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!fieldErrors.name}
            placeholder="e.g. Accessories"
          />
          {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Description (optional)</Label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Shown internally for reference"
          />
          {fieldErrors.description && (
            <p className="text-sm text-destructive">{fieldErrors.description}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground">Sort order</Label>
          <Input
            type="number"
            className="h-10"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
            min={0}
            aria-invalid={!!fieldErrors.sortOrder}
          />
          {fieldErrors.sortOrder && (
            <p className="text-sm text-destructive">{fieldErrors.sortOrder}</p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{category ? 'Save' : 'Create'}</Button>
        </DialogFooter>
      </form>
    </>
  );
}
