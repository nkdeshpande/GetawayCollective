/**
 * THE NOTIFICATION CATALOGUE — N-01 through N-17
 *
 * Wave 9 · Communications
 *
 * Every notification the platform can send, as data: its firing event,
 * audience, urgency, channels, and a template that renders the actual
 * words from a context object. The words live HERE, once — the feed,
 * the specimen page and (later) the email sender all call the same
 * template, so the in-product copy and the mail copy cannot drift.
 *
 * ── WIRED IS A FLAG, NOT A HOPE ──────────────────────────────────────
 * Exactly one notification fires today (N-17, lead capture). Every
 * other spec carries wired:false and the surfaces say "specimen"
 * wherever they render one. A notification surface that looked live
 * while nothing generated events would be the platform lying about its
 * own nervous system.
 *
 * ── URGENCY IS SEMANTIC, NOT COSMETIC ────────────────────────────────
 * critical — irreversible state changes and system-critical alerts.
 *            N-05 (the Member Law) and N-15 (covenant proximity) only.
 * high     — action or attention with a deadline or a consequence.
 * normal   — the record advanced; no action required.
 * low      — operational hum.
 * The colour follows the token system's meaning bands; urgency is never
 * a volume knob for marketing.
 */

import type { Confidence } from "../app/_assemblies/data";
import { inr } from "../app/_assemblies/data";
import {
  LLP, DEPOSIT, DISCLOSURE, position, ALLOCATION,
} from "../app/_assemblies/slowspace";
import { RESERVE } from "../app/_assemblies/data";

export type Urgency = "low" | "normal" | "high" | "critical";
export type Channel = "email" | "product";
export type Audience = "applicant" | "investor" | "member" | "office";

export interface Notice {
  title: string;
  body: readonly string[];
  facts?: readonly { k: string; v: string; money?: boolean }[];
  /** Forward-looking figures carry their class, here as everywhere. */
  conf?: Confidence;
  links?: readonly { t: string; to: string }[];
}

export interface NoticeSpec {
  id: string;
  event: string;
  audience: Audience;
  urgency: Urgency;
  channels: readonly Channel[];
  /** True only when something actually generates this event today. */
  wired: boolean;
  /** Renders the words from a context. The specimen feed passes the worked one. */
  render: (ctx: SpecimenContext) => Notice;
  note?: string;
}

/** The worked context every specimen renders from. Canon figures only. */
export interface SpecimenContext {
  vehicle: string;
  bps: number;
}

const P = (ctx: SpecimenContext) => position(ctx.bps);

