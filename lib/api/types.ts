/**
 * API response wrapper from Spring backend (ApiResponse<T>).
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/** Backend CategoryDto */
export interface ApiCategory {
  id: number;
  name: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

/** Admin create/update category */
export interface CategoryCreateRequest {
  name: string;
  description?: string;
  sortOrder?: number;
}

export interface CategoryUpdateRequest {
  name?: string;
  description?: string;
  sortOrder?: number;
}

/** Backend ProductDto shape */
export interface ApiProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  description: string | null;
  stock: number;
  rating: number;
  reviews: number;
  sizes: string[];
  colors: string[];
  createdAt: string;
}

/** Backend OrderItemDto */
export interface ApiOrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  selectedSize: string | null;
  selectedColor: string | null;
}

/** Backend OrderDto shape */
export interface ApiOrder {
  id: number;
  customerId: number;
  customerName: string;
  total: number;
  status: string;
  itemCount: number;
  items: ApiOrderItem[];
  createdAt: string;
}

/** Backend DashboardDto */
export interface ApiDashboard {
  totalRevenue: number;
  activeOrders: number;
  totalCustomers: number;
  conversionRate: number;
  salesData: { name: string; sales: number }[];
  recentOrders: ApiOrder[];
}

/** Backend UserDto (used for /me and /customers) */
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  orders: number;
  totalSpent: number;
  lastOrder: string | null;
  createdAt: string;
}

/** Backend SettingsDto */
export interface ApiSettings {
  id: number;
  storeName: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  supportEmail: string;
}

/** Auth login request */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Auth login response */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: ApiUser;
}

/** Request body for creating/updating product */
export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  stock: number;
  rating?: number;
  reviews?: number;
  sizes?: string[];
  colors?: string[];
}

/** Admin: create customer */
export interface CustomerCreateRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

/** Admin: update customer */
export interface CustomerUpdateRequest {
  name: string;
  email: string;
  /** Empty string clears avatar on the server */
  avatar: string;
}
