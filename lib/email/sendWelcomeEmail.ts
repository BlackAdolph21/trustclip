import { Resend } from "resend";

const FROM_ADDRESS = "Leonidas from TrustClip <leonidas@trustclip.app>";
const SUBJECT = "Welcome to TrustClip! (a quick note from the founder)";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildWelcomeEmailText(firstName?: string | null) {
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  return `${greeting}

Leonidas here, but you can call me Leo, founder at TrustClip.

I wanted to personally reach out and welcome you! TrustClip started as a little dream of mine to help creators and businesses gather authentic video testimonials effortlessly, and I genuinely hope you love using the platform.

I'm always looking for ways to make TrustClip better for you. If you ever have any feedback, feature requests, or need a hand with anything, just hit reply to this email. I personally read and reply to every single message.

Thanks for being a part of us!

Best,
Leonidas,
Founder, TrustClip`;
}

function buildWelcomeEmailHtml(firstName?: string | null) {
  const paragraphs = buildWelcomeEmailText(firstName).split("\n\n");

  const body = paragraphs
    .map((paragraph) => {
      const withBreaks = escapeHtml(paragraph).replace(/\n/g, "<br />");
      return `<p style="margin: 0 0 16px;">${withBreaks}</p>`;
    })
    .join("");

  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; line-height: 1.7; color: #1e1e1e; max-width: 480px;">
      ${body}
    </div>
  `;
}

/**
 * Sends a one-time, personal-feeling welcome email from the founder.
 *
 * The Resend client is constructed lazily (rather than at module scope) so a
 * missing `RESEND_API_KEY` never crashes anything that merely imports this
 * module - e.g. the production build's page-data collection step.
 */
export async function sendWelcomeEmail(to: string, firstName?: string | null) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    // Requires the `trustclip.app` sending domain to be verified in Resend.
    from: FROM_ADDRESS,
    to,
    subject: SUBJECT,
    text: buildWelcomeEmailText(firstName),
    html: buildWelcomeEmailHtml(firstName),
  });

  if (error) {
    throw error;
  }
}
