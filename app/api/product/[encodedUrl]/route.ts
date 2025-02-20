import { authOptions } from "@/auth";
import {
  deleteProduct,
  fetchAndTransformAmazonProduct,
  getProduct,
  addProduct,
  updateProduct,
} from "@/lib/server-actions";
import { isValidProduct } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { GetProductResponse, PostProductResponse, PutProductResponse, DeleteProductResponse } from "@/types/api";

// #######################################################################

export async function GET(
  request: NextRequest,
  { params }: { params: { encodedUrl: string } }
): Promise<GetProductResponse> {
  try {
    const encodedUrl = params.encodedUrl;

    if (!encodedUrl) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    const data = await getProduct(encodedUrl);

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

export async function POST(
  request: NextRequest,
  { params }: { params: { encodedUrl: string } }
): Promise<PostProductResponse> {
  try {
    // throw new Error("random"); // TEST
    // Early authorization check
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Extract and validate URL parameter
    const encodedUrl = params.encodedUrl;
    if (!encodedUrl) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Fetch and validate product data
    const product = await fetchAndTransformAmazonProduct(encodedUrl);
    if (!isValidProduct(product)) {
      console.log("POST /api/product] | product ", product);
      return NextResponse.json({ error: "Product structure is not valid or URL is incorrect" }, { status: 400 });
    }

    // Update product in database
    const result = await addProduct(product);
    if (!result) {
      throw new Error("Failed to save product data");
    }

    return NextResponse.json({ message: "Product added successfully", data: result }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/product]", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
  }
}

// #######################################################################

export async function PUT(
  request: NextRequest,
  { params }: { params: { encodedUrl: string } }
): Promise<PutProductResponse> {
  try {
    // throw new Error("random"); // TEST
    // Early authorization check
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Extract and validate URL parameter
    const encodedUrl = params.encodedUrl;
    if (!encodedUrl) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // Fetch and validate product data
    const product = await fetchAndTransformAmazonProduct(encodedUrl);
    if (!isValidProduct(product)) {
      return NextResponse.json({ error: "Product structure is not valid or URL is incorrect" }, { status: 400 });
    }

    // Update product in database
    const result = await updateProduct(product);
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
  { params }: { params: { encodedUrl: string } }
): Promise<DeleteProductResponse> {
  try {
    // throw new Error("random"); // TEST
    // 1. Authorization check
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 2. Input validation
    const encodedUrl = params.encodedUrl;
    if (!encodedUrl) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }

    // 3. Delete operation
    const result = await deleteProduct(encodedUrl);

    // 4. Response handling
    return NextResponse.json(
      result ? { message: "Product deleted", deletedCount: result.deletedCount } : { error: "No product was found" },
      { status: result ? 200 : 404 }
    );
  } catch (error) {
    // 5. Error logging and handling
    console.error("DELETE product error:", error instanceof Error ? error.message : "Unknown error");

    return NextResponse.json({ error: "Failed to delete product data" }, { status: 500 });
  }
}
