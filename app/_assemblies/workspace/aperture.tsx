/**
 * THE APERTURE, DRAWN — one estate record, four openings
 *
 * 24 Sep 2026. constants/apertures.ts has held the rule since Wave 6.5 and
 * nothing rendered it: the same record is shown to the public, an investor,
 * a partner and the Office, and a wider opening may show MORE of it, never a
 * DIFFERENT version of it. This card makes the rule something you can see.
 *
 * Every value is read from constants/vehicles.ts. A field states the
 * narrowest opening it is visible from; a wider opening shows everything a
 * narrower one does, with the same value, plus its own. Nothing is
 * recomputed per opening, so no opening can disagree with another.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CONFLICTS, LIFECYCLE_LABEL, BUILD_LABEL, VEHICLES, WATERFALL_STAGES, publishable, stanceFor, type Vehicle,
} from "@/constants/vehicles";
import { rupees, rupeesFull } from "../site/registry";
import { ApertureMark, OPENINGS, type Opening } from "./frame";

const RANK: Record<Opening, number> = { public: 0, investor: 1, partner: 2, office: 3 };

interface Field { readonly label: string; readonly value: string; readonly from: Opening; readonly tone?: "money" | "warn" }

const pct = (bps: number | null | undefined) => (bps == null ? "Not stated" : `${(bps / 100).toFixed(bps % 100 ? 2 : 0)}%`);

/** Open items on the record for a vehicle: a conflict not yet marked settled. */
export const openItems = (v: Vehicle) => CONFLICTS.filter((c) => c.vehicle === v.key && !/SETTLED/.test(c.what));

/** Raising, subscribed or forming, read from the offering and the lifecycle — a
 *  forming vehicle also resolves to a waitlist, and must not read "subscribed". */
export const stateOf = (v: Vehicle): "open" | "waitlist" | "forming" | "closed" =>
  v.lifecycle === "forming" ? "forming" : stanceFor(v).kind === "open" ? "open" : v.offering.available <= 0 ? "waitlist" : "closed";
const STATE_LABEL = { open: "Raising", waitlist: "Subscribed", forming: "Pipeline", closed: "Not open" } as const;

export function fieldsOf(v: Vehicle): readonly Field[] {
  const o = v.offering, ok = publishable(v).ok, stance = stanceFor(v), items = openItems(v);
  const f: Field[] = [
    { label: "Place", value: v.jurisdiction, from: "public" },
    { label: "Keys", value: String(v.keys), from: "public" },
    { label: "Stage", value: `${LIFECYCLE_LABEL[v.lifecycle]} · ${BUILD_LABEL[v.buildStage].toLowerCase()}`, from: "public" },
    { label: "Offering", value: stance.kind === "open" ? `${stance.unitsAvailable} of ${o.units} units available` : v.lifecycle === "forming" ? "In the pipeline · not yet open for subscription" : o.available <= 0 ? "Fully subscribed · waitlist open" : "Not open", from: "public" },
  ];
  if (ok) {
    f.push(
      { label: "Unit price", value: rupees(o.unitPrice), from: "investor", tone: "money" },
      { label: "Holding deposit", value: o.deposit === null ? "Not stated" : rupeesFull(o.deposit), from: "investor", tone: "money" },
      { label: "Project cost", value: rupees(v.stack.projectTotal), from: "investor", tone: "money" },
      { label: "Bank facility", value: `${rupees(v.stack.facility)} · ${v.stack.covenant}`, from: "investor", tone: "money" },
      { label: "Lock-in", value: o.lockIn, from: "investor" },
    );
  } else {
    f.push({ label: "Figures", value: "Withheld until the record is settled", from: "investor", tone: "warn" });
  }
  f.push(
    { label: "Held by", value: v.registeredName + (v.llpin ? ` · LLPIN ${v.llpin}` : " · LLPIN not yet issued"), from: "partner" },
    { label: "Decisions", value: v.governance ? `Ordinary above ${pct(v.governance.ordinaryBps)} · special at ${pct(v.governance.specialBps)}` : "Thresholds not yet stated", from: "partner" },
    { label: "To partners", value: pct(v.operating.waterfall?.toPartners), from: "partner", tone: "money" },
    { label: "Nights", value: v.entitlement ? `${v.entitlement.nightPoolMin}–${v.entitlement.nightPoolMax} a year, from ${v.entitlement.begins}` : "Allocation rule not yet set", from: "partner" },
    { label: "Waterfall", value: v.operating.waterfall ? WATERFALL_STAGES.map(([k, n]) => `${n.replace(/^\d /, "")} ${pct(v.operating.waterfall![k])}`).join(" · ") : "Not stated", from: "office" },
    { label: "Subscribed", value: `${o.subscribed} of ${o.units} offered · sponsor ${rupees(o.promoter)}`, from: "office", tone: "money" },
    { label: "Open items", value: items.length ? `${items.length} · ${items.filter((c) => c.severity === "blocking").length} blocking` : "None", from: "office", tone: items.length ? "warn" : undefined },
    { label: "Audited", value: v.audited ? "Yes" : "Not yet", from: "office" },
  );
  return f;
}

export function ApertureCard({ v, opening, href }: { v: Vehicle; opening: Opening; href?: string }) {
  const all = fieldsOf(v);
  const shown = all.filter((x) => RANK[x.from] <= RANK[opening]);
  const more = all.length - shown.length;
  return (
    <article className="ws-card ap-card">
      <header>
        <div><span className="eb">{v.assetCode ? v.jurisdiction.split(",")[0] : ""}</span><h3>{v.propertyName}</h3></div>
        <span className={`ap-state s-${stateOf(v)}`}>{STATE_LABEL[stateOf(v)]}</span>
      </header>
      <dl>
        {shown.map((x) => (
          <div key={x.label} className={`ap-f f-${x.from}${x.tone ? ` t-${x.tone}` : ""}`}>
            <dt>{x.label}</dt><dd>{x.value}</dd>
          </div>
        ))}
      </dl>
      <footer>
        {more ? <span>{more} more fields open to a wider view</span> : <span>The whole record</span>}
        {href ? <Link href={href}>Open →</Link> : null}
      </footer>
    </article>
  );
}

/** Every estate, one opening at a time, with the opening chosen by the reader. */
export function ApertureStrip({ start = "office", hrefFor }: { start?: Opening; hrefFor?: (v: Vehicle) => string }) {
  const [opening, setOpening] = useState<Opening>(start);
  const o = OPENINGS.find((x) => x.id === opening)!;
  return (
    <section className="ap">
      <div className="ap-head">
        <div>
          <span className="eb">One record, four openings</span>
          <h2 className="ws-h2">What each person <span>sees of an estate.</span></h2>
          <p>The same record is shown to everyone. A wider opening shows more of it, never a different version of it. Choose who is looking.</p>
        </div>
        <div className="ap-switch" role="radiogroup" aria-label="Who is looking">
          {OPENINGS.map((x) => (
            <button key={x.id} type="button" role="radio" aria-checked={x.id === opening} onClick={() => setOpening(x.id)}>
              <ApertureMark opening={x.id} size={30} /><b>{x.label}</b><span>{x.who}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="ap-now">Seen as <b>{o.label}</b> · {o.who}</p>
      <div className="ap-grid">
        {VEHICLES.map((v) => <ApertureCard key={v.key} v={v} opening={opening} href={hrefFor?.(v)} />)}
      </div>
    </section>
  );
}
