"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Item {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function ItemCard({ item }: { item: Item }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full aspect-square"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image src={item.image || "/placeholder.svg"} alt={item.name} layout="fill" objectFit="cover" />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
          >
            <div className="text-white text-center p-4">
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-sm mb-1">{item.category}</p>
              <p className="text-xl font-bold mb-2">${item.price.toFixed(2)}</p>
              <Button variant="secondary" size="sm">
                Add to Cart
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
