"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface AddProductFormProps {
  onAddProduct: (url: string) => void;
  isLoading: boolean;
}

export function AddProductForm({ onAddProduct, isLoading }: AddProductFormProps) {
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
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          "Add Product"
        )}
      </Button>
    </form>
  );
}
