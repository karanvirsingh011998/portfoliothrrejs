import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon — KS monogram for Karanvir Singh.
 */
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
          background: "#04070f",
          borderRadius: 6,
          border: "1.5px solid #3dd6c6",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#3dd6c6",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          KS
        </span>
      </div>
    ),
    { ...size }
  );
}
