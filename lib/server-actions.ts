"use server";
import dbConnect from "@/db/db";
import Product from "@/db/models";
import { getRandomUserAgent } from "@/lib/utils";
import { ProductData } from "@/types/product";
import { unstable_cache } from "next/cache";
import { transformProduct } from "@/lib/productData-adapter";
import { DeleteResult } from "mongoose";
import { GetProductsResponse } from "@/types/responses";
import clientPromise from "@/db/mongodb";
import { ReturnDocument } from "mongodb";

export async function getProducts(limit = 20, page = 1, category?: string): Promise<GetProductsResponse> {
  const getCachedProducts = unstable_cache(
    async (limit, page, category) => {
      try {
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("products");

        const query = category ? { category } : {};
        const data = await collection
          .find(query)
          .limit(limit)
          .skip((page - 1) * limit)
          .toArray();

        if (!data.length) {
          console.log("server-actions | getProducts | No products found in DB for category:", category);
          return {
            data: [],
            totalPages: 0,
            currentPage: page,
            limit,
          };
        }

        const count = await collection.countDocuments(query);

        console.log("server-actions | getProducts | products fetched from DB for category:", category);
        return {
          data,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
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
        const client = await clientPromise;
        const db = client.db();
        const collection = db.collection("products");

        const data = (await collection.findOne({ url })) as ProductData | null;

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

export async function addProduct(product: ProductData | undefined): Promise<ProductData | null> {
  if (!product) {
    console.error("server-actions | addProduct | No product data provided");
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const query = { url: product.url };
    const update = { $set: product };

    const options = {
      returnDocument: ReturnDocument.AFTER,
      upsert: true,
    };
    const result = await collection.findOneAndUpdate(query, update, options);
    const newProduct = result.value as ProductData | null;

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
export async function updateProduct(product: ProductData | undefined): Promise<ProductData | null> {
  if (!product) {
    console.error("server-actions | updateProduct | No product data provided");
    return null;
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const query = { url: product.url };
    const update = { $set: product };
    const options = {
      returnDocument: ReturnDocument.AFTER,
      upsert: true,
    };

    const result = await collection.findOneAndUpdate(query, update, options);
    const updatedProduct = result.value as ProductData | null;

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
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const result = await collection.deleteOne({ url });

    if (result.deletedCount === 0) {
      console.warn(`server-actions | deleteProduct | No product found with URL: ${url}`);
      return result;
    }

    console.info("server-actions | deleteProduct | Product successfully deleted");
    return result;
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
        const response = await fetch(`${decodeURIComponent(url)}`, {
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
