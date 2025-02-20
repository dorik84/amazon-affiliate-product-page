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
import { GetProductsResponse } from "@/types/responses";

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

export function AdminDashboard({
  allProducts: { data, totalPages, currentPage, limit },
}: {
  allProducts: GetProductsResponse;
}) {
  const [products, setProducts] = useState<ProductData[]>(data || []);
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const updateProductInList = useCallback((updatedProduct: ProductData) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.url === updatedProduct.url ? { ...product, ...updatedProduct } : product))
    );
  }, []);

  const addProductInList = useCallback((newProduct: ProductData) => {
    setProducts((prevProducts) => {
      return [...prevProducts, newProduct];
    });
  }, []);

  const deleteProductFromList = useCallback((encodedUrl: string) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.url !== encodedUrl));
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
    async (url: string) => {
      setLoading((prev) => ({ ...prev, add: true }));
      try {
        const encodedUrl = encodeURIComponent(url);
        const productPromise = updateProduct(encodedUrl);
        toast.promise(productPromise, toastConfig);
        const updatedProduct = await productPromise;
        updateProductInList(updatedProduct.data as ProductData);
      } catch (error) {
        console.error("Error updating product:", error);
      } finally {
        setLoading((prev) => ({ ...prev, add: false }));
      }
    },
    [updateProductInList]
  );

  const handleDeleteProduct = useCallback(
    async (url: string) => {
      setLoading((prev) => ({ ...prev, [url]: true }));
      try {
        const deletePromise = deleteProduct(url);
        console.log("deletePromise", deletePromise);

        toast.promise(deletePromise, toastConfig);
        await deletePromise;
        deleteProductFromList(url);
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoading((prev) => ({ ...prev, [url]: false }));
      }
    },
    [deleteProductFromList]
  );

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.defaultPrice - b.defaultPrice;
        case "category":
          return (a.category || "").localeCompare(b.category || "");
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  const filteredProducts = useMemo(
    () =>
      sortedProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [sortedProducts, searchTerm]
  );

  const cachedLoading = useMemo(() => loading, [loading]);

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
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductList
        products={filteredProducts}
        onRefreshProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
      />
    </div>
  );
}
