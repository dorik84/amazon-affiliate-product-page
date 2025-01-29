import * as cheerio from "cheerio";

import type { ProductData } from "@/types/productData";

export async function fetchAndTransformProduct(url: string): Promise<ProductData> {
  try {
    // Decode the URL if it's encoded
    const decodedUrl = decodeURIComponent(url);

    // Fetch the remote page
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProductBot/1.0;)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`);
    }

    const html = await response.text();

    // Load HTML into cheerio for parsing
    const $ = cheerio.load(html);

    // Transform HTML content into structured data
    // Mock implementation for testing
    const mockProduct: ProductData = {
      title: "Sample Product",
      description: "This is a sample product description.",
      variations: [
        {
          name: "Red Version",
          price: 99.99,
          option: "red",
          image: "",
        },
        {
          name: "Blue Version",
          price: 129.99,
          option: "blue",
          image: "",
        },
      ],
      images: [
        "https://m.media-amazon.com/images/I/71GJx79GiFL._AC_SX679_.jpg",
        "https://m.media-amazon.com/images/I/71gJBqBLWhL._AC_SX679_.jpg",
        "https://m.media-amazon.com/images/I/71oYf41QpCL._AC_SX679_.jpg",
      ],
    };

    return mockProduct;
  } catch (error) {
    console.error("Error fetching and transforming product:", error);
    throw error;
  }
}
