import { authOptions } from "@/auth";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (session) return Response.json({ user: session?.user });
  else return Response.json({ error: "Not authenticated" }, { status: 401 });
};
