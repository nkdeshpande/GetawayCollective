/**
 * Composed member surfaces — the twenty that rendered the scaffold.
 *
 * Everything reads the worked position (10% of SlowSpace Coastal LLP)
 * because no identity exists to read a real one. Every page marks its
 * modelled figures, and every record that does not exist yet says WHY
 * — mostly: the property is at pre-construction, so the operational
 * stage has not begun.
 */
import type { Entry } from "@/app/_assemblies/compose";
import { d } from "./shared";
import { inr } from "@/app/_assemblies/data";
import {
  LLP, GOVERNANCE, PROGRAMME, DEPOSIT,
  ALLOCATION, position, NIGHT_POOL,
} from "@/app/_assemblies/slowspace";
import { DOCUMENTS, readingMinutes } from "@/content/legal";

const p = position(ALLOCATION.defaultBps);
const pct = (bps: number) => (bps / 100).toFixed(0) + "%";

/** The one sentence that explains most empty member records. */
const PRE_OP =
  "The property is at pre-construction. Records of operation exist from operation.";

const emptyRef = (what: string, kind: string): Entry => ((ref: string) => ({
  title: `${what} ${ref.toUpperCase()}`,
  eyebrow: `Member · ${LLP.name}`,
  lead: `No ${kind} answers to this reference yet.`,
  disclosure: d(
    "Nothing — these records are never public.",
    "Nothing before commitment; references exist per position.",
    `Your ${kind}s, by reference, once any exist.`,
    `Most ${kind}s are operational events; the register fills from go-live.`,
  ),
  sections: [
    { kind: "empty", what: `No ${kind} at ${ref.toUpperCase()}`,
      because: PRE_OP,
      when: "References become live as records are created, and never before." },
    { kind: "links", items: [{ t: "Back to the console", to: "/flow/settled", primary: true }] },
  ],
}));

