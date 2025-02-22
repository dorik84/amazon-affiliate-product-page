"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductData } from "@/types/product";
import ProductImage from "@/components/ProductImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const RelatedProductCard = ({ product, className }: { product: ProductData; className?: string }) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={cn("flex-shrink-0  rounded-lg overflow-hidden shadow-custom-shadow ", className)}
    >
      <div className="relative h-24 md:h-48">
        <ProductImage name={product.name} src={product.images[0]} index={0} style={{ objectFit: "cover" }} />
      </div>
      <div className="p-4">
        <h3 className="text-xs md:text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
        {/* <p className="text-xs text-gray-600 mb-1">{item.category}</p> */}
        {/* <p className="font-bold mb-2">${item.defaultPrice.toFixed(2)}</p> */}
        <Link href={`/product/${product.url}`} onClick={handleClick} rel="noopener noreferrer">
          <Button
            className={cn("w-full text-xs py-1 transition-all duration-200", isClicked && "bg-primary/50 cursor-wait")}
            size="sm"
            disabled={isClicked}
          >
            {isClicked ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "View"
            )}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default RelatedProductCard;
