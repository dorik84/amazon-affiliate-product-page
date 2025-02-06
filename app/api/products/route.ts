import { getRelatedProducts } from "@/lib/server-actions";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getRelatedProducts();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch product data" }, { status: 500 });
  }
}
