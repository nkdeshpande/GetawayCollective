/** Same monogram as app/icon.tsx, at the size iOS asks for. */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center",
          background: COLOUR.void,
        }}
      >
        <span
          style={{
            fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 96,
            color: COLOUR.copper, letterSpacing: "-4px",
          }}
        >
          GC
        </span>
      </div>
    ),
    { ...size },
  );
}
