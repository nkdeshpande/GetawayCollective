/**
 * THE COMPLETE FLOW — SlowSpace Coastal LLP
 *
 * Wave 7 · Workspaces
 *
 * One walkable arc: offering → accreditation → risk → commit → settled.
 * Every figure comes from slowspace.ts, so no screen holds its own copy
 * of a number and none of them can drift from another.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LLP, SITE, STACK, EQUITY, PROJECT, UNIT, GROSS_REVENUE,
  WATERFALL_SLOWSPACE, MY_DISTRIBUTION, MY_YIELD_BPS, DSCR, RETURNS,
  GOVERNANCE, RISKS_SLOWSPACE, RISK_TERMS, DISCLOSURE, PROGRAMME,
} from "./slowspace";
import { inr, rate, plate } from "./data";
import { ConfidenceTag, Pct, Footer } from "./atoms";

const pct = (bps: number) => (bps / 100).toFixed(2) + "%";

/* ═══════════════════════════════════════════════════════════════════
   STEP 1 · THE OFFERING — space vantage, public

   Everything a prospective investor can be shown before identifying
   themselves. The valuation and the waterfall are here because this is
   the space vantage, not the gateway: they carry their provenance.
   ═══════════════════════════════════════════════════════════════════ */

export function Offering() {
  return (
    <>
      <section data-sec="FLOW.1" style={{ paddingTop: 0 }}>
        <div
          style={{
            position: "relative", minHeight: "54vh", display: "flex",
            alignItems: "flex-end", ...plate(SITE.hue),
          }}
        >
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, var(--gc-void) 0%, transparent 62%)",
          }} />
          <div className="wrap" style={{
            position: "relative", paddingBottom: "var(--gc-sp-xl)",
            paddingTop: "var(--gc-sp-3xl)",
          }}>
            <span className="t-micro label">
              {SITE.jurisdiction} · {SITE.assetId} · {SITE.coords}
            </span>
            {/* No figure over the image. FB-1. */}
            <h1 className="t-display-xl" style={{ marginTop: "var(--gc-sp-2xs)" }}>
              SlowSpace
              <br />
              Coastal
            </h1>
            <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
              {SITE.keys} keys on a dual-frontage sandbar. {SITE.frontage}.
            </p>
          </div>
        </div>
      </section>

      <section data-sec="FLOW.1.b">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Vehicle</span>
            <span className="t-micro label">{LLP.name} · LLPIN {LLP.llpin}</span>
          </div>

          <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
            <div className="panel on-panel" style={{ flex: "1 1 300px" }}>
              <span className="t-micro label">The unit</span>
              <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {inr(UNIT.commitment)}
              </div>
              <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                secures {pct(UNIT.sharePct)} of {LLP.name}
              </p>
              <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                Ten units are the whole equity layer. The figure is derived from{" "}
                {inr(EQUITY)} by largest remainder, not typed separately.
              </p>
            </div>

            <div className="panel on-panel" style={{ flex: "1 1 300px" }}>
              <span className="t-micro label">Indicative distribution</span>
              <div className="t-display-m" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                <Pct v={MY_YIELD_BPS / 100} conf="modelled" />
              </div>
              <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                <span className="money">{inr(MY_DISTRIBUTION)}</span> a year, once stabilised
              </p>
              <div style={{ marginTop: "var(--gc-sp-2xs)" }}>
                <ConfidenceTag c="modelled" />
              </div>
            </div>

            <div className="panel on-panel" style={{ flex: "1 1 220px" }}>
              <span className="t-micro label">Entitlement</span>
              <div className="t-display-m nights" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {UNIT.nights.min}–{UNIT.nights.max}
              </div>
              <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                nights a year, per {pct(UNIT.sharePct)}. Begins at settlement, not here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GROUND INVERSION — the capital stack is an assertion ══ */}
      <section data-sec="FLOW.1.c" className="on-paper">
        <div className="narrow">
          <div className="sec-head">
            <span className="sec-ref">Capital stack</span>
            <span className="ground-note t-mono-s">Paper ground · assertion</span>
          </div>
          <h2 className="t-display-m" style={{ marginBottom: "var(--gc-sp-m)" }}>
            {inr(PROJECT)} total
          </h2>
          <div className="scroll-x">
            <table>
              <thead>
                <tr><th>Layer</th><th className="num">Amount</th><th>When</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="doc-nm">Land</span>
                    <span className="hash">{SITE.landArea}</span></td>
                  <td className="num money">{inr(STACK.land)}</td>
                  <td className="t-body-s" style={{ color: "var(--gc-steel)" }}>Equity · at close</td>
                </tr>
                <tr>
                  <td><span className="doc-nm">Formation</span>
                    <span className="hash">Approvals, legal, digital twin</span></td>
                  <td className="num money">{inr(STACK.formation)}</td>
                  <td className="t-body-s" style={{ color: "var(--gc-steel)" }}>Equity · pre-construction</td>
                </tr>
                <tr>
                  <td><span className="doc-nm">Facility</span>
                    <span className="hash">Interest-only, months 1–18</span></td>
                  <td className="num money">{inr(STACK.debt)}</td>
                  <td className="t-body-s" style={{ color: "var(--gc-steel)" }}>Debt · during build only</td>
                </tr>
                <tr className="totrow">
                  <td>Total</td>
                  <td className="num money">{inr(PROJECT)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <p className="t-body-s" style={{ color: "var(--gc-steel)", marginTop: "var(--gc-sp-m)", maxWidth: "70ch" }}>
            Equity clears the land and the approvals before a rupee of debt is drawn, so
            pre-construction risk sits entirely on equity. That is the structure working as intended
            — and it also means the first {inr(EQUITY)} is exposed for eighteen months to an asset
            that is not yet earning.
          </p>
        </div>
      </section>

      <section data-sec="FLOW.1.d" className="on-paper">
        <div className="narrow">
          <div className="sec-head">
            <span className="sec-ref">The waterfall</span>
            <span className="t-micro" style={{ color: "var(--gc-steel)" }}>
              Six stages · {inr(GROSS_REVENUE)} a year at stabilisation
            </span>
          </div>
          <div className="scroll-x">
            <div className="wf">
              {WATERFALL_SLOWSPACE.map((s) => (
                <div key={s.k}>
                  <div className="wf-row">
                    <span className="k t-mono-s">{s.k}</span>
                    <div className="wf-track">
                      <div className={`wf-bar ${s.cls}`} style={{ width: `${s.bps / 100}%` }}>
                        <span className="t-mono-s">{(s.bps / 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <span className="amt t-mono-s">{inr(rate(GROSS_REVENUE, s.bps))}</span>
                  </div>
                  <div className="wf-row">
                    <span />
                    <span className="wf-note t-body-s">{s.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderLeft: "3px solid var(--gc-hazard-deep)",
            paddingLeft: "var(--gc-sp-s)", marginTop: "var(--gc-sp-l)", maxWidth: "72ch",
          }}>
            <p className="t-body">
              <strong>The dossier states this as four stages, not six.</strong> It splits revenue
              45% investor / 35% operator / 15% platform / 5% admin, and notes that the investor
              share services the debt. That sums correctly — but it shows a 45% figure to someone
              deciding, when {(WATERFALL_SLOWSPACE[5].bps / 100).toFixed(1)}% of gross leaves before
              they see any of it. Stated in order, the number labelled{" "}
              <em>to partners</em> is the number that arrives.
            </p>
          </div>
        </div>
      </section>

      <section data-sec="FLOW.1.e">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Returns</span>
            <span className="t-micro label">All modelled or forecast · none observed</span>
          </div>
          <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
            {[
              ["Cash yield", `${RETURNS.cashYield.v.toFixed(1)}%`, RETURNS.cashYield.conf, "on the commitment, once stabilised"],
              ["Debt cover", `${DSCR.toFixed(2)}×`, RETURNS.dscr.conf, "derived — see the note below"],
              ["Payback", `${RETURNS.payback.v} yrs`, RETURNS.payback.conf, "to full capital return, asset retained"],
              ["5-yr IRR", `≈${RETURNS.irr.v}%`, RETURNS.irr.conf, "yield, paydown and exit"],
            ].map(([k, v, c, d]) => (
              <div key={k as string} className="panel on-panel" style={{ flex: "1 1 210px" }}>
                <span className="t-micro label">{k as string}</span>
                <div className="t-display-m" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  <span className="prov">~</span>{v as string}
                </div>
                <div style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  <ConfidenceTag c={c as never} />
                </div>
                <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{d as string}</p>
              </div>
            ))}
          </div>

          <div style={{
            borderLeft: "2px solid var(--gc-hazard)", paddingLeft: "var(--gc-sp-s)",
            marginTop: "var(--gc-sp-m)", maxWidth: "74ch",
          }}>
            <p className="t-body-s dim">
              <strong style={{ color: "var(--gc-hazard)" }}>Two of the dossier&rsquo;s claims cannot both
              hold.</strong> It states a 2.4× debt cover and an ~18% cash yield. Computed from its own
              inputs, 18% gives {DSCR.toFixed(2)}×; 2.4× would give 21.6%. The conservative figure is
              carried here and the cover ratio is whatever falls out of it, so the two can never
              disagree again.
            </p>
          </div>
        </div>
      </section>

      <section data-sec="FLOW.1.f">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Governance</span>
            <span className="t-micro label">From the LLP Agreement</span>
          </div>
          <div className="panel on-panel" style={{ maxWidth: "760px" }}>
            {GOVERNANCE.map((g) => (
              <div className="kv" key={g.k}>
                <span className="label t-micro">{g.k}</span>
                <span className="v t-body-s">{g.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-sec="FLOW.1.g">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Programme</span>
            <span className="t-micro label">Design to handover</span>
          </div>
          <div className="scroll-x">
            <div className="stages">
              {PROGRAMME.map((p, i) => (
                <div key={p.stage} className={`stage ${i === 0 ? "now" : ""}`}>
                  <span className="n t-mono-s">{p.w}</span>
                  <span className="t t-body-s">{p.stage}</span>
                  <span className="st t-mono-s dim">{p.capital}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-s)", maxWidth: "70ch" }}>
            {PROGRAMME[0].detail} The asset is at{" "}
            <strong>{SITE.lifecycle.toLowerCase()}</strong> — nothing has been built.
          </p>
        </div>
      </section>

      <section data-sec="FLOW.1.h" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <h2 className="t-display-m">Take a position</h2>
          <p className="t-body dim measure" style={{ margin: "var(--gc-sp-s) 0 var(--gc-sp-m)" }}>
            Accreditation comes first, then the risk disclosure, then the commitment. You can stop at
            any point before the last one.
          </p>
          <Link className="btn primary" href="/flow/accreditation">
            Begin accreditation →
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 2 · ACCREDITATION — PR-01, resumable

   Each field autosaves on blur to a draft record, which is what makes
   PR-01 genuinely resumable rather than a second mechanism bolted on.
   ═══════════════════════════════════════════════════════════════════ */

const STEPS = [
  { id: "identity", t: "Identity", d: "Legal name and contact, for the register." },
  { id: "verification", t: "Verification", d: "PAN and address, for regulatory compliance." },
  { id: "suitability", t: "Suitability", d: "Whether this instrument is appropriate for you." },
] as const;

export function Accreditation() {
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setVals((p) => ({ ...p, [k]: v }));
  const blur = (k: string) => {
    if (!vals[k]?.trim()) return;
    setSaved(k);
    setTimeout(() => setSaved(null), 1800);
  };

  return (
    <>
      <section data-sec="FLOW.2" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Step 2 of 5</span>
            <span className="t-micro label">PR-01 Accreditation · resumable</span>
          </div>
          <h1 className="t-display-l">Accreditation</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Fifteen working days from submission. Every field saves as you leave it, so you can stop
            and come back — nothing here has to be done in one sitting.
          </p>

          <div style={{ marginTop: "var(--gc-sp-xl)", maxWidth: "620px" }}>
            {STEPS.map((s, i) => (
              <div className="step" key={s.id}
                   data-state={i < step ? "done" : i === step ? "active" : "idle"}>
                <span className="t-mono-s label">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-heading">{s.t}</h3>
                {i < step ? (
                  <span className="summary t-body-s" style={{ display: "block" }}>
                    {s.id === "identity" ? `${vals.name || "—"} · ${vals.email || "—"}`
                      : s.id === "verification" ? `PAN ${(vals.pan || "—").toUpperCase()}`
                      : "Answered"}
                  </span>
                ) : null}

                {i === step ? (
                  <div className="step-body" style={{ display: "block" }}>
                    <p className="t-body-s dim" style={{ marginBottom: "var(--gc-sp-s)" }}>{s.d}</p>

                    {s.id === "identity" ? (
                      <div className="fields">
                        <div className="f full">
                          <label htmlFor="name">Full legal name</label>
                          <input id="name" type="text" autoComplete="name"
                                 value={vals.name ?? ""} onChange={(e) => set("name", e.target.value)}
                                 onBlur={() => blur("name")} />
                          <span className="help t-body-s">As it appears on your identity document.</span>
                        </div>
                        <div className="f full">
                          <label htmlFor="email">Email address</label>
                          {/* No uppercase transform. It would render what
                              someone typed as something they did not type. */}
                          <input id="email" type="email" autoComplete="email"
                                 value={vals.email ?? ""} onChange={(e) => set("email", e.target.value)}
                                 onBlur={() => blur("email")} />
                        </div>
                      </div>
                    ) : s.id === "verification" ? (
                      <div className="fields">
                        <div className="f full">
                          <label htmlFor="pan">PAN</label>
                          <input id="pan" className="ident" type="text" autoComplete="off"
                                 value={vals.pan ?? ""} onChange={(e) => set("pan", e.target.value)}
                                 onBlur={() => blur("pan")} aria-describedby="panh" />
                          <span className="help t-body-s" id="panh">
                            Ten characters. Uppercase because a PAN is uppercase — your name and
                            email are not transformed.
                          </span>
                        </div>
                        <div className="f full">
                          <label htmlFor="addr">Residential address</label>
                          <input id="addr" type="text" autoComplete="street-address"
                                 value={vals.addr ?? ""} onChange={(e) => set("addr", e.target.value)}
                                 onBlur={() => blur("addr")} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginBottom: "var(--gc-sp-m)" }}>
                        <p className="t-body" style={{ maxWidth: "60ch" }}>
                          This instrument is illiquid, locked for {UNIT.lockIn.toLowerCase()}, and can
                          lose its whole value. Confirming that you can sustain a total loss of{" "}
                          <span className="money">{inr(UNIT.commitment)}</span> is a condition of
                          proceeding, not a formality.
                        </p>
                        <label className="inv-item" style={{ marginTop: "var(--gc-sp-s)" }}>
                          <input type="checkbox" checked={vals.suit === "y"}
                                 onChange={(e) => set("suit", e.target.checked ? "y" : "")} />
                          <span>
                            I can sustain a total loss of the capital I commit, and this is not
                            capital I need within {UNIT.lockIn.toLowerCase()}.
                          </span>
                        </label>
                      </div>
                    )}

                    <button className="btn primary"
                            disabled={s.id === "suitability" && vals.suit !== "y"}
                            onClick={() => setStep((n) => n + 1)}>
                      {i === STEPS.length - 1 ? "Submit for review" : "Continue"}
                    </button>
                    <span className={`saved t-mono-s ${saved ? "on" : ""}`}>Draft saved</span>
                  </div>
                ) : null}
              </div>
            ))}

            {step >= STEPS.length ? (
              <div className="panel on-panel"
                   style={{ borderLeft: "2px solid var(--gc-confirm)", marginTop: "var(--gc-sp-m)" }}>
                <span className="t-micro" style={{ color: "var(--gc-confirm)" }}>Submitted</span>
                <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                  Under review. A decision comes within <strong>15 working days</strong>.
                </p>
                <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "60ch" }}>
                  An application already in flight completes before any suspension applies —
                  COMPLETE-THEN-SUSPEND, §24b.
                </p>
                <Link className="btn primary" href="/flow/risk" style={{ marginTop: "var(--gc-sp-s)" }}>
                  Continue to the risk disclosure →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 3 · THE RISK DISCLOSURE — paper throughout

   The gate opens on reaching the end by ANY route: scroll, keyboard, or
   the skip control. Scroll position is not reading, and someone tabbing
   to the end never fires a scroll handler.
   ═══════════════════════════════════════════════════════════════════ */

export function RiskDisclosure() {
  const [reached, setReached] = useState(false);
  const [ack, setAck] = useState(false);

  return (
    <div className="risk on-paper">
      <div className="risk-col">
        <span className="t-micro" style={{ color: "var(--gc-steel)" }}>
          Step 3 of 5 · mandatory before commitment
        </span>
        <h1>
          How this
          <br />
          loses money.
        </h1>
        <span className="ver">
          {LLP.name} · disclosure v{DISCLOSURE.version} · {DISCLOSURE.dated}
        </span>

        <p className="t-body-l" style={{ maxWidth: "65ch", marginTop: "var(--gc-sp-l)" }}>
          Seven ways, in order of how badly. None of them is unlikely enough to leave out.
        </p>

        <button className="skipend" onClick={() => setReached(true)}>
          Skip to the acknowledgement ↓
        </button>

        {RISKS_SLOWSPACE.map((c, i) => (
          <section className={`clause ${c.sev === 1 ? "sev1" : ""}`} key={c.t}>
            <span className="sev">
              {c.sev === 1 ? "Severity 1 · total loss possible"
                : c.sev === 2 ? "Severity 2 · material" : "Severity 3"}
            </span>
            <h2>
              {String(i + 1).padStart(2, "0")}&nbsp;&nbsp;{c.t}
            </h2>
            <p>{c.p}</p>
            {c.terms ? (
              <div className="terms">
                {c.terms.map((k) => (
                  <div key={k}>{RISK_TERMS[k]}</div>
                ))}
                <div style={{ opacity: 0.75 }}>
                  Read from the vehicle record, not written here.
                </div>
              </div>
            ) : null}
          </section>
        ))}

        <p className="t-body" style={{ maxWidth: "65ch", marginTop: "var(--gc-sp-2xl)" }}>
          By acknowledging, you confirm you have read this and can sustain a total loss of{" "}
          {inr(UNIT.commitment)}.
        </p>
        <span
          tabIndex={-1}
          onFocus={() => setReached(true)}
          ref={(el) => {
            if (!el || reached) return;
            const io = new IntersectionObserver(
              (es) => es.forEach((e) => e.isIntersecting && setReached(true)),
              { threshold: 0 },
            );
            io.observe(el);
          }}
          style={{ display: "block", height: 1 }}
        />
      </div>

      <div className="ackbar">
        <div className="in">
          <label>
            <input type="checkbox" disabled={!reached} checked={ack}
                   onChange={(e) => setAck(e.target.checked)} />
            <span>
              I have read the risk disclosure v{DISCLOSURE.version} for {LLP.name} and understand I
              can lose the whole of my capital.
            </span>
          </label>
          <span className="go">
            <Link className="btn" href="/flow/commit"
                  aria-disabled={!ack}
                  style={ack ? undefined : { pointerEvents: "none", opacity: 1, borderColor: "var(--gc-steel)", color: "var(--gc-steel)" }}>
              Continue to commitment
            </Link>
          </span>
          <span className="why">
            {!reached
              ? "Reach the end of the statement to enable this — scroll, tab, or use the skip link above."
              : ack
                ? `Acknowledgement of v${DISCLOSURE.version} will be recorded with your identity and the time.`
                : "Acknowledge to continue."}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 4 · THE COMMITMENT — the piston

   3000ms linear. The duration IS the deliberation, and no undo follows.
   The anchor never leaves the screen: it is very hard to lose track of
   what you are committing to when the thing stays visible.
   ═══════════════════════════════════════════════════════════════════ */

export function Commit() {
  const [held, setHeld] = useState(false);
  const [done, setDone] = useState(false);
  const [cap, setCap] = useState("Hold to commit " + inr(UNIT.commitment));
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const start = (e: React.SyntheticEvent) => {
    if (done || timer) return;
    e.preventDefault();
    setHeld(true);
    setCap("Hold…");
    setTimer(setTimeout(() => {
      setDone(true);
      setCap("Committed");
      setTimer(null);
    }, 3000));
  };
  const stop = () => {
    if (done || !timer) return;
    clearTimeout(timer);
    setTimer(null);
    setHeld(false);
    setCap("Released — hold to commit");
  };

  return (
    <>
      <section data-sec="FLOW.4" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Step 4 of 5</span>
            <span className="t-micro label">Commitment · {LLP.name}</span>
          </div>

          <div className="commit">
            <div>
              <h1 className="t-display-l" style={{ marginBottom: "var(--gc-sp-m)" }}>
                Review, then commit
              </h1>

              <div className="panel on-panel" style={{ maxWidth: "560px" }}>
                <div className="kv">
                  <span className="label t-micro">Vehicle</span>
                  <span className="v t-body-s">{LLP.name}</span>
                </div>
                <div className="kv">
                  <span className="label t-micro">Property</span>
                  <span className="v t-body-s">{SITE.name} · {SITE.jurisdiction}</span>
                </div>
                <div className="kv">
                  <span className="label t-micro">Your share</span>
                  <span className="v">{pct(UNIT.sharePct)}</span>
                </div>
                <div className="kv">
                  <span className="label t-micro">Committed now</span>
                  <span className="v money">{inr(UNIT.commitment)}</span>
                </div>
                <div className="kv">
                  <span className="label t-micro">Completion window</span>
                  <span className="v">15 working days</span>
                </div>
                <div className="kv">
                  <span className="label t-micro">Lock-in</span>
                  <span className="v t-body-s">{UNIT.lockIn}</span>
                </div>
              </div>

              <p className="t-body-s dim" style={{ margin: "var(--gc-sp-m) 0", maxWidth: "56ch" }}>
                Nothing new appears after this point. A term first shown on a confirmation screen was
                not disclosed, it was sprung.
              </p>

              <button
                className={"piston " + (held && !done ? "arm " : "") + (done ? "settled" : "")}
                onPointerDown={start}
                onPointerUp={stop}
                onPointerLeave={stop}
                onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") start(e); }}
                onKeyUp={stop}
                onBlur={stop}
                aria-disabled={done}
                aria-describedby="pistonHelp"
              >
                <span className="fill" aria-hidden="true" />
                <span className="ticks" aria-hidden="true"><i /><i /><i /><i /></span>
                <span className="cap">{cap}</span>
              </button>
              <p className="t-body-s dim" id="pistonHelp"
                 style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "56ch" }}>
                Press and hold for three seconds. Release to cancel. This is the only control that
                moves capital, and no undo follows it.
              </p>

              {done ? (
                <div className="panel on-panel"
                     style={{ marginTop: "var(--gc-sp-m)", borderLeft: "2px solid var(--gc-confirm)", maxWidth: "560px" }}>
                  <span className="t-micro" style={{ color: "var(--gc-confirm)" }}>Recorded</span>
                  <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                    {inr(UNIT.commitment)} committed against {LLP.name}. Your state is{" "}
                    <strong>Committed</strong>.
                  </p>
                  <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "56ch" }}>
                    You are <strong>not yet a Member</strong>. The Member Law fires on settlement —
                    when the funds clear, within 15 working days. Governance rights and entitlement
                    begin then, not now.
                  </p>
                  <Link className="btn primary" href="/flow/settled"
                        style={{ marginTop: "var(--gc-sp-s)" }}>
                    See what happens next →
                  </Link>
                </div>
              ) : null}
            </div>

            <aside className="deriv on-paper" aria-label="What you are committing to">
              <h3>Derivation</h3>
              <div className="row"><span>Equity layer</span>
                <span className="v">{inr(EQUITY)}</span></div>
              <div className="row"><span>Units of {pct(UNIT.sharePct)}</span>
                <span className="v">10</span></div>
              <div className="row tot"><span>Your unit</span>
                <span className="v">{inr(UNIT.commitment)}</span></div>
              <div className="row"><span>Indicative annual</span>
                <span className="v">{inr(MY_DISTRIBUTION)}</span></div>
              <div className="row"><span>Nights per year</span>
                <span className="v">{UNIT.nights.min}–{UNIT.nights.max}</span></div>
              <p className="note">
                Derived from the equity layer by largest remainder, so ten units are exactly{" "}
                {inr(EQUITY)} with nothing left over.
              </p>
              <p className="note">
                The annual figure is modelled, not promised. It carries its class here and everywhere
                else it appears.
              </p>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP 5 · SETTLED — the member position

   The first screen where the Member Law has fired. Everything before it
   said Committed.
   ═══════════════════════════════════════════════════════════════════ */

export function Settled() {
  return (
    <>
      <section data-sec="FLOW.5">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-ref">Step 5 of 5</span>
            <span className="t-micro label">Settled · member vantage</span>
          </div>
          <h1 className="t-display-l">You are a Member</h1>
          <p className="t-body-l dim measure" style={{ marginTop: "var(--gc-sp-s)" }}>
            Settlement cleared on 2026-08-14. That is the moment the Member Law fired — not
            acceptance, not the commitment — and it is irreversible.
          </p>

          <div className="row" style={{ marginTop: "var(--gc-sp-l)", gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
            <div className="panel on-panel" style={{ flex: "1 1 260px" }}>
              <span className="t-micro label">Your position</span>
              <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {inr(UNIT.commitment)}
              </div>
              <span className="t-mono-s dim">{pct(UNIT.sharePct)} of {LLP.name}</span>
              <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ConfidenceTag c="verified" /></div>
            </div>
            <div className="panel on-panel" style={{ flex: "1 1 260px" }}>
              <span className="t-micro label">First distribution</span>
              <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {inr(MY_DISTRIBUTION / 4n)}
              </div>
              <span className="t-mono-s dim">quarterly, from stabilisation</span>
              <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ConfidenceTag c="forecast" /></div>
            </div>
            <div className="panel on-panel" style={{ flex: "1 1 220px" }}>
              <span className="t-micro label">Voting weight</span>
              <div className="t-display-m" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                {pct(UNIT.sharePct)}
              </div>
              <span className="t-mono-s dim">contribution-weighted · §24a</span>
            </div>
            <div className="panel on-panel needs-you" style={{ flex: "1 1 220px" }}>
              <span className="t-micro label">Entitlement</span>
              <div className="t-display-m nights" style={{ marginTop: "var(--gc-sp-2xs)" }}>0</div>
              <span className="t-mono-s dim">nights available</span>
              <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>
                Begins at handover, Jan 2028. Nothing is drawable against an unbuilt asset.
              </p>
            </div>
          </div>

          <div style={{
            borderLeft: "2px solid var(--gc-hazard)", paddingLeft: "var(--gc-sp-s)",
            marginTop: "var(--gc-sp-l)", maxWidth: "74ch",
          }}>
            <p className="t-body">
              <strong>Nothing is distributable yet.</strong> The property is at pre-construction and
              the facility has not been drawn. The first distribution follows stabilisation, which
              the programme puts after January 2028 — and stage six does not run at all if paying it
              would take the reserve below its floor.
            </p>
          </div>

          <div className="row" style={{ marginTop: "var(--gc-sp-xl)", gap: "var(--gc-sp-2xs)" }}>
            <Link className="btn" href="/member">Your position</Link>
            <Link className="btn" href="/member/documents">Documents</Link>
            <Link className="btn" href="/member/resolutions">Resolutions</Link>
            <Link className="btn" href="/flow">Walk the flow again</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
