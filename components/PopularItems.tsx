"use client";

import { useState, useEffect } from "react";
import { MobilePopularItems } from "./MobilePopularItems";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductData } from "@/types/product";
import { DesktopPopularItems } from "@/components/DesktopPopularItems";
import ProductNotFound from "@/components/ProductNotFound";

export function PopularItems({ popularItems }: { popularItems: ProductData[] | undefined }) {
  if (!popularItems) return <ProductNotFound />;

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setKey((prevKey) => prevKey + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (popularItems?.length === 0) return null;

  return (
    <section className="bg-background py-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Top Selections</h2>
        {/* Desktop version */}
        {isDesktop && <DesktopPopularItems key={key} items={popularItems} />}
        {/* Mobile version */}
        {!isDesktop && <MobilePopularItems items={popularItems} />}
      </div>
    </section>
  );
}
