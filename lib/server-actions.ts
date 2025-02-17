"use server";
import dbConnect from "@/db/db";
import Product from "@/db/models";
import { getRandomUserAgent } from "./utils";
import { ProductData } from "@/types/product";
import { unstable_cache } from "next/cache";
import { transformProduct } from "./productData-adapter";

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
    console.log("server-actions | updateProduct | No product data provided");
    return;
  }
  try {
    const options = { new: true, upsert: true }; // Create if doesn't exist
    const res = await Product.findOneAndUpdate({ url: product.url }, product, options);
    console.log("server-actions | updateProduct | product updated in DB");
    return res;
  } catch (err) {
    console.log("server-actions | updateProduct | ", err);
  }
}

export async function deleteProduct(url: string) {
  if (!url) {
    console.log("server-actions | deleteProduct | No url provided");
    return;
  }
  try {
    const res = await Product.deleteOne({ url });
    console.log(res);
    console.log("server-actions | deleteProduct | product deleted from DB");
    return res;
  } catch (err) {
    console.log("server-actions | deleteProduct | ", err);
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
      revalidate: 60 * 60 * 24, // revalidate every 24 hours
    }
  );
  return getCachedAmazonProduct(url);
};
