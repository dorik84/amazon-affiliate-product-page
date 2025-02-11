import { ProductData } from "@/types/productData";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { ItemCard } from "@/components/ItemCard";

export const FilmStrip = ({ items }: { items: ProductData[] }) => {
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
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className="film-strip relative w-full md:w-1/5 h-[300px] md:h-[calc(100vh-200px)] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-0 left-0 w-full flex flex-col gap-1">
        {duplicatedItems.map((item, i) => (
          <motion.div key={`${item.url}-${i}`} className="w-full flex-shrink-0">
            <ItemCard product={item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
