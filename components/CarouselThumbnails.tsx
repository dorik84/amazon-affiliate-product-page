import Image from "next/image";
import type { ProductData } from "@/types/productData";

interface CarouselThumbnailsProps {
  product: ProductData | null;
  selectedIndex: number;
  onThumbClick: (index: number) => void;
}
export default function CarouselThumbnails({ product, selectedIndex, onThumbClick }: CarouselThumbnailsProps) {
  return (
    <div className="relative order-2 sm:order-1">
      <div className="absolute inset-0 bg-gradient-to-r from-background/10 to-background/5 backdrop-blur-sm rounded-lg" />
      <div className="relative flex flex-shrink-0 p-4 gap-4 overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto sm:max-h-[400px] scrollbar-thin scrollbar-thumb-primary scrollbar-track-background/20 rounded-lg">
        {product?.images.map((src, index) => (
          <button
            key={index}
            onClick={() => onThumbClick(index)}
            className={`flex-shrink-0 transition-all duration-200 ease-in-out ${
              index === selectedIndex
                ? "ring-2 ring-primary shadow-lg scale-105"
                : "hover:ring-2 hover:ring-primary/50 hover:scale-105"
            } focus:outline-none focus:ring-2 focus:ring-primary rounded-md overflow-hidden`}
            aria-label={`View image ${index + 1}`}
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
