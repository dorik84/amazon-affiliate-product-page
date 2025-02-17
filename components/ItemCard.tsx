"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProductData } from "@/types/product";
import ProductImage from "./ProductImage";
import Link from "next/link";

export function ItemCard({ product }: { product: ProductData }) {
  const [isHovered, setIsHovered] = useState(false);

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
              <Link href={`/product/${product.url}`}>
                <Button variant="secondary" size="sm">
                  View product
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
