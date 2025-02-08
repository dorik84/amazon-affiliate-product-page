import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import type { ProductData } from "@/types/productData";
import { Button } from "@/components/ui/button";
import ProductImage from "./ProductImage";

interface CarouselThumbnailsProps {
  product: ProductData | null;
  selectedIndex: number;
  onThumbClick: (index: number) => void;
}

export default function CarouselThumbnails({ product, selectedIndex, onThumbClick }: CarouselThumbnailsProps) {
  if (product?.images.length === 0) return null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      scrollContainer?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const centerThumbnail = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const thumbElement = scrollContainerRef.current.children[index] as HTMLElement;
      const containerWidth = scrollContainerRef.current.clientWidth;
      const thumbLeft = thumbElement.offsetLeft;
      const thumbWidth = thumbElement.clientWidth;

      const newScrollLeft = Math.max(
        0,
        Math.min(
          thumbLeft - containerWidth / 2 + thumbWidth / 2,
          scrollContainerRef.current.scrollWidth - containerWidth
        )
      );

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  }, []);

  const handleThumbClick = (index: number) => {
    onThumbClick(index);
    centerThumbnail(index);
  };

  useEffect(() => {
    centerThumbnail(selectedIndex);
  }, [selectedIndex, centerThumbnail]);

  return (
    <div className="relative order-2 w-full">
      <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-background/5 backdrop-blur-sm rounded-lg" />
      <div
        ref={scrollContainerRef}
        className="relative flex justify-center gap-4 p-4 overflow-x-auto max-h-[120px] rounded-lg scrollbar-thin no-scrollbar scrollbar-thumb-primary scrollbar-track-background/20"
      >
        {product?.images.map((src, index) => (
          <button
            key={index}
            onClick={() => handleThumbClick(index)}
            className={`flex-shrink-0 transition-all duration-200 ease-in-out ${
              index === selectedIndex
                ? "ring-2 ring-primary shadow-lg scale-105"
                : "hover:ring-2 hover:ring-primary/50 hover:scale-105"
            } focus:outline-none focus:ring-2 focus:ring-primary rounded-md overflow-hidden`}
            aria-label={`View image ${index + 1}`}
          >
            <ProductImage
              title={product.title}
              src={src}
              index={index}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              // draggable={false}
            />
          </button>
        ))}
      </div>
      <div className="absolute left-0 right-0 bottom-0 flex justify-between">
        {showLeftArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-[-0.5rem] top-1/2 -translate-y-1/2 "
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {showRightArrow && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-[-0.5rem] top-1/2 -translate-y-1/2 "
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
