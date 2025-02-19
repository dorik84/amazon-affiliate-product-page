"use server";
import dbConnect from "@/db/db";
import Product from "@/db/models";
import { getRandomUserAgent } from "./utils";
import { ProductData } from "@/types/product";
import { unstable_cache } from "next/cache";
import { transformProduct } from "./productData-adapter";
import { DeleteResult } from "mongoose";

export async function getRelatedProducts() {
  try {
    await dbConnect();
    const data = await Product.find({}).limit(10).lean();

    if (!data) {
      console.log("server-actions | getRelatedProducts | No products found in DB");
      return;
    }

    console.log("server-actions | getRelatedProducts | products fetched from DB");
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
}

export async function getPopularProducts() {
  try {
    await dbConnect();
    const data = await Product.find({}).limit(20).lean();

    if (!data) {
      console.log("server-actions | getPopularProducts | No products found in DB");
      return [];
    }
    console.log("server-actions | getPopularProducts | products fetched from DB");
    return data;
  } catch (err) {
    console.log("server-actions | getPopularProducts | ", err);
    return [];
  }
}

export async function getProduct(url: string) {
  const getCachedProduct = unstable_cache(
    async (url: string) => {
      try {
        await dbConnect();
        const data = await Product.findOne({ url }).lean();

        if (!data) {
          console.log("server-actions | getProduct | No products found in DB");
          return null;
        }
        console.log("server-actions | getProduct | product fetched from DB");
        return data;
      } catch (err) {
        console.log("server-actions | getProduct | ", err);
        return null;
      }
    },
    [`product-${url}`], // More specific cache key
    {
      tags: ["products"],
      revalidate: 3600,
    }
  );
  return getCachedProduct(url);
}

export async function updateProduct(product: ProductData | undefined) {
  if (!product) {
    console.error("server-actions | updateProduct | No product data provided");
    return null;
  }

  try {
    const query = { url: product.url };
    const update = { $set: product };
    const options = {
      new: true,
      upsert: true,
      lean: true, // Returns a plain JavaScript object instead of a Mongoose document
    };

    const updatedProduct = await Product.findOneAndUpdate(query, update, options);
    console.info("server-actions | updateProduct | product updated in DB");
    return updatedProduct;
  } catch (err) {
    console.error("server-actions | updateProduct | ", err);
    throw err; // Propagate error to caller for proper error handling
  }
}

export async function deleteProduct(url: string): Promise<DeleteResult | null> {
  if (!url?.trim()) {
    console.error("server-actions | deleteProduct | Invalid or empty URL provided");
    return null;
  }

  try {
    // Use lean() for better performance when we don't need a full Mongoose document
    const result = await Product.deleteOne({ url }).lean();

    if (result.deletedCount === 0) {
      console.warn(`server-actions | deleteProduct | No product found with URL: ${url}`);
      return null;
    }

    console.info("server-actions | deleteProduct | Product successfully deleted");
    return result;
  } catch (error) {
    console.error("server-actions | deleteProduct | Error:", error instanceof Error ? error.message : "Unknown error");
    throw error; // Re-throw to handle it in the calling function
  }
}

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
