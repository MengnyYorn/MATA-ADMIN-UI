import type { ApiProduct, ApiOrder, ApiUser, ApiSettings, ApiCategory } from './types';
import type { Product, Order, Customer, Settings, Category } from '@/lib/types';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

export function mapApiCategoryToCategory(c: ApiCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    description: c.description ?? '',
    sortOrder: c.sortOrder ?? 0,
  };
}

export function mapApiProductToProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    category: p.category,
    price: Number(p.price),
    image: p.image ?? '',
    description: p.description ?? '',
    stock: p.stock ?? 0,
    rating: Number(p.rating ?? 0),
    reviews: p.reviews ?? 0,
    sizes: p.sizes ?? [],
    colors: p.colors ?? [],
  };
}

export function mapApiOrderToOrder(o: ApiOrder): Order {
  return {
    id: String(o.id),
    customerName: o.customerName,
    date: formatDate(o.createdAt),
    total: Number(o.total),
    status: (o.status as Order['status']) || 'Pending',
    items: o.itemCount ?? (o.items?.length ?? 0),
  };
}

export function mapApiUserToCustomer(u: ApiUser): Customer {
  return {
    id: String(u.id),
    name: u.name,
    email: u.email,
    orders: u.orders ?? 0,
    totalSpent: Number(u.totalSpent ?? 0),
    lastOrder: u.lastOrder ?? '',
    avatar: u.avatar ?? undefined,
  };
}

export function mapApiSettingsToSettings(s: ApiSettings): Settings {
  return {
    storeName: s.storeName,
    currency: s.currency,
    taxRate: Number(s.taxRate),
    shippingFee: Number(s.shippingFee),
    supportEmail: s.supportEmail,
  };
}

export function mapProductToRequest(p: Partial<Product>): import('./types').ProductRequest {
  return {
    name: p.name!,
    category: p.category!,
    price: Number(p.price),
    image: p.image,
    description: p.description,
    stock: p.stock ?? 0,
    rating: p.rating,
    reviews: p.reviews,
    sizes: p.sizes,
    colors: p.colors,
  };
}
