import { verifyToken } from "@/lib/auth";
import logger from "@/lib/logger";
import { addProduct, fetchAndTransformAmazonProduct, getProducts } from "@/lib/server-actions";
import { isProductData } from "@/lib/utils";

import { ApiResponse, ProductsResponse } from "@/types/api";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

// Cache constants
const CACHE_TTL = 1 * 60 * 1000; // 1 minutes in milliseconds
const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;
const MAX_LIMIT = 100;

// Memoize parameter extraction for repeated requests
const extractQueryParams = cache((request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;

  return {
    category: searchParams.get("category")?.trim(),
    limit: Math.min(
      parseInt(searchParams.get("limit")?.trim() || String(DEFAULT_LIMIT), 10),
      MAX_LIMIT // Max limit to prevent excessive data fetching
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
  logger.debug("[GET /api/product] | start");

  // Use AbortController for request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
    const { category, limit, page } = extractQueryParams(request);

    // Validate query parameters using bitwise operations for faster checks
    if ((limit | 0) < 1) {
      logger.error("[GET /api/product] | limit is negative number");
      return NextResponse.json({ error: "Limit must be a positive number" }, { status: 400 });
    }

    if ((page | 0) < 1) {
      logger.error("[GET /api/product] | page is negative number");
      return NextResponse.json({ error: "Page must be a positive number" }, { status: 400 });
    }

    // Fetch data with timeout
    const data = (await Promise.race([
      getCachedProducts(limit, page, category),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Request timeout")), 5000)),
    ])) as ProductsResponse;

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
    logger.debug("[GET /api/product] | end");
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      logger.error("Error fetching products:", {
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

// #######################################################################

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    logger.debug("[POST /api/product] | start");
    // throw new Error("random"); // TEST

    // Early authorization check
    const sessionToken = await verifyToken(request);
    if (!sessionToken) {
      logger.warn("[POST /api/product] | no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (sessionToken?.role !== "ADMIN") {
      logger.warn("[POST /api/product] | no authorized access atempt | session: ", sessionToken);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Extract and validate URL parameter
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("encodedUrl");
    logger.debug("[POST /api/product] | searchParams", searchParams);

    if (!url) {
      logger.error("[POST /api/product] | no url param found");
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Fetch and validate product data
    const product = await fetchAndTransformAmazonProduct(url);

    if (!isProductData(product)) {
      logger.error("[POST /api/product] | transformed product is not valid product");
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    // Update product in database
    const result = await addProduct(product);
    if (!result) {
      logger.error("[POST /api/product] | Failed to save product data in DB");
      throw new Error("Failed to save product data");
    }
    logger.debug("[POST /api/product] | end");
    return NextResponse.json({ message: "Product added successfully", data: result }, { status: 201 });
  } catch (error) {
    logger.error("[POST /api/product]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
  }
}
