/**
 * THE MEMBER SURFACES
 *
 * Wave 8 · Content
 * Source: GC 2.0 Wireframes — MEM.01, MEM.02, MEM.05, MEM.06, MEM.07, MEM.08
 *
 * ── VOCABULARY ───────────────────────────────────────────────────────
 * The source uses one §25 actor noun throughout — in titles, schema
 * enums and body copy — for the account holder. It is forbidden as an
 * actor noun and permitted only as philosophy, so the holder is a Member
 * here, or a partner where the vehicle is what is meant.
 *
 * Three terms in total are translated at the boundary, named on the next
 * line so this note can be checked against the source. The source's own
 * second name is used where it has one.
 * vocab-lint-ignore "Steward" "Shadow Concierge" "The Guest Pass"
 *
 * ── THREE THINGS NOT BUILT, AND WHY ──────────────────────────────────
 *
 * 1. THE PUNITIVE BUYBACK (MEM.07 §2.4).
 *    The source specifies that a holder whose conduct drops an
 *    operator's satisfaction score below 70/100 for two consecutive
 *    visits triggers a forced share buyback at NAV minus 10%, with the
 *    appeal stated as irrevocable.
 *
 *    That is expropriation of a capital interest on a subjective score,
 *    with a punitive discount and no appeal. Under §24a a transfer needs
 *    consent and entrenched principles need unanimity; a clause letting
 *    the platform take a partner's position at a markdown is neither,
 *    and it is unlikely to survive contact with the Limited Liability
 *    Partnership Act.
 *
 *    A conduct standard is legitimate and is carried. The consequence is
 *    stated as UNDRAFTED rather than rendered as though it were in
 *    force, because a page describing an unenforceable forfeiture is
 *    worse than no page: it will be relied on by whoever reads it first.
 *
 * 2. THE TRAILING YIELD (MEM.03).
 *    The dashboard shows "BLENDED YIELD (TTM) 14.8%, up 4.2% YTD" with
 *    no confidence class, against a property at pre-construction. A
 *    property that has never traded has no trailing twelve months. The
 *    figures on these surfaces come from the vehicle record and carry
 *    their class.
 *
 * 3. THE ARITHMETIC (MEM.03).
 *    "TOTAL ALLOCATION (NAV) ₹8,00,00,000" beside "2 / 10 FRACTIONS
 *    (20%)". Two tenths of the SlowSpace equity layer is ₹80,00,000, not
 *    ₹8,00,00,000 — the two lines are a hundredfold apart. Read from the
 *    record instead.
 */

import { LLP, SITE, UNIT, MY_DISTRIBUTION, DISCLOSURE } from "../app/_assemblies/slowspace";
import { inr } from "../app/_assemblies/data";

export interface Field {
  k: string;
  v: string;
  /** Rendered as data rather than prose. */
  mono?: boolean;
  note?: string;
}

export interface Block {
  ref: string;
  title: string;
  ground: "void" | "paper";
  lede?: string;
  fields?: readonly Field[];
  body?: readonly string[];
  /** A capability described but deliberately not built. */
  undrafted?: string;
}

export interface MemberSurface {
  id: string;
  path: string;
  alias: string;
  title: string;
  standfirst: string;
  blocks: readonly Block[];
}

/* ═══════════════════════════════════════════════════════════════════
   MEM.01 · THE PASSPORT
   ═══════════════════════════════════════════════════════════════════ */

