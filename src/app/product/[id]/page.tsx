"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import AffiliateMessage from "@/components/AffiliateMessage";
import ProductCarousel from "@/components/ProductCarousel";
import ProductDescription from "@/components/ProductDescription";
import ProductVariations from "@/components/ProductVariations";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProductPage() {
  const [selectedVariation, setSelectedVariation] = useState(0);
  const { theme } = useTheme();

  const product = {
    name: "Premium Wireless Headphones",
    description:
      "Experience crystal-clear audio with our premium wireless headphones. Featuring advanced noise-cancellation technology and a comfortable over-ear design, these headphones are perfect for music lovers and professionals alike.",
    images: [
      "/placeholder.svg?height=400&width=400&text=Image1",
      "/placeholder.svg?height=400&width=400&text=Image2",
      "/placeholder.svg?height=400&width=400&text=Image3",
      "/placeholder.svg?height=400&width=400&text=Image4",
      "/placeholder.svg?height=400&width=400&text=Image5",
    ],
    variations: [
      {
        name: "Classic Black",
        price: 199.99,
        color: "black",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Sleek White",
        price: 209.99,
        color: "white",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Metallic Silver",
        price: 219.99,
        color: "silver",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Rose Gold",
        price: 229.99,
        color: "rose-gold",
        image: "/placeholder.svg?height=100&width=100",
      },
      {
        name: "Navy Blue",
        price: 209.99,
        color: "navy",
        image: "/placeholder.svg?height=100&width=100",
      },
    ],
  };

  const handleVariationChange = (index: number) => {
    setSelectedVariation(index);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <AffiliateMessage />
        <ThemeToggle />
      </div>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 xl:col-span-6">
          <ProductCarousel product={product} />
        </div>
        <div className="lg:col-span-7 xl:col-span-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <p className="text-2xl font-semibold bg-primary/10 text-primary px-4 py-2 rounded-md">
              ${product.variations[selectedVariation].price.toFixed(2)}
            </p>
            <Button
              className="flex items-center gap-2 w-full sm:w-auto"
              size="lg"
              onClick={() => window.open("https://www.amazon.com", "_blank")}
            >
              <Image src="/amazon-icon.svg" alt="Amazon" width={24} height={24} />
              View on Amazon
            </Button>
          </div>
          <ProductVariations
            variations={product.variations}
            selectedVariation={selectedVariation}
            onVariationChange={handleVariationChange}
          />
          <ProductDescription description={product.description} />
        </div>
      </div>
    </div>
  );
}
