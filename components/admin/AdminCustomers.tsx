'use client';

import { Plus, Edit3, Trash2 } from 'lucide-react';
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
}

export function AdminCustomers({ customers }: AdminCustomersProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold tracking-tight">Customer Management</CardTitle>
        <Button variant="outline" size="sm">
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-xs">
                      {c.avatar ?? c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{c.email}</TableCell>
                <TableCell className="font-medium">{c.orders}</TableCell>
                <TableCell className="font-bold">${c.totalSpent.toFixed(2)}</TableCell>
                <TableCell className="text-muted-foreground">{c.lastOrder}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon-sm">
                      <Edit3 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
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
