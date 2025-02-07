import dbConnect from "@/db/db";
import Product from "@/db/models";
import { getRandomUserAgent } from "./utils";
import { ProductData } from "@/types/productData";
import { unstable_cache } from "next/cache";
import { transformProduct } from "./productData-adapter";

export async function getRelatedProducts() {
  try {
    await dbConnect();
    const data = await Product.find({}).limit(10).lean();

    if (!data) {
      console.log("No products found in DB");
      return [];
    }
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getProduct(url: string) {
  try {
    await dbConnect();
    const data = await Product.findOne({ url }).lean();

    if (!data) {
      console.log("No products found in DB");
      return [];
    }
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function updateProduct(body: ProductData) {
  try {
    const options = { new: true, upsert: true }; // Create if doesn't exist
    const res = await Product.findOneAndUpdate({ url: body.url }, body, options);
  } catch (err) {
    console.log(err);
  }
}

export async function getAmazonProduct(url: string) {
  try {
    const response = await fetch(`${decodeURIComponent(url)}`, {
      cache: "no-store",
      headers: {
        "User-Agent": getRandomUserAgent(),
      },
    });
    if (!response.ok) {
      throw new Error("Amazon response was not ok");
    }

    return response;
  } catch (error) {
    console.log("Error fetching amazon product", error);
  }
}

// Cached function to fetch and strip data
export const fetchAndTransformAmazonProduct = (url: string) => {
  const getCachedProduct = unstable_cache(
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
          throw new Error("Failed to fetch amazon product data");
        }

        // Parse the large response
        // Strip down the data to essential information
        const strippedData = transformProduct(response, url);

        return strippedData;
      } catch (error) {
        console.error("Error fetching or stripping data:", error);
      }
    },
    [url], // add the user ID to the cache key
    {
      tags: ["url"],
      revalidate: 60,
    }
  );
  return getCachedProduct(url);
};
