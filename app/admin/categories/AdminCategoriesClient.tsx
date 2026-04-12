'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { AdminCategories } from '@/components/admin/AdminCategories';
import { CategoryModal } from '@/components/admin/CategoryModal';
import type { Category } from '@/lib/types';
import type { CategoryFormValues } from '@/lib/validations/schemas';

export function AdminCategoriesClient() {
  const { token, status } = useAdminSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const load = useCallback(() => {
    fetchCategories()
      .then(setCategories)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load categories'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (values: CategoryFormValues, existing?: Category | null) => {
    if (!token) return;
    try {
      setError(null);
      if (existing) {
        await updateCategory(
          existing.id,
          {
            name: values.name,
            description: values.description,
            sortOrder: values.sortOrder,
          },
          token
        );
      } else {
        await createCategory(
          {
            name: values.name,
            description: values.description,
            sortOrder: values.sortOrder,
          },
          token
        );
      }
      setIsModalOpen(false);
      setEditing(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const handleDelete = async (c: Category) => {
    if (!token) return;
    if (!window.confirm(`Delete category "${c.name}"? Products using it cannot be deleted until reassigned.`)) {
      return;
    }
    try {
      setError(null);
      await deleteCategory(c.id, token);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">Loading…</div>
    );
  }

  return (
    <>
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        category={editing}
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <AdminCategories
        categories={categories}
        onAdd={() => {
          setEditing(null);
          setIsModalOpen(true);
        }}
        onEdit={(c) => {
          setEditing(c);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />
    </>
  );
}
