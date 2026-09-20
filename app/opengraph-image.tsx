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
 *
 * ── BRAND, CORRECTED 20 SEP 2026 ─────────────────────────────────────
 * Every line on this card was set in Georgia — a serif that is not one of
 * the system's four typefaces — and the wordmark carried no copper square.
 * This is the most-shared brand surface in the product, so it was also the
 * most-seen version of a mark the design system does not have.
 *
 * The copy is unchanged. What changed is the face, the wordmark's form
 * (BR-01: uppercase, trailing copper square) and the headline weight, which
 * is now the type scale's ratified display-xl 200 rather than Georgia 700.
 *
 * Satori has no Outfit binary, so the letterforms are its default sans, not
 * Outfit. The geometry and the colours are exact. Shipping the Outfit binary
 * is what closes the gap — app/icon.tsx carries the same note.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR, devicePx } from "@/constants/brand-system";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Getaway Collective";

const MARK_PX = 22;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", background: COLOUR.void, padding: "80px",
        }}
      >
        {/* GC-MARK-01 · the wordmark. The square is the mark, not a flourish. */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <div style={{ display: "flex", fontWeight: 200, fontSize: MARK_PX, letterSpacing: 6,
                        textTransform: "uppercase", color: COLOUR.steelDim }}>
            Getaway Collective
          </div>
          <div style={{ width: devicePx(MARK_PX), height: devicePx(MARK_PX), marginBottom: 4,
                        background: MARK_COLOUR.onVoid.device }} />
        </div>
        {/* width, not maxWidth in "ch" — Satori's subset of CSS does not
            resolve the ch unit inside a column flex item the way a real
            browser does, and the headline wrapped one word per line. A
            pixel width on a flex item with wrap enabled behaves exactly
            like a browser's would; found by rendering the actual PNG,
            not by reading the JSX. */}
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 28,
                       fontWeight: 200, fontSize: 64, lineHeight: 1.15, color: COLOUR.inkInverse,
                       width: 760 }}>
          We do not sell holidays.
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 22,
                       color: COLOUR.copper, letterSpacing: 1 }}>
          Capital is at risk.
        </div>
      </div>
    ),
    { ...size },
  );
}
