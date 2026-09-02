import { ImageResponse } from "next/og";

export const alt = "TrustClip | Effortless Video Testimonials";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: "#020617",
          backgroundImage:
            "linear-gradient(135deg, #020617 0%, #0b1120 45%, #1e1b4b 100%)",
        }}
      >
        {/* Soft glow accents, matching the app's premium dark aesthetic */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: 9999,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 70%)",
          }}
        />

        {/* Stylized "T" logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 128,
            height: 128,
            borderRadius: 32,
            backgroundImage: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
            boxShadow: "0 30px 60px -20px rgba(79, 70, 229, 0.65)",
            marginBottom: 44,
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            T
          </span>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "#f8fafc",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          TrustClip
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 34,
            fontWeight: 500,
            color: "#94a3b8",
            letterSpacing: "-0.01em",
          }}
        >
          Effortless Video Testimonials
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
