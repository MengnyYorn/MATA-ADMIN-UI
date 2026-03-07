'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900">
          MATA <span className="text-xs font-sans font-normal text-gray-600 uppercase tracking-widest ml-1">Admin</span>
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              pathname === item.path ? 'bg-brand-primary text-white' : 'text-gray-600 hover:bg-gray-50'
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-bold">
            JD
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Jane Doe</p>
            <p className="text-xs text-gray-600">Store Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}