export const NOTICES: readonly NoticeSpec[] = [
  {
    id: "N-01", event: "Accreditation submitted", audience: "applicant",
    urgency: "normal", channels: ["email", "product"], wired: false,
    render: () => ({
      title: "Application received",
      body: [
        "Your accreditation application has been received in full.",
        "A decision follows within 15 working days. Every field you entered is saved, and an " +
        "application in flight always completes — no suspension interrupts it (§24b).",
      ],
      facts: [{ k: "Decision due within", v: "15 working days" }],
      links: [{ t: "Your application", to: "/passport" }],
    }),
  },
  {
    id: "N-02", event: "Accreditation decided", audience: "applicant",
    urgency: "high", channels: ["email", "product"], wired: false,
    note: "A decline must state its reason and the route to ask again. A bare no teaches nothing.",
    render: () => ({
      title: "Accreditation approved",
      body: [
        "You are accredited for this offering class. The commitment path is now open to you.",
        "Accreditation is maintained, not permanent: the decision is reviewed annually, and the " +
        "evidence you provided holds — only the decision expires.",
      ],
      facts: [{ k: "Valid until", v: "annual review, 12 months from decision" }],
      links: [{ t: "The open offering", to: "/flow" }],
    }),
  },
  {
    id: "N-03", event: "Deposit received", audience: "investor",
    urgency: "high", channels: ["email", "product"], wired: false,
    note: "Must repeat the Member Law. The commonest misreading of a deposit is that it completes the purchase.",
    render: (ctx) => ({
      title: inr(DEPOSIT.amount) + " received",
      body: [
        "Your deposit is received and your position in " + ctx.vehicle + " is held.",
        "The deposit holds a position; it does not buy one. You are not a partner: the Member " +
        "Law fires on settlement of the full commitment and on nothing else. " +
        DEPOSIT.refundable,
      ],
      facts: [
        { k: "Deposit", v: inr(DEPOSIT.amount), money: true },
        { k: "Position held", v: "as selected on your commitment path" },
        { k: "Completion window", v: DEPOSIT.window },
      ],
      links: [{ t: "What happens next", to: "/flow/settled" }],
    }),
  },
  {
    id: "N-04", event: "Completion window opening", audience: "investor",
    urgency: "high", channels: ["email"], wired: false,
    note: "Fires at window opening and again at T−3 days. Two notices, one wording, different countdowns.",
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: "Completion window open — " + DEPOSIT.window,
        body: [
          "The balance of your commitment, the Vehicle Agreement and the transfer of funds are " +
          "completed off the platform, within " + DEPOSIT.window + ".",
          "If the window lapses, the deposit is returned in full and the position is released.",
        ],
        facts: [
          { k: "Balance due", v: inr(p.balance), money: true },
          { k: "Window", v: DEPOSIT.window },
        ],
      };
    },
  },
  {
    id: "N-05", event: "SETTLEMENT — the Member Law", audience: "member",
    urgency: "critical", channels: ["email", "product"], wired: false,
    note: "I-08 fires here and only here. The single most important notification in the system, and irreversible.",
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: "You are a Member of " + ctx.vehicle,
        body: [
          "Settlement has cleared. The Member Law has fired — on settlement, not on acceptance, " +
          "not on commitment — and it is irreversible.",
          "Your entitlement and governance rights begin now. Your position is entered on the " +
          "partner register, and Form 4 files with the Registrar within 30 days.",
        ],
        facts: [
          { k: "Position", v: inr(p.commitment), money: true },
          { k: "Share", v: (p.bps / 100).toFixed(0) + "% · contribution-weighted vote" },
          { k: "Entitlement", v: `${p.nights.min}–${p.nights.max} nights a year, from handover` },
        ],
        links: [{ t: "Your vehicle console", to: "/member" }],
      };
    },
  },
  {
    id: "N-06", event: "Resolution opened", audience: "member",
    urgency: "high", channels: ["email", "product"], wired: false,
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: "A resolution is open for your vote",
        body: [
          "Resolution R-2028-01 is open on " + ctx.vehicle + ". It is an ordinary resolution: " +
          "it carries on more than 50% of contribution present, and a tie is not approval.",
          "Your vote casts " + (p.bps / 100).toFixed(0) + "% — weighted by contribution, per §24a.",
        ],
        facts: [
          { k: "Threshold", v: "Ordinary · more than 50% of contribution present" },
          { k: "Your weight", v: (p.bps / 100).toFixed(0) + "%" },
          { k: "Closes", v: "2028-02-15 · 18:00 IST" },
        ],
        links: [{ t: "Read and vote", to: "/member/resolutions" }],
      };
    },
  },
  {
    id: "N-07", event: "Resolution closing, vote uncast", audience: "member",
    urgency: "high", channels: ["email", "product"], wired: false,
    note: "A tie is NOT approval, so an uncast vote has a real consequence and the reminder says so.",
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: "Your vote has not been cast — 48 hours remain",
        body: [
          "Voting on R-2028-01 closes in 48 hours and your " + (p.bps / 100).toFixed(0) +
          "% has not been cast.",
          "An uncast vote is not neutral: the threshold is measured against contribution present, " +
          "and a tie is not approval. Absence can decide the outcome as surely as a vote.",
        ],
        facts: [{ k: "Closes", v: "2028-02-15 · 18:00 IST" }],
        links: [{ t: "Vote now", to: "/member/resolutions" }],
      };
    },
  },
  {
    id: "N-08", event: "Resolution decided", audience: "member",
    urgency: "normal", channels: ["email", "product"], wired: false,
    note: "ADR-0008: secret ballot, transparent outcome. The tally publishes; who voted how never does.",
    render: () => ({
      title: "Resolution R-2028-01: carried",
      body: [
        "The resolution carried at 64% of contribution present against a threshold of more than 50%.",
        "The tally is published in full. Individual votes are sealed and are not retained in " +
        "readable form — the outcome is transparent, the ballot is secret.",
      ],
      facts: [
        { k: "For", v: "64% of contribution present" },
        { k: "Against", v: "31%" },
        { k: "Abstained", v: "5%" },
        { k: "Threshold", v: "Ordinary · >50%" },
      ],
      links: [{ t: "The resolution record", to: "/member/resolutions" }],
    }),
  },
  {
    id: "N-09", event: "Distribution declared", audience: "member",
    urgency: "normal", channels: ["email", "product"], wired: false,
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: inr(p.distribution / 4n) + " declared",
        body: [
          "A distribution has been declared for the quarter. Your share is stated below and pays " +
          "to your registered account within 7 working days.",
          "The waterfall ran all six stages; the reserve stands above its floor.",
        ],
        facts: [
          { k: "Your share", v: inr(p.distribution / 4n), money: true },
          { k: "Period", v: "quarter ending 2028-06-30" },
        ],
        conf: "forecast",
        links: [{ t: "The breakdown", to: "/member/distributions" }],
      };
    },
  },
  {
    id: "N-10", event: "Distribution paid", audience: "member",
    urgency: "normal", channels: ["email", "product"], wired: false,
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: inr(p.distribution / 4n) + " paid",
        body: ["The declared distribution has been paid to the account ending 4471. The statement " +
               "is attached to the period record."],
        facts: [{ k: "Paid", v: inr(p.distribution / 4n), money: true }],
        conf: "forecast",
        links: [{ t: "Statement", to: "/member/distributions" }],
      };
    },
  },
  {
    id: "N-11", event: "Distribution BLOCKED", audience: "member",
    urgency: "high", channels: ["email", "product"], wired: false,
    note: "Silence here reads as an error. A profitable period with no distribution is normal, and is explained when it happens — not in a FAQ.",
    render: () => ({
      title: "No distribution this period — and why",
      body: [
        "The waterfall ran, the period was profitable, and stage six did not run: paying it would " +
        "have taken the administrative reserve below its floor.",
        "This is the distribution framework working as designed, not a failure. The withheld " +
        "amount is retained, not evaporated, and pays when the reserve recovers.",
      ],
      facts: [
        { k: "Reserve floor", v: inr(RESERVE.floor), money: true },
        { k: "Basis", v: RESERVE.basis },
      ],
      links: [{ t: "The reserve test", to: "/capital/distributions" }],
    }),
  },
  {
    id: "N-12", event: "Entitlement opens", audience: "member",
    urgency: "normal", channels: ["product"], wired: false,
    note: "Never before handover — nothing is drawable against an unbuilt asset.",
    render: (ctx) => {
      const p = P(ctx);
      return {
        title: `Your ${p.nights.min}–${p.nights.max} nights for 2028 are drawable`,
        body: [
          "Handover is complete and the ownership calendar for 2028 is open. Your allocation is " +
          "derived from the vehicle pool by your stake, floored — a static right of ownership, " +
          "not a reward for conduct.",
        ],
        facts: [{ k: "Allocation", v: `${p.nights.min}–${p.nights.max} nights · ${(p.bps / 100).toFixed(0)}%` }],
        links: [{ t: "Entitlement", to: "/member/entitlement" }],
      };
    },
  },
  {
    id: "N-13", event: "Entitlement expiring", audience: "member",
    urgency: "normal", channels: ["email", "product"], wired: false,
    note: "Blocked on Decision D-07 — the lapse policy (lapse / roll / convert) is undecided, and this notice cannot be written truthfully until it is.",
    render: () => ({
      title: "Nights approaching year end",
      body: [
        "Your allocation year closes on 31 December. What happens to undrawn nights is governed " +
        "by the vehicle's lapse policy.",
        "[The lapse policy is Decision D-07 and is not yet made. This notice ships after it is, " +
        "and states the actual consequence — this line is the specimen being honest.]",
      ],
      links: [{ t: "Entitlement", to: "/member/entitlement" }],
    }),
  },
  {
    id: "N-14", event: "Document version changed", audience: "member",
    urgency: "high", channels: ["email"], wired: false,
    note: "A binding document changing under someone silently is the failure mode. The diff links, always.",
    render: () => ({
      title: "Terms and Conditions: v" + DISCLOSURE.version + " → v3.0",
      body: [
        "A standing document that binds you has a new version in force. The change summary and " +
        "the full difference against the version you acknowledged are linked below.",
        "Your acknowledgement of the prior version remains on record; continued use after the " +
        "effective date is governed by the document itself.",
      ],
      facts: [
        { k: "Effective", v: "30 days from this notice" },
        { k: "You acknowledged", v: "v" + DISCLOSURE.version + " · " + DISCLOSURE.dated },
      ],
      links: [{ t: "Read the change", to: "/legal/terms" }],
    }),
  },
  {
    id: "N-15", event: "Covenant proximity", audience: "office",
    urgency: "critical", channels: ["product"], wired: false,
    note: "Office vantage only. Never shown at member vantage without Board sign-off on the wording.",
    render: () => ({
      title: "DSCR approaching covenant threshold",
      body: [
        "Modelled debt service cover for the trailing period is approaching the facility covenant. " +
        "This is an office alert: partner-facing wording requires Board sign-off before any " +
        "member sees a covenant notice.",
      ],
      facts: [
        { k: "Covenant", v: "1.50× minimum" },
        { k: "Trailing", v: "1.62× and declining" },
      ],
      conf: "modelled",
      links: [{ t: "Capital risk", to: "/capital/risk" }],
    }),
  },
  {
    id: "N-16", event: "Valuation published", audience: "member",
    urgency: "normal", channels: ["product"], wired: false,
    note: "Names the source and its confidence class. A management estimate is not an appraisal.",
    render: () => ({
      title: "Kyoto House revalued",
      body: [
        "A new valuation is on the record. The source is part of the figure: this one is an " +
        "independent appraisal, and renders as verified — a management estimate would say so " +
        "and render as an estimate.",
      ],
      facts: [
        { k: "Valuation", v: inr(124000000_0000n), money: true },
        { k: "Source", v: "Independent appraisal · Nomura Real Estate" },
      ],
      conf: "verified",
      links: [{ t: "The property record", to: "/collection/kyoto-house" }],
    }),
  },
  {
    id: "N-17", event: "Lead captured", audience: "office",
    urgency: "low", channels: ["email"], wired: true,
    note: "The only notification that fires today: /api/signal and /api/dossier through lib/leads.ts.",
    render: () => ({
      title: "New signal subscriber",
      body: ["A lead arrived through the public form and was forwarded to the configured address. " +
             "Without RESEND_API_KEY the endpoint returns 503 and the page says so — a lead is " +
             "never silently dropped."],
      links: [{ t: "The form", to: "/signal" }],
    }),
  },
];

