"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductData } from "@/types/product";

import ProductListRow from "./ProductListRow";
import { useCallback } from "react";

interface ProductListProps {
  products: ProductData[];
  onRefreshProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  loading: { [key: string]: boolean };
}

export function ProductList({ products, onRefreshProduct, onDeleteProduct, loading }: ProductListProps) {
  console.log("ProductList rerenders");

  const memoizedRefreshProduct = useCallback(
    (id: string) => {
      onRefreshProduct(id);
    },
    [onRefreshProduct]
  );

  const memoizedDeleteProduct = useCallback(
    (url: string) => {
      onDeleteProduct(url);
    },
    [onDeleteProduct]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductListRow
            key={product.url}
            product={product}
            onRefreshProduct={memoizedRefreshProduct}
            onDeleteProduct={memoizedDeleteProduct}
            loading={loading}
          />
        ))}
      </TableBody>
    </Table>
  );
}
