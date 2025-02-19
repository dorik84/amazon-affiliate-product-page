import { ProductData } from "@/types/product";
import { sanitizeProductData } from "./utils";
import {
  DeleteProductResponseBody,
  UpdateProductResponseBody,
  AddProductResponseBody,
  getProductsResponse,
} from "@/types/responses";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetcher(endpoint: string, options = {}) {
  console.log("component-actions | fetcher | start");
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
  });
  if (!response.ok) {
    console.log("component-actions | fetcher | Network response was not ok");
    throw new Error((await response.json()).error);
  }
  console.log("component-actions | fetcher | end");
  return response.json();
}

// ###########################################################################

const addProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<AddProductResponseBody>> = new Map();

  return (url: string): Promise<AddProductResponseBody> => {
    if (!url) {
      console.log("component-actions | addProduct | no url provided");
      return Promise.reject({ message: "No url provided" });
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | addProduct | start");
      const promise = fetch(`${baseUrl}/api/product?url=${url}`, {
        method: "POST",
        cache: "no-store",
      })
        .then(async (res) => {
          console.log("component-actions | addProduct | response received");
          if (!res.ok) {
            console.log("component-actions | addProduct | Network response was not ok");
            throw new Error((await res.json()).error);
          }
          return res.json();
        })
        .then((data) => {
          console.log("component-actions | addProduct | data retrieved");
          productPromiseMap.delete(url);
          return data;
        })
        .catch((error) => {
          productPromiseMap.delete(url);
          console.log("component-actions | addProduct | error", error);
          return Promise.reject(error);
        });

      productPromiseMap.set(url, promise);
      return promise;
    }

    const existingPromise = productPromiseMap.get(url);
    if (!existingPromise) {
      // This should never happen due to the check above, but TypeScript needs it
      return Promise.reject(new Error("Promise unexpectedly missing"));
    }

    console.log("component-actions | addProduct | product data already updating");
    return existingPromise;
  };
};

export const addProduct = addProductEnclosure();

// ###########################################################################

const updateProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<UpdateProductResponseBody>> = new Map();

  return (url: string): Promise<UpdateProductResponseBody> => {
    if (!url) {
      console.log("component-actions | updateProduct | no url provided");
      return Promise.reject({ message: "No url provided" });
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | updateProduct | start");
      const promise = fetch(`${baseUrl}/api/product?url=${url}`, {
        method: "PUT",
        cache: "no-store",
      })
        .then(async (res) => {
          console.log("component-actions | updateProduct | response received");
          if (!res.ok) {
            console.log("component-actions | updateProduct | Network response was not ok");
            throw new Error((await res.json()).error);
          }
          return res.json();
        })
        .then((data) => {
          console.log("component-actions | updateProduct | data retrieved");
          productPromiseMap.delete(url);
          return data;
        })
        .catch((error) => {
          productPromiseMap.delete(url);
          console.log("component-actions | updateProduct | error", error);
          return Promise.reject(error);
        });

      productPromiseMap.set(url, promise);
      return promise;
    }

    const existingPromise = productPromiseMap.get(url);
    if (!existingPromise) {
      // This should never happen due to the check above, but TypeScript needs it
      return Promise.reject(new Error("Promise unexpectedly missing"));
    }

    console.log("component-actions | updateProduct | product data already updating");
    return existingPromise;
  };
};

export const updateProduct = updateProductEnclosure();

// ###########################################################################

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

// ###########################################################################

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

// ###########################################################################

const getProductsEnclosure = () => {
  let productsPromiseMap: Map<String, Promise<getProductsResponse>> = new Map();

  return (query?: string): Promise<getProductsResponse> => {
    const queryKey = query || "";

    if (!productsPromiseMap.has(queryKey)) {
      console.log("component-actions | getProducts | start");
      const endpoint = query ? `/api/products?${query}` : "/api/products";
      console.log("component-actions | getProducts | endpoint", endpoint);
      const promise = fetch(`${baseUrl}${endpoint}`, {
        cache: "no-store",
      })
        .then(async (res) => {
          console.log("component-actions | getProducts | response received");
          if (!res.ok) {
            console.log("component-actions | getProducts | Network response was not ok");
            throw new Error((await res.json()).error);
          }
          return res.json();
        })
        .then((result) => {
          productsPromiseMap.delete(queryKey);
          console.log("component-actions | getProducts | products fetched");
          return result;
        })
        .catch((error) => {
          productsPromiseMap.delete(queryKey);
          console.log("component-actions | getProducts | error", error);
          return Promise.reject(error);
        });
      productsPromiseMap.set(queryKey, promise);
      return promise;
    }

    const existingPromise = productsPromiseMap.get(queryKey);
    if (!existingPromise) {
      // This should never happen due to the check above, but TypeScript needs it
      return Promise.reject(new Error("Promise unexpectedly missing"));
    }

    console.log("component-actions | getProducts | products data already fetching");
    return existingPromise;
  };
};

export const getProducts = getProductsEnclosure();

// ###########################################################################

const deleteProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<DeleteProductResponseBody>> = new Map();

  return (url: string): Promise<DeleteProductResponseBody> => {
    if (!url) {
      console.log("component-actions | deleteProduct | no url provided");
      return Promise.reject({ message: "No url provided" });
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | deleteProduct | start");
      const promise = fetch(`${baseUrl}/api/product?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
        cache: "no-store",
      })
        .then(async (res) => {
          console.log("component-actions | deleteProduct | response received");
          if (!res.ok) {
            console.log("component-actions | deleteProduct | Network response was not ok");
            throw new Error((await res.json()).error);
          }
          return res.json();
        })
        .then((resut) => {
          productPromiseMap.delete(url);
          console.log("component-actions | deleteProduct | product deleted");
          return resut;
        })
        .catch((error) => {
          productPromiseMap.delete(url);
          console.log("component-actions | deleteProduct | error", error);
          return Promise.reject(error);
        });
      productPromiseMap.set(url, promise);
      return promise;
    }

    const existingPromise = productPromiseMap.get(url);
    if (!existingPromise) {
      // This should never happen due to the check above, but TypeScript needs it
      return Promise.reject(new Error("Promise unexpectedly missing"));
    }

    console.log("component-actions | deleteProduct | product data already delleting");
    return existingPromise;
  };
};

export const deleteProduct = deleteProductEnclosure();