/** The worked context the specimen feed renders from. */
export const SPECIMEN_CONTEXT: SpecimenContext = {
  vehicle: LLP.name,
  bps: ALLOCATION.defaultBps,
};

export const noticeById = (id: string): NoticeSpec | undefined =>
  NOTICES.find((n) => n.id === id);

/* ── Load-time checks — the catalogue proves its own rules ────────── */
{
  const ids = new Set<string>();
  for (const n of NOTICES) {
    if (ids.has(n.id)) throw new Error(`Duplicate notice ${n.id}`);
    ids.add(n.id);
    if (n.channels.length === 0) throw new Error(`${n.id} has no channel`);
  }

  // critical is the rarest urgency: the Member Law and covenant proximity only.
  const crit = NOTICES.filter((n) => n.urgency === "critical").map((n) => n.id);
  if (crit.join(",") !== "N-05,N-15") {
    throw new Error(`critical is reserved for N-05 and N-15; found [${crit.join(", ")}]`);
  }

  // Exactly one notification is wired. Adding a second means an event
  // source now exists — update this check WITH the event source.
  const wired = NOTICES.filter((n) => n.wired).map((n) => n.id);
  if (wired.join(",") !== "N-17") {
    throw new Error(`wired must be exactly N-17 until an event source exists; found [${wired.join(", ")}]`);
  }

  const words = (id: string) => {
    const n = noticeById(id)!;
    const r = n.render(SPECIMEN_CONTEXT);
    return [r.title, ...r.body].join(" ");
  };
  // N-03 must repeat the Member Law; a deposit is not a purchase.
  if (!words("N-03").includes("not a partner")) throw new Error("N-03 must state the Member Law");
  // N-05 must state irreversibility and the settlement trigger.
  if (!words("N-05").includes("irreversible") || !words("N-05").includes("settlement")) {
    throw new Error("N-05 must state settlement and irreversibility");
  }
  // N-08 publishes a tally and never an identity.
  if (!words("N-08").includes("secret")) throw new Error("N-08 must state the ballot is secret");
  // N-11 explains a blocked distribution as designed behaviour.
  if (!words("N-11").includes("floor")) throw new Error("N-11 must name the reserve floor");
}
