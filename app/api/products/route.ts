import dbConnect from "@/db/db";
import Product from "@/db/models";

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const data = await Product.find({}).limit(10).lean();
    // console.log(" in products route");
    // console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}
