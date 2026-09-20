/**
 * The dossier — what the private investor pages say about ONE vehicle.
 *
 * The seven tabs used to carry the same generic sentence for every vehicle,
 * with "Verified record →" beside evidence nobody had attached. This reads
 * the vehicle record instead. Every figure here is derived from
 * constants/vehicles.ts at render; nothing is typed a second time, so a
 * correction to the intake reaches this page without an edit to it.
 *
 * Three rules it keeps, all inherited from the record:
 *  - Absent is absent. A null renders as what is missing and why it matters,
 *    never as zero and never as a plausible substitute.
 *  - A percentage travels with its basis (PUBLIC.02) and its confidence.
 *  - Only a vehicle that passes `publishable()` gets a dossier. The others
 *    keep the generic page, because a dossier is a claim.
 */
import {
  BUILD_LABEL, TENURE_LABEL, WATERFALL_STAGES, publishable, waterfallState,
  type Vehicle,
} from "../../constants/vehicles";

export type DossierKey = "overview" | "asset" | "financials" | "structure" | "risks" | "dataroom" | "commit";

export interface Row {
  readonly label: string;
  readonly value: string;
  /** Where the figure comes from, or what is missing. Always present. */
  readonly basis: string;
}

export interface Section {
  readonly heading: string;
  readonly rows: readonly Row[];
}

export interface Dossier {
  readonly title: string;
  readonly lead: string;
  readonly sections: readonly Section[];
  readonly note: string;
  readonly action: string;
}

/* ── Formatting. Money is bigint at SCALE 4 (lib/money.ts). ─────────── */

const rupees = (v: bigint): number => Number(v / 10000n);
const grouped = (n: number): string => n.toLocaleString("en-IN");