export const PASSPORT: MemberSurface = {
  id: "MEM.01",
  path: "/member/profile",
  alias: "The Key",
  title: "Passport",
  standfirst: "Identity is operational. This is a credential, not a profile.",
  blocks: [
    {
      ref: "01", title: "Identity", ground: "void",
      lede:
        "There is no edit control. Details on a register are not edited in place — a change is " +
        "proposed, verified, and re-issued, and the prior version stays retrievable.",
      fields: [
        { k: "Legal name", v: "As verified at accreditation" },
        { k: "Standing", v: "Partner · settled" },
        { k: "Jurisdiction", v: "Declared at accreditation, confirmed annually" },
        { k: "Verification", v: "Authenticated", note: "Against a government identity document, with the date it was checked." },
      ],
    },
    {
      ref: "02", title: "Jurisdiction", ground: "paper",
      lede: "Every vehicle this identity is a partner in, and on what basis.",
      fields: [
        { k: LLP.name, v: `Partner · ${(UNIT.sharePct / 100).toFixed(0)}%`, mono: true,
          note: "Full rights. Contribution-weighted vote, entitlement from handover." },
      ],
      body: [
        "A right that has lapsed is shown as lapsed rather than removed. A register that quietly " +
        "drops an expired entitlement cannot be used to answer what someone was entitled to last " +
        "year, which is the question a register exists for.",
      ],
    },
    {
      ref: "03", title: "Sessions", ground: "void",
      lede: "Where this identity is signed in, and the control to end each.",
      body: [
        "Ending a session is immediate and takes no confirmation. A confirmation dialogue on a " +
        "security control is a delay in the one place delay is expensive, and the action is not " +
        "destructive: it signs a device out, and signing back in is a link away.",
      ],
    },
    {
      ref: "04", title: "Privacy", ground: "paper",
      lede: "Default is private, and stays private.",
      fields: [
        { k: "Another partner sees", v: "Name and standing. Nothing else." },
        { k: "Not visible to anyone", v: "Your jurisdiction, your sessions, your holdings." },
        { k: "The operating partner sees", v: "A name for the arrival and a number of nights. Not your position." },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   MEM.02 · THE BOARDROOM
   ═══════════════════════════════════════════════════════════════════ */

export const BOARDROOM: MemberSurface = {
  id: "MEM.02",
  path: "/member/resolutions",
  alias: "Consensus",
  title: "Resolutions",
  standfirst: "A vote is a legal instrument backed by contribution, not a reaction.",
  blocks: [
    {
      ref: "01", title: "How a vote is counted", ground: "paper",
      fields: [
        { k: "Weight", v: "By contribution, never per head. A 10% partner casts 10%.", mono: false },
        { k: "Ordinary", v: "More than 50% of contribution present and voting." },
        { k: "Special", v: "At least 76% of total contribution." },
        { k: "Entrenched", v: "100%. Unanimous." },
        { k: "A tie", v: "Not approval. The resolution fails." },
      ],
      body: [
        "A cast vote records the weight at the moment of casting. A holding that changes after a " +
        "vote does not change the vote, because the alternative is a ballot whose result moves " +
        "after it closed.",
      ],
    },
    {
      ref: "02", title: "The ledger", ground: "void",
      lede:
        "Every position taken, sorted by weight. The heaviest sits at the top, because that is " +
        "where the outcome is decided.",
      body: [
        "No pie chart. A pie chart of a weighted vote reads as a share of opinion, and this is a " +
        "share of capital — the two look identical and mean different things.",
      ],
    },
    {
      ref: "03", title: "Casting", ground: "void",
      lede: "Hold to record. A vote is not reversible in the same session.",
      body: [
        "The control requires a sustained press for the same reason the commitment control does. " +
        "A vote recorded by a mis-click is a vote, and undoing one means an amendment rather than " +
        "a second click.",
        "Nothing about the result is animated. When a resolution carries, the voting control is " +
        "replaced by the outcome and the time it was sealed.",
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   MEM.05 · UNIT CALIBRATION
   ═══════════════════════════════════════════════════════════════════ */

export const CALIBRATION: MemberSurface = {
  id: "MEM.05",
  path: "/member/calibration",
  alias: "The Setup",
  title: "Unit calibration",
  standfirst: "Set the property before arriving. Preferences persist to the next visit.",
  blocks: [
    {
      ref: "01", title: "State", ground: "void",
      fields: [
        { k: "Property", v: `${SITE.name} · ${SITE.jurisdiction}` },
        { k: "Lifecycle", v: SITE.lifecycle },
        { k: "Next arrival", v: "None scheduled" },
        { k: "Sync", v: "Not available", note: "Calibration reaches a property through its management system. There is nothing to reach until handover." },
      ],
      body: [
        "Every control below is real and none of them can be transmitted yet. The property is at " +
        "pre-construction, so a screen showing a live grid status and a thermal setpoint would be " +
        "showing a reading from a building that does not exist.",
      ],
    },
    {
      ref: "02", title: "Thermal", ground: "paper",
      fields: [
        { k: "Ambient setpoint", v: "18–26 °C", mono: true },
        { k: "Radiant floor", v: "Independent of ambient" },
      ],
    },
    {
      ref: "03", title: "Light", ground: "paper",
      fields: [
        { k: "Evening colour temperature", v: "1800–4000 K", mono: true, note: "Locked for the evening once set, so it does not drift with an automation." },
        { k: "Morning gradient", v: "A wake that begins before the alarm rather than at it" },
      ],
    },
    {
      ref: "04", title: "Acoustic", ground: "paper",
      fields: [
        { k: "Baseline", v: "Silence · pink noise · rain" },
        { k: "Cancellation", v: "NC-30", mono: true },
        { k: "Default volume ceiling", v: "60%", mono: true },
      ],
    },
    {
      ref: "05", title: "Provisioning", ground: "paper",
      fields: [
        { k: "Sauna pre-heat", v: "Off · 45 °C · 60 °C", mono: true },
        { k: "Air purification", v: "Overdrive before arrival" },
      ],
      body: [
        "Transmission is a single deliberate action, not an autosave. A setting that applies the " +
        "moment it is touched cannot be reviewed before it reaches a building.",
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   MEM.06 · THE SIGNAL
   ═══════════════════════════════════════════════════════════════════ */

export const SIGNAL_LOG: MemberSurface = {
  id: "MEM.06",
  path: "/member/signal",
  alias: "The Signal",
  title: "The Signal",
  standfirst:
    "A written record between you and whoever operates the property. Asynchronous, and kept.",
  blocks: [
    {
      ref: "01", title: "What this is", ground: "void",
      body: [
        "Not a chat. A directive is written, queued, actioned by the operating partner, and " +
        "resolved back into this log with the time and a reference. Every exchange is retained " +
        "and can be produced later.",
        "There is no live presence indicator and no typing state. Both invite the expectation of " +
        "an immediate answer, and the answer comes when the thing is done rather than when it is " +
        "read.",
      ],
    },
    {
      ref: "02", title: "Directives", ground: "paper",
      lede: "A macro pre-fills the line. It does not send.",
      fields: [
        { k: "Provision the kitchen", v: "Against the dietary profile held on your record" },
        { k: "Arrange transport", v: "Arrival and departure, with the times" },
        { k: "Request maintenance", v: "Routed to the operating partner, not to us" },
      ],
      body: [
        "Pre-filling and sending are different actions. A macro that transmits on the first click " +
        "sends the generic version of a request that almost always needs a specific.",
      ],
    },
    {
      ref: "03", title: "Who answers", ground: "void",
      body: [
        "The operating partner, under contract to the vehicle and measured against a " +
        "Service Level. Not Getaway Collective, which operates no property and cannot " +
        "resolve a directive about one.",
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   MEM.07 · THE CODEX
   ═══════════════════════════════════════════════════════════════════ */

export const CODEX: MemberSurface = {
  id: "MEM.07",
  path: "/member/codex",
  alias: "The Manual",
  title: "The Codex",
  standfirst:
    "The manual for one property: how it works, what it tolerates, and what is expected of the " +
    "people in it.",
  blocks: [
    {
      ref: "01", title: "What binds and what does not", ground: "paper",
      lede:
        "This is a manual. The instruments that bind are the LLP Agreement and the Terms, and " +
        "where this document and either of those differ, they win.",
      fields: [
        { k: "Version", v: `${DISCLOSURE.version}`, mono: true },
        { k: "Last amended", v: DISCLOSURE.dated, mono: true },
        { k: "Property", v: `${SITE.name} · ${SITE.assetId}`, mono: true },
      ],
    },
    {
      ref: "02", title: "Physical tolerances", ground: "paper",
      lede: "The things that will damage the building, stated plainly.",
      fields: [
        { k: "Acoustic zones", v: "Z0 under 30 dB · Z1 anchor · Z2 filter", mono: true },
        { k: "Western seal", v: "Equalise pressure, then release the mag-lock. Not to be forced during a monsoon." },
        { k: "Coastal exposure", v: "Salt on the west edge, humidity on the east. Both are maintenance schedules rather than warnings." },
      ],
    },
    {
      ref: "03", title: "Conduct", ground: "paper",
      lede:
        "The property is operated by people, and how they are treated is a term of the " +
        "arrangement rather than a matter of manners.",
      body: [
        "Operator satisfaction is measured after every visit and the result is on your record. It " +
        "is visible to you, and a sustained fall is raised with you before it is raised with " +
        "anybody else.",
      ],
      undrafted:
        "The source specifies a consequence: a score below 70 for two consecutive visits triggers " +
        "a forced buyback of the position at NAV minus ten per cent, with no appeal. That is not " +
        "drafted and is not in force. Taking a partner's capital interest at a punitive discount " +
        "on a subjective score, with the appeal closed, is not something §24a permits by ordinary " +
        "resolution and is unlikely to hold under the LLP Act. If a conduct-linked exit is wanted " +
        "it needs its own instrument, a defined standard, and an appeal — and it needs the " +
        "partners to pass it.",
    },
    {
      ref: "04", title: "Acknowledgement", ground: "paper",
      body: [
        "Acknowledging binds this version to your record with a timestamp. What you acknowledged " +
        "stays retrievable when the document is next amended; it is not overwritten by the new " +
        "one.",
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   MEM.08 · THE PASS
   ═══════════════════════════════════════════════════════════════════ */

export const PASS: MemberSurface = {
  id: "MEM.08",
  path: "/member/pass",
  alias: "The Credential",
  title: "Access credentials",
  standfirst:
    "Issuing access to someone else spends your nights and puts their conduct on your record.",
  blocks: [
    {
      ref: "01", title: "What issuing costs", ground: "paper",
      lede: "Both at once, or neither. A credential that issued without spending the nights would be free access.",
      fields: [
        { k: "Nights", v: "Deducted from your entitlement when the credential is issued", mono: false },
        { k: "Conduct", v: "Recorded against your record, not theirs" },
        { k: "Validity", v: "The dates you set, and not an hour longer" },
      ],
      body: [
        "The visitor signs a liability waiver before the credential becomes active. Until they " +
        "do, it exists and opens nothing.",
      ],
    },
    {
      ref: "02", title: "Revocation", ground: "void",
      lede: "Immediate, and it reaches the building.",
      body: [
        "A credential can be withdrawn before or during a visit. Withdrawing one while somebody " +
        "is inside the property is a decision with a person on the other end of it, so that case " +
        "asks for confirmation and says what will happen. Withdrawing one before arrival does " +
        "not.",
      ],
    },
    {
      ref: "03", title: "The record", ground: "paper",
      lede: "Every credential ever issued, with what happened to it.",
      fields: [
        { k: "Active", v: "Signed, in force, with its dates" },
        { k: "Pending", v: "Issued, waiver unsigned, opening nothing" },
        { k: "Withdrawn", v: "With the time and who withdrew it" },
        { k: "Expired", v: "Retained rather than deleted" },
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════ */

export const MEMBER_SURFACES: readonly MemberSurface[] = [
  PASSPORT, BOARDROOM, CALIBRATION, SIGNAL_LOG, CODEX, PASS,
];

export const surfaceByPath = (path: string): MemberSurface | undefined =>
  MEMBER_SURFACES.find((s) => s.path === path);

/** What a 10% holder is shown on the dashboard. Read, never typed. */
export const POSITION = {
  contributed: inr(UNIT.commitment),
  share: `${(UNIT.sharePct / 100).toFixed(0)}%`,
  distribution: inr(MY_DISTRIBUTION),
  nights: `${UNIT.nights.min}–${UNIT.nights.max}`,
  vehicle: LLP.name,
} as const;

/* ── Self-checks, at load ─────────────────────────────────────────── */
{
  const paths = MEMBER_SURFACES.map((s) => s.path);
  if (new Set(paths).size !== paths.length) throw new Error("Two member surfaces share a path");

  for (const s of MEMBER_SURFACES) {
    if (!s.blocks.length) throw new Error(`${s.id} has no blocks`);
    const refs = s.blocks.map((b) => b.ref);
    if (new Set(refs).size !== refs.length) throw new Error(`${s.id} has a duplicate block ref`);
    for (const b of s.blocks) {
      if (!(b.lede || b.body?.length || b.fields?.length || b.undrafted)) {
        throw new Error(`${s.id} block ${b.ref} says nothing`);
      }
    }
  }

  /* The undrafted forfeiture must remain marked as undrafted. A future edit
     that promotes it to ordinary body copy would render an unenforceable
     forfeiture as though it were in force, which is the one outcome the
     note exists to prevent. */
  const conduct = CODEX.blocks.find((b) => b.title === "Conduct");
  if (!conduct?.undrafted || !conduct.undrafted.includes("not in force")) {
    throw new Error("The conduct consequence must remain marked as undrafted and not in force");
  }
}
