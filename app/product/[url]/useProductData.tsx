import { useState, useEffect } from "react";
import type { ProductData, VariationData } from "@/types/productData";
import { getUpdatedProduct, updateProduct } from "@/lib/component-actions";

const getInitialVariations = (productData: ProductData) => {
  if (!productData) return {};
  const getInitialVariations: Record<string, number> = {};
  productData.variations.forEach((variation: VariationData) => {
    const type = variation.type || "default";
    if (!getInitialVariations[type]) {
      getInitialVariations[type] = 0;
    }
  });

  return getInitialVariations;
};

export const useProductData = (url: string, product: ProductData) => {
  const [selectedVariations, setSelectedVariations] = useState<Record<string, number>>(getInitialVariations(product));
  const [productData, setProductData] = useState<ProductData | null>(product);

  useEffect(() => {
    const fetchSlowProduct = async () => {
      try {
        const product = await getUpdatedProduct(url);
        setProductData(product);
      } catch (err) {
        console.log("Failed to fetch productData data from amazon:", err);
      }
    };

    fetchSlowProduct();
  }, [url]);

  return { selectedVariations, setSelectedVariations, productData };
};
