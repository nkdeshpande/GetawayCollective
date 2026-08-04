/**
 * GET /api/brochure/[vehicle] — the one-page brief
 *
 * ── WHY IT IS GENERATED AND NOT A FILE ───────────────────────────────
 * A brochure uploaded once is a snapshot that outlives what it describes.
 * It gets emailed, forwarded and read six months later against a vehicle
 * whose availability, waterfall and site area have all moved — and
 * nothing in the document says how old it is.
 *
 * So this is rendered from constants/vehicles.ts and constants/spatial.ts
 * at the moment it is requested. The page and the download read the same
 * records and cannot disagree, and every copy carries the date it was
 * produced.
 *
 * ── IT CARRIES THE RECONCILIATION NOTES ──────────────────────────────
 * This is the part that matters. A brochure is the document most likely
 * to be read away from the platform, by somebody who will never see the
 * conflict register — so a vehicle that fails `publishable()` produces a
 * brief that states what is unsettled and omits every financial figure,
 * exactly as the page does.
 *
 * A downloadable document that quietly looked more confident than the
 * website would be the worst artefact this platform could emit.
 *
 * ── HTML, DELIBERATELY ───────────────────────────────────────────────
 * It prints to PDF from any browser and needs no dependency. A PDF
 * library would be a third-party renderer between the registry and the
 * reader, and there is nothing here that needs one.
 */

import { publishable, waterfallState, VEHICLES } from "@/constants/vehicles";
import { estateOf } from "@/constants/spatial";
import { pageFor } from "@/constants/property-page";
import { COLOUR, SPACE } from "@/constants/tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const inr = (n: bigint) => `₹${(Number(n) / 10000).toLocaleString("en-IN")}`;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ vehicle: string }> },
) {
  const { vehicle } = await ctx.params;
  const v = VEHICLES.find((x) => x.slug === vehicle);
  if (!v) return new Response("Not found", { status: 404 });

  const est = estateOf(v.key);
  const page = pageFor(v.key);
  const gate = publishable(v);
  const wf = waterfallState(v.operating.waterfall);
  const at = new Date().toISOString().slice(0, 10);

  const row = (k: string, x: string) =>
    `<tr><th>${esc(k)}</th><td>${esc(x)}</td></tr>`;

  /* Figures only where the vehicle clears its gate — the same rule the
     page applies, for the stronger reason that this travels further. */
  const figures = gate.ok
    ? `<h2>The position</h2><table>
        ${row("Project total", inr(v.stack.projectTotal))}
        ${row("Equity layer", inr(v.offering.totalEquity))}
        ${row("Facility", inr(v.stack.facility))}
        ${row("Unit", inr(v.offering.unitPrice))}
        ${row("Available", `${v.offering.available} of ${v.offering.units}`)}
        ${row("Minimum", `${v.ladder.minimumInvestmentBps / 100}% in ${v.ladder.stepBps / 100}% steps`)}
        ${row("Lock-in", v.offering.lockIn)}
        ${wf.state === "complete"
          ? row("To partners", `${(v.operating.waterfall!.toPartners! / 100).toFixed(2)}% of gross — forecast, not a promise`)
          : ""}
      </table>`
    : `<h2 class="hold">Figures are being reconciled</h2>
       <p>This vehicle's source documents disagree on the points below. No financial figure is
       stated in this brief until they agree.</p>
       <ul>${gate.because.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(v.propertyName)} — Getaway Collective</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  /* Print-first, and every value read from constants/tokens.ts rather
     than typed. This document is served standalone so it cannot use the
     app's CSS variables — but it can use the same scale they are built
     from, which is the part that matters. A brief laid out on its own
     numbers would drift from the platform one revision at a time. */
  body{font:14px/1.55 Georgia,serif;color:${COLOUR.ink};max-width:760px;margin:0 auto;padding:${SPACE.xl} ${SPACE.m}}
  h1{font-size:30px;line-height:1.1;margin:0 0 ${SPACE["3xs"]}}
  h2{font-size:12px;letter-spacing:.14em;text-transform:uppercase;margin:${SPACE.l} 0 ${SPACE["2xs"]};color:${COLOUR.steel}}
  .eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${COLOUR.steel};margin:0}
  .lede{font-size:16px;color:${COLOUR.steel}}
  table{width:100%;border-collapse:collapse;margin-top:${SPACE["3xs"]}}
  th,td{text-align:left;padding:${SPACE["3xs"]} 0;border-bottom:1px solid ${COLOUR.hairline};vertical-align:top}
  th{width:34%;font-weight:400;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${COLOUR.steel}}
  .hold{color:${COLOUR.hazard}}
  footer{margin-top:${SPACE.l};padding-top:${SPACE.xs};border-top:1px solid ${COLOUR.hairline};font-size:11px;color:${COLOUR.steel}}
  @media print{body{padding:0}}
</style></head><body>

<p class="eyebrow">${esc(page?.eyebrow ?? "Getaway Collective")}</p>
<h1>${esc(v.propertyName)}</h1>
<p class="lede">${esc(page?.headline ?? "")}</p>

<h2>The place</h2>
<p>${esc(page?.opening ?? "")}</p>
<table>
  ${row("Where", v.jurisdiction + (est ? ` · ${est.region}` : ""))}
  ${v.coordinates ? row("Coordinates", v.coordinates) : ""}
  ${row("Land", v.landArea)}
  ${row("Keys", String(v.keys))}
  ${est ? row("Climate pack", est.pack) : ""}
  ${est ? row("Ecology", est.ecology) : ""}
  ${est ? row("Landscape held", est.landscapePreserved) : ""}
  ${row("Stage", v.propertyLifecycle)}
</table>

<h2>The vehicle</h2>
<table>
  ${row("Registered name", v.registeredName)}
  ${row("LLPIN", v.llpin ?? "Not yet incorporated")}
  ${row("Registrar", v.registrar)}
  ${row("State", v.lifecycle)}
  ${v.governance
    ? row("Ordinary resolution", `More than ${v.governance.ordinaryBps / 100}%. A tie is not approval.`)
    : row("Governance", "Not yet set for this vehicle")}
  ${v.entitlement
    ? row("Entitlement", `${v.entitlement.nightPoolMin}–${v.entitlement.nightPoolMax} nights a year across the vehicle, from ${v.entitlement.begins}`)
    : row("Entitlement", "Not yet set for this vehicle")}
</table>

${figures}

<h2>What this document is not</h2>
<p>Capital is at risk. This brief is a summary of published records and is not an offer. Any
specific opportunity is governed by its applicable private materials, not by this document.
Nothing here has been appraised: no building exists on this site, so every valuation is a
project cost and every forward figure is a model's output.</p>

<footer>
  Generated ${at} from the Getaway Collective record for ${esc(v.assetCode)}.
  Figures change; regenerate rather than forward an old copy.
</footer>
</body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": `inline; filename="${v.slug}-brief-${at}.html"`,
    },
  });
}
