/**
 * WHAT EACH CHAPTER SAYS ABOUT ONE PROPERTY
 *
 * The public half of what `investordossier.ts` does behind the
 * accreditation gate. Same discipline, different audience: every figure is
 * read from `constants/vehicles.ts` at render, every absence says what is
 * missing, and every percentage carries its basis (PUBLIC.02).
 *
 * ── THE GATE IS NOT THE SAME HERE ────────────────────────────────────
 * These pages are public, so `publishable()` decides whether FIGURES may
 * be shown, not whether the page exists. A vehicle that fails it still has
 * a Place, a Life and an Asset — what it does not have is a capital stack
 * on the open web, because a prospective partner could act on that and the
 * record does not yet support it.
 *
 * So a gated chapter renders its narrative and states, in place of the
 * numbers, exactly why the numbers are not there. That is the honest
 * version of a page with figures missing, and it is the opposite of a page
 * that quietly renders zeros.
 */
import {
  BUILD_LABEL, LIFECYCLE_LABEL, TENURE_LABEL, WATERFALL_STAGES,
  conflictsFor, publishable, stanceFor, waterfallState,
  type Vehicle,
} from "../../constants/vehicles";
import type { ChapterId } from "../../constants/property-chapters";
import { estateOf, type KeyType } from "../../constants/spatial";
import { PROPERTY_PAGES } from "../../constants/property-page";
import { inr, modelledYield, type Row } from "./investordossier";

export interface ChapterContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly rows: readonly Row[];
  /** Why figures are absent, when they are. Empty when nothing is withheld. */
  readonly withheld: readonly string[];
  /**
   * The keys themselves, where the spatial ledger states them.
   *
   * Drawn rather than listed. These carry a name, a count, an area and a
   * note, and every one of those was authored and rendered nowhere — a
   * chapter called The Asset that said "Keys: 6" and stopped.
   */
  readonly units?: readonly KeyType[];
  /** Mass, light, protection, access — the architectural intent. */
  readonly intent?: readonly { readonly label: string; readonly text: string }[];
  /** Four materials, each one word and one clause. */
  readonly palette?: readonly { readonly material: string; readonly role: string }[];
}

const NOT_STATED = "Not yet stated";
const SOURCE = "Vehicle register";
const pct = (bps: number): string => `${(bps / 100).toFixed(2)}%`;

/** Rows a gated vehicle does not show, with the gate's own reasons. */
const gatedRows = (v: Vehicle): Row[] => [
  {
    label: "Figures withheld",
    value: "Until the record is settled",
    basis:
      `This vehicle has ${publishable(v).because.length} unsettled item(s) in its register. ` +
      `A figure nobody can stand behind is worse than a figure nobody has published.`,
  },
];

