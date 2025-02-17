import { ProductData } from "@/types/product";
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

const updateProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<ProductData> | null> = new Map();

  return (url: string) => {
    if (!url) {
      console.log("component-actions | updateProduct | no url provided");
      return null;
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | updateProduct | start");
      productPromiseMap.set(
        url,
        fetcher(`/api/product?url=${url}`, {
          method: "POST",
          cache: "no-store",
          // next: { revalidate: 60 },
        })
          .then((product) => {
            console.log("component-actions | updateProduct | product updated");
            productPromiseMap.delete(url);
            return product;
          })
          .catch((error) => {
            productPromiseMap.delete(url);
            throw new Error("component-actions | updateProduct | error", error);
          })
      );
    } else {
      console.log("component-actions | updateProduct | product data already updating");
    }

    return productPromiseMap.get(url);
  };
};

export const updateProduct = updateProductEnclosure();

const getProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<ProductData | null>> = new Map();

  return (url: string) => {
    if (!url) {
      console.log("component-actions | getProduct | no url provided");
      return null;
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | updateProduct | start");
      productPromiseMap.set(
        url,
        fetcher(`/api/product?url=${encodeURIComponent(url)}`, {
          cache: "no-store",
          // next: { revalidate: 60 },
        })
          .then((productDB) => {
            productPromiseMap.delete(url);
            return sanitizeProductData(productDB);
          })
          .catch((error) => {
            productPromiseMap.delete(url);
            console.log("component-actions | getProduct | error", error);
            return null;
          })
      );
    } else {
      console.log("component-actions | getProduct | product data already fetching");
    }

    return productPromiseMap.get(url);
  };
};

export const getProduct = getProductEnclosure();

const getRelatedProductsEnclosure = () => {
  let productPromise: Promise<ProductData[]> | null = null;

  return () => {
    if (!productPromise) {
      console.log("component-actions | getRelatedProducts | start fetching");
      productPromise = fetcher("/api/products", {
        cache: "no-store",
        // next: { revalidate: 60 },
      })
        .then((productDB) => {
          productPromise = null; // Reset the promise after it resolves
          console.log("component-actions | getRelatedProducts | success");
          return productDB.map(sanitizeProductData).filter((p: ProductData | null) => p != null);
        })
        .catch((error) => {
          productPromise = null; // Reset the promise if there's an error
          console.log("component-actions | getRelatedProducts | error", error);
          return null;
        });
    } else {
      console.log("component-actions | getRelatedProducts | products data already fetching");
    }

    return productPromise;
  };
};

export const getRelatedProducts = getRelatedProductsEnclosure();

const deleteProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<ProductData | null>> = new Map();

  return (url: string) => {
    if (!url) {
      console.log("component-actions | deleteProduct | no url provided");
      return null;
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | deleteProduct | start");
      productPromiseMap.set(
        url,
        fetcher(`/api/product?url=${encodeURIComponent(url)}`, {
          method: "DELETE",
          cache: "no-store",
        })
          .then((resut) => {
            productPromiseMap.delete(url);
            console.log("component-actions | deleteProduct | product deleted");
            return resut;
          })
          .catch((error) => {
            productPromiseMap.delete(url);
            console.log("component-actions | deleteProduct | error", error);
            return null;
          })
      );
    } else {
      console.log("component-actions | deleteProduct | product deletiion already fetching");
    }

    return productPromiseMap.get(url);
  };
};

export const deleteProduct = deleteProductEnclosure();
