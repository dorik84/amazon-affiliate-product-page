"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProductData } from "@/types/productData";

export default function ProductCard({ product }: { product: ProductData }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-32 md:w-64 bg-white rounded-lg shadow-custom-shadow overflow-hidden"
    >
      <Link href={`/product/${product.url}`}>
        <div className="relative h-24 md:h-48">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            style={{ objectFit: "contain" }}
            className="w-full h-full"
          />
        </div>
        <div className="p-4 truncate">
          <h3 className="text-sm md:text-lg font-semibold mb-2 truncate">{product.title}</h3>
          <p className="text-gray-600">${product.defaultPrice.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
