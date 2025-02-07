import { updateProduct } from "@/lib/component-actions";
import { updateProduct as updateProductDB } from "@/lib/server-actions";
import { transformProduct } from "@/lib/productData-adapter";
import { getAmazonProduct } from "@/lib/server-actions";

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Fetch the remote page
    const response = await getAmazonProduct(url);
    const product = await transformProduct(response, url);

    // Call backend POST to update the product in DB
    updateProduct(product);

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
    }
    await updateProductDB(body);

    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
  }
}
