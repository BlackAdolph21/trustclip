import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

// Video submissions are infrequent by nature, so a generous-but-finite
// sliding window is enough to stop spam/abuse without punishing real users.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:upload",
});

const ALLOWED_CONTENT_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // `request.ip` was removed from Next.js's Request type in v15, but some
    // runtimes still attach it, so it's kept as a fallback before defaulting
    // to localhost for local development.
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

    const { contentType, businessId, fileSize } = await request.json();

    // Security check: reject the request up front if we don't know which
    // business this recording belongs to, rather than generating an upload
    // URL and orphaning the resulting file.
    if (!businessId) {
      return Response.json(
        { error: "businessId is required." },
        { status: 400 }
      );
    }

    // Browsers may append codec parameters (e.g. "video/webm;codecs=vp9,opus"),
    // so only the base MIME type is checked against the allow-list.
    const baseContentType =
      typeof contentType === "string" ? contentType.split(";")[0].trim() : "";

    if (!ALLOWED_CONTENT_TYPES.includes(baseContentType)) {
      return Response.json(
        { error: "Invalid file type. Only video files are allowed." },
        { status: 400 }
      );
    }

    if (typeof fileSize !== "number" || !Number.isFinite(fileSize)) {
      return Response.json(
        { error: "fileSize is required." },
        { status: 400 }
      );
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return Response.json(
        { error: "File size exceeds the 50MB limit." },
        { status: 400 }
      );
    }

    const fileName = `${crypto.randomUUID()}.mp4`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      ContentType: baseContentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    // Intentionally no Supabase write here: this route only hands out a
    // presigned URL. The database row is only created by
    // `/api/upload/complete` once the client confirms the video has
    // actually landed in R2, so a failed upload never leaves behind an
    // unplayable "ghost" record.
    return Response.json({ uploadUrl, fileName });
  } catch (error) {
    console.error("Failed to create upload URL:", error);
    return Response.json(
      { error: "Failed to create upload URL." },
      { status: 500 }
    );
  }
}
