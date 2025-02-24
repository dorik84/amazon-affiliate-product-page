import { DeleteProductResponse, GetProductsResponse } from "@/types/responses";
import { ApiResponse, PostProductResponse, PutProductResponse, SuccessApiResponse } from "@/types/api";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// ###########################################################################

const addProductEnclosure = () => {
  let productPromiseMap: Map<String, Promise<ApiResponse>> = new Map();

  return (url: string): Promise<ApiResponse> => {
    if (!url) {
      console.log("component-actions | addProduct | no url provided");
      return Promise.reject({ message: "No url provided" });
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | addProduct | start");
      const promise = fetch(`${baseUrl}/api/product/${url}`, {
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
  let productPromiseMap: Map<String, Promise<ApiResponse>> = new Map();

  return (url: string): Promise<ApiResponse> => {
    if (!url) {
      console.log("component-actions | updateProduct | no url provided");
      return Promise.reject({ message: "No url provided" });
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | updateProduct | start");
      const promise: Promise<ApiResponse> = fetch(`${baseUrl}/api/product/${url}`, {
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
  let productPromiseMap: Map<String, Promise<SuccessApiResponse>> = new Map();

  return (url: string) => {
    if (!url) {
      console.log("component-actions | getProduct | no url provided");
      // Better to throw error and handle in component
      return Promise.reject(new Error("No url provided"));
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | getProduct | start");
      const promise: Promise<SuccessApiResponse> = fetch(`${baseUrl}/api/product/${encodeURIComponent(url)}`, {
        cache: "no-store",
      })
        .then(async (res) => {
          console.log("component-actions | getProduct | response received");
          if (!res.ok) {
            console.log("component-actions | getProduct | Network response was not ok");
            throw new Error((await res.json()).error);
          }
          return res.json();
        })
        .then((productDB: SuccessApiResponse) => {
          productPromiseMap.delete(url);
          return productDB;
        })
        .catch((error) => {
          productPromiseMap.delete(url);
          console.log("component-actions | getProduct | error", error);
          // Better to throw error and handle in component
          throw error;
        });

      productPromiseMap.set(url, promise);
      return promise;
    }
    const existingPromise = productPromiseMap.get(url);
    if (!existingPromise) {
      // This should never happen due to the check above, but TypeScript needs it
      return Promise.reject(new Error("Promise unexpectedly missing"));
    }

    console.log("component-actions | getProduct | product data already fetching");
    return existingPromise;
  };
};

export const getProduct = getProductEnclosure();

// ###########################################################################

const getProductsEnclosure = () => {
  let productsPromiseMap: Map<String, Promise<GetProductsResponse>> = new Map();

  return (query?: string): Promise<GetProductsResponse> => {
    console.log("component-actions | getProducts | start");
    const queryKey = query || "";

    if (!productsPromiseMap.has(queryKey)) {
      const endpoint = query ? `/api/product?${query}` : "/api/product";
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
          console.log("component-actions | getProducts | complete");
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

function deleteProductEnclosure() {
  let productPromiseMap: Map<String, Promise<DeleteProductResponse>> = new Map();

  return (url: string): Promise<DeleteProductResponse> => {
    if (!url) {
      console.log("component-actions | deleteProduct | no url provided");
      return Promise.reject({ message: "No url provided" });
    }

    if (!productPromiseMap.has(url)) {
      console.log("component-actions | deleteProduct | start");
      const promise = fetch(`${baseUrl}/api/product/${encodeURIComponent(url)}`, {
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
}

export const deleteProduct = deleteProductEnclosure();
