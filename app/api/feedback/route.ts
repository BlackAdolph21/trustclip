import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

// Feedback is a low-frequency, public-facing form, so a generous window is
// enough to stop spam/abuse without punishing a genuine visitor.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:feedback",
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 4000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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
            "You're submitting feedback too quickly. Please try again later.",
        },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !EMAIL_PATTERN.test(email.trim()) ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return Response.json(
        { error: "Please fill in your name, a valid email, and a message." },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: "Please shorten your name or message and try again." },
        { status: 400 }
      );
    }

    const feedbackEmail = process.env.FEEDBACK_EMAIL;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!feedbackEmail || !resendApiKey) {
      console.error("FEEDBACK_EMAIL or RESEND_API_KEY is not configured.");
      return Response.json(
        {
          error:
            "Feedback isn't accepting submissions right now. Please try again later.",
        },
        { status: 500 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    // Constructed lazily (rather than at module scope) so a missing API key
    // never crashes the build's page-data collection step - it's only
    // exercised once we know the request is otherwise valid.
    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      // Resend's shared sandbox sender works out of the box for any account.
      // Swap this for an address on a domain you've verified with Resend
      // before going to production.
      from: "TrustClip Feedback <onboarding@resend.dev>",
      to: feedbackEmail,
      replyTo: trimmedEmail,
      subject: `New feedback from ${trimmedName}`,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #1e1e1e;">
          <h2 style="margin: 0 0 16px;">New feedback from TrustClip</h2>
          <p style="margin: 0 0 4px;"><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
          <p style="margin: 0 0 16px;"><strong>Email:</strong> ${escapeHtml(trimmedEmail)}</p>
          <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; margin: 0;">${escapeHtml(trimmedMessage)}</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to send feedback email:", error);
    return Response.json(
      { error: "Something went wrong while sending your feedback. Please try again." },
      { status: 500 }
    );
  }
}
