import dbConnect from "@/db/db";
import Product from "@/db/models";
import { fetchAndTransformProduct } from "@/lib/productData-adapter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    const data = await Product.findOne({ url }).lean();
    console.log("fetched product from Db");
    console.log(data);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}
