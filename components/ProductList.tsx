"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ProductData } from "@/types/product";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import ProductListRow from "./ProductListRow";
import { useCallback } from "react";
import type { SortColumn, SortDirection } from "@/components/AdminDashboard";
import { cn } from "@/utils/cn";

interface ProductListProps {
  products: ProductData[];
  onRefreshProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  loading: { [key: string]: boolean };
  sortBy: SortColumn;
  sortDirection: SortDirection;
  onSortChange: (column: SortColumn) => void;
}

export function ProductList({
  products,
  onRefreshProduct,
  onDeleteProduct,
  loading,
  sortBy,
  sortDirection,
  onSortChange,
}: ProductListProps) {
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

  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  const getSortableHeaderClass = (column: SortColumn) => {
    return cn(
      "cursor-pointer hover:bg-muted/50",
      sortBy === column && (sortDirection === "asc" ? "bg-blue-100" : "bg-orange-100")
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead className={getSortableHeaderClass("name")} onClick={() => onSortChange("name")}>
            <div className="flex items-center">
              Name
              {renderSortIcon("name")}
            </div>
          </TableHead>
          <TableHead>Description</TableHead>
          <TableHead className={getSortableHeaderClass("price")} onClick={() => onSortChange("price")}>
            <div className="flex items-center">
              Price
              {renderSortIcon("price")}
            </div>
          </TableHead>
          <TableHead className={getSortableHeaderClass("category")} onClick={() => onSortChange("category")}>
            <div className="flex items-center">
              Category
              {renderSortIcon("category")}
            </div>
          </TableHead>
          <TableHead className={getSortableHeaderClass("updatedAt")} onClick={() => onSortChange("updatedAt")}>
            <div className="flex items-center">
              Updated At
              {renderSortIcon("updatedAt")}
            </div>
          </TableHead>
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
