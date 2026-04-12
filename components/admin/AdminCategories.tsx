'use client';

import { Plus, Edit3, Trash2 } from 'lucide-react';
import type { Category } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AdminCategoriesProps {
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
  onAdd: () => void;
}

export function AdminCategories({ categories, onEdit, onDelete, onAdd }: AdminCategoriesProps) {
  const sorted = [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold tracking-tight">Categories</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" /> Add category
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Sort</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-semibold">{c.name}</TableCell>
                <TableCell className="max-w-md truncate text-muted-foreground text-sm">
                  {c.description || '—'}
                </TableCell>
                <TableCell>{c.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(c)} aria-label="Edit category">
                      <Edit3 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => onDelete(c)}
                      aria-label="Delete category"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
