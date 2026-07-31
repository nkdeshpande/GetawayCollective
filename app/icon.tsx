/**
 * FAVICON — generated, not sourced.
 *
 * There is no logo file in this repository yet. Rather than fabricate
 * one and call it final, this renders the same "GC" monogram already
 * used as a wordmark in the design references, in the platform's own
 * void/copper tokens. Replace with a designed mark when one exists;
 * until then the tab icon is honest about what it is.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
            fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 20,
            color: COLOUR.copper, letterSpacing: "-1px",
          }}
        >
          GC
        </span>
      </div>
    ),
    { ...size },
  );
}
