import { getProducts } from "@/lib/server-actions";
import { ProductsResponse } from "@/types/api";
import { ProductData } from "@/types/product";
import { GetProductsResponse } from "@/types/responses";

import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

// Cache constants
const CACHE_TTL = 1 * 60 * 1000; // 1 minutes in milliseconds
const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

// Memoize parameter extraction for repeated requests
const extractQueryParams = cache((request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  return {
    category: searchParams.get("category")?.trim(),
    limit: Math.min(
      parseInt(searchParams.get("limit")?.trim() || String(DEFAULT_LIMIT), 10),
      100 // Max limit to prevent excessive data fetching
    ),
    page: parseInt(searchParams.get("page")?.trim() || String(DEFAULT_PAGE), 10),
  };
});

// Memoize product fetching
const getCachedProducts = cache(async (limit: number, page: number, category?: string) => {
  return await getProducts(limit, page, category);
});

// #######################################################################

export async function GET(request: NextRequest): Promise<NextResponse<ProductsResponse>> {
  // Removed generic type since NextResponse already includes the response type
  // Use AbortController for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const { category, limit, page } = extractQueryParams(request);
    console.log("Extracted query parameters:", { category, limit, page });
    // Validate query parameters using bitwise operations for faster checks
    if ((limit | 0) < 1) {
      return NextResponse.json({ error: "Limit must be a positive number" }, { status: 400 });
    }

    if ((page | 0) < 1) {
      return NextResponse.json({ error: "Page must be a positive number" }, { status: 400 });
    }

    // Fetch data with timeout
    const data = (await Promise.race([
      getCachedProducts(limit, page, category),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 5000)),
    ])) as GetProductsResponse;

    clearTimeout(timeoutId);

    // Use structured clone for deep copying if needed
    return NextResponse.json(
      {
        ...data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      console.error("Error fetching products:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message === "Request timeout"
            ? "Request timed out"
            : "Failed to fetch product data",
      },
      {
        status: error instanceof Error && error.message === "Request timeout" ? 408 : 500,
      }
    );
  }
}
