"use server";

import { getRandomUserAgent } from "@/utils/getRandomUserAgent";
import { ProductData } from "@/types/product";
import { unstable_cache } from "next/cache";
import { transformProduct } from "@/utils/productData-adapter";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct as updateProductDb,
  deleteProduct as deleteProductDb,
} from "@/db/products";
import logger from "@/lib/logger";
import { ProductsResponse } from "@/types/api";

export async function getProducts(limit = 20, page = 1, category?: string): Promise<ProductsResponse> {
  const getCachedProducts = unstable_cache(
    async (limit, page, category) => {
      try {
        const { data, totalPages, currentPage } = await getAllProducts(limit, page, category);

        if (!data.length) {
          logger.debug("[lib/server-actions.ts] | getProducts | No products found in DB for category:", category);
          return {
            data: [],
            totalPages: 0,
            currentPage: page,
            limit,
          };
        }

        logger.info("[lib/server-actions.ts] | getProducts | products fetched from DB for category:", category);
        return {
          data,
          totalPages,
          currentPage,
          limit,
        };
      } catch (err) {
        logger.error("[lib/server-actions.ts] | getProducts | error", err);
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
          logger.debug("[lib/server-actions.ts] | getProduct | No products found in DB");
          return null;
        }
        logger.info("[lib/server-actions.ts] | getProduct | product fetched from DB");
        return data;
      } catch (err) {
        logger.error("[lib/server-actions.ts] | getProduct | ", err);
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
    logger.error("[lib/server-actions.ts] | addProduct | No product data provided");
    return null;
  }

  try {
    const newProduct = createProduct(product);

    if (!newProduct) {
      logger.error("[lib/server-actions.ts] | addProduct | No products added in DB");
      return null;
    }
    logger.info("[lib/server-actions.ts] | addProduct | product added in DB");
    return newProduct;
  } catch (err) {
    logger.error("[lib/server-actions.ts] | addProduct | ", err);
    throw err; // Propagate error to caller for proper error handling
  }
}

// ###########################################################################
export async function updateProduct(
  id: string,
  product: Omit<ProductData, "id"> | undefined
): Promise<ProductData | null> {
  if (!id) {
    logger.error("[lib/server-actions.ts] | updateProduct | No id  provided");
    return null;
  }
  if (!product) {
    logger.error("[lib/server-actions.ts] | updateProduct | No product data provided");
    return null;
  }

  try {
    const updatedProduct = updateProductDb(id, product);

    if (!updatedProduct) {
      logger.error("[lib/server-actions.ts] | updateProduct | No products updated in DB");
      return null;
    }
    logger.info("[lib/server-actions.ts] | updateProduct | product updated in DB");
    return updatedProduct;
  } catch (err) {
    logger.error("[lib/server-actions.ts] | updateProduct | ", err);
    throw err; // Propagate error to caller for proper error handling
  }
}

// ###########################################################################

export async function deleteProduct(id: string) {
  if (!id) {
    logger.error("[lib/server-actions.ts] | deleteProduct | Invalid or empty id provided");
    return null;
  }

  try {
    const result = await deleteProductDb(id);

    logger.info("[lib/server-actions.ts] | deleteProduct | Product successfully deleted");
    return null;
  } catch (error) {
    logger.error(
      "[lib/server-actions.ts] | deleteProduct | Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error; // Re-throw to handle it in the calling function
  }
}

// ###########################################################################

// Cached function to fetch and strip data
export const fetchAndTransformAmazonProduct = (url: string) => {
  logger.debug("[lib/server-actions.ts] | fetchAndTransformAmazonProduct | start");
  logger.debug("[lib/server-actions.ts] | fetchAndTransformAmazonProduct | url", url);
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
        logger.debug("[lib/server-actions.ts] | fetchAndTransformAmazonProduct | data fetched and stripped");
        return strippedData;
      } catch (error) {
        logger.error(
          "[lib/server-actions.ts] | fetchAndTransformAmazonProduct | Error fetching or stripping data:",
          error
        );
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
