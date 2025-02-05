"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductData } from "@/types/productData";
import CarouselThumbnails from "./CarouselThumbnails";

interface ProductCarouselProps {
  product: ProductData | null;
}

export default function ProductCarousel({ product }: ProductCarouselProps) {
  if (!product?.images) return null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();

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

  // Add event listener for slide changes when emblaApi is available
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", onSelect);
      return () => emblaApi.off("select", onSelect);
    }
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col-reverse items-center sm:items-start  gap-4 mx-auto md:mx-0">
      {/* Thumbnails */}
      <CarouselThumbnails product={product} selectedIndex={selectedIndex} onThumbClick={onThumbClick} />

      {/* Main carousel */}
      <div className="relative aspect-video w-full order-1 sm:order-2 sm:flex-grow">
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
