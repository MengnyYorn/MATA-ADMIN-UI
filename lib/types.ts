/** Product category (admin CRUD + product picker) */
export interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  avatar?: string;
}

export interface Settings {
  storeName: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  supportEmail: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}
