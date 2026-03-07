'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product, Order, Customer, Settings } from '@/lib/types';
import {
  PRODUCTS,
  ORDERS,
  CUSTOMERS,
  INITIAL_SETTINGS,
} from '@/lib/data';

type OrderStatus = Order['status'];

interface AppStateContextValue {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  const value: AppStateContextValue = {
    products,
    setProducts,
    orders,
    setOrders,
    customers,
    setCustomers,
    settings,
    setSettings,
    updateOrderStatus,
  };

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
