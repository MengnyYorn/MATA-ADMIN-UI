'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const mainNav = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingBag, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
];

const secondaryNav = [
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const navLinkClass = (active: boolean) =>
  cn(
    'flex w-full items-center gap-2 overflow-hidden rounded-md p-2.5 text-left text-base font-medium',
    'ring-sidebar-ring outline-none transition-colors',
    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    'focus-visible:ring-2',
    active && 'bg-sidebar-accent text-sidebar-accent-foreground'
  );

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const name = session?.user?.name ?? 'User';
  const email = session?.user?.email ?? 'Admin';
  const initials = name.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    signOut({ callbackUrl: '/login' });
  };

  return (
    <aside
      className={cn(
        'flex h-svh w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        'border-r border-sidebar-border'
      )}
      data-sidebar="sidebar"
    >
      {/* SidebarHeader */}
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-sidebar-border px-4">
        <Link
          href="/admin"
          className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 rounded-md"
          aria-label="MATA Admin"
        >
          <Image
            src="/MATA.svg"
            alt="MATA"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main nav */}
      <div className="flex flex-1 flex-col gap-2 overflow-auto py-2">
        <div className="px-2">
          <ul className="flex w-full flex-col gap-1" data-sidebar="menu">
            {mainNav.map((item) => (
              <li key={item.path} data-sidebar="menu-item">
                <Link
                  href={item.path}
                  className={navLinkClass(pathname === item.path)}
                  data-active={pathname === item.path}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary nav: Settings, Get Help, Search */}
        <div className="px-2">
          <ul className="flex w-full flex-col gap-1" data-sidebar="menu">
            {secondaryNav.map((item) => (
              <li key={item.label} data-sidebar="menu-item">
                <Link
                  href={item.path}
                  className={navLinkClass(pathname === item.path)}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User profile block with dropdown - like shadcn reference */}
      <div className="mt-auto shrink-0 border-t border-sidebar-border p-2">
        <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-2">
          <div className="flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-base font-medium">
              {initials}
            </div>
            <div className="grid min-w-0 flex-1 text-left text-base leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-sm text-muted-foreground">
                {email}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="size-8 shrink-0 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
                aria-label="Open user menu"
              >
                <LogOut className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-base font-medium">
                      {initials}
                    </div>
                    <div className="grid min-w-0 flex-1 text-left text-base leading-tight">
                      <span className="truncate font-medium">{name}</span>
                      <span className="truncate text-sm text-muted-foreground">
                        {email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLogoutDialogOpen(true)}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent showCloseButton={true}>
          <DialogHeader>
            <DialogTitle>Log out</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button className="border border-input" />}>
              Cancel
            </DialogClose>
            <Button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
