import dbConnect from "@/db/db";
import Product from "@/db/models";
import { getRandomUserAgent } from "./utils";
import { ProductData } from "@/types/productData";

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
