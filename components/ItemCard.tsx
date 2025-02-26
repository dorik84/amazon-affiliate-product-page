"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductData } from "@/types/product";
import ProductImage from "@/components/ProductImage";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@/lib/analytics";

export function ItemCard({ product }: { product: ProductData }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 2000); // Reset after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  const handleClick = () => {
    setIsClicked(true);
    sendGAEvent("product_view", "Product Interaction", "Product View Desktop", product.url);
  };

  return (
    <div
      className="relative w-full aspect-square"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ProductImage name={product.name} src={product.images[0]} index={0} style={{ objectFit: "cover" }} />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/70 flex items-center justify-center "
          >
            <div className="text-center p-4">
              <h3 className="text-xs font-semibold mb-1 line-clamp-3 select-none">{product.name}</h3>
              {/* <p className="text-xs mb-1 truncate">{product.category}</p> */}
              {/* <p className="text-xl font-bold mb-2">${product.defaultPrice.toFixed(2)}</p> */}
              <Link href={`/product/${product.id}`} onClick={handleClick} rel="noopener noreferrer">
                <Button
                  variant="secondary"
                  className={cn(
                    "w-full text-xs py-1 transition-all duration-200",
                    isClicked && "bg-secondary/50 cursor-wait"
                  )}
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
        )}
      </AnimatePresence>
    </div>
  );
}
