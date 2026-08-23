import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { createClient } from "@/utils/supabase/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

// Mirrors the presign step's limit so a client can't bypass it by hitting
// this route directly and spamming database inserts.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:upload-complete",
});

// Guards against arbitrary file paths being passed in; this route should
// only ever finalize files this server itself named in `/api/upload`.
const FILE_NAME_PATTERN = /^[0-9a-f-]{36}\.mp4$/;

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip =
      forwardedFor?.split(",")[0]?.trim() ||
      (request as { ip?: string }).ip ||
      "127.0.0.1";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return Response.json(
        {
          error:
            "You have reached the maximum number of uploads allowed. Please try again later.",
        },
        { status: 429 }
      );
    }

    const { fileName, businessId, customerName } = await request.json();

    if (!businessId) {
      return Response.json(
        { error: "businessId is required." },
        { status: 400 }
      );
    }

    if (typeof fileName !== "string" || !FILE_NAME_PATTERN.test(fileName)) {
      return Response.json(
        { error: "A valid fileName is required." },
        { status: 400 }
      );
    }

    const videoUrl = `https://${process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN}/${fileName}`;

    const supabase = await createClient();

    // This insert is the single source of truth that a testimonial exists,
    // and it only ever runs after the caller has confirmed the video itself
    // was successfully written to R2.
    const { error: insertError } = await supabase.from("videos").insert({
      business_id: businessId,
      customer_name: customerName || "Anonymous",
      video_url: videoUrl,
      status: "Pending",
    });

    if (insertError) {
      throw insertError;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to finalize video upload:", error);
    return Response.json(
      { error: "Failed to save your testimonial. Please try again." },
      { status: 500 }
    );
  }
}