export function chapterContent(v: Vehicle, id: ChapterId): ChapterContent {
  const gate = publishable(v);
  /* The ledger and the authored page, where the vehicle has been joined to
     them. Both are optional and both are tolerated as absent — Wildwood has
     neither yet, and a chapter that needed them would have nothing to say
     about the newest property in the Collection. */
  const estate = estateOf(v.key);
  const units = estate?.keyTypes ?? [];
  const page = PROPERTY_PAGES.find((x) => x.vehicle === v.key);
  const o = v.offering;
  const s = v.stack;
  const stance = stanceFor(v);

  switch (id) {
    case "opportunity":
      return {
        eyebrow: "CHAPTER 00 · OPPORTUNITY",
        title: `${v.propertyName}.`,
        lead:
          `${v.keys} keys on ${v.landArea}, at ${v.jurisdiction}. ` +
          `${LIFECYCLE_LABEL[v.lifecycle]}, ${BUILD_LABEL[v.buildStage].toLowerCase()}.`,
        rows: [
          { label: "Where", value: v.jurisdiction, basis: `Asset ${v.assetCode}` },
          { label: "Keys", value: String(v.keys), basis: SOURCE },
          { label: "Land", value: v.landArea, basis: SOURCE },
          { label: "Status", value: LIFECYCLE_LABEL[v.lifecycle], basis: stance.kind === "open" ? `${o.available} of ${o.units} units remain.` : stance.because },
        ],
        withheld: [],
      };

    case "place":
      return {
        eyebrow: "CHAPTER 01 · THE PLACE",
        title: "The place, before the proposition.",
        lead:
          `${v.landArea} at ${v.jurisdiction}. Read the ground first: what an offering is worth ` +
          `depends on where it stands long before it depends on how it is structured.`,
        rows: [
          { label: "Jurisdiction", value: v.jurisdiction, basis: SOURCE },
          { label: "Coordinates", value: v.coordinates ?? NOT_STATED, basis: v.coordinates ? `Asset ${v.assetCode}` : "No site position on record." },
          { label: "Land", value: v.landArea, basis: SOURCE },
          ...(estate
            ? [
                { label: "Ground", value: estate.ecology, basis: `${estate.region} · ${estate.pack.replace(/_/g, " ").toLowerCase()}` },
                { label: "Kept", value: estate.landscapePreserved, basis: `Of ${estate.siteArea} acres, ${estate.buildableEnvelope} is the buildable envelope.` },
              ]
            : []),
          { label: "Asset code", value: v.assetCode, basis: "The identifier every document uses" },
        ],
        intent: page ? [{ label: "ACCESS", text: page.access }, { label: "PROTECTION", text: page.protection }] : [],
        withheld: [],
      };

    case "life":
      return {
        eyebrow: "CHAPTER 02 · THE LIFE",
        title: "What it is to return here.",
        lead: v.entitlement
          ? `Partners draw on a pool of ${v.entitlement.nightPoolMin}–${v.entitlement.nightPoolMax} nights ` +
            `a year across the ${v.keys} keys. It begins ${v.entitlement.begins.toLowerCase()}.`
          : "No entitlement is recorded for this vehicle yet, so nothing is claimed about time here.",
        rows: v.entitlement
          ? [
              { label: "Night pool", value: `${v.entitlement.nightPoolMin}–${v.entitlement.nightPoolMax} nights a year`, basis: "Shared across the vehicle, not per key" },
              { label: "Reserved days", value: String(v.entitlement.reservedDays), basis: v.entitlement.reservedDays === 0 ? "None held back from the pool" : SOURCE },
              { label: "Begins", value: v.entitlement.begins, basis: "Programme-dependent, and the programme is not locked" },
              { label: "Keys", value: String(v.keys), basis: units.length ? `${units.map((u) => u.name).join(" · ")}` : SOURCE },
            ]
          : [{ label: "Entitlement", value: NOT_STATED, basis: "No night pool, reserved days or start is on record for this vehicle." }],
        units,
        intent: page ? [{ label: "LIGHT", text: page.light }] : [],
        withheld: [],
      };

    case "idea":
      return {
        eyebrow: "CHAPTER 03 · THE IDEA",
        title: "The thesis, before any figure.",
        lead: v.commitments,
        rows: [
          { label: "What is being built", value: `${v.keys} keys`, basis: BUILD_LABEL[v.buildStage] },
          { label: "On", value: v.landArea, basis: v.jurisdiction },
          { label: "Held by", value: v.registeredName, basis: v.llpin ? `LLPIN ${v.llpin}` : "No LLPIN on record yet." },
          { label: "Governance", value: "GC governs, and holds no equity", basis: "Governance Without Ownership — the separation this platform enforces" },
        ],
        withheld: [],
      };

    case "asset":
      return {
        eyebrow: "CHAPTER 04 · THE ASSET",
        title: "What the capital stands on.",
        lead: units.length
          ? `${v.keys} keys in ${units.length} types on ${v.landArea}. Each is drawn below at its ` +
            `true relative area, because nothing is built yet and a drawing with a dimension on it ` +
            `cannot flatter the way a render can.`
          : `${v.landArea} at ${v.jurisdiction}, carrying ${v.keys} keys. ` +
            `${v.tenure ? TENURE_LABEL[v.tenure] : "How the land is held is not stated as a tenure position."}`,
        units,
        intent: [
          ...(page ? [{ label: "MASS", text: page.mass }, { label: "LIGHT", text: page.light }] : []),
          ...(page ? [{ label: "PROTECTION", text: page.protection }] : []),
          ...(estate ? [{ label: "GROUND", text: `${estate.ecology}. ${estate.landscapePreserved} preserved.` }] : []),
        ],
        palette: page?.palette.map((x) => ({ material: x.material, role: x.role })),
        rows: [
          { label: "Land", value: v.landArea, basis: SOURCE },
          { label: "How it is held", value: v.tenure ? TENURE_LABEL[v.tenure] : NOT_STATED, basis: v.commitments },
          { label: "Keys", value: String(v.keys), basis: units.length ? `${units.length} types, drawn above` : SOURCE },
          ...(estate?.footprint
            ? [{ label: "Built area", value: `${estate.footprint.lodgingBuilt.toLocaleString("en-IN")} sq ft`, basis: `Lodging only. Working areas add ${estate.footprint.workingBuilt.toLocaleString("en-IN")} sq ft.` }]
            : []),
          { label: "Build stage", value: BUILD_LABEL[v.buildStage], basis: SOURCE },
          { label: "Audited", value: v.audited ? "Yes" : "No", basis: v.audited ? SOURCE : "No audited accounts exist for a vehicle that has not yet traded." },
        ],
        withheld: [],
      };

    case "ownership": {
      const g = v.governance;
      const l = v.llpCapital;
      return {
        eyebrow: "CHAPTER 05 · OWNERSHIP",
        title: "How participation works.",
        lead:
          `${v.registeredName}. ` +
          (gate.ok
            ? `${o.units} unit${o.units === 1 ? "" : "s"} of ${inr(o.unitPrice)}, and a lock-in of ${o.lockIn.toLowerCase()}.`
            : "The unit structure is not published while the register is unsettled."),
        rows: [
          ...(gate.ok
            ? [
                { label: "Units", value: `${o.units} of ${inr(o.unitPrice)}`, basis: `${inr(o.offered)} offered · ${SOURCE}` },
                { label: "Minimum", value: pct(v.ladder.minimumInvestmentBps), basis: `Step ${pct(v.ladder.stepBps)} · ceiling ${pct(v.ladder.ceilingBps)}` },
                { label: "Sponsor holds", value: pct(Number((o.promoter * 10000n) / o.totalEquity)), basis: `${inr(o.promoter)} of ${inr(o.totalEquity)}` },
              ]
            : gatedRows(v)),
          { label: "Lock-in", value: o.lockIn, basis: SOURCE },
          ...(g
            ? [
                { label: "Ordinary resolution", value: pct(g.ordinaryBps), basis: "Of voting interest — a tie is not approval" },
                { label: "Special resolution", value: pct(g.specialBps), basis: "Of voting interest" },
                { label: "Transfer", value: g.transferRule, basis: SOURCE },
              ]
            : [{ label: "Governance", value: NOT_STATED, basis: "Voting thresholds are not on record for this vehicle." }]),
          ...(l
            ? [{
                label: "Filed capital",
                value: `${inr(l.nominalTotal)} nominal`,
                basis: l.why,
              }]
            : []),
        ],
        withheld: gate.ok ? [] : gate.because,
      };
    }

    case "investment": {
      const wf = v.operating.waterfall;
      const y = modelledYield(v);
      if (!gate.ok) {
        return {
          eyebrow: "CHAPTER 06 · THE INVESTMENT",
          title: "The economics are not published yet.",
          lead:
            "Every figure on this chapter would be one a reader could act on, and the register " +
            "for this vehicle is not settled. It is withheld rather than estimated.",
          rows: gatedRows(v),
          withheld: gate.because,
        };
      }
      return {
        eyebrow: "CHAPTER 06 · THE INVESTMENT",
        title: "Where each rupee of gross goes.",
        lead: y
          ? `A modelled ${pct(y.bps)} to partners, ${v.operating.yieldBasis}. It is a forecast from ` +
            `a model on an asset that does not exist yet — not a promise, and not a return.`
          : "The waterfall is not complete, so no yield is stated.",
        rows: [
          { label: "Project total", value: inr(s.projectTotal), basis: `${inr(s.equityLayer)} equity + ${inr(s.facility)} facility` },
          { label: "Facility", value: inr(s.facility), basis: `${s.moratorium} · ${s.covenant}` },
          { label: "Gross revenue", value: inr(v.operating.grossRevenue), basis: `Rate ${inr(v.operating.adr)} at ${pct(v.operating.occupancyBps)} occupancy — forecast` },
          ...(wf
            ? WATERFALL_STAGES.map(([k, label]) => ({
                label,
                value: wf[k] === null ? NOT_STATED : pct(wf[k] as number),
                basis: "Share of gross revenue",
              }))
            : []),
          ...(y ? [{ label: "Modelled yield", value: pct(y.bps), basis: `FORECAST · ${v.operating.yieldBasis}` }] : []),
        ],
        withheld: [],
      };
    }

    case "risk": {
      const registered = conflictsFor(v.key);
      const wf = waterfallState(v.operating.waterfall);
      return {
        eyebrow: "CHAPTER 07 · RISK",
        title: "How this loses money.",
        lead:
          "Stated before you are asked for anything. Each line is read from a field in the record, " +
          "not from a template — a risk with nothing behind it is not listed.",
        rows: [
          { label: "Nothing is built", value: BUILD_LABEL[v.buildStage], basis: "Construction carries cost, programme and delivery risk, and none of it is insured away." },
          { label: "How the land is held", value: v.tenure ? TENURE_LABEL[v.tenure] : NOT_STATED, basis: v.commitments },
          { label: "Debt ranks ahead of you", value: inr(s.facility), basis: `${s.moratorium}. ${s.covenant}.` },
          { label: "Your capital is locked", value: o.lockIn, basis: v.governance?.transferRule ?? "Transfer terms are not on record." },
          { label: "The yield is a forecast", value: wf.state === "complete" ? "Modelled" : "Not stated", basis: "No revenue has been observed. Occupancy and rate are assumptions." },
          { label: "Open items on the record", value: String(registered.length), basis: registered.length ? registered.map((c) => c.id).join(" · ") : "None registered." },
        ],
        withheld: [],
      };
    }

    case "progress":
      return {
        eyebrow: "PROGRESS",
        title: "What exists today.",
        lead:
          `${BUILD_LABEL[v.buildStage]}. ${LIFECYCLE_LABEL[v.lifecycle]}. ` +
          `This chapter reports rather than renders: nothing below is a picture of the finished thing.`,
        rows: [
          { label: "Build stage", value: BUILD_LABEL[v.buildStage], basis: SOURCE },
          { label: "Vehicle", value: LIFECYCLE_LABEL[v.lifecycle], basis: stance.kind === "open" ? `${o.available} of ${o.units} units remain.` : stance.because },
          { label: "Subscription", value: `${o.subscribed} of ${o.units} units`, basis: SOURCE },
          { label: "Entitlement begins", value: v.entitlement?.begins ?? NOT_STATED, basis: v.entitlement ? "Programme-dependent" : "No entitlement on record." },
          { label: "Photography", value: "None published", basis: "Every frame on this platform is a labelled drawing until a photograph exists." },
        ],
        withheld: [],
      };

    case "enquire":
      return {
        eyebrow: "CHAPTER 08 · ENQUIRE",
        title:
          stance.kind === "open"
            ? "What an enquiry creates."
            : stance.kind === "waitlist"
              ? "Fully subscribed. The waitlist is open."
              : "Not open.",
        lead:
          stance.kind === "open"
            ? `An enquiry is a conversation, not a commitment. It reserves nothing and costs nothing, ` +
              `and ${o.available} of ${o.units} units remain while it happens.`
            : stance.because,
        rows: [
          { label: "This creates", value: stance.kind === "waitlist" ? "A record of interest" : "A conversation", basis: "Nothing binding on either side." },
          { label: "It does not create", value: "An allocation", basis: "No unit is held, no priority is promised, and no capital is taken." },
          { label: "Cost", value: "Nothing", basis: o.deposit === null ? "No holding deposit exists for this vehicle." : `A ${inr(o.deposit)} deposit applies only against a unit that is actually available.` },
          { label: "What governs", value: "The executed instrument", basis: "The LLP agreement and verified funds admit a partner. Nothing on a web page does." },
        ],
        withheld: [],
      };
  }
}
