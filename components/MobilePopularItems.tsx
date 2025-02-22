"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductData } from "@/types/product";
import ProductCard from "./ProductCard";

export function MobilePopularItems({ items }: { items: ProductData[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const itemsPerSlide = 6;
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    let hasMoved = false;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const diffX = touch.clientX - startX;

      if (Math.abs(diffX) > 50 && !hasMoved) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
        hasMoved = true;
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="relative w-full overflow-hidden px-4" onTouchStart={handleTouchStart}>
      <div ref={slideRef} className="flex transition-transform duration-300 ease-in-out pb-4">
        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
          <div key={slideIndex} className="w-full flex-shrink-0">
            <div className="grid grid-cols-2 gap-4 p-2">
              {items.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((item) => (
                <ProductCard key={`${slideIndex} - ${item.url}`} product={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-primary/30 rounded-full shadow-md"
        onClick={prevSlide}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-2  transform -translate-y-1/2 p-2 bg-primary/30 rounded-full shadow-md"
        onClick={nextSlide}
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-gray-800" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
