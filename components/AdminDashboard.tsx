"use client";

import { useState } from "react";
import { ProductList } from "@/components/ProductList";
import { AddProductForm } from "@/components/AddProductForm";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProductData } from "@/types/product";
import { deleteProduct, getRelatedProducts, updateProduct } from "@/lib/component-actions";
import { useToast } from "@/components/ui/use-toast";

export function AdminDashboard({ allProducts }: { allProducts: ProductData[] }) {
  console.log("AdminDashboard rerenders");
  const [products, setProducts] = useState<ProductData[]>(allProducts);
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  const handleAddProduct = async (url: string) => {
    setLoading((prev) => ({ ...prev, add: true }));
    try {
      const encodedUrl = encodeURIComponent(url);
      const updatedProduct = await updateProduct(encodedUrl);
      if (updatedProduct) {
        const products = await getRelatedProducts();
        setProducts(products);
        toast({
          title: "Product added successfully",
          description: `${updatedProduct.name} has been added to the list.`,
        });
      } else {
        throw new Error("Failed to add product");
      }
    } catch (error) {
      toast({
        title: "Error adding product",
        description: "There was a problem adding the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, add: false }));
    }
  };

  const handleRefreshProduct = async (url: string) => {
    setLoading((prev) => ({ ...prev, [url]: true }));
    try {
      const res = await updateProduct(url);
      console.log("handleRefreshProduct | updateProduct | res", res);
      if (res) {
        // const products = await getRelatedProducts();
        // setProducts(products);
        toast({
          title: "Product refreshed",
          description: `${res.name} has been updated.`,
        });
      } else {
        throw new Error("Failed to refresh product");
      }
    } catch (error) {
      toast({
        title: "Error refreshing product",
        description: "There was a problem refreshing the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [url]: false }));
    }
  };

  const handleDeleteProduct = async (url: string) => {
    setLoading((prev) => ({ ...prev, [url]: true }));
    try {
      const res = await deleteProduct(url);
      if (res) {
        const products = await getRelatedProducts();
        setProducts(products);
        toast({
          title: "Product deleted",
          description: "The product has been removed from the list.",
        });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast({
        title: "Error deleting product",
        description: "There was a problem deleting the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [url]: false }));
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
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

  const filteredProducts = sortedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
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
        onRefreshProduct={handleRefreshProduct}
        onDeleteProduct={handleDeleteProduct}
        loading={loading}
      />
    </div>
  );
}
