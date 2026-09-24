/**
 * FAVICON — GC-MARK-02, the monogram.
 *
 * Since 24 Sep 2026 (L1-01 §29-0b) the monogram is the drawn mark: the
 * chamfered box with the copper skylight cut through it. It is geometry, so
 * Satori renders it exactly — the letterform approximation this file used to
 * confess (no Outfit binary for Satori) no longer arises, because there are
 * no letters in it.
 *
 * Colours are inline because there is no CSS cascade inside Satori, so
 * `.on-paper` cannot re-point --gc-copper here. This icon always stands on
 * void, so MARK_COLOUR.onVoid is the correct pair.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR, MARK_CUT, MARK_PATH } from "@/constants/brand-system";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: COLOUR.void }}>
        <svg width="28" height="28" viewBox="0 0 100 100">
          <path fillRule="evenodd" d={MARK_PATH} fill={MARK_COLOUR.onVoid.type} />
          <path d={MARK_CUT} fill={MARK_COLOUR.onVoid.device} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
