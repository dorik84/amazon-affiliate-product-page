import { deleteProduct, fetchAndTransformAmazonProduct, getProduct, updateProduct } from "@/lib/server-actions";
import logger from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

import { getProductById } from "@/db/products";
import { verifyToken } from "@/lib/auth";
import { isProductData } from "@/utils/isProductData";

// #######################################################################

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  logger.debug("[GET /api/product[id]] | start ");
  try {
    if (!params.id) {
      logger.error("[GET /api/product[id]] | error | id parameter is missing");
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    const data = await getProduct(params.id);

    if (!data) {
      logger.error("[GET /api/product[id]] | error | no product found in db");
      return NextResponse.json({ error: "No product data found" }, { status: 404 });
    }

    logger.debug("[GET /api/product[id]] | Product fetched successfully");
    return NextResponse.json({ message: "Product fetched successfully", data }, { status: 200 });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}

// #######################################################################

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  logger.debug("[PUT /api/product[id]] | start");
  try {
    // throw new Error("random"); // TEST
    // Early authorization check
    const sessionToken = await verifyToken(request);
    if (!sessionToken) {
      logger.error("[PUT /api/product[id]] | error | no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (sessionToken.role !== "ADMIN") {
      logger.warn(`[PUT /api/product[id]] | not authorized access | session: ${sessionToken}`);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Extract and validate URL parameter
    const id = params.id;
    if (!id) {
      logger.warn(`[PUT /api/product[id]] | no product id provided`);
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Get product data from request body
    const product = await getProductById(id);

    if (!product) {
      logger.warn(`[PUT /api/product[id]] | no product provided`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const url = decodeURIComponent(product.url);
    // Fetch and validate product data
    const updatedProduct = await fetchAndTransformAmazonProduct(url);
    if (!isProductData(updatedProduct)) {
      logger.error(`[PUT /api/product[id]] | updatedProduct is not valid Product`);
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
    }

    // Update product in database
    const result = await updateProduct(id, updatedProduct);
    if (!result) {
      logger.error(`[PUT /api/product[id]] | Failed to update product data in DB`);
      throw new Error("Failed to update product data");
    }

    logger.debug(`[PUT /api/product[id]] | Product updated successfully`);
    return NextResponse.json({ message: "Product updated successfully", data: result }, { status: 201 });
  } catch (error) {
    logger.error("[PUT /api/product[id]]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to update product data" }, { status: 500 });
  }
}

// #######################################################################
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  logger.debug("[DELETE /api/product[id]] | start");
  try {
    // throw new Error("random"); // TEST
    // 1. Authorization check
    const sessionToken = await verifyToken(request);
    if (!sessionToken) {
      logger.error("[DELETE /api/product[id]] | error | no session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (sessionToken.role !== "ADMIN") {
      logger.warn(`[DELETE /api/product[id]] | not authorized access | session: ${sessionToken}`);
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 2. Input validation
    const id = params.id;
    if (!id) {
      logger.warn(`[DELETE /api/product/[id]] | not id provided`);
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    // 3. Delete operation
    const result = await deleteProduct(id);

    // 4. Response handling
    logger.debug(`[DELETE /api/product/[id]] | product id: ${id} deleted`);
    return NextResponse.json(
      { message: "Product deleted" },
      {
        status: 200,
      }
    );
  } catch (error) {
    // 5. Error logging and handling
    logger.error("[DELETE /api/product[id]]", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json({ error: "Failed to delete product data" }, { status: 500 });
  }
}
