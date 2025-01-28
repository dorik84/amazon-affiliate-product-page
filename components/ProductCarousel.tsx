"use client";

import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCarouselProps {
  product: {
    name: string;
    images: string[];
    variations: Array<{
      name: string;
      image: string;
    }>;
  };
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
    <div className="space-y-4">
      <div className="relative aspect-square">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {product.images.map((src, index) => (
              <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
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
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto pb-2">
        {product.images.map((src, index) => (
          <button
            key={index}
            onClick={() => onThumbClick(index)}
            className={`flex-shrink-0 ${index === selectedIndex ? "ring-2 ring-primary" : ""}`}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={60}
              height={60}
              className="object-cover aspect-square"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
