import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          backgroundImage: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          T
        </span>
      </div>
    ),
    { ...size }
  );
}
