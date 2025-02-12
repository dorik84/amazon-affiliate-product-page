"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { ProductData } from "@/types/productData";
import CarouselThumbnails from "@/components/ProductCarouselThumbnails";
import ProductImage from "@/components/ProductImage";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTheme } from "next-themes";

interface ProductCarouselProps {
  product: ProductData | undefined;
}

export default function ProductCarousel({ product }: ProductCarouselProps) {
  if (!product?.images) return null;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const { theme, setTheme } = useTheme();

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
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="flex flex-col-reverse items-center sm:items-start gap-4 mx-auto md:mx-0">
      {/* Thumbnails */}
      <CarouselThumbnails product={product} selectedIndex={selectedIndex} onThumbClick={onThumbClick} />

      {/* Main carousel */}
      <div className="relative aspect-video w-full order-1 sm:order-2 sm:flex-grow">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {product?.images.map((src, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div className="flex-[0_0_100%] min-w-0 relative h-full cursor-pointer">
                    <ProductImage name={product.name} src={src} index={index} />
                  </div>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined} className="max-w-[90vw] max-h-[90vh] p-0">
                  <DialogTitle className="text-center">{product.name}</DialogTitle>
                  <div className="relative w-full h-full min-h-[80vh]">
                    <ProductImage name={product.name} src={src} index={index} priority={index === 0} />
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-[-0.5rem] transform -translate-y-1/2 text-accent-foreground sm:text-inherit md:text-accent-foreground bg-primary/30 sm:bg-primary/10 md:bg-primary/30 rounded-full shadow-md"
          onClick={scrollPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute  top-1/2 right-[-0.5rem] transform -translate-y-1/2 text-accent-foreground sm:text-inherit md:text-accent-foreground bg-primary/30 sm:bg-primary/10 md:bg-primary/30 rounded-full shadow-md"
          onClick={scrollNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
