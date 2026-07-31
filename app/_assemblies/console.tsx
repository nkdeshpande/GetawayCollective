/**
 * AS-31 · THE VEHICLE CONSOLE
 *
 * Wave 7 · Workspaces
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * The settled screen ended in four loose links — Your position,
 * Documents, Resolutions, Walk the flow again — sitting side by side as
 * if they were peers. They are not. Three are views of ONE vehicle and
 * the fourth restarts a demonstration, and rendering them as a row of
 * buttons said the opposite.
 *
 * Worse, each one navigated away. A partner checking a resolution then
 * wanting the document it refers to had to go back and out again, and
 * the position they were reading was gone by the time they arrived.
 *
 * This is one module. Every view of a vehicle is a panel inside it,
 * switched in place, and nothing about the vehicle is reached by leaving
 * it. A partner's relationship with a vehicle is continuous, so the
 * surface that carries it should be too.
 *
 * ── THE PANELS ARE TABS, PROPERLY ────────────────────────────────────
 * role="tablist" with roving tabindex and arrow-key movement, which is
 * what someone navigating by keyboard expects from something that looks
 * like this. A row of buttons that changes content without any of that
 * is a tab strip that only works with a pointer.
 */

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  LLP, SITE, UNIT, GOVERNANCE, PROGRAMME,
  DISCLOSURE, DEPOSIT, STACK, PROJECT, EQUITY,
  ALLOCATION, position, MIN_UNIT, type Position as Holding,
} from "./slowspace";
import { inr } from "./data";
import { ConfidenceTag } from "./atoms";

const pct = (bps: number) => (bps / 100).toFixed(2).replace(/\.00$/, "") + "%";

type PanelId = "position" | "entitlement" | "documents" | "resolutions" | "distributions" | "disclosure";

const PANELS: readonly { id: PanelId; label: string; note: string }[] = [
  { id: "position", label: "Position", note: "What you hold, and what it is worth." },
  { id: "entitlement", label: "Entitlement", note: "Nights, and when they begin." },
  { id: "documents", label: "Documents", note: "The instruments that bind." },
  { id: "resolutions", label: "Resolutions", note: "What has been put to partners." },
  { id: "distributions", label: "Distributions", note: "What has been paid, and what has not." },
  { id: "disclosure", label: "Disclosure", note: "The version you acknowledged." },
];

/* ── Panel contents ───────────────────────────────────────────────── */

function Row({ k, v, sub }: { k: string; v: React.ReactNode; sub?: string }) {
  return (
    <div className="kv">
      <span className="label t-micro">{k}</span>
      <span className="v">
        {v}
        {sub ? <span className="t-mono-s dim" style={{ display: "block" }}>{sub}</span> : null}
      </span>
    </div>
  );
}

/**
 * An empty panel says what is absent and WHY, and when it will not be.
 *
 * A panel that renders nothing reads as a page that failed to load. A
 * panel that renders a zero reads as a fact. Neither is true of a vehicle
 * at pre-construction, where the honest answer is "not yet, and here is
 * the date".
 */
function Absent({ what, because, when }: { what: string; because: string; when: string }) {
  return (
    <div className="panel on-panel" style={{ borderLeft: "2px solid var(--gc-steel)" }}>
      <span className="t-micro label">{what}</span>
      <p className="t-body" style={{ marginTop: "var(--gc-sp-2xs)", maxWidth: "60ch" }}>{because}</p>
      <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-2xs)" }}>{when}</p>
    </div>
  );
}

