"use client";

import { useCallback, useMemo, useState } from "react";
import { ProductList } from "@/components/ProductList";
import { AddProductForm } from "@/components/AddProductForm";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductData } from "@/types/product";
import { deleteProduct, updateProduct, addProduct } from "@/lib/component-actions";
import { toast } from "sonner";
import { CheckCircle2Icon, LoaderIcon, XCircleIcon } from "lucide-react";
import type { ProductsResponse } from "@/types/api";

const toastConfig = {
  loading: (
    <div className="flex items-center">
      <LoaderIcon className="mr-2 h-5 w-5 animate-spin text-primary" />
      <span>Processing your request...</span>
    </div>
  ),
  success: (data) => (
    <div className="flex items-center">
      <CheckCircle2Icon className="mr-2 h-5 w-5 text-success" />
      <div>
        <div className="font-semibold">Success!</div>
        <div className="text-sm text-success/80">{data.message}</div>
      </div>
    </div>
  ),
  error: (data) => (
    <div className="flex items-center">
      <XCircleIcon className="mr-2 h-5 w-5 text-destructive" />
      <div>
        <div className="font-semibold text-destructive">Operation Failed</div>
        <div className="text-sm text-destructive/80">{data.message}</div>
      </div>
    </div>
  ),
};

export type SortColumn = "name" | "price" | "category" | "updatedAt";
export type SortDirection = "asc" | "desc";

export function AdminDashboard({
  allProducts: { data, totalPages, currentPage, limit },
}: {
  allProducts: ProductsResponse;
}) {
  const [products, setProducts] = useState<ProductData[]>(data || []);
  const [sortBy, setSortBy] = useState<SortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const updateProductInList = useCallback((updatedProduct: ProductData) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === updatedProduct.id ? { ...product, ...updatedProduct } : product))
    );
  }, []);

  const addProductInList = useCallback((newProduct: ProductData) => {
    setProducts((prevProducts) => {
      return [...prevProducts, newProduct];
    });
  }, []);

  const deleteProductFromList = useCallback((id: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  }, []);

  const handleAddProduct = useCallback(
    async (url: string) => {
      setLoading((prev) => ({ ...prev, add: true }));
      try {
        const encodedUrl = encodeURIComponent(url);
        const addPromise = addProduct(encodedUrl);
        toast.promise(addPromise, toastConfig);
        const newProduct = await addPromise;
        addProductInList(newProduct.data as ProductData);
      } catch (error) {
        console.error("Error adding product:", error);
      } finally {
        setLoading((prev) => ({ ...prev, add: false }));
      }
    },
    [addProductInList]
  );

  const handleUpdateProduct = useCallback(
    async (id: string) => {
      setLoading((prev) => ({ ...prev, [id]: true }));
      try {
        const productPromise = updateProduct(id);
        toast.promise(productPromise, toastConfig);
        const updatedProduct = await productPromise;
        updateProductInList(updatedProduct.data as ProductData);
      } catch (error) {
        console.error("Error updating product:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [updateProductInList]
  );

  const handleDeleteProduct = useCallback(
    async (id: string) => {
      setLoading((prev) => ({ ...prev, [id]: true }));
      try {
        const deletePromise = deleteProduct(id);

        toast.promise(deletePromise, toastConfig);
        await deletePromise;
        deleteProductFromList(id);
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [deleteProductFromList]
  );

  const handleSortChange = useCallback(
    (column: SortColumn) => {
      if (sortBy === column) {
        // Toggle direction if clicking the same column
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        // Set new column and default to ascending
        setSortBy(column);
        setSortDirection("asc");
      }
    },
    [sortBy]
  );

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "price":
          comparison = a.defaultPrice - b.defaultPrice;
          break;
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "");
          break;
        case "updatedAt":
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [products, sortBy, sortDirection]);

  const filteredProducts = useMemo(
    () =>
      sortedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sortedProducts, searchTerm]
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AddProductForm onAddProduct={handleAddProduct} isLoading={loading.add} />
      <div className="my-4 flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <ProductList
        products={filteredProducts}
        onRefreshProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </div>
  );
}
