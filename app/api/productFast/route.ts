import { getProduct } from "@/lib/server-actions";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
