/**
 * AS-33 · THE MEMBER SURFACE
 *
 * Wave 8 · Member
 * Source: GC 2.0 Wireframes — MEM.01, MEM.02, MEM.05, MEM.06, MEM.07, MEM.08
 *
 * One renderer for the member surfaces. The copy lives in
 * content/member.ts.
 *
 * ── THE UNDRAFTED BLOCK ──────────────────────────────────────────────
 * A block may declare `undrafted`: a capability the source specifies
 * that is deliberately not built. It renders as a marked panel rather
 * than as body copy, because the whole point is that a reader must not
 * mistake it for something in force. MEM.07's conduct-linked forfeiture
 * is the one that matters — see the note in content/member.ts.
 *
 * ── WHAT IS NOT HERE ─────────────────────────────────────────────────
 * Live telemetry: grid status, sync state, thermal readings, a host
 * presence light. Every property in the collection is at
 * pre-construction or lease-up, so those would be readings from a
 * building that is not sending any. The controls are described and the
 * state says so.
 */

import Link from "next/link";
import { surfaceByPath, POSITION, type MemberSurface, type Block } from "@/content/member";
import { Footer } from "./atoms";

function BlockView({ b }: { b: Block }) {
  const paper = b.ground === "paper";
  return (
    <section data-sec={`AS-33.${b.ref}`} className={paper ? "on-paper" : undefined}>
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-ref">{b.ref}</span>
          <span className="t-micro label">{b.title}</span>
          {paper ? <span className="ground-note t-mono-s">Paper ground · assertion</span> : null}
        </div>

        {b.lede ? <p className="t-body-l dim measure">{b.lede}</p> : null}

        {b.fields ? (
          <div className={paper ? "panel on-paper" : "panel on-panel"}
               style={{ marginTop: "var(--gc-sp-m)", maxWidth: "760px" }}>
            {b.fields.map((f) => (
              <div key={f.k} className="kv">
                <span className="label t-micro">{f.k}</span>
                <span className={f.mono ? "v t-mono-s" : "v t-body-s"}>
                  {f.v}
                  {f.note ? (
                    <span className="t-body-s dim" style={{ display: "block", marginTop: "var(--gc-sp-3xs)" }}>
                      {f.note}
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {(b.body ?? []).map((para, i) => (
          <p key={i} className="t-body measure" style={{ marginTop: "var(--gc-sp-s)" }}>{para}</p>
        ))}

        {/* Marked, never mistaken for body copy. */}
        {b.undrafted ? (
          <div className="panel on-panel"
               style={{ marginTop: "var(--gc-sp-m)", maxWidth: "76ch",
                        borderLeft: "2px solid var(--gc-critical)" }}>
            <span className="t-micro" style={{ color: "var(--gc-critical)" }}>
              Specified, not drafted, not in force
            </span>
            <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>{b.undrafted}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** The position, on every member surface. Read from the vehicle record. */
function PositionStrip() {
  return (
    <section data-sec="AS-33.position">
      <div className="wrap">
        <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
          <div className="panel on-panel" style={{ flex: "1 1 220px" }}>
            <span className="t-micro label">Contributed</span>
            <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              {POSITION.contributed}
            </div>
            <span className="t-mono-s dim">{POSITION.share} of {POSITION.vehicle}</span>
          </div>
          <div className="panel on-panel" style={{ flex: "1 1 220px" }}>
            <span className="t-micro label">Indicative annual</span>
            <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              {POSITION.distribution}
            </div>
            <span className="t-mono-s dim">modelled · nothing distributable yet</span>
          </div>
          <div className="panel on-panel needs-you" style={{ flex: "1 1 220px" }}>
            <span className="t-micro label">Nights available</span>
            <div className="t-display-m nights" style={{ marginTop: "var(--gc-sp-2xs)" }}>0</div>
            <span className="t-mono-s dim">of {POSITION.nights} a year, from handover</span>
          </div>
        </div>
        <p className="t-body-s dim measure" style={{ marginTop: "var(--gc-sp-m)" }}>
          The source dashboard shows a trailing twelve-month yield of 14.8% against this position.
          A property that has never traded has no trailing twelve months, so the modelled figure is
          shown with its class instead.
        </p>
      </div>
    </section>
  );
}

export function MemberSurfaceView({ path }: { path: string }) {
  const s: MemberSurface | undefined = surfaceByPath(path);
  if (!s) return null;

  return (
    <>
      <section data-sec="AS-33.a" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <span className="sec-ref">{s.id} · {s.alias}</span>
          <h1 className="t-display-l" style={{ marginTop: "var(--gc-sp-2xs)" }}>{s.title}</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            {s.standfirst}
          </p>
        </div>
      </section>

      <PositionStrip />

      {s.blocks.map((b) => <BlockView key={b.ref} b={b} />)}

      <section data-sec="AS-33.onward">
        <div className="wrap">
          <span className="t-micro label">Elsewhere</span>
          <div className="row" style={{ marginTop: "var(--gc-sp-s)", gap: "var(--gc-sp-2xs)" }}>
            <Link className="btn" href="/member">Your position</Link>
            <Link className="btn" href="/legal/terms">Terms and Conditions</Link>
            <Link className="btn" href="/legal/risk-disclosure">Asset Disclosure</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export const Passport = () => <MemberSurfaceView path="/member/profile" />;
export const Boardroom = () => <MemberSurfaceView path="/member/resolutions" />;
export const Calibration = () => <MemberSurfaceView path="/member/calibration" />;
export const SignalLog = () => <MemberSurfaceView path="/member/signal" />;
export const Codex = () => <MemberSurfaceView path="/member/codex" />;
export const Pass = () => <MemberSurfaceView path="/member/pass" />;
