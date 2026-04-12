'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  mapProductToRequest,
} from '@/lib/api';
import { useAdminSession } from '@/hooks/useAdminSession';
import { ProductModal } from '@/components/admin/ProductModal';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function AdminProductsClient() {
  const { token, status } = useAdminSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = () => {
    if (!token) return;
    fetchProducts(token)
      .then(setProducts)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load products'));
  };

  useEffect(() => {
    fetchCategories()
      .then((cats) =>
        setCategoryNames([...cats].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)).map((c) => c.name))
      )
      .catch(() => setCategoryNames([]));
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && token) loadProducts();
  }, [token, status]);

  const handleSave = async (product: Product) => {
    if (!token) return;
    try {
      const body = mapProductToRequest(product);
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, body, token);
      } else {
        await createProduct(body, token);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id, token);
      loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
        categoryNames={categoryNames}
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-semibold tracking-tight">Product Management</CardTitle>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="size-4" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-semibold">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="font-bold">${p.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={p.stock < 20 ? 'destructive' : 'success'}>
                      {p.stock} in stock
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
