import { deleteProduct, fetchAndTransformAmazonProduct, getProduct, updateProduct } from "@/lib/server-actions";

import { NextRequest, NextResponse } from "next/server";
import { GetProductResponse, PutProductResponse, DeleteProductResponse } from "@/types/api";

import { getProductById } from "@/db/products";
import { verifyToken } from "@/lib/auth";

// #######################################################################

export async function GET(request: NextRequest, { params }: { params: { id: string } }): Promise<GetProductResponse> {
  try {
    if (!params.id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    const data = await getProduct(params.id);

    if (!data) {
      const error = new Error("No product data found");
      console.error("[GET /api/product] | error ", error);
      return NextResponse.json({ error: "No product data found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product fetched successfully", data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}

// #######################################################################

export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<PutProductResponse> {
  try {
    // throw new Error("random"); // TEST
    // Early authorization check
    const sessionToken = await verifyToken(request);
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (sessionToken.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Extract and validate URL parameter
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Get product data from request body
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const url = decodeURIComponent(product.url);
    // Fetch and validate product data
    const updatedProduct = await fetchAndTransformAmazonProduct(url);

    // Update product in database
    const result = await updateProduct(id, updatedProduct);
    if (!result) {
      throw new Error("Failed to update product data");
    }

    return NextResponse.json({ message: "Product updated successfully", data: result }, { status: 201 });
  } catch (error) {
    console.error("[PUT /api/product]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to update product data" }, { status: 500 });
  }
}

// #######################################################################
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<DeleteProductResponse> {
  try {
    // throw new Error("random"); // TEST
    // 1. Authorization check
    const sessionToken = await verifyToken(request);
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (sessionToken.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 2. Input validation
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }

    // 3. Delete operation
    const result = await deleteProduct(id);

    // 4. Response handling
    return NextResponse.json(
      { message: "Product deleted" },
      {
        status: 200,
      }
    );
  } catch (error) {
    // 5. Error logging and handling
    console.error("[PUT /api/product]", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json({ error: "Failed to delete product data" }, { status: 500 });
  }
}
