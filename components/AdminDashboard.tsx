"use client";

import { useState } from "react";
import { ProductList } from "@/components/ProductList";
import { AddProductForm } from "@/components/AddProductForm";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductData } from "@/types/product";
import { deleteProduct, getRelatedProducts, updateProduct } from "@/lib/component-actions";

export function AdminDashboard({ allProducts }: { allProducts: ProductData[] }) {
  const [products, setProducts] = useState<ProductData[]>(allProducts);
  const [sortBy, setSortBy] = useState<string>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleAddProduct = async (url: string) => {
    console.log("Adding product:", url);
    url = encodeURIComponent(url);
    const updatedroduct = await updateProduct(url);
    console.log(updatedroduct);
    // After adding, you should update the products state
    if (updatedroduct) {
      const products = await getRelatedProducts();
      setProducts(products);
    } else {
      console.log("Failed to add product");
    }
  };

  const handleRefreshProduct = async (url: string) => {
    // Implement the logic to refresh a product here
    console.log("Refreshing product:", url);
    const res = await updateProduct(url);
    console.log(res);
    // After refreshing, you should update the products state
    const products = await getRelatedProducts();
    setProducts(products);
  };

  const handleDeleteProduct = async (url: string) => {
    // Implement the logic to delete a product here
    console.log("Deleting product:", url);
    const res = await deleteProduct(url);
    console.log(res);
    // After deleting, you should update the products state
    const products = await getRelatedProducts();
    setProducts(products);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AddProductForm onAddProduct={handleAddProduct} />
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
      />
    </div>
  );
}
