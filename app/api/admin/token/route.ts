import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Generate a new Bearer token
  const bearerToken = jwt.sign(
    {
      id: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.role,
      name: session?.user?.name,
      picture: session?.user?.image,
    },
    secret,
    { expiresIn: "1h" } // Token expires in 1 hour
  );

  return NextResponse.json({ token: bearerToken });
}
