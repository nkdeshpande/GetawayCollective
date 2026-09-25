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
import { inr, modelledYield, type Row } from "./investordossier";
import { plainTerms } from "../../lib/plain";

export interface ChapterContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead: string;
  readonly rows: readonly Row[];
  /** Why figures are absent, when they are. Empty when nothing is withheld. */
  readonly withheld: readonly string[];
  /* The keys, the architectural intent and the material palette were
     carried here for The Asset chapter. That chapter is retired: the
     property page renders all three already, which is why it went. The
     fields are gone rather than left empty — an unused optional is an
     invitation to fill it in the wrong place. */
}

const NOT_STATED = "Not yet stated";
const SOURCE = "Vehicle register";
const pct = (bps: number): string => `${(bps / 100).toFixed(2)}%`;

/** Rows a gated vehicle does not show, with the gate's own reasons. */
const gatedRows = (v: Vehicle): Row[] => [
  {
    label: "Figures withheld",
    value: "Until the record is complete",
    basis:
      `This estate's record has ${publishable(v).because.length} open item${publishable(v).because.length === 1 ? "" : "s"}, listed below. ` +
      `A figure nobody can stand behind is worse than no figure at all.`,
  },
];

export function chapterContent(v: Vehicle, id: ChapterId): ChapterContent {
  const gate = publishable(v);
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

    case "investment": {
      const wf = v.operating.waterfall;
      const y = modelledYield(v);
      if (!gate.ok) {
        return {
          eyebrow: "CHAPTER 06 · THE INVESTMENT",
          title: "The economics are not published yet.",
          lead:
            "Every figure here is one a reader could act on, and this estate's record still has " +
            "open items. Until they are closed the figures are withheld, not estimated.",
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
          { label: "Facility", value: inr(s.facility), basis: plainTerms(`${s.moratorium} · ${s.covenant}`) },
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
          { label: "How the land is held", value: v.tenure ? TENURE_LABEL[v.tenure] : NOT_STATED, basis: plainTerms(v.commitments) },
          { label: "Debt ranks ahead of you", value: inr(s.facility), basis: plainTerms(`${s.moratorium}. ${s.covenant}.`) },
          { label: "Your capital is locked", value: o.lockIn, basis: v.governance ? plainTerms(v.governance.transferRule) : "Transfer terms are not on record." },
          { label: "The yield is a forecast", value: wf.state === "complete" ? "Modelled" : "Not stated", basis: "No revenue has been observed. Occupancy and rate are assumptions." },
          { label: "Open items on the record", value: String(registered.length), basis: registered.length ? registered.map((c) => c.id).join(" · ") : "None registered." },
        ],
        withheld: [],
      };
    }

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
