"use server";

import { getRandomUserAgent } from "@/lib/utils";
import { ProductData } from "@/types/product";
import { unstable_cache } from "next/cache";
import { transformProduct } from "@/lib/productData-adapter";

import { GetProductsResponse } from "@/types/responses";
import clientPromise from "@/db/mongodb";
import { ReturnDocument } from "mongodb";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "@/db/products";

export async function getProducts(limit = 20, page = 1, category?: string): Promise<GetProductsResponse> {
  const getCachedProducts = unstable_cache(
    async (limit, page, category) => {
      try {
        const { data, totalPages, currentPage } = await getAllProducts(limit, page, category);

        if (!data.length) {
          console.log("server-actions | getProducts | No products found in DB for category:", category);
          return {
            data: [],
            totalPages: 0,
            currentPage: page,
            limit,
          };
        }

        console.log("server-actions | getProducts | products fetched from DB for category:", category);
        return {
          data,
          totalPages,
          currentPage,
          limit,
        };
      } catch (err) {
        console.error("server-actions | getProducts | ", err);
        throw err;
      }
    },
    [`products-${limit}-${page}-${category}`], // More specific cache key
    {
      tags: ["products"],
      revalidate: 3600,
    }
  );
  return getCachedProducts(limit, page, category);
}

// ###########################################################################
export async function getProduct(id: string): Promise<ProductData | null> {
  const getCachedProduct = unstable_cache(
    async (id: string) => {
      try {
        const data = getProductById(id);

        if (!data) {
          console.log("server-actions | getProduct | No products found in DB");
          return null;
        }
        console.log("server-actions | getProduct | product fetched from DB");
        return data;
      } catch (err) {
        console.log("server-actions | getProduct | ", err);
        throw err;
      }
    },
    [`product-${id}`], // More specific cache key
    {
      tags: ["product"],
      revalidate: 60 * 60, // 1 hour
    }
  );
  return getCachedProduct(id);
}

// ###########################################################################

export async function addProduct(product: Omit<ProductData, "id"> | undefined): Promise<ProductData | null> {
  if (!product) {
    console.error("server-actions | addProduct | No product data provided");
    return null;
  }

  try {
    const newProduct = createProduct(product);

    if (!newProduct) {
      console.log("server-actions | addProduct | No products added in DB");
      return null;
    }
    console.info("server-actions | addProduct | product added in DB");
    return newProduct;
  } catch (err) {
    console.error("server-actions | addProduct | ", err);
    throw err; // Propagate error to caller for proper error handling
  }
}

// ###########################################################################
export async function updateProduct(
  id: string,
  product: Omit<ProductData, "id"> | undefined
): Promise<ProductData | null> {
  if (!id) {
    console.error("server-actions | updateProduct | No id  provided");
    return null;
  }
  if (!product) {
    console.error("server-actions | updateProduct | No product data provided");
    return null;
  }

  try {
    const updatedProduct = updateProductDb(id, product);

    if (!updatedProduct) {
      console.log("server-actions | updateProduct | No products updated in DB");
      return null;
    }
    console.info("server-actions | updateProduct | product updated in DB");
    return updatedProduct;
  } catch (err) {
    console.error("server-actions | updateProduct | ", err);
    throw err; // Propagate error to caller for proper error handling
  }
}

// ###########################################################################

export async function deleteProduct(id: string) {
  if (!id) {
    console.error("server-actions | deleteProduct | Invalid or empty id provided");
    return null;
  }

  try {
    const result = await deleteProductDb(id);

    console.info("server-actions | deleteProduct | Product successfully deleted");
    return null;
  } catch (error) {
    console.error("server-actions | deleteProduct | Error:", error instanceof Error ? error.message : "Unknown error");
    throw error; // Re-throw to handle it in the calling function
  }
}

// ###########################################################################

// Cached function to fetch and strip data
export const fetchAndTransformAmazonProduct = (url: string) => {
  console.log("server-actions | fetchAndTransformAmazonProduct | start");
  const getCachedAmazonProduct = unstable_cache(
    async (url: string) => {
      try {
        // Simulate fetching large data from 3rd party API
        const response = await fetch(`${url}`, {
          cache: "no-store",
          headers: {
            "User-Agent": getRandomUserAgent(),
          },
        });

        if (!response.ok) {
          throw new Error("server-actions | fetchAndTransformAmazonProduct | Failed to fetch amazon product data");
        }

        // Parse the large response
        // Strip down the data to essential information
        const strippedData = transformProduct(response, url);
        console.log("server-actions | fetchAndTransformAmazonProduct | data fetched and stripped");
        return strippedData;
      } catch (error) {
        console.error("server-actions | fetchAndTransformAmazonProduct | Error fetching or stripping data:", error);
      }
    },
    [`amazon-${url}`], // add the ID to the cache key
    {
      tags: ["amazon-url"],
      revalidate: 60 * 60, // revalidate every 1 hours
    }
  );
  return getCachedAmazonProduct(url);
};
