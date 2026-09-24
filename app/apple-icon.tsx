/**
 * iOS ICON — GC-MARK-02, the monogram, at 180px.
 *
 * The drawn mark (L1-01 §29-0b, 24 Sep 2026) with BR-02 clearspace around
 * it: the mark's own chamfers make it legible at this size without a frame.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR, MARK_CUT, MARK_PATH } from "@/constants/brand-system";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: COLOUR.void }}>
        <svg width="124" height="124" viewBox="0 0 100 100">
          <path fillRule="evenodd" d={MARK_PATH} fill={MARK_COLOUR.onVoid.type} />
          <path d={MARK_CUT} fill={MARK_COLOUR.onVoid.device} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
