export { apiRequest, apiData, ApiError } from './client';
export type { RequestOptions } from './client';
export * from './types';
export * from './mappers';

import { apiData } from './client';
import type {
  ApiProduct,
  ApiOrder,
  ApiDashboard,
  ApiUser,
  ApiSettings,
  AuthResponse,
  LoginRequest,
  ProductRequest,
} from './types';
import {
  mapApiProductToProduct,
  mapApiOrderToOrder,
  mapApiUserToCustomer,
  mapApiSettingsToSettings,
} from './mappers';
import { productRequestSchema } from '@/lib/validations/schemas';
import type { Product, Order, Customer, Settings } from '@/lib/types';

const tokenParam = (token: string | null | undefined) => (token ? { token } : {});

/** Auth: login and return tokens + user */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await apiData<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password } satisfies LoginRequest),
    skipAuth: true,
  });
  if (!res) throw new Error('Login failed');
  return res;
}

/** Products (public GET; admin POST/PUT/DELETE with token) */
export async function fetchProducts(token?: string | null): Promise<Product[]> {
  const out = await apiData<import('./types').ApiProduct[]>('/api/v1/products', tokenParam(token));
  return (out ?? []).map(mapApiProductToProduct);
}

export async function fetchProduct(
  id: string,
  token?: string | null
): Promise<Product | null> {
  const out = await apiData<import('./types').ApiProduct>(
    `/api/v1/products/${id}`,
    tokenParam(token)
  );
  return out ? mapApiProductToProduct(out) : null;
}

export async function createProduct(
  body: ProductRequest,
  token: string
): Promise<Product | null> {
  const parsed = productRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join('; ');
    throw new Error(`Validation failed: ${msg}`);
  }
  const out = await apiData<import('./types').ApiProduct>('/api/v1/products', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
    token,
  });
  return out ? mapApiProductToProduct(out) : null;
}

export async function updateProduct(
  id: string,
  body: ProductRequest,
  token: string
): Promise<Product | null> {
  const parsed = productRequestSchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join('; ');
    throw new Error(`Validation failed: ${msg}`);
  }
  const out = await apiData<import('./types').ApiProduct>(`/api/v1/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(parsed.data),
    token,
  });
  return out ? mapApiProductToProduct(out) : null;
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  await apiData<unknown>(`/api/v1/products/${id}`, { method: 'DELETE', token });
}

/** Orders (admin list; update status) */
export async function fetchOrders(token: string): Promise<Order[]> {
  const out = await apiData<import('./types').ApiOrder[]>('/api/v1/orders', { token });
  return (out ?? []).map(mapApiOrderToOrder);
}

export async function updateOrderStatus(
  id: string,
  status: string,
  token: string
): Promise<void> {
  await apiData<unknown>(`/api/v1/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
    token,
  });
}

/** Customers (admin) */
export async function fetchCustomers(token: string): Promise<Customer[]> {
  const out = await apiData<import('./types').ApiUser[]>('/api/v1/customers', { token });
  return (out ?? []).map(mapApiUserToCustomer);
}

/** Dashboard (admin) */
export async function fetchDashboard(token: string): Promise<{
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  conversionRate: number;
  salesData: { name: string; sales: number }[];
  recentOrders: Order[];
}> {
  const out = await apiData<import('./types').ApiDashboard>('/api/v1/admin/dashboard', {
    token,
  });
  if (!out)
    return {
      totalRevenue: 0,
      activeOrders: 0,
      totalCustomers: 0,
      conversionRate: 0,
      salesData: [],
      recentOrders: [],
    };
  return {
    ...out,
    recentOrders: (out.recentOrders ?? []).map(mapApiOrderToOrder),
  };
}

/** Settings (admin) */
export async function fetchSettings(token: string): Promise<Settings | null> {
  const out = await apiData<import('./types').ApiSettings>('/api/v1/settings', { token });
  return out ? mapApiSettingsToSettings(out) : null;
}

export async function updateSettings(
  settings: Settings,
  token: string
): Promise<Settings | null> {
  const out = await apiData<import('./types').ApiSettings>('/api/v1/settings', {
    method: 'PUT',
    body: JSON.stringify({
      storeName: settings.storeName,
      currency: settings.currency,
      taxRate: settings.taxRate,
      shippingFee: settings.shippingFee,
      supportEmail: settings.supportEmail,
    }),
    token,
  });
  return out ? mapApiSettingsToSettings(out) : null;
}
