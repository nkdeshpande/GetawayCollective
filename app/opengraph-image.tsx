/**
 * SHARE CARD — GC-MARK-02 beside the line the site opens with.
 *
 * The drawn mark (L1-01 §29-0b, 24 Sep 2026) and one sentence. The name is
 * set in Satori's default sans, because no display binary is passed to it;
 * the mark itself is geometry and renders exactly. Words stand on the void
 * ground, never on a picture (ruling of 21 Sep 2026).
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR, MARK_CUT, MARK_PATH } from "@/constants/brand-system";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Getaway Collective";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: COLOUR.void, padding: "80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="88" height="88" viewBox="0 0 100 100">
            <path fillRule="evenodd" d={MARK_PATH} fill={MARK_COLOUR.onVoid.type} />
            <path d={MARK_CUT} fill={MARK_COLOUR.onVoid.device} />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 40, lineHeight: 1, textTransform: "uppercase", color: COLOUR.inkInverse }}>
            <span style={{ fontWeight: 800 }}>Getaway</span>
            <span style={{ fontWeight: 200, color: COLOUR.steelDim }}>Collective</span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 56, fontSize: 60, lineHeight: 1.12, color: COLOUR.inkInverse, width: 900 }}>
          Sensory Retreat, Capital Meets Curation.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 22, color: COLOUR.copper, letterSpacing: 1 }}>
          Capital is at risk.
        </div>
      </div>
    ),
    { ...size },
  );
}
