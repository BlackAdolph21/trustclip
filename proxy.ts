import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Note: as of Next.js 16, the `middleware.ts` file convention is deprecated
// in favor of `proxy.ts`. The exported function is now named `proxy`
// (previously `middleware`), but behaves identically.

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "ratelimit:page-visit",
});

const TOO_MANY_REQUESTS_HTML =
  "<html><body><h1>Too many requests. Please try again in a minute.</h1></body></html>";

export async function proxy(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "127.0.0.1";

  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new NextResponse(TOO_MANY_REQUESTS_HTML, {
      status: 429,
      headers: { "Content-Type": "text/html" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only run on public dynamic collection-link pages (e.g. /happy-customer-co).
    // Excludes API routes, Next internals, static assets, and known app
    // routes (auth pages, dashboard) as well as the home page itself.
    "/((?!api|_next|favicon\\.ico|login|dashboard|reset-password|$).*)",
  ],
};
