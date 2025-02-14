"use client";

import ProductCarousel from "@/components/ProductCarousel";
import ProductDescription from "@/components/ProductDescription";
import ProductVariations from "@/components/ProductVariations";
import Image from "next/image";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useState } from "react";
import type { ProductData } from "@/types/productData";
import { getInitialVariations } from "@/lib/utils";
import { RedirectIcon } from "@/components/RedirectIcon";

export default function ProductPage({ product }: { product: ProductData | undefined }) {
  if (!product) return null;

  const [selectedVariations, setSelectedVariations] = useState<Record<string, number>>(getInitialVariations(product));

  const handleVariationChange = (type: string, index: number) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [type]: index,
    }));
  };

  // Get the current selected variation's price
  const getCurrentPrice = () => {
    if (!product?.variations) return 0;

    // Find the variation that matches all selected options
    const selectedVariation = product.variations.find((variation) => {
      const type = variation.type || "default";
      return (
        selectedVariations[type] === product.variations.findIndex((v) => v.type === type && v.name === variation.name)
      );
    });

    return selectedVariation?.price || (product?.defaultPrice ?? 0);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="space-y-6">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center">{product?.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="md:col-span-1">
            <ProductCarousel product={product} />
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <p className="text-2xl sm:text-lg md:text-sm font-semibold bg-primary/10 text-primary px-4 py-2 rounded-md">
                {/* ${getCurrentPrice().toFixed(2)} */}
                See Price on Amazon
              </p>

              <AnimatedButton size="lg" onClick={() => window.open(decodeURIComponent(product?.url || ""), "_blank")}>
                {/* <Image src="/amazon-icon.svg" alt="Amazon" width={24} height={24} className="w-6" /> */}
                View Product on Amazon
                <RedirectIcon />
              </AnimatedButton>
            </div>

            <ProductVariations
              variations={product?.variations}
              selectedVariations={selectedVariations}
              onVariationChange={handleVariationChange}
            />
          </div>

          <div className="md:col-span-2">
            <ProductDescription product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
