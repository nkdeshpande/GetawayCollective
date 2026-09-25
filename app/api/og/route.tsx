/**
 * A SHARE CARD PER PAGE — /api/og?p=/journal/two-waters
 *
 * 25 Sep 2026. Every public page shared the one brand card, so a Journal
 * entry, an estate and a legal document looked identical in a message
 * thread. This draws the page's own title with the line above it.
 *
 * The text is never read from the URL. `p` only selects a page, and
 * describePath() answers from the site's content; a path the site does not
 * publish gets the plain brand card. Otherwise this would render any words
 * anyone typed onto a card carrying our mark.
 *
 * Same grammar as app/opengraph-image.tsx: the drawn mark, words on the void
 * ground and never on a picture (ruling of 21 Sep 2026), capital at risk.
 */
import { ImageResponse } from "next/og";
import { COLOUR } from "@/constants/tokens";
import { MARK_COLOUR, MARK_CUT, MARK_PATH } from "@/constants/brand-system";
import { describePath } from "@/app/_system/meta";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

export function GET(req: Request) {
  const p = new URL(req.url).searchParams.get("p") ?? "/";
  const d = p.startsWith("/") && p.length <= 200 ? describePath(p) : undefined;
  const title = d?.title ?? "Sensory Retreat, Capital Meets Curation.";
  const kicker = d?.kicker ?? "";
  /* Long titles step down so none runs past three lines. */
  const size = title.length > 70 ? 52 : title.length > 40 ? 62 : 74;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: COLOUR.void, padding: "72px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 100 100">
            <path fillRule="evenodd" d={MARK_PATH} fill={MARK_COLOUR.onVoid.type} />
            <path d={MARK_CUT} fill={MARK_COLOUR.onVoid.device} />
          </svg>
          <div style={{ display: "flex", gap: 10, fontSize: 26, textTransform: "uppercase", letterSpacing: 2, color: COLOUR.inkInverse }}>
            <span style={{ fontWeight: 800 }}>Getaway</span>
            <span style={{ fontWeight: 200, color: COLOUR.steelDim }}>Collective</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {kicker ? <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: COLOUR.steelDim }}>{kicker}</div> : null}
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: size, lineHeight: 1.06, fontWeight: 800, letterSpacing: -1.5, color: COLOUR.inkInverse, width: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: COLOUR.steelDim }}>
          <span>getawaycollective.co</span>
          <span style={{ color: COLOUR.copper }}>Capital is at risk.</span>
        </div>
      </div>
    ),
    { ...SIZE, headers: { "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" } },
  );
}
