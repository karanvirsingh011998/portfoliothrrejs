import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — KS monogram.
 */
export default function AppleIcon() {
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
          borderRadius: 36,
          border: "6px solid #3dd6c6",
        }}
      >
        <span
          style={{
            fontSize: 72,
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