function PositionPanel({ p }: { p: Holding }) {
  return (
    <>
      <div className="row" style={{ gap: "var(--gc-sp-s)", alignItems: "stretch" }}>
        <div className="panel on-panel" style={{ flex: "1 1 240px" }}>
          <span className="t-micro label">Contributed</span>
          <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            {inr(p.commitment)}
          </div>
          <span className="t-mono-s dim">
            {pct(p.bps)} of {LLP.name} · {p.units} × {inr(MIN_UNIT)}
          </span>
          <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ConfidenceTag c="verified" /></div>
        </div>
        <div className="panel on-panel" style={{ flex: "1 1 240px" }}>
          <span className="t-micro label">Indicative annual distribution</span>
          <div className="t-display-m money" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            {inr(p.distribution)}
          </div>
          <span className="t-mono-s dim">{(p.yieldBps / 100).toFixed(1)}% once stabilised</span>
          <div style={{ marginTop: "var(--gc-sp-2xs)" }}><ConfidenceTag c="modelled" /></div>
        </div>
        <div className="panel on-panel" style={{ flex: "1 1 220px" }}>
          <span className="t-micro label">Voting weight</span>
          <div className="t-display-m" style={{ marginTop: "var(--gc-sp-2xs)" }}>
            {pct(p.bps)}
          </div>
          <span className="t-mono-s dim">contribution-weighted · §24a</span>
        </div>
      </div>

      {/* WHAT THE WEIGHT ACTUALLY BUYS.
          A percentage beside the words "voting weight" tells a partner
          how much they cast and nothing about whether it decides
          anything. These are the same three statements the allocation
          matrix showed before the commitment, from the same function —
          so what was promised at selection is what is stated at rest. */}
      <div className="panel on-panel" style={{ marginTop: "var(--gc-sp-m)", maxWidth: "560px" }}>
        <span className="t-micro label">What this holding can do</span>
        {p.control.map((c) => (
          <div className="kv" key={c.t}>
            <span className="v t-body-s" style={{ textAlign: "left", fontFamily: "inherit" }}>
              {c.t}
            </span>
          </div>
        ))}
      </div>

      <div className="panel on-paper" style={{ marginTop: "var(--gc-sp-m)" }}>
        <span className="t-micro label">The vehicle</span>
        <div style={{ marginTop: "var(--gc-sp-2xs)" }}>
          <Row k="Name" v={<span className="t-body-s">{LLP.name}</span>} />
          <Row k="LLPIN" v={<span className="t-mono-s">{LLP.llpin}</span>} />
          <Row k="Registered office" v={<span className="t-body-s">{LLP.office}</span>} />
          <Row k="Registrar" v={<span className="t-body-s">{LLP.registrar}</span>} />
          <Row k="Property" v={<span className="t-body-s">{SITE.name} · {SITE.jurisdiction}</span>} />
          <Row k="Capital" v={<span className="money">{inr(PROJECT)}</span>}
               sub={`${inr(EQUITY)} equity · ${inr(STACK.debt)} facility`} />
          <Row k="Lock-in" v={<span className="t-body-s">{UNIT.lockIn}</span>} />
        </div>
      </div>
    </>
  );
}

function Entitlement({ p }: { p: Holding }) {
  return (
    <>
      <div className="panel on-panel needs-you" style={{ maxWidth: "420px" }}>
        <span className="t-micro label">Nights available now</span>
        <div className="t-display-m nights" style={{ marginTop: "var(--gc-sp-2xs)" }}>0</div>
        <span className="t-mono-s dim">
          of {p.nights.min}–{p.nights.max} a year, once the property is open
        </span>
      </div>
      <div style={{ marginTop: "var(--gc-sp-m)" }}>
        <Absent
          what="Nothing drawable yet"
          because={
            "Entitlement begins at handover. Nothing is drawable against an unbuilt asset, and a " +
            "figure shown here before then would be a promise rather than a balance."
          }
          when="Handover is programmed for January 2028."
        />
      </div>
    </>
  );
}

