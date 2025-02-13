import { cache } from "react";
import { sanitizeProductData } from "./utils";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetcher(endpoint: string, options = {}) {
  console.log("component-actions | fetcher | start");
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
  });
  if (!response.ok) {
    throw new Error("component-actions | fetcher | Network response was not ok");
  }
  console.log("component-actions | fetcher | success");
  return response.json();
}

const getProductEnclosure = () => {
  let productPromise: Promise<ProductData> | null = null;

  return (url: string) => {
    if (!url) {
      console.log("component-actions | getProduct | no url provided");
      return;
    }

    if (!productPromise) {
      console.log("component-actions | getProduct | fetching product data");
      productPromise = fetcher(`/api/product?url=${encodeURIComponent(url)}`, {
        next: { revalidate: 60 },
      })
        .then((productDB: typeof Product) => {
          productPromise = null; // Reset the promise after it resolves
          return sanitizeProductData(productDB);
        })
        .catch((error) => {
          productPromise = null; // Reset the promise if there's an error
          throw error;
        });
    } else {
      console.log("component-actions | getProduct | product data already fetching");
    }

    return productPromise;
  };
};

export const getProduct = cache(getProductEnclosure());

export async function getRelatedProducts() {
  try {
    const relatedProducts = await fetcher("/api/products", { cache: "no-store" });

    if (!relatedProducts) {
      console.log("No products found in DB");
      return [];
    }
    return relatedProducts;
  } catch (err) {
    console.log(err);
    return [];
  }
}
