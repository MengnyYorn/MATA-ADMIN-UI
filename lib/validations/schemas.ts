import { z } from 'zod';

/** Login form */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** Product form (create/edit) — category name must exist in API */
export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name is too long'),
  category: z.string().min(1, 'Category is required').max(100),
  price: z.number().min(0, 'Price must be 0 or more').finite(),
  stock: z.number().int().min(0, 'Stock must be 0 or more'),
  image: z.string().optional(),
  description: z.string().max(2000, 'Description is too long').optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviews: z.number().int().min(0).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

/** Store settings form */
export const settingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required').max(100, 'Store name is too long'),
  supportEmail: z.string().min(1, 'Support email is required').email('Invalid email address'),
  currency: z.literal('USD'),
  taxRate: z.number().min(0, 'Tax rate must be 0 or more').max(100, 'Tax rate must be 100 or less'),
  shippingFee: z.number().min(0, 'Shipping fee must be 0 or more').finite(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

/** API: product request body (create/update) */
export const productRequestSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  price: z.number().min(0).finite(),
  stock: z.number().int().min(0),
  image: z.union([z.string().url(), z.literal('')]).optional(),
  description: z.string().optional(),
  rating: z.number().optional(),
  reviews: z.number().int().min(0).optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

export type ProductRequestValidated = z.infer<typeof productRequestSchema>;

/** Admin: create customer */
export const customerCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1).email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  avatar: z.string().max(10).optional(),
});

export type CustomerCreateFormValues = z.infer<typeof customerCreateSchema>;

/** Admin: update customer (avatar may be empty to clear) */
export const customerUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1).email('Invalid email'),
  avatar: z.string().max(10),
});

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>;

/** Admin: category form */
export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(2000).optional(),
  sortOrder: z.number().int().min(0, 'Sort order must be 0 or more'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