export const MEMBER_PAGES: Record<string, Entry> = {
  "/member": {
    title: "Member",
    eyebrow: "The member vantage",
    lead: "One vehicle, one position, and everything that follows from it — in one place.",
    disclosure: d(
      "Nothing. The member vantage opens at settlement, not before.",
      "Nothing yet — accreditation opens the commitment path, not this surface.",
      "Your position, votes, documents and entitlement, from the moment the Member Law fires.",
      "Distributions received and nights drawn join at operation.",
    ),
    sections: [
      { kind: "figures", items: [
        { label: "Position", value: inr(p.commitment), money: true,
          sub: `${pct(p.bps)} of ${LLP.name}`, conf: "verified" },
        { label: "Indicative annual", value: inr(p.distribution), money: true,
          sub: `${(p.yieldBps / 100).toFixed(1)}% once stabilised`, conf: "modelled" },
        { label: "Voting weight", value: pct(p.bps), sub: "contribution-weighted · §24a" },
        { label: "Nights", value: "0", nights: true, sub: `of ${p.nights.min}–${p.nights.max}, from handover` },
      ] },
      { kind: "links", items: [
        { t: "The vehicle console", to: "/flow/settled", primary: true },
        { t: "Position", to: "/member/position" },
        { t: "Documents", to: "/member/documents" },
        { t: "Entitlement", to: "/member/entitlement" },
      ] },
    ],
  },

  "/member/position": {
    title: "Position",
    eyebrow: `Member · ${LLP.name}`,
    lead: "What you hold, what it can do, and what it is worth on the current model.",
    disclosure: d(
      "Nothing — a position is never public.",
      "Nothing before commitment.",
      "The full position: units, weight, control, and the modelled distribution.",
      "Realised figures replace modelled ones as periods close.",
    ),
    sections: [
      { kind: "kv", label: "The holding", rows: [
        { k: "Vehicle", v: LLP.name },
        { k: "LLPIN", v: LLP.llpin, mono: true },
        { k: "Share", v: `${pct(p.bps)} · ${p.units} × ${inr(p.commitment / BigInt(p.units))}`, mono: true },
        { k: "Contributed", v: inr(p.commitment), money: true },
        { k: "Of which platform deposit", v: inr(DEPOSIT.amount), money: true },
        { k: "Lock-in", v: "36 months from financial close" },
      ] },
      { kind: "kv", label: "What this holding can do",
        rows: p.control.map((c) => ({ k: c.kind === "power" ? "Power" : "Limit", v: c.t })),
        note: "Derived from the thresholds in §24a, not written per size. Ordinary carries above 50%; " +
              "special at 76%, so it is blocked from above 24%." },
    ],
  },

  "/member/calls": {
    title: "Capital calls",
    eyebrow: `Member · ${LLP.name}`,
    lead: "Calls against your commitment, when the vehicle makes any.",
    disclosure: d(
      "Nothing — calls are never public.",
      "Nothing before commitment.",
      "Every call against your position: amount, due date, and what it funds.",
      "The register stays; calls are rare after construction completes.",
    ),
    sections: [
      { kind: "empty", what: "No capital calls",
        because: "The commitment is fully paid at settlement — " + inr(p.commitment) + " with no " +
                 "drawdown schedule. This vehicle has made no call and its model does not anticipate one.",
        when: "A call, if ever made, appears here with its resolution reference and due date." },
      { kind: "note", tone: "steel",
        text: "Construction is funded by the " + inr(55000000_0000n) + " facility, drawn during " +
              "build only — not by calls on partners." },
    ],
  },
  "/member/calls/[ref]": emptyRef("Call", "capital call"),

  "/member/distributions": {
    title: "Distributions",
    eyebrow: `Member · ${LLP.name}`,
    lead: "What stage six has paid you. Nothing has run yet, and the page says so.",
    disclosure: d(
      "Nothing — distributions are never public.",
      "The waterfall mechanics are public at /how-capital-works; your figures are not.",
      "Declared and paid amounts per period, against the modelled expectation.",
      "This is the page operation fills: quarterly, from stabilisation, unless blocked by the reserve floor.",
    ),
    sections: [
      { kind: "figures", items: [
        { label: "Received to date", value: inr(0n), money: true, sub: "no period has closed" },
        { label: "Modelled annual", value: inr(p.distribution), money: true,
          sub: "once stabilised", conf: "modelled" },
        { label: "First expected", value: "post-" + PROGRAMME[3].w.split("– ")[1],
          sub: "after handover and stabilisation", conf: "forecast" },
      ] },
      { kind: "empty", what: "No distributions",
        because: PRE_OP + " Stage six runs only after operating costs, the brand, both reserves and " +
                 "debt service — and not at all if paying would take the reserve below its floor.",
        when: "Each declared distribution appears here with its waterfall breakdown and payment state." },
    ],
  },
  "/member/distributions/[ref]": emptyRef("Distribution", "distribution"),

  "/member/documents": {
    title: "Documents",
    eyebrow: "Member",
    lead: "The standing corpus, plus everything your position binds you to. Versioned, dated, never paraphrased.",
    disclosure: d(
      "The seven standing documents — they are public law, readable by anyone.",
      "Your acknowledgements join: which version you accepted, and when.",
      "The Vehicle Agreement and your register entry join at settlement.",
      "Operational notices and period statements file here as they issue.",
    ),
    sections: [
      { kind: "table", label: "Standing documents",
        cols: [{ h: "Document" }, { h: "Id" }, { h: "Version", num: true }, { h: "In force" }, { h: "Reading", num: true }],
        rows: DOCUMENTS.map((doc) => [
          doc.title, { v: doc.id, mono: true }, { v: "v" + doc.version, mono: true },
          doc.effective, { v: readingMinutes(doc) + " min", dim: true },
        ]),
        note: "Documents are read at their home address under /legal. Nothing on this platform " +
              "paraphrases them — a summary is a second wording that drifts." },
      { kind: "empty", what: "No position documents yet",
        because: "The Vehicle Agreement and the register extract attach at settlement of a real " +
                 "position; the worked demonstration carries none.",
        when: "They appear here the day the Member Law fires, and never leave." },
      { kind: "links", items: [{ t: "The legal corpus", to: "/legal", primary: true }] },
    ],
  },
  "/member/documents/[id]": ((id: string) => {
    const doc = DOCUMENTS.find((x) => x.id.toLowerCase() === id.toLowerCase());
    return doc ? {
      title: doc.title,
      eyebrow: `${doc.id} · v${doc.version} · in force from ${doc.effective}`,
      lead: "This is a pointer, not a copy. The document is read at its home address, where its " +
            "version history lives.",
      disclosure: d(
        "The standing documents are public in full.",
        "Your acknowledgement state for this document joins.",
        "Binding force: the version you acknowledged is recorded against your position.",
        "Version changes notify you here and by mail, with the diff.",
      ),
      sections: [
        { kind: "kv", rows: [
          { k: "Document", v: doc.title },
          { k: "Version", v: "v" + doc.version, mono: true },
          { k: "In force from", v: doc.effective, mono: true },
          { k: "Reading time", v: readingMinutes(doc) + " minutes", mono: true },
        ] },
        { kind: "links", items: [{ t: "Read it in full", to: doc.path, primary: true }] },
      ],
    } : {
      title: "Unknown document",
      eyebrow: "Member · documents",
      lead: "No document answers to this identifier.",
      disclosure: d(
        "The corpus index is public.", "Identical.", "Your documents list at /member/documents.",
        "Operational filings join the same index.",
      ),
      sections: [
        { kind: "empty", what: "Nothing at this identifier",
          because: "Document ids are stable and listed; this one is not among them.",
          when: "The index at /member/documents is complete." },
        { kind: "links", items: [{ t: "All documents", to: "/member/documents", primary: true }] },
      ],
    };
  }),

  "/member/entitlement": {
    title: "Entitlement",
    eyebrow: `Time · ${LLP.name}`,
    lead: "Time is ownership: a static yearly allocation × your stake, from a pool the property can actually deliver.",
    disclosure: d(
      "The mechanics — pool, floor rule, and when entitlement begins — are public doctrine.",
      "Identical; entitlement never attaches to accreditation.",
      "Your allocation appears at settlement: floor(pool × stake), stated per year.",
      "Drawable nights, and the operational calendar, from handover.",
    ),
    sections: [
      { kind: "figures", items: [
        { label: "Your allocation", value: `${p.nights.min}–${p.nights.max}`, nights: true,
          sub: `floor of ${NIGHT_POOL.min}–${NIGHT_POOL.max} × ${pct(p.bps)}` },
        { label: "Drawable now", value: "0", nights: true, sub: "begins at handover" },
        { label: "Handover", value: PROGRAMME[3].w, sub: PROGRAMME[3].stage, conf: "forecast" },
      ] },
      { kind: "note", tone: "steel", strong: "The pool is divided, never multiplied.",
        text: "Each position takes its floor of the vehicle pool, so the sum of every partner's " +
              "entitlement can never exceed what the property delivers. Half a night is not a night." },
      { kind: "prose", paras: [
        "Allocation is static — it does not vary with season, conduct or usage. What the vehicle " +
        "records is who controls time; the operating calendar itself is the Operating Company's " +
        "record, outside this domain by direction.",
      ] },
    ],
  },
  "/member/entitlement/[year]": ((year: string) => ({
    title: `Entitlement · ${/^\d{4}$/.test(year) ? year : "—"}`,
    eyebrow: `Time · ${LLP.name}`,
    lead: /^\d{4}$/.test(year) && Number(year) >= 2028
      ? "The allocation year, once the ownership calendar for it is opened."
      : "No allocation year exists before handover.",
    disclosure: d(
      "The year structure is public doctrine.",
      "Identical before commitment.",
      "Your per-year allocation from the year the calendar opens.",
      "Draws against the year, and what remains, in operation.",
    ),
    sections: [
      { kind: "empty", what: `No ownership calendar for ${year}`,
        because: "The first calendar opens with the property — handover is programmed for " +
                 PROGRAMME[3].w + ". A year before that has nothing to allocate.",
        when: "Each year's record opens with the vehicle's calendar resolution and lists your " +
              "allocation, reserved days and blackout rules." },
      { kind: "links", items: [{ t: "Entitlement overview", to: "/member/entitlement", primary: true }] },
    ],
  })),

  "/member/notifications": {
    title: "Notifications",
    eyebrow: "Member",
    lead: "Everything the platform has told you, in order, kept. Nothing generates a notification yet.",
    disclosure: d(
      "Nothing — notices attach to a person.",
      "Application events (received, decided) begin at KYC.",
      "Settlement, resolutions, document versions and distribution events join at commitment.",
      "Operational notices — calendar, draws, telemetry alerts — join at go-live.",
    ),
    sections: [
      { kind: "empty", what: "No notifications",
        because: "No event source is wired: settlement, resolutions and distributions all await " +
                 "persistence. The surface exists first so events have somewhere to land.",
        when: "The first real notification is likely to be an accreditation receipt." },
      { kind: "links", items: [{ t: "Notification settings", to: "/member/settings/notifications" }] },
    ],
  },

  "/member/reports": {
    title: "Reports",
    eyebrow: `Member · ${LLP.name}`,
    lead: "Period statements for the vehicle: balance sheet, profit and loss, cash flow, capital accounts.",
    disclosure: d(
      "Nothing — vehicle reporting is for its partners.",
      "Nothing before commitment.",
      "Every closed period's statements, plus your capital account.",
      "The first statements follow the first operating period; construction periods report progress instead.",
    ),
    sections: [
      { kind: "empty", what: "No closed period",
        because: "The vehicle has operated for no period: " + PRE_OP.toLowerCase(),
        when: "Statements file here per period, audited annually — every GC vehicle crosses the " +
              "audit threshold at formation." },
      { kind: "kv", label: "What each period will carry", rows: [
        { k: "Balance sheet", v: "Assets, facility outstanding, reserves, capital" },
        { k: "Profit & loss", v: "Revenue through the six-stage waterfall" },
        { k: "Cash flow", v: "Operating, financing, and reserve movements" },
        { k: "Capital accounts", v: "Per partner: contributed, share of profit, closing balance" },
      ] },
    ],
  },

  "/member/resolutions/[ref]": ((ref: string) => ({
    title: `Resolution ${ref.toUpperCase()}`,
    eyebrow: `Governance · ${LLP.name}`,
    lead: "No resolution answers to this reference yet.",
    disclosure: d(
      "Nothing — resolutions are partner business.",
      "Nothing before commitment.",
      "The text, the threshold, your cast weight, and — after close — the tally.",
      "Outcomes publish with the tally; who voted how never does (ADR-0008).",
    ),
    sections: [
      { kind: "empty", what: `No resolution at ${ref.toUpperCase()}`,
        because: "The vehicle has opened no resolution. The register begins with the first partner vote.",
        when: "Each resolution carries its threshold from §24a and closes on its stated date." },
      { kind: "kv", label: "The thresholds that will apply",
        rows: GOVERNANCE.map((g) => ({ k: g.k, v: g.v })) },
    ],
  })),

  "/member/settings": {
    title: "Settings",
    eyebrow: "Member",
    lead: "The account, not the position. Nothing here can touch the register.",
    disclosure: d(
      "Nothing — settings attach to an account.",
      "Contact and notification preferences from identification.",
      "Tax and security settings join with the position they protect.",
      "Unchanged at operation; settings never gain financial power.",
    ),
    sections: [
      { kind: "cards", label: "Sections", items: [
        { t: "Notifications", meta: "Delivery", body: "Which events reach you, and where. The legally required notices cannot be switched off." },
        { t: "Security", meta: "Access", body: "Sessions and sign-in methods, once identity connects." },
        { t: "Tax", meta: "Records", body: "PAN and residency as reporting uses them. Corrections flow through the passport." },
      ] },
      { kind: "note", tone: "steel", strong: "Deliberately powerless.",
        text: "No setting transfers, commits, or draws anything. Everything that moves capital lives " +
              "behind its own deliberate control, not a toggle." },
      { kind: "links", items: [
        { t: "Notifications", to: "/member/settings/notifications", primary: true },
        { t: "Security", to: "/member/settings/security" },
        { t: "Tax", to: "/member/settings/tax" },
      ] },
    ],
  },
  "/member/settings/notifications": {
    title: "Notification settings",
    eyebrow: "Member · settings",
    lead: "Choose delivery, not existence: statutory notices are sent regardless, and the page says which.",
    disclosure: d(
      "Nothing — preferences attach to an account.",
      "Editable from identification.",
      "The mandatory set is marked once a position makes notices statutory.",
      "Operational alerts join the list at go-live.",
    ),
    sections: [
      { kind: "table", label: "Events",
        cols: [{ h: "Event" }, { h: "Channel" }, { h: "Optional" }],
        rows: [
          ["Resolution opened / closing / decided", "Email + in-product", { v: "No — statutory", dim: true }],
          ["Document version changes", "Email", { v: "No — statutory", dim: true }],
          ["Distribution declared / paid / blocked", "Email + in-product", { v: "No — statutory", dim: true }],
          ["Journal and platform writing", "Email", "Yes"],
          ["Entitlement calendar events", "In-product", "Yes"],
        ],
        note: "Nothing sends yet — no event source is wired. The split between statutory and " +
              "optional is the design decision this page exists to state." },
    ],
  },
  "/member/settings/security": {
    title: "Security",
    eyebrow: "Member · settings",
    lead: "Sessions, sign-in methods and recovery — once there is an identity to secure.",
    disclosure: d(
      "Nothing — there is no account surface without an account.",
      "Sessions and methods from identification.",
      "Step-up confirmation guards anything that could read the register.",
      "Unchanged at operation.",
    ),
    sections: [
      { kind: "empty", what: "No identity provider connected",
        because: "Sign-in, sessions and recovery arrive with the identity integration; securing an " +
                 "account that cannot exist yet would be theatre.",
        when: "This page lists active sessions and methods the day identity connects." },
    ],
  },
  "/member/settings/tax": {
    title: "Tax",
    eyebrow: "Member · settings",
    lead: "The records reporting will use: PAN, residency, and the statements each year produces.",
    disclosure: d(
      "Nothing — tax records are the most private thing here.",
      "PAN and residency carry over from the passport.",
      "Your capital account and TDS certificates attach per period.",
      "Yearly statements issue from the first operating year.",
    ),
    sections: [
      { kind: "kv", label: "What reporting uses", rows: [
        { k: "PAN", v: "From the passport — corrected there, reflected here" },
        { k: "Tax residency", v: "Declared at accreditation; changes need re-declaration" },
        { k: "TDS", v: "Deducted at source on distributions where the Act requires" },
        { k: "Capital account", v: "Issued with the vehicle's annual statements" },
      ] },
      { kind: "note", tone: "steel",
        text: "Nothing here is tax advice. The platform reports what the law requires and no more." },
    ],
  },
};
