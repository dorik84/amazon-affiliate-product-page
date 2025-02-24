import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LRUCache } from "lru-cache";

const LIMIT = 100; // Max number of requests per token per interval

type RateLimitOptions = {
  uniqueTokenPerInterval?: number;
  interval?: number;
  limit?: number;
};

const rateLimit = (options?: RateLimitOptions) => {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, [1]);
      } else {
        tokenCount[0] += 1;
        tokenCache.set(token, tokenCount);
      }
      return tokenCount[0] <= (options?.limit || 10);
    },
  };
};

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute in milliseconds
  uniqueTokenPerInterval: 500, // Max number of unique tokens per interval
  limit: LIMIT, // Max number of requests per token per interval
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const token = ip;

  const { pathname } = request.nextUrl;

  // Exclude certain paths from rate limiting if needed
  if (pathname.startsWith("/_next") || pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  const isAllowed = limiter.check(token);

  if (!isAllowed) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  // Add rate limit headers
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", "10");
  response.headers.set("X-RateLimit-Remaining", isAllowed ? "1" : "0");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

/*
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/"];

  // Route-based role protection
  const adminRoutes = ["/admin", "/admin/dashboard"];
  const managerRoutes = ["/manager", "/manager/reports"];
  const userRoutes = ["/dashboard", "/profile"];

  // If no token and not a public route, redirect to login
  if (!token && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access control
  if (token) {
    const role = token.role as string;

    // Admin routes
    if (adminRoutes.some((route) => path.startsWith(route))) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // Manager routes
    if (managerRoutes.some((route) => path.startsWith(route))) {
      if (role !== "ADMIN" && role !== "MANAGER") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // User routes
    if (userRoutes.some((route) => path.startsWith(route))) {
      if (role === "GUEST") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
*/
