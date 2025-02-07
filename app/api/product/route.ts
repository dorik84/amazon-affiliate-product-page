import { fetchAndTransformAmazonProduct, getProduct, updateProductDB } from "@/lib/server-actions";
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
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Fetch the remote page
    const product = await fetchAndTransformAmazonProduct(url);

    // Call backend POST to update the product in DB
    if (!product?.title) {
      return NextResponse.json({ error: "Product structure is not valid" }, { status: 400 });
    }
    const result = await updateProductDB(product);
    if (!result._id) {
      return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
    }

    return NextResponse.json({ message: "Product added/updated successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
  }
}
