"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddProductFormProps {
  onAddProduct: (url: string) => void;
}

export function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct(url);
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex items-center space-x-2">
      <Input
        type="url"
        placeholder="Enter Amazon product URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="flex-grow"
      />
      <Button type="submit">Add Product</Button>
    </form>
  );
}
