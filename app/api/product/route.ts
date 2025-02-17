import { authOptions } from "@/auth";
import { deleteProduct, fetchAndTransformAmazonProduct, getProduct, updateProduct } from "@/lib/server-actions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const data = await getProduct(url);

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Fetch the remote page
    const product = await fetchAndTransformAmazonProduct(url);

    // Call backend POST to update the product in DB
    if (!product || !product?.name || !product?.url || !product?.images || !product?.defaultPrice) {
      return NextResponse.json({ error: "Product structure is not valid or URL is incorrect" }, { status: 400 });
    }
    const result = await updateProduct(product);
    if (!result._id) {
      return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
    }

    return NextResponse.json({ message: "Product added/updated successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const result = await deleteProduct(url);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to delete product data" }, { status: 500 });
  }
}
