import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

// Custom type for token validation result
type TokenValidationResult = jwt.JwtPayload | null;

// Constants
const BEARER_PREFIX = "Bearer ";
const ENV_SECRET_KEY = "NEXTAUTH_SECRET";

// Get and validate secret from environment variables
const secret = process.env[ENV_SECRET_KEY];
if (!secret) {
  throw new Error(`Invalid/Missing environment variable: "${ENV_SECRET_KEY}"`);
}

// Helper function to validate Bearer token
const validateBearerToken = async (token: string): Promise<TokenValidationResult> => {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (error) {
    console.error("Error verifying Bearer token:", error);
    return null;
  }
};

// Helper function to extract Bearer token from header
const extractBearerToken = (authHeader: string | null): string | null => {
  if (!authHeader?.startsWith(BEARER_PREFIX)) return null;
  return authHeader.substring(BEARER_PREFIX.length);
};

export async function verifyToken(req: NextRequest): Promise<TokenValidationResult> {
  try {
    // 1. Check for session token
    const sessionToken = await getToken({ req, secret });
    if (sessionToken) return sessionToken;

    // 2. Check for Bearer token
    const authHeader = req.headers.get("authorization");
    const bearerToken = extractBearerToken(authHeader);
    if (bearerToken) {
      const decodedToken = await validateBearerToken(bearerToken);
      if (decodedToken) return decodedToken;
    }

    // 3. Check for server session
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
