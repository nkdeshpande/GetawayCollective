/**
 * iOS ICON — GC-MARK-02, at the size Apple asks for.
 *
 * Same mark and the same stated limitation as app/icon.tsx: Satori has no
 * Outfit binary, so the letterforms are its default sans while the geometry
 * and the copper are exact. It rendered "GC" in Georgia bold until
 * 20 Sep 2026.
 *
 * At 180px the frame gets the full BR-02 clearspace around the type, which
 * the 32px favicon cannot fit.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR, clearspacePx } from "@/constants/brand-system";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const TYPE_PX = 76;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10,
          background: COLOUR.void,
          border: `2px solid ${MARK_COLOUR.onVoid.type}`,
          padding: clearspacePx(TYPE_PX) / 2,
        }}
      >
        <span style={{ fontWeight: 200, fontSize: TYPE_PX, letterSpacing: 2, color: MARK_COLOUR.onVoid.type }}>
          GC
        </span>
        <div style={{ width: 13, height: 13, background: MARK_COLOUR.onVoid.device }} />
      </div>
    ),
    { ...size },
  );
}
