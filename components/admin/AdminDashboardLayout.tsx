'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

const pathLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/settings': 'Settings',
};

export function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentLabel = pathLabels[pathname] ?? (segments[segments.length - 1] ? segments[segments.length - 1].charAt(0).toUpperCase() + segments[segments.length - 1].slice(1) : 'Dashboard');

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Top navbar - shadcn dashboard header pattern */}
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-1 md:hidden"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="size-5" />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 h-4 hidden md:block"
          decorative
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:inline-flex" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
