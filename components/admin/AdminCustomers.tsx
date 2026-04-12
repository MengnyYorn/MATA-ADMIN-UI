'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, ChevronRight } from 'lucide-react';
import type { Customer } from '@/lib/types';
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

interface AdminCustomersProps {
  customers: Customer[];
  onViewCustomer?: (id: string) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customer: Customer) => void;
  onAddCustomer?: () => void;
}

function isAvatarImageUrl(avatar: string | undefined): boolean {
  if (!avatar?.trim()) return false;
  const a = avatar.trim().toLowerCase();
  return a.startsWith('http://') || a.startsWith('https://') || a.startsWith('//');
}

function CustomerAvatarCell({ name, avatar }: { name: string; avatar?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const initialsFromName = name.slice(0, 2).toUpperCase();
  const url = avatar?.trim();

  if (url && isAvatarImageUrl(url) && !imgFailed) {
    return (
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-border">
        {/* eslint-disable-next-line @next/next/no-img-element -- remote Google URLs; avoid next/image domain config */}
        <img
          src={url.startsWith('//') ? `https:${url}` : url}
          alt=""
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  const text =
    avatar && !isAvatarImageUrl(avatar)
      ? avatar.trim().slice(0, 2).toUpperCase()
      : initialsFromName;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
      {text}
    </div>
  );
}

export function AdminCustomers({
  customers,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onAddCustomer,
}: AdminCustomersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold tracking-tight">Customer Management</CardTitle>
        <Button variant="outline" size="sm" onClick={onAddCustomer}>
          <Plus className="size-4" /> Add Customer
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <CustomerAvatarCell name={c.name} avatar={c.avatar} />
                    <span className="min-w-0 truncate font-semibold">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.email}</TableCell>
                <TableCell className="font-medium">{c.orders}</TableCell>
                <TableCell className="font-bold">${c.totalSpent.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground">{c.lastOrder}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {onViewCustomer && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onViewCustomer(c.id)}
                        aria-label="View customer details"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    )}
                    {onEditCustomer && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onEditCustomer(c)}
                        aria-label="Edit customer"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                    )}
                    {onDeleteCustomer && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onDeleteCustomer(c)}
                        aria-label="Delete customer"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
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
