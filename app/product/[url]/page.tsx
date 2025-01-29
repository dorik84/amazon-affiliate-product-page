"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import AffiliateMessage from "@/components/AffiliateMessage";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDescription from "@/components/ProductDescription";
import ProductVariations from "@/components/ProductVariations";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { fetchAndTransformProduct } from "@/lib/productData-adapter";
import type { ProductData } from "@/types/productData";

export default function ProductPage() {
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const url = params.url as string;
        const data = await fetchAndTransformProduct(url);
        setProductData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch productData data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.url]);

  // Fallback loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleVariationChange = (index: number) => {
    setSelectedVariation(index);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <AffiliateMessage />
        <ThemeToggle />
      </div>

      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{productData?.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="md:col-span-1">
            <ProductCarousel product={productData} />
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <p className="text-2xl font-semibold bg-primary/10 text-primary px-4 py-2 rounded-md">
                ${productData?.variations[selectedVariation].price.toFixed(2)}
              </p>
              <Button
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
                size="lg"
                onClick={() => window.open("https://www.amazon.com", "_blank")}
              >
                <Image src="/amazon-icon.svg" alt="Amazon" width={24} height={24} className="w-6" />
                View on Amazon
              </Button>
            </div>

            <ProductVariations
              variations={productData?.variations}
              selectedVariation={selectedVariation}
              onVariationChange={handleVariationChange}
            />
          </div>

          <div className="md:col-span-2">
            <ProductDescription description={productData?.description} />
          </div>
        </div>
      </div>
    </div>
  );
}