function Documents() {
  const DOCS = [
    { n: "LLP Agreement", d: LLP.agreementDated, s: "Executed", w: "Governs everything below." },
    { n: "Incorporation certificate", d: LLP.incorporated, s: "Filed", w: `${LLP.registrar}.` },
    { n: "Hospitality Asset Disclosure", d: DISCLOSURE.dated, s: `v${DISCLOSURE.version}`,
      w: "Acknowledged before commitment." },
    { n: "Subscription record", d: "on settlement", s: "Pending", w: "Issued when funds clear." },
  ];
  return (
    <div className="panel on-paper">
      <div className="scroll-x">
        <table>
          <thead><tr><th>Document</th><th>Dated</th><th>State</th><th>What it does</th></tr></thead>
          <tbody>
            {DOCS.map((d) => (
              <tr key={d.n}>
                <td><span className="doc-nm">{d.n}</span></td>
                <td className="t-mono-s">{d.d}</td>
                <td className="t-mono-s">{d.s}</td>
                <td className="t-body-s">{d.w}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Resolutions() {
  return (
    <>
      <div className="panel on-paper">
        <span className="t-micro label">Thresholds, from the Agreement</span>
        <div style={{ marginTop: "var(--gc-sp-2xs)" }}>
          {GOVERNANCE.map((g) => (
            <Row key={g.k} k={g.k} v={<span className="t-body-s">{g.v}</span>} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: "var(--gc-sp-m)" }}>
        <Absent
          what="No resolution has been put"
          because={
            "Nothing has been put to partners since incorporation. An empty register is the " +
            "correct state for a vehicle at pre-construction, and it is shown as empty rather " +
            "than hidden."
          }
          when="A ballot appears here when one is convened, with its threshold and its close."
        />
      </div>
    </>
  );
}

function Distributions() {
  return (
    <Absent
      what="No distribution has been made"
      because={
        "The property is at pre-construction and the facility has not been drawn. The first " +
        "distribution follows stabilisation, and stage six does not run at all if paying it would " +
        "take the administrative reserve below its floor."
      }
      when="Stabilisation follows handover, programmed for January 2028."
    />
  );
}

function Disclosure() {
  return (
    <>
      <div className="panel on-paper" style={{ maxWidth: "560px" }}>
        <Row k="Document" v={<span className="t-body-s">Hospitality Asset Disclosure</span>} />
        <Row k="Version" v={<span className="t-mono-s">v{DISCLOSURE.version}</span>} />
        <Row k="Dated" v={<span className="t-mono-s">{DISCLOSURE.dated}</span>} />
        <Row k="Acknowledged" v={<span className="t-body-s">Before commitment, against this version</span>} />
        <Row k="Initial deposit" v={<span className="money">{inr(DEPOSIT.amount)}</span>}
             sub={DEPOSIT.refundable} />
      </div>
      <p className="t-body-s dim" style={{ marginTop: "var(--gc-sp-m)", maxWidth: "62ch" }}>
        An acknowledgement is recorded against a version, not against a document. If the disclosure
        is revised, what you acknowledged remains retrievable and is not overwritten by the new one.
      </p>
      <div className="row" style={{ marginTop: "var(--gc-sp-m)", gap: "var(--gc-sp-2xs)" }}>
        <Link className="btn" href="/legal/risk-disclosure">Read the current version</Link>
        <Link className="btn" href="/legal/terms">Terms and Conditions</Link>
      </div>
    </>
  );
}

const RENDER: Record<PanelId, (props: { p: Holding }) => React.ReactElement> = {
  position: PositionPanel,
  entitlement: Entitlement,
  documents: Documents,
  resolutions: Resolutions,
  distributions: Distributions,
  disclosure: Disclosure,
};

/* ── The console ──────────────────────────────────────────────────── */

export function VehicleConsole({
  initial = "position", bps = ALLOCATION.defaultBps,
}: { initial?: PanelId; bps?: number }) {
  const [active, setActive] = useState<PanelId>(initial);
  const held = position(bps);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Arrow keys move between tabs and activate as they go, which is the
     behaviour for a tablist whose panels are cheap to render. Home and
     End jump to the ends. */
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = PANELS.length - 1;
    let to: number | null = null;
    if (e.key === "ArrowRight") to = i === last ? 0 : i + 1;
    else if (e.key === "ArrowLeft") to = i === 0 ? last : i - 1;
    else if (e.key === "Home") to = 0;
    else if (e.key === "End") to = last;
    if (to === null) return;
    e.preventDefault();
    setActive(PANELS[to].id);
    tabs.current[to]?.focus();
  };

  const Panel = RENDER[active];
  const current = PANELS.find((p) => p.id === active)!;

  return (
    <section className="console" data-sec="AS-31" aria-label={`${LLP.name} console`}>
      <div className="console-head">
        <div>
          <span className="t-micro label">Vehicle console</span>
          <h2 className="t-display-s" style={{ marginTop: "var(--gc-sp-3xs)" }}>{LLP.name}</h2>
          <span className="t-mono-s dim">
            LLPIN {LLP.llpin} · {SITE.name} · {SITE.lifecycle}
          </span>
        </div>
        <span className="t-mono-s dim">{pct(held.bps)} held</span>
      </div>

      <div className="console-tabs" role="tablist" aria-label="Vehicle views">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => { tabs.current[i] = el; }}
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={active === p.id}
            aria-controls={`panel-${p.id}`}
            tabIndex={active === p.id ? 0 : -1}
            className={active === p.id ? "on" : ""}
            onClick={() => setActive(p.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="console-panel"
      >
        <p className="t-body-s dim" style={{ marginBottom: "var(--gc-sp-m)" }}>{current.note}</p>
        <Panel p={held} />
      </div>

      <div className="console-foot">
        <span className="t-body-s dim">
          Every view of this vehicle is in this module. Nothing about it is reached by leaving.
        </span>
        <Link className="btn" href={`/flow?share=${held.bps}`}>Walk the flow again</Link>
      </div>
    </section>
  );
}

/** The programme, shown beneath the console on the settled screen. */
export function Programme() {
  return (
    <div className="panel on-paper">
      <span className="t-micro label">Programme</span>
      <div className="scroll-x" style={{ marginTop: "var(--gc-sp-2xs)" }}>
        <table>
          <thead><tr><th>Window</th><th>Stage</th><th>Capital</th><th>Detail</th></tr></thead>
          <tbody>
            {PROGRAMME.map((s) => (
              <tr key={s.w}>
                <td className="t-mono-s">{s.w}</td>
                <td><span className="doc-nm">{s.stage}</span></td>
                <td className="t-body-s">{s.capital}</td>
                <td className="t-body-s">{s.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
