import { useState, useEffect } from "react";
import type { ProductData, VariationData } from "@/types/productData";

export const useProductData = (url: string) => {
  const [selectedVariations, setSelectedVariations] = useState<Record<string, number>>({});
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlowProduct = async () => {
      try {
        const response = await fetch(`/api/productSlow?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product data");
        }
        const data = await response.json();
        setProductData(data);
        console.log("data before fetch");
        console.log(data);
        // Call backend to update the database
        fetch("/api/productSlow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Initialize selected variations with first option of each type
        if (data?.variations) {
          const initialVariations: Record<string, number> = {};
          data.variations.forEach((variation: VariationData) => {
            const type = variation.type || "default";
            if (initialVariations[type] === undefined) {
              initialVariations[type] = 0;
            }
          });
          setSelectedVariations(initialVariations);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch productData data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchFastProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/productFast?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
          console.log("Failed to fetch product data from DB");
        }
        const data = await response.json();
        console.log("dataDB");
        console.log(data);
        if (!data) {
          console.log("No product found in DB");
          return;
        }
        setProductData(data);

        // Initialize selected variations with first option of each type
        if (data?.variations) {
          const initialVariations: Record<string, number> = {};
          data.variations.forEach((variation: VariationData) => {
            const type = variation.type || "default";
            if (initialVariations[type] === undefined) {
              initialVariations[type] = 0;
            }
          });
          setSelectedVariations(initialVariations);
        }
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch productData data");
      }
    };

    fetchFastProduct();
    fetchSlowProduct();
  }, [url]);

  return { selectedVariations, setSelectedVariations, productData, isLoading, error };
};
