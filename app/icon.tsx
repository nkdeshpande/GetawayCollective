/**
 * FAVICON — GC-MARK-02, the monogram.
 *
 * ── WHAT THIS REPLACED ───────────────────────────────────────────────
 * This file used to open "There is no logo file in this repository yet"
 * and then draw "GC" in Georgia, bold — a serif that is not one of the
 * system's four typefaces — as the tab icon of a live investment platform.
 * The iOS icon and every share card did the same. Honest about being a
 * placeholder, and still the most-seen brand surface in the product.
 *
 * Now it renders the ratified monogram: BR-03 geometry (1px stroke, square
 * frame, no fill, no two-tone) carrying the BR-01 copper square.
 *
 * ── THE LIMITATION, STATED ───────────────────────────────────────────
 * Satori cannot use Outfit unless a font binary is shipped and passed to
 * ImageResponse, and none is. So the letterforms here are Satori's default
 * sans, not Outfit 200 — the mark's identity is carried by the geometry and
 * the copper, which do render exactly. A sans fallback is the near miss
 * Georgia never was. Closing it properly means shipping the Outfit binary;
 * until then this file says which part of the mark is approximate.
 *
 * Colours are inline because there is no CSS cascade inside Satori, so
 * `.on-paper` cannot re-point --gc-copper here. This icon always stands on
 * void, so MARK_COLOUR.onVoid is the correct pair.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR } from "@/constants/brand-system";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 2,
          background: COLOUR.void,
          border: `1px solid ${MARK_COLOUR.onVoid.type}`,
        }}
      >
        <span style={{ fontWeight: 200, fontSize: 15, letterSpacing: 0.4, color: MARK_COLOUR.onVoid.type }}>
          GC
        </span>
        {/* GC-MARK-03 · the device. Square, because RADIUS.none is invariant. */}
        <div style={{ width: 3, height: 3, background: MARK_COLOUR.onVoid.device }} />
      </div>
    ),
    { ...size },
  );
}
