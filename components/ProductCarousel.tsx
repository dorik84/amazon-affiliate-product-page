"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { ProductData } from "@/types/product";
import CarouselThumbnails from "@/components/ProductCarouselThumbnails";
import ProductImage from "@/components/ProductImage";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ProductCarouselProps {
  product: ProductData | undefined;
}

export default function ProductCarousel({ product }: ProductCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const scrollPrevRef = useRef<(index?: number) => void>(() => {});
  const scrollNextRef = useRef<(index?: number) => void>(() => {});
  const onThumbClickRef = useRef<(index: number) => void>(() => {});
  const onSelectRef = useRef<() => void>(() => {});

  useEffect(() => {
    scrollPrevRef.current = () => {
      if (emblaApi) {
        emblaApi.scrollPrev();
        // sendGAEvent("carousel_scroll", "Product Interaction", "Scroll Previous", selectedIndex);
      }
    };

    scrollNextRef.current = () => {
      if (emblaApi) {
        emblaApi.scrollNext();
        // sendGAEvent("carousel_scroll", "Product Interaction", "Scroll Next", selectedIndex);
      }
    };

    onThumbClickRef.current = (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      setSelectedIndex(index);
      // sendGAEvent("carousel_thumbnail_click", "Product Interaction", "Thumbnail Click", index);
    };

    onSelectRef.current = () => {
      if (!emblaApi) return;
      const newIndex = emblaApi.selectedScrollSnap();
      setSelectedIndex(newIndex);
      // sendGAEvent("carousel_image_view", "Product Interaction", "Image View", newIndex);
    };
  }, [emblaApi, selectedIndex]);

  const scrollPrev = useCallback(() => {
    scrollPrevRef.current();
  }, []);

  const scrollNext = useCallback(() => {
    scrollNextRef.current();
  }, []);

  const onThumbClick = useCallback((index: number) => {
    onThumbClickRef.current(index);
  }, []);

  const onSelect = useCallback(() => {
    onSelectRef.current();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  const handleDialogOpen = (index: number) => {
    // sendGAEvent("product_image_zoom", "Product Interaction", "Image Zoom", index);
  };

  if (!product?.images) return null;

  return (
    <div className="flex flex-col-reverse items-center sm:items-start gap-4 mx-auto md:mx-0">
      <CarouselThumbnails product={product} selectedIndex={selectedIndex} onThumbClick={onThumbClick} />

      <div className="relative w-full order-1 sm:order-2 sm:flex-grow">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex h-[400px] sm:h-[500px] md:h-[600px]">
            {product?.images.map((src, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div
                    className="flex-[0_0_100%] min-w-0 relative h-full cursor-pointer"
                    onClick={() => handleDialogOpen(index)}
                  >
                    <ProductImage name={product.name} src={src} index={index} priority={index === 0} />
                  </div>
                </DialogTrigger>
                <DialogContent aria-describedby={undefined} className="max-w-[90vw] max-h-[90vh] p-4">
                  <DialogTitle className="text-left pr-14 pl-10">{product.name}</DialogTitle>
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
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-primary/30 sm:bg-primary/10 md:bg-primary/30 rounded-full shadow-md"
          onClick={scrollPrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-primary/30 sm:bg-primary/10 md:bg-primary/30 rounded-full shadow-md`}
          onClick={scrollNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
