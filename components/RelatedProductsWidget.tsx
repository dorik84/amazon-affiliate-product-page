"use client";

import { useRef, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import type { ProductData } from "@/types/productData";

export default function RelatedProductsWidget({ relatedProducts }: { relatedProducts: ProductData[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      setScrollWidth(scrollRef.current.scrollWidth / 2);
    }
  }, [scrollRef]); //Fixed unnecessary dependency

  const duplicatedProducts = [...relatedProducts, ...relatedProducts];

  return (
    <div className="w-full overflow-hidden pb-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-4">Related Products</h2>
      <div
        ref={scrollRef}
        className="flex space-x-3 sm:space-x-4 animate-scroll hover:animation-play-state-paused"
        style={
          {
            "--scroll-width": `${scrollWidth}px`,
          } as React.CSSProperties
        }
      >
        {duplicatedProducts.map((product, index) => (
          <ProductCard key={`${product.url}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );
}
