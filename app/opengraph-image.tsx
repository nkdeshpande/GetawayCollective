/**
 * DEFAULT SHARE IMAGE — generated, not photographed.
 *
 * No property photography exists yet (see content/gateway.ts — every
 * gallery frame is a labelled drawing, not a photograph). Rather than
 * ship a stock image or an invented render as the public face of every
 * shared link, this generates a plain type-only card in the platform's
 * own tokens. It is honest about being a placeholder and it is correct
 * at the pixel dimensions social platforms actually crop to.
 *
 * A page-specific og-image.tsx anywhere under app/ overrides this one
 * automatically — Next.js resolves the nearest file in the segment.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Getaway Collective";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", background: COLOUR.void, padding: "80px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Georgia, serif", fontSize: 22, letterSpacing: 6,
                       textTransform: "uppercase", color: COLOUR.steelDim }}>
          Getaway Collective
        </div>
        {/* width, not maxWidth in "ch" — Satori's subset of CSS does not
            resolve the ch unit inside a column flex item the way a real
            browser does, and the headline wrapped one word per line. A
            pixel width on a flex item with wrap enabled behaves exactly
            like a browser's would; found by rendering the actual PNG,
            not by reading the JSX. */}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 28, fontFamily: "Georgia, serif",
                       fontWeight: 700, fontSize: 64, lineHeight: 1.15, color: COLOUR.inkInverse,
                       width: 760 }}>
          We do not sell holidays.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontFamily: "Georgia, serif", fontSize: 22,
                       color: COLOUR.copper, letterSpacing: 1 }}>
          Capital is at risk.
        </div>
      </div>
    ),
    { ...size },
  );
}