/** ₹6.00 Cr / ₹87.00 L / ₹50,000 — the unit Indian investors read in. */
export function inr(v: bigint): string {
  const n = rupees(v);
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${grouped(n)}`;
}

const pct = (bps: number): string => `${(bps / 100).toFixed(2)}%`;
const NOT_STATED = "Not yet stated";
const SOURCE = "Intake sheet, 4 Aug 2026";

/**
 * The modelled partner yield, by the one convention every vehicle shares:
 * the partners' waterfall share of gross, over the whole equity layer.
 * Null unless the waterfall is complete — a partial one cannot state it.
 */
export function modelledYield(v: Vehicle): { bps: number; partnerShare: bigint } | null {
  const wf = waterfallState(v.operating.waterfall);
  const share = v.operating.waterfall?.toPartners;
  if (wf.state !== "complete" || share == null) return null;
  const partnerShare = (v.operating.grossRevenue * BigInt(share)) / 10000n;
  return { bps: Number((partnerShare * 10000n) / v.offering.totalEquity), partnerShare };
}

const stated = (x: string | null, why: string): { value: string; basis: string } =>
  x === null ? { value: NOT_STATED, basis: why } : { value: x, basis: SOURCE };

/* ── The seven tabs ─────────────────────────────────────────────────── */

export function dossierFor(v: Vehicle, key: DossierKey): Dossier | null {
  if (!publishable(v).ok) return null;
  const o = v.offering;
  const s = v.stack;
  const y = modelledYield(v);

  switch (key) {
    case "overview":
      return {
        title: `${v.propertyName}: ${v.keys} keys, ${v.landArea}.`,
        lead:
          `${v.registeredName} is raising ${inr(o.offered)} in ${o.units} units of ${inr(o.unitPrice)} ` +
          `toward a ${inr(s.equityLayer)} equity layer. The sponsor holds the other ${inr(o.promoter)}. ` +
          `Nothing has been built: the vehicle is ${v.lifecycle} and the property is ${BUILD_LABEL[v.buildStage].toLowerCase()}.`,
        sections: [
          {
            heading: "The offering",
            rows: [
              { label: "Offered to partners", value: inr(o.offered), basis: `${o.units} units × ${inr(o.unitPrice)} · ${SOURCE}` },
              { label: "Units available", value: `${o.available} of ${o.units}`, basis: `${o.subscribed} subscribed · ${SOURCE}` },
              { label: "Sponsor stake", value: inr(o.promoter), basis: "Offered + sponsor = whole equity layer" },
              { label: "Deposit", value: inr(o.deposit), basis: "Its purpose and whether it is refundable are not stated in the record" },
            ],
          },
          {
            heading: "The position today",
            rows: [
              { label: "Land", value: v.tenure ? TENURE_LABEL[v.tenure] : NOT_STATED, basis: v.commitments },
              { label: "Build stage", value: BUILD_LABEL[v.buildStage], basis: SOURCE },
              { label: "Brand", value: "SlowSpace", basis: "Founder, 4 Aug 2026" },
            ],
          },
        ],
        note: "Read the risks before the economics. Nothing on this page creates a commitment.",
        action: "Read the asset",
      };

    case "asset":
      return {
        title: "What the capital stands on.",
        lead:
          `${v.landArea} at ${v.jurisdiction}. Land is held in possession; title, Land Reforms Act and ` +
          `conversion status have not been verified, and this page will not imply otherwise.`,
        sections: [
          {
            heading: "The land",
            rows: [
              { label: "Area", value: v.landArea, basis: SOURCE },
              { label: "Location", value: v.jurisdiction, basis: SOURCE },
              { label: "Coordinates", value: v.coordinates ?? NOT_STATED, basis: `Asset code ${v.assetCode} · ${SOURCE}` },
              { label: "How it is held", value: v.tenure ? TENURE_LABEL[v.tenure] : NOT_STATED, basis: "Diligence complete is a statement about the work done, not about title." },
            ],
          },
          {
            heading: "The building",
            rows: [
              { label: "Keys", value: String(v.keys), basis: SOURCE },
              { label: "Stage", value: BUILD_LABEL[v.buildStage], basis: "Construction is financed by the facility once the equity raise closes." },
              { label: "Night pool", value: `${v.entitlement?.nightPoolMin}–${v.entitlement?.nightPoolMax} nights`, basis: v.entitlement?.begins ?? NOT_STATED },
            ],
          },
        ],
        note: "Title and conversion are the two facts this page cannot yet give you. Ask for them in the dataroom.",
        action: "Read the economics",
      };

    case "financials": {
      const wf = v.operating.waterfall;
      const stageRows: Row[] = wf
        ? WATERFALL_STAGES.map(([k, label]) => ({
            label,
            value: wf[k] === null ? NOT_STATED : pct(wf[k] as number),
            basis: `Share of gross revenue · ${SOURCE}`,
          }))
        : [];
      return {
        title: "Economics, with their basis beside them.",
        lead:
          y
            ? `A modelled ${pct(y.bps)} to partners from year 3 at stabilised occupancy, ${v.operating.yieldBasis}. ` +
              `It is a forecast from a model on an asset that does not exist yet. It is not a promise and it is not a return.`
            : "The waterfall is not complete, so no yield is stated.",
        sections: [
          {
            heading: "The capital stack",
            rows: [
              { label: "Land", value: inr(s.land), basis: SOURCE },
              { label: "Formation and pre-development", value: inr(s.formation), basis: SOURCE },
              { label: "Facility", value: inr(s.facility), basis: `${s.moratorium} · covenant ${s.covenant}` },
              { label: "Equity layer", value: inr(s.equityLayer), basis: "Sponsor plus partners" },
              { label: "Project total", value: inr(s.projectTotal), basis: s.equityLayer + s.facility === s.projectTotal ? "Equity + facility: reconciles" : "Equity + facility: DOES NOT RECONCILE" },
            ],
          },
          {
            heading: "The operating model (forecast)",
            rows: [
              { label: "Average daily rate", value: inr(v.operating.adr), basis: SOURCE },
              { label: "Occupancy", value: pct(v.operating.occupancyBps), basis: "Stabilised · assumption" },
              { label: "Gross revenue", value: inr(v.operating.grossRevenue), basis: "Rate × keys × 365 × occupancy" },
              { label: "Reserve floor", value: v.operating.reserveFloor === null ? NOT_STATED : inr(v.operating.reserveFloor), basis: SOURCE },
            ],
          },
          { heading: "Where each rupee of gross goes", rows: stageRows },
          ...(y
            ? [{
                heading: "The yield",
                rows: [
                  { label: "To partners, per year", value: inr(y.partnerShare), basis: "Stage 6 of the waterfall × gross revenue" },
                  { label: "Modelled yield", value: pct(y.bps), basis: `FORECAST · ${v.operating.yieldBasis}` },
                ],
              }]
            : []),
        ],
        note: "Every figure derives from the intake. If one looks wrong, the intake is what to correct.",
        action: "Read the structure",
      };
    }

    case "structure": {
      const g = v.governance;
      const llpin = stated(v.llpin, "The LLP identification number has not been issued or recorded.");
      const inc = stated(v.incorporated, "Incorporation date not recorded.");
      const agr = stated(v.agreementDated, "The LLP agreement has no recorded date.");
      return {
        title: "What you would legally be joining.",
        lead:
          `${v.registeredName}, registered with ${v.registrar}. ` +
          `${v.llpin === null ? "It has no LLPIN on record yet. " : ""}` +
          `Designated partner: ${g?.designatedPartners ?? NOT_STATED}.`,
        sections: [
          {
            heading: "The vehicle",
            rows: [
              { label: "Registered name", value: v.registeredName, basis: SOURCE },
              { label: "LLPIN", value: llpin.value, basis: llpin.basis },
              { label: "Incorporated", value: inc.value, basis: inc.basis },
              { label: "Agreement dated", value: agr.value, basis: agr.basis },
              { label: "Lifecycle", value: v.lifecycle, basis: "The vehicle's own state" },
            ],
          },
          ...(g
            ? [{
                heading: "How decisions are made",
                rows: [
                  { label: "Ordinary resolution", value: pct(g.ordinaryBps), basis: "Of voting interest" },
                  { label: "Special resolution", value: pct(g.specialBps), basis: "Of voting interest" },
                  { label: "Quorum", value: pct(g.quorumBps), basis: "Of voting interest" },
                  { label: "Reserved matters", value: g.reservedMatters, basis: SOURCE },
                  { label: "Transfer of an interest", value: g.transferRule, basis: SOURCE },
                ],
              }]
            : []),
          {
            heading: "Holding it",
            rows: [
              { label: "Lock-in", value: o.lockIn, basis: SOURCE },
              { label: "Entitlement begins", value: v.entitlement?.begins ?? NOT_STATED, basis: "Programme-dependent" },
            ],
          },
        ],
        note: "The executed LLP agreement governs. This is a summary of the intake, not the instrument.",
        action: "Read the risks",
      };
    }

    case "risks":
      return {
        title: "Start with how this can fail.",
        lead: "Each risk below is read from a field in the record, not from a template. A risk with no field behind it is not listed.",
        sections: [
          {
            heading: "What the record says can go wrong",
            rows: [
              { label: "Title", value: "Unverified", basis: `${v.commitments}` },
              { label: "Nothing is built", value: BUILD_LABEL[v.buildStage], basis: "Construction begins after the equity raise closes; the programme is not locked." },
              { label: "Debt before revenue", value: `${inr(s.facility)} facility`, basis: `${s.moratorium}. Covenant: ${s.covenant}.` },
              { label: "Yield is a forecast", value: y ? pct(y.bps) : NOT_STATED, basis: `FORECAST · ${v.operating.yieldBasis}. No revenue has been observed.` },
              { label: "Your capital is locked", value: o.lockIn, basis: `${v.governance?.transferRule ?? NOT_STATED}` },
              { label: "Sponsor share of equity", value: pct(Number((o.promoter * 10000n) / o.totalEquity)), basis: `Of the equity layer. Ordinary resolutions need ${v.governance ? pct(v.governance.ordinaryBps) : NOT_STATED}, special ${v.governance ? pct(v.governance.specialBps) : NOT_STATED}.` },
              { label: "Not audited", value: v.audited ? "Audited" : "Unaudited", basis: "No audited accounts exist for a vehicle that has not yet traded." },
              { label: "Entitlement has no date", value: v.entitlement?.begins ?? NOT_STATED, basis: "When you can first use the property depends on construction." },
            ],
          },
        ],
        note: "Acknowledging these is recorded against your identity, version and time when that step is connected. It is not connected yet.",
        action: "Open the dataroom",
      };

    case "dataroom":
      return {
        title: "The evidence itself.",
        lead: "No documents are published to the dataroom yet. It says so rather than listing files that are not there.",
        sections: [
          {
            heading: "What exists, and where",
            rows: [
              { label: "Vehicle intake", value: "Held by Getaway Collective", basis: `${SOURCE} · source of every figure in this dossier` },
              { label: "LLP agreement", value: NOT_STATED, basis: "No executed agreement is on record." },
              { label: "Title and conversion documents", value: NOT_STATED, basis: "Title, Land Reforms Act and conversion status are unverified." },
              { label: "Facility term sheet", value: NOT_STATED, basis: `${inr(s.facility)} facility, not yet documented here.` },
            ],
          },
        ],
        note: "Request any of these from Investor Relations. Each will state its custody and version when it is published.",
        action: "Prepare a commitment",
      };

    case "commit":
      return {
        title: "A commitment is prepared, never improvised.",
        lead:
          `${o.available} of ${o.units} units are available at ${inr(o.unitPrice)}. ` +
          `The record states a ${inr(o.deposit)} deposit; what it secures and whether it is refundable are not stated, so ask before paying anything.`,
        sections: [
          {
            heading: "What must be true first",
            rows: [
              { label: "Offering open", value: v.lifecycle === "raising" ? "Yes" : "No", basis: "The vehicle's lifecycle" },
              { label: "Capacity", value: `${o.available} of ${o.units} units`, basis: SOURCE },
              { label: "Your eligibility", value: "Checked in qualification", basis: "Identity, suitability and source of funds" },
              { label: "Instrument and funds", value: "Agree before admission", basis: "The executed instrument and verified funds govern. A payment alone admits no one." },
            ],
          },
        ],
        note: "Nothing on this page creates a commitment or holds a unit.",
        action: "Speak with Investor Relations",
      };
  }
}
