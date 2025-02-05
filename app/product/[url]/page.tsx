"use client";

import { useParams } from "next/navigation";
import AffiliateMessage from "@/components/AffiliateMessage";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDescription from "@/components/ProductDescription";
import ProductVariations from "@/components/ProductVariations";
import ThemeToggle from "@/components/ThemeToggle";
import Image from "next/image";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useProductData } from "./useProductData";

export default function ProductPage() {
  const params = useParams();

  // Custom hook to fetch product data
  let { selectedVariations, setSelectedVariations, productData, isLoading, error } = useProductData(
    params.url as string
  );
  // Fallback loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleVariationChange = (type: string, index: number) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [type]: index,
    }));
  };

  // Get the current selected variation's price
  const getCurrentPrice = () => {
    if (!productData?.variations) return 0;

    // Find the variation that matches all selected options
    const selectedVariation = productData.variations.find((variation) => {
      const type = variation.type || "default";
      return (
        selectedVariations[type] ===
        productData.variations.findIndex((v) => v.type === type && v.name === variation.name)
      );
    });

    return selectedVariation?.price || (productData?.defaultPrice ?? 0);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex justify-between items-center mb-4 gap-4 sm:mb-6">
        <AffiliateMessage />
        <ThemeToggle />
      </div>

      <div className="space-y-6">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-center">{productData?.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div className="md:col-span-1">
            <ProductCarousel product={productData} />
          </div>

          <div className="md:col-span-1 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              <p className="text-2xl font-semibold bg-primary/10 text-primary px-4 py-2 rounded-md">
                ${getCurrentPrice().toFixed(2)}
              </p>

              <AnimatedButton size="lg" onClick={() => window.open(decodeURIComponent(params.url as string), "_blank")}>
                <Image src="/amazon-icon.svg" alt="Amazon" width={24} height={24} className="w-6" />
                View on Amazon
              </AnimatedButton>
            </div>

            <ProductVariations
              variations={productData?.variations}
              selectedVariations={selectedVariations}
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
