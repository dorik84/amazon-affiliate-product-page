import { ProductData } from "@/types/productData";
import { sanitizeProductData } from "./utils";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCache(endpoint: string, options = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    next: { revalidate: 6 },
    ...options,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchNoCache(endpoint: string, options = {}) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, { cache: "no-store", ...options });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function getProduct(url: string) {
  if (!url) return;
  const productDB = await fetchCache(`/api/product?url=${encodeURIComponent(url)}`);
  return sanitizeProductData(productDB);
}

export async function getRelatedProducts() {
  try {
    const relatedProducts = await fetchNoCache("/api/products");

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
