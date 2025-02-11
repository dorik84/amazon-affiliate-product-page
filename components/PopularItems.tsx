"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MobilePopularItems } from "./MobilePopularItems";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ProductData } from "@/types/productData";
import { FilmStrip } from "@/components/FilmStrip";

export function PopularItems({ popularItems }: { popularItems: ProductData[] }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [key, setKey] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setKey((prevKey) => prevKey + 1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filmStrips = Array.from({ length: 5 }, (_, i) => (
    <FilmStrip
      key={`${i}-${key}`}
      items={popularItems.slice(i * 2, (i + 1) * 2).concat(popularItems.slice(0, i * 2))} //creating a rotating or cyclic view of popular items
    />
  ));

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Popular Items</h2>
        {/* Desktop version */}
        {isDesktop && <div className="flex flex-row gap-4 w-full">{filmStrips}</div>}
        {/* Mobile version */}
        {!isDesktop && <MobilePopularItems items={popularItems} />}
      </div>
    </section>
  );
}
