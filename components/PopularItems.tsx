"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MobilePopularItems } from "./MobilePopularItems";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ItemCard } from "@/components/ItemCard";

const scrollbarHideClass = "scrollbar-hide";

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

const popularItems: Item[] = [
  {
    id: 1,
    name: "Wireless Earbuds",
    price: 59.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Home Hub",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
  },
  {
    id: 4,
    name: "Stainless Steel Cookware Set",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
  },
  { id: 5, name: "Casual Sneakers", price: 79.99, image: "/placeholder.svg?height=300&width=300", category: "Fashion" },
  {
    id: 6,
    name: "Wooden Building Blocks",
    price: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Toys & Games",
  },
  {
    id: 7,
    name: "Smart Watch",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
  {
    id: 8,
    name: "Yoga Mat",
    price: 29.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports & Outdoors",
  },
  {
    id: 9,
    name: "Portable Blender",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
  },
  {
    id: 10,
    name: "Wireless Keyboard",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
  },
];

export const FilmStrip = ({ items, index }: { items: Item[]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollSpeed] = useState(() => 0.5 + Math.random() * 0.5);
  const [scrollPosition, setScrollPosition] = useState(0);
  const animationRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalHeight = container.scrollHeight;
    const visibleHeight = container.clientHeight;

    const newScrollPosition = (scrollPosition + scrollSpeed) % (totalHeight - visibleHeight);
    setScrollPosition(newScrollPosition);
    container.scrollTop = newScrollPosition;

    animationRef.current = requestAnimationFrame(animate);
  }, [scrollPosition, scrollSpeed]);

  useEffect(() => {
    if (!isHovered) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, animate]);

  // Duplicate items to create a seamless loop
  const duplicatedItems = [...items, ...items, ...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className="film-strip relative w-full md:w-1/5 h-[300px] md:h-[calc(100vh-200px)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full flex flex-col gap-1">
        {duplicatedItems.map((item, i) => (
          <motion.div
            key={`${item.id}-${i}`}
            className="w-full flex-shrink-0"
            /*style={{
              boxShadow: "0 0 0 8px #000, 0 0 0 10px #fff, 0 0 0 12px #000",
            }}*/
          >
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export function PopularItems() {
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
      items={popularItems.slice(i * 2, (i + 1) * 2).concat(popularItems.slice(0, i * 2))}
      index={i}
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
