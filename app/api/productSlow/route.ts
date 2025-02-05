import dbConnect from "@/db/db";
import ProductData from "@/db/models";
import { fetchAndTransformProduct } from "@/lib/productData-adapter";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    const data = await fetchAndTransformProduct(url);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    // console.log("body");
    // console.log(body);
    const newProduct = new ProductData(body);
    // console.log("newProduct!!");
    // console.log(newProduct);
    // const result = await newProduct.save();
    const options = { new: true, upsert: true }; // Create if doesn't exist

    const updatedProduct = await ProductData.findOneAndUpdate({ url: body.url }, body, options);
    console.log("updatedProduct");
    console.log(updatedProduct);
    return NextResponse.json({ message: "Product added successfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to save product data" }, { status: 500 });
  }
}
