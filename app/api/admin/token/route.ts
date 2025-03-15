import { NextResponse } from "next/server";
import "@/lib/envConfig";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import logger from "@/lib/logger";

const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  logger.debug("[GET /admin/token] | start");

  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    logger.error("[GET /admin/token] | not authorised access | session", session);
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
      sub: session?.user?.id,
    },
    secret,
    { expiresIn: "1h" } // Token expires in 1 hour
  );
  logger.debug("[GET /admin/token] | end");
  return NextResponse.json({ token: bearerToken });
}
