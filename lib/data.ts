import type { Product, Order, Stat, Customer, Settings } from '@/lib/types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Silk Wrap Dress',
    category: 'Dresses',
    price: 189.0,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    description:
      'A luxurious silk wrap dress perfect for evening events. Features a flattering V-neck and adjustable waist tie.',
    stock: 45,
    rating: 4.8,
    reviews: 124,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald', 'Midnight Blue', 'Champagne'],
  },
  {
    id: '2',
    name: 'Cashmere Turtleneck',
    category: 'Knitwear',
    price: 245.0,
    image: 'https://images.unsplash.com/photo-1574167132757-1447ae9450c7?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-soft 100% cashmere sweater. A timeless staple for your winter wardrobe.',
    stock: 28,
    rating: 4.9,
    reviews: 89,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Oatmeal', 'Charcoal', 'Black'],
  },
  {
    id: '3',
    name: 'High-Rise Linen Trousers',
    category: 'Bottoms',
    price: 125.0,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    description: 'Breathable linen trousers with a tailored high-rise fit. Ideal for summer office wear.',
    stock: 62,
    rating: 4.6,
    reviews: 56,
    sizes: ['24', '26', '28', '30', '32'],
    colors: ['Sand', 'White', 'Navy'],
  },
  {
    id: '4',
    name: 'Structured Wool Blazer',
    category: 'Outerwear',
    price: 320.0,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    description: 'A sharp, structured blazer made from premium Italian wool blend.',
    stock: 15,
    rating: 4.7,
    reviews: 42,
    sizes: ['S', 'M', 'L'],
    colors: ['Camel', 'Black'],
  },
  {
    id: '5',
    name: 'Floral Chiffon Blouse',
    category: 'Tops',
    price: 85.0,
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight chiffon blouse with a delicate floral print and ruffle details.',
    stock: 84,
    rating: 4.5,
    reviews: 210,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Rose', 'Sage'],
  },
];

export const ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Sarah Jenkins', date: '2024-03-01', total: 189.0, status: 'Delivered', items: 1 },
  { id: 'ORD-002', customerName: 'Emma Wilson', date: '2024-03-01', total: 370.0, status: 'Shipped', items: 2 },
  { id: 'ORD-003', customerName: 'Olivia Brown', date: '2024-02-28', total: 125.0, status: 'Pending', items: 1 },
  { id: 'ORD-004', customerName: 'Sophia Davis', date: '2024-02-28', total: 565.0, status: 'Delivered', items: 3 },
  { id: 'ORD-005', customerName: 'Isabella Garcia', date: '2024-02-27', total: 85.0, status: 'Cancelled', items: 1 },
];

export const DASHBOARD_STATS: Stat[] = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+12.5%', trend: 'up' },
  { label: 'Active Orders', value: '156', change: '+8.2%', trend: 'up' },
  { label: 'New Customers', value: '2,345', change: '+18.7%', trend: 'up' },
  { label: 'Conversion Rate', value: '3.42%', change: '-0.5%', trend: 'down' },
];

export const SALES_DATA = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 2000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

export const CUSTOMERS: Customer[] = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', orders: 12, totalSpent: 2450.0, lastOrder: '2024-03-01', avatar: 'SJ' },
  { id: '2', name: 'Emma Wilson', email: 'emma.w@example.com', orders: 8, totalSpent: 1890.5, lastOrder: '2024-03-01', avatar: 'EW' },
  { id: '3', name: 'Olivia Brown', email: 'olivia.b@example.com', orders: 5, totalSpent: 750.0, lastOrder: '2024-02-28', avatar: 'OB' },
  { id: '4', name: 'Sophia Davis', email: 'sophia.d@example.com', orders: 15, totalSpent: 3200.0, lastOrder: '2024-02-28', avatar: 'SD' },
  { id: '5', name: 'Isabella Garcia', email: 'isabella.g@example.com', orders: 3, totalSpent: 450.0, lastOrder: '2024-02-27', avatar: 'IG' },
];

export const INITIAL_SETTINGS: Settings = {
  storeName: 'MATA Shop',
  currency: 'USD',
  taxRate: 8.5,
  shippingFee: 15.0,
  supportEmail: 'support@mataboutique.com',
};
