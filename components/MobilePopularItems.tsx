"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductData } from "@/types/productData";
import Link from "next/link";

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

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
    <div className="relative w-full overflow-hidden" onTouchStart={handleTouchStart}>
      <div
        ref={slideRef}
        className="flex transition-transform duration-300 ease-in-out pb-4"
        style={{ width: `${totalSlides * 100}%` }}
      >
        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
          <div key={slideIndex} className="w-full flex-shrink-0">
            <div className="grid grid-cols-2 gap-4">
              {items.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-32">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} layout="fill" objectFit="cover" />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-semibold mb-1 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{item.category}</p>
                    <p className="text-gray-800 font-bold mb-2">${item.defaultPrice.toFixed(2)}</p>
                    <Link href={`/product/${item.url}`}>
                      <Button className="w-full text-xs py-1" size="sm">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md bg-primary/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2  transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md bg-primary/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
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
