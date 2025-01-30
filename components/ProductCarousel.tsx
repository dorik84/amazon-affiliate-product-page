"use client";

import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductData } from "@/types/productData";

interface ProductCarouselProps {
  product: ProductData | null;
}

export default function ProductCarousel({ product }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  return (
    // <div className="flex flex-col-reverse items-center sm:items-start md:flex-row gap-4 mx-auto md:mx-0">
    <div className="flex flex-col-reverse items-center sm:items-start  gap-4 mx-auto md:mx-0">
      {/* Thumbnails */}
      <div className="flex flex-shrink-0 p-1 order-2 sm:order-1 gap-2 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto sm:max-h-[400px]">
        {/* <div className="flex flex-shrink-0 p-1 sm:flex-col order-2 sm:order-1 gap-2 overflow-x-auto sm:overflow-x-visible sm:overflow-y-auto sm:max-h-[400px]"> */}
        {product?.images.map((src, index) => (
          <button
            key={index}
            onClick={() => onThumbClick(index)}
            className={`flex-shrink-0 ${
              index === selectedIndex ? "ring-2 ring-primary" : ""
            } focus:outline-none focus:ring-2 focus:ring-primary`}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className="object-contain aspect-square"
            />
          </button>
        ))}
      </div>

      {/* Main carousel */}
      <div className="relative aspect-square w-full order-1 sm:order-2 sm:flex-grow">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {product?.images.map((src, index) => (
              <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${product.title} - Image ${index + 1}`}
                  fill
                  priority={index === 0} // Add priority to the first image
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2"
          onClick={scrollPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
          onClick={scrollNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
