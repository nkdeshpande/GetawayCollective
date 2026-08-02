/**
 * Composed office and capital surfaces, plus the parameterised
 * commitment path.
 *
 * The office vantage reads MORE of the same records, never different
 * ones. Everything here derives from the same canon the public pages
 * read — slowspace, the property records, the statutory mirror, the
 * authority matrix — with the operational registers stated as absent
 * until persistence exists.
 */
import type { Entry } from "@/app/_assemblies/compose";
import { d } from "./shared";
import { PROPERTIES, inr, RESERVE, WATERFALL, rate, GROSS } from "@/app/_assemblies/data";
import {
  LLP, SITE, STACK, EQUITY, PROJECT, GROSS_REVENUE, DSCR, PROGRAMME,
  ALLOCATION, LADDER, MIN_UNIT, SUBSCRIBED_UNITS, UNITS_IN_VEHICLE, REMAINING_BPS,
  RISKS_SLOWSPACE, DISCLOSURE, GOVERNANCE,
} from "@/app/_assemblies/slowspace";
import { STATUTORY_MIRROR, REGISTERED_CANDIDATES } from "@/constants/vehicle-domain";
import { FUNCTIONS, EXECUTIVES, WORKFLOWS, AI_ESCALATION_MATTERS } from "@/constants/operating-model";
import { INTERNAL_ONLY_RIGHTS } from "@/lib/access-admin";
import { FORMATION } from "@/content/admin";
import { ROLE_RIGHTS } from "@/lib/authority";

const pct = (bps: number) => (bps / 100).toFixed(0) + "%";
const roleName = (r: string) =>
  r.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

/* One honest line for every empty operational register. */
const NO_OPS =
  "The vehicle has operated for no period; the property is at pre-construction.";

const isPDB = (id: string) =>
  ["aac-4471", "pdb-01", "slowspace-coastal"].includes(id.toLowerCase());

/* ── The commitment path, parameterised ──────────────────────────── */

const offeringPage = (tail: "" | "risk" | "execute") => ((offering: string): ReturnType<Extract<Entry, (p: string) => unknown>> => {
  const known = isPDB(offering) || offering.toLowerCase() === "slowspace";
  if (!known) {
    return {
      title: "Unknown offering",
      eyebrow: "Commitment path",
      lead: "No offering answers to this reference. One offering exists today.",
      disclosure: d(
        "The list of open offerings is public.",
        "The commitment path opens here, after accreditation.",
        "Your committed offering keeps this address until settlement.",
        "A settled offering closes; the vehicle console takes over.",
      ),
      sections: [
        { kind: "empty", what: "Nothing at this reference",
          because: "Offerings are few and named. The one open today is SlowSpace Coastal LLP.",
          when: "New offerings appear on the public collection first." },
        { kind: "links", items: [{ t: "The open offering", to: "/flow", primary: true }] },
      ],
    };
  }
  const step = tail === "" ? "Review" : tail === "risk" ? "Risk disclosure" : "Execution";
  return {
    title: `${LLP.name} · ${step}`,
    eyebrow: "Commitment path · accredited",
    lead: "This parameterised path serves the general case. The worked flow carries the same steps " +
          "with every figure live — it is the same instrument, not a substitute.",
    disclosure: d(
      "The offering's public figures — the same ones on the collection page.",
      "This path itself: review, risk and execution open after PR-01.",
      "Your selected size travels the path; the piston at the end is the only control that moves capital.",
      "The path closes at settlement; the console holds the position from then on.",
    ),
    sections: [
      { kind: "kv", label: "The offering", rows: [
        { k: "Vehicle", v: LLP.name },
        { k: "Property", v: `${SITE.name} · ${SITE.jurisdiction}` },
        { k: "Minimum unit", v: `${inr(MIN_UNIT)} · ${pct(ALLOCATION.minBps)}`, mono: true },
        { k: "Remaining", v: pct(REMAINING_BPS), mono: true },
        { k: "Disclosure", v: `v${DISCLOSURE.version} · ${DISCLOSURE.dated}`, mono: true },
      ] },
      { kind: "links", items: [
        { t: tail === "" ? "Review in the worked flow" : tail === "risk" ? "Read the disclosure" : "Go to the commitment",
          to: tail === "" ? "/flow" : tail === "risk" ? "/flow/risk" : "/flow/commit", primary: true },
      ] },
    ],
  };
});

/* ── Compositions ────────────────────────────────────────────────── */

export const OFFICE_PAGES: Record<string, Entry> = {
  "/commit/[offering]": offeringPage(""),
  "/commit/[offering]/risk": offeringPage("risk"),
  "/commit/[offering]/execute": offeringPage("execute"),

  /* ── Capital office ─────────────────────────────────────────────── */

  "/capital": {
    title: "Capital",
    eyebrow: "Office · the financial position",
    lead: "Everything the vehicle receives, owes, earns, preserves and distributes — the Capital domain, at office vantage.",
    disclosure: d(
      "The doctrine and the waterfall shape are public at /collection/slowspace-coastal/investment.",
      "Offering terms in full detail after accreditation.",
      "Partners see their own slice of these figures in the console.",
      "Live ledgers, reserves and covenant headroom, per period, at operation.",
    ),
    sections: [
      { kind: "figures", items: [
        { label: "Project", value: inr(PROJECT), money: true, sub: `${LLP.name}` },
        { label: "Equity layer", value: inr(EQUITY), money: true,
          sub: `${SUBSCRIBED_UNITS} of ${UNITS_IN_VEHICLE} units subscribed` },
        { label: "Facility", value: inr(STACK.debt), money: true, sub: "drawn during construction only" },
        { label: "Debt cover", value: DSCR.toFixed(2) + "×", sub: "derived, never asserted", conf: "modelled" },
      ] },
      { kind: "links", items: [
        { t: "Offerings", to: "/capital/offerings", primary: true },
        { t: "Properties", to: "/capital/properties" },
        { t: "The waterfall", to: "/capital/waterfall" },
        { t: "Risk", to: "/capital/risk" },
      ] },
    ],
  },

  "/capital/calls": {
    title: "Capital calls",
    eyebrow: "Office · capital",
    lead: "The call register, across every vehicle. Empty, and structurally likely to remain so.",
    disclosure: d(
      "Nothing — the office register is never public.",
      "Nothing at KYC; calls concern positions.",
      "A partner sees their own calls; this page sees all of them.",
      "Rare after construction: the model funds build from the facility, not from calls.",
    ),
    sections: [
      { kind: "empty", what: "No calls, any vehicle",
        because: "Commitments settle in full; construction draws the facility. A call would need a " +
                 "resolution and would appear here with it.",
        when: "The register lists every call with its resolution reference, due date and cover." },
    ],
  },

  "/capital/distributions": {
    title: "Distributions",
    eyebrow: "Office · capital",
    lead: "Stage six, across every vehicle and period. Nothing has run.",
    disclosure: d(
      "The waterfall mechanics are public; amounts are not.",
      "Nothing at KYC.",
      "A partner sees their own; the office sees the full run per period.",
      "Fills quarterly from stabilisation — or records WHY it was blocked, which matters more.",
    ),
    sections: [
      { kind: "empty", what: "No distribution run", because: NO_OPS,
        when: "Each run records the six stages, the reserve test, and every partner amount." },
      { kind: "kv", label: "The reserve test that gates stage six", rows: [
        { k: "Reserve held (model)", v: inr(RESERVE.held), money: true },
        { k: "Reserve floor", v: inr(RESERVE.floor), money: true },
        { k: "Basis", v: RESERVE.basis },
      ], note: "Stage six does not run if paying it would take the reserve below its floor. Blocked " +
               "is a recorded outcome, not a silent skip." },
    ],
  },
  "/capital/distributions/[ref]": ((ref: string) => ({
    title: `Distribution ${ref.toUpperCase()}`,
    eyebrow: "Office · capital",
    lead: "No distribution run answers to this reference.",
    disclosure: d(
      "Nothing — office register.", "Nothing at KYC.",
      "Partners see their own amounts under /member/distributions.",
      "Every operational run gets a permanent reference here.",
    ),
    sections: [
      { kind: "empty", what: `Nothing at ${ref.toUpperCase()}`, because: NO_OPS,
        when: "References issue when a run is declared and never change." },
      { kind: "links", items: [{ t: "All distributions", to: "/capital/distributions", primary: true }] },
    ],
  })),

  "/capital/offerings": {
    title: "Offerings",
    eyebrow: "Office · capital formation",
    lead: "One offering is open. Its ladder, subscription state and terms, from the vehicle record.",
    disclosure: d(
      "The offering's existence and headline terms are public on the collection.",
      "Full terms and the disclosure document at accreditation.",
      "Subscription state per partner joins at commitment.",
      "An offering closes at full subscription; the register is permanent.",
    ),
    sections: [
      { kind: "table", label: "Open",
        cols: [{ h: "Vehicle" }, { h: "Minimum unit", num: true }, { h: "Ladder" },
               { h: "Subscribed", num: true }, { h: "Remaining", num: true }],
        rows: [[
          LLP.name,
          { v: inr(MIN_UNIT), money: true },
          { v: `${pct(LADDER[0])}–${pct(LADDER[LADDER.length - 1])} in ${pct(ALLOCATION.stepBps)} steps`, mono: true },
          { v: `${SUBSCRIBED_UNITS}/${UNITS_IN_VEHICLE} units`, mono: true },
          { v: pct(REMAINING_BPS), mono: true },
        ]],
        note: "The ceiling is constitutional, not commercial: above 50% a single partner carries " +
              "every ordinary resolution alone." },
      { kind: "links", items: [{ t: "The offering as an investor sees it", to: "/flow", primary: true }] },
    ],
  },

  "/capital/properties": {
    title: "Properties",
    eyebrow: "Office · the asset base",
    lead: "Every property, its vehicle and its valuation — with the source of each valuation stated.",
    disclosure: d(
      "Names, places and lifecycle are public on the collection.",
      "Valuation sources and figures in detail after accreditation.",
      "Partners see their vehicle's asset in the console.",
      "Telemetry and operating state join per property at go-live.",
    ),
    sections: [
      { kind: "table", label: "Register",
        cols: [{ h: "Property" }, { h: "Vehicle" }, { h: "Lifecycle" }, { h: "Valuation", num: true }, { h: "Source" }],
        rows: [
          ...PROPERTIES.map((x) => [
            `${x.ufr0060} · ${x.assetId}`, x.ufr0061, x.ufr0066,
            { v: inr(x.ufr0102), money: true }, { v: x.ufr0103, dim: true },
          ]),
          [`${SITE.name} · ${SITE.assetId}`, LLP.name, SITE.lifecycle,
           { v: inr(PROJECT), money: true }, { v: "Project cost — no valuation exists pre-construction", dim: true }],
        ],
        note: "A management estimate renders as an estimate. The register never flattens who " +
              "produced a number." },
    ],
  },
  "/capital/properties/[id]": ((id: string) => {
    const x = PROPERTIES.find((q) => q.assetId.toLowerCase() === id.toLowerCase());
    const pdb = isPDB(id);
    return {
      title: x ? x.ufr0060 : pdb ? SITE.name : "Unknown property",
      eyebrow: "Office · property record",
      lead: x || pdb ? "The record at office vantage — the same record every other surface reads."
                     : "No property answers to this identifier.",
      disclosure: d(
        "The public face of the same record is on the collection.",
        "Valuation detail after accreditation.",
        "Partners read it through the console.",
        "Operating telemetry attaches at go-live.",
      ),
      sections: x ? [
        { kind: "kv", rows: [
          { k: "Asset", v: `${x.ufr0060} · ${x.assetId}`, mono: true },
          { k: "Jurisdiction", v: x.ufr0063 },
          { k: "Vehicle", v: x.ufr0061 },
          { k: "Lifecycle", v: x.ufr0066 },
          { k: "Valuation", v: `${inr(x.ufr0102)} · ${x.ufr0103}`, money: true },
          { k: "Units", v: `${x.held} of ${x.units} held`, mono: true },
        ] },
        { kind: "links", items: [
          { t: "Programme", to: `/capital/properties/${x.assetId.toLowerCase()}/programme` },
          { t: "Valuations", to: `/capital/properties/${x.assetId.toLowerCase()}/valuations`, primary: true },
        ] },
      ] : pdb ? [
        { kind: "kv", rows: [
          { k: "Asset", v: `${SITE.name} · ${SITE.assetId}`, mono: true },
          { k: "Jurisdiction", v: SITE.jurisdiction },
          { k: "Vehicle", v: LLP.name },
          { k: "Lifecycle", v: SITE.lifecycle },
          { k: "Land", v: SITE.landArea },
          { k: "Project", v: inr(PROJECT), money: true },
        ] },
        { kind: "links", items: [
          { t: "Programme", to: "/capital/properties/pdb-01/programme", primary: true },
          { t: "The offering", to: "/flow" },
        ] },
      ] : [
        { kind: "empty", what: "Unknown identifier",
          because: "Property ids are stable and few.",
          when: "The register at /capital/properties is complete." },
        { kind: "links", items: [{ t: "All properties", to: "/capital/properties", primary: true }] },
      ],
    };
  }),
  "/capital/properties/[id]/programme": ((id: string) => ({
    title: (isPDB(id) ? SITE.name : id.toUpperCase()) + " · Programme",
    eyebrow: "Office · development",
    lead: isPDB(id)
      ? "Design to handover, with where capital sits at each stage."
      : "Only a property in development carries a programme.",
    disclosure: d(
      "The public offering shows the same programme — this is not a second version.",
      "Identical detail at accreditation.",
      "Partners track it in the console; delays are notices, not surprises.",
      "The programme retires at handover; operations reporting replaces it.",
    ),
    sections: isPDB(id) ? [
      { kind: "stages", label: "The programme",
        items: PROGRAMME.map((s, i) => ({ n: s.w, t: s.stage, st: s.capital, now: i === 0 })),
        note: PROGRAMME[0].detail },
    ] : [
      { kind: "empty", what: "No programme",
        because: "This property is stabilised or unknown; programmes belong to development.",
        when: "A development programme appears with the vehicle that undertakes it." },
    ],
  })),
  "/capital/properties/[id]/valuations": ((id: string) => {
    const x = PROPERTIES.find((q) => q.assetId.toLowerCase() === id.toLowerCase());
    return {
      title: (x ? x.ufr0060 : isPDB(id) ? SITE.name : id.toUpperCase()) + " · Valuations",
      eyebrow: "Office · asset protection",
      lead: "Every valuation, with who produced it and when. The source is part of the figure.",
      disclosure: d(
        "The current figure and source are public per property.",
        "History in detail after accreditation.",
        "NAV effects flow to partner statements.",
        "Annual revaluation cadence begins at operation.",
      ),
      sections: x ? [
        { kind: "table", label: "History",
          cols: [{ h: "Valued on" }, { h: "Amount", num: true }, { h: "Source" }],
          rows: [[{ v: x.ufr0101, mono: true }, { v: inr(x.ufr0102), money: true }, x.ufr0103]],
          note: "One valuation exists per property today. The table is the register, not a sample." },
      ] : [
        { kind: "empty", what: "No valuation",
          because: isPDB(id)
            ? "Pre-construction: the honest figure is project cost, " + inr(PROJECT) + ", and calling " +
              "it a valuation would launder a budget into an appraisal."
            : "Unknown property identifier.",
          when: "The first appraisal follows practical completion." },
      ],
    };
  }),

  "/capital/risk": {
    title: "Risk",
    eyebrow: "Office · oversight",
    lead: "The register behind the public disclosure — same items, office lens.",
    disclosure: d(
      "The full disclosure text is public at /legal/risk-disclosure.",
      "The per-asset disclosure gates the commitment path.",
      "Partners acknowledge a version; the acknowledgement is recorded with identity and time.",
      "Covenant proximity and live risk telemetry join at operation.",
    ),
    sections: [
      { kind: "table", label: `Register · ${LLP.name}`,
        cols: [{ h: "N", num: true }, { h: "Item" }, { h: "First line" }],
        rows: RISKS_SLOWSPACE.map((r) => [
          { v: r.n, mono: true }, r.t, { v: r.p[0], dim: true },
        ]),
        note: "Total loss is stated outside the numbered sequence, deliberately — see the disclosure itself." },
      { kind: "links", items: [
        { t: "The standing disclosure", to: "/legal/risk-disclosure", primary: true },
        { t: "The per-asset disclosure", to: "/flow/risk" },
      ] },
    ],
  },

  /* ── Admin office ───────────────────────────────────────────────── */

  "/admin": {
    title: "Administration",
    eyebrow: "Office vantage",
    lead: "The offices, the vehicles, and the constitutional machinery — with every operational register honest about being empty.",
    disclosure: d(
      "Nothing. Admin never has a public face.",
      "Nothing at KYC.",
      "Nothing at commitment — admin is a RIGHT, not a stage; a partner without an office sees none of it.",
      "Operational registers (ledger, telemetry, compliance events) fill from go-live.",
    ),
    sections: [
      { kind: "figures", items: [
        { label: "Vehicles", value: "1", sub: LLP.name },
        { label: "Offices", value: String(Object.keys(ROLE_RIGHTS).length), sub: "constituted roles, no super-admin" },
        { label: "Statutory obligations", value: String(STATUTORY_MIRROR.length), sub: "mirrored, per vehicle" },
        { label: "§33 queue", value: String(REGISTERED_CANDIDATES.length), sub: "candidate objects registered" },
      ] },
      { kind: "links", items: [
        { t: "Vehicles", to: "/admin/vehicles", primary: true },
        { t: "Governance", to: "/admin/governance" },
        { t: "Compliance", to: "/admin/compliance" },
        { t: "Authority", to: "/admin/authority" },
      ] },
    ],
  },

  "/admin/authority": {
    title: "Authority",
    eyebrow: "Office · the operating model",
    lead: "Humans make fiduciary decisions. AI manages information. Partner firms execute. " +
          "A title, an employer, or an engagement never creates authority — only a named, " +
          "time-bound, reasoned grant does.",
    disclosure: d(
      "Nothing — the matrix is internal.",
      "Nothing at KYC.",
      "Partners see OUTCOMES of authority (resolutions, filings), never the matrix.",
      "Grants, expiries and separation alerts become live views on the register.",
    ),
    sections: [
      { kind: "table", label: "Constitutional functions",
        cols: [{ h: "Function" }, { h: "Purpose" }, { h: "Owns" }, { h: "Decides?" }],
        rows: FUNCTIONS.map((f) => [
          f.name, f.purpose, { v: f.owns.join(" · "), dim: true },
          { v: f.neverDecides ? "NEVER — escalates only" : "within its rights", mono: true },
        ]),
        note: "The AI Operating Layer (GC-01 / GC-02) drafts, classifies, monitors, routes and " +
              "assembles. It creates escalations, never approvals — the checks in " +
              "constants/operating-model.ts refuse a deciding AI at load." },
      { kind: "kv", label: "Executive leadership",
        rows: EXECUTIVES.flatMap((e) => [
          { k: e.title, v: e.accountableFor + " — may decide: " + e.mayDecide.join("; ") },
          { k: "…must not decide alone", v: e.mustNotDecideAlone.join("; ") },
        ]),
        note: "An executive who lists nothing they cannot decide alone is a super-admin, and the " +
              "model refuses to load one." },
      { kind: "table", label: "Offices and their rights (lib/authority.ts)",
        cols: [{ h: "Office" }, { h: "Rights held", num: true }, { h: "Rights" }],
        rows: Object.entries(ROLE_RIGHTS).map(([role, rights]) => [
          roleName(role), { v: String(rights.length), mono: true },
          { v: rights.join(" · "), dim: true, mono: true },
        ]),
        note: "separationViolations() proves no office holds a dangerous triad; requestGrant() " +
              "refuses the grant that would assemble one on a person." },
      { kind: "kv", label: "Internal-only rights — never granted to a partner identity",
        rows: [
          { k: String(INTERNAL_ONLY_RIGHTS.length) + " rights", v: INTERNAL_ONLY_RIGHTS.join(" · "), mono: true },
        ],
        note: "Everything that moves money, admits partners or changes the constitution stays " +
              "inside the constitutional functions. A partner firm is capacity, never authority." },
      { kind: "links", items: [
        { t: "Grants", to: "/admin/authority/grants", primary: true },
        { t: "Revocations", to: "/admin/authority/revocations" },
      ] },
    ],
  },
  "/admin/authority/grants": {
    title: "Grants",
    eyebrow: "Office · authority lifecycle (WF-3)",
    lead: "Request → verify standing → right + scope + expiry → conflict and separation check → " +
          "grantor approval → 30-day review → renew, reduce, or revoke.",
    disclosure: d(
      "Nothing — internal.", "Nothing at KYC.", "Nothing at commitment.",
      "The grant ledger is append-only from the first real grant; these views go live with it.",
    ),
    sections: [
      { kind: "kv", label: "What a grant must survive (lib/access-admin.ts)", rows: [
        { k: "1 · Named", v: "A verified person — a firm record is refused with the reason" },
        { k: "2 · Standing", v: "An active engagement (partner) or constitutional appointment (internal)" },
        { k: "3 · Scoped", v: "Enterprise or a named LLPIN. A scope of every vehicle is not a scope" },
        { k: "4 · Time-bound", v: "An expiry, always. A grant without one is a super-admin on layaway" },
        { k: "5 · Reasoned", v: "E-02 — the reason files with the grant" },
        { k: "6 · Separated", v: "Refused if it completes a GP-06 triad on the identity" },
        { k: "7 · Internal-only", v: "Capital and governance rights never reach a partner identity" },
      ], note: "Refusals return the WHOLE list, not the first — tested, 18 cases." },
      { kind: "cards", label: "The register views, ready for persistence", items: [
        { t: "Expiring", meta: "expiring()", body: "Every live grant inside the 30-day review window." },
        { t: "Separation alerts", meta: "separationAlerts()", body: "Any identity holding a full triad — the second net under the first refusal." },
        { t: "Unassigned rights", meta: "unassignedRights()", body: "Rights nobody holds: work that cannot currently be performed by anyone." },
      ] },
      { kind: "empty", what: "No grants recorded",
        because: "No identity exists to grant to. The lifecycle is executable and tested; the " +
                 "register persists with the database.",
        when: "Each grant records grantee, right, scope, grantor, reason, effective and expiry." },
    ],
  },
  "/admin/authority/revocations": {
    title: "Revocations",
    eyebrow: "Office · authority lifecycle",
    lead: "Rights taken back — with a reason, never by deletion, never twice.",
    disclosure: d(
      "Nothing — internal.", "Nothing at KYC.", "Nothing at commitment.",
      "Append-only from the first revocation.",
    ),
    sections: [
      { kind: "prose", paras: [
        "revokeGrant() keeps the original grant intact and adds the end: who revoked, when, and " +
        "why. A revocation with a trivial reason is refused exactly as a grant with one is — " +
        "the record has to answer the question someone asks a year later.",
      ] },
      { kind: "empty", what: "No revocations",
        because: "Nothing has been granted, so nothing can be revoked.",
        when: "Emergency revocation for the Digital Platform Partner operational access is part " +
              "of the same lifecycle — one mechanism, no special cases." },
    ],
  },

  "/admin/compliance": {
    title: "Compliance",
    eyebrow: "Office · the statutory mirror",
    lead: "Every obligation of an Indian LLP, mirrored in the domain so the calendar is derived, never kept by hand.",
    disclosure: d(
      "Nothing — internal, though the obligations themselves are public law.",
      "Nothing at KYC.",
      "Partners see outcomes: filings made, accounts audited.",
      "Deadlines begin binding per vehicle from incorporation; events log from go-live.",
    ),
    sections: [
      { kind: "table", label: "The mirror",
        cols: [{ h: "Ref" }, { h: "Instrument" }, { h: "Authority" }, { h: "Due" }, { h: "Applies" }],
        rows: STATUTORY_MIRROR.map((s) => [
          { v: s.ref, mono: true }, s.instrument, s.authority, s.due, { v: s.appliesWhen, dim: true },
        ]),
        note: "Every row lands on the ComplianceEvent object, so a new obligation added to the " +
              "mirror is automatically a calendar entry and a breach condition." },
      { kind: "links", items: [
        { t: "Events", to: "/admin/compliance/events" },
        { t: "Accreditation queue", to: "/admin/compliance/accreditation" },
        { t: "Conflicts", to: "/admin/compliance/conflicts" },
      ] },
    ],
  },
  "/admin/compliance/accreditation": {
    title: "Accreditation queue",
    eyebrow: "Office · compliance",
    lead: "PR-01 applications awaiting decision. The 15-working-day clock is the platform's obligation, not the applicant's.",
    disclosure: d(
      "Nothing — applications are personal data.",
      "An applicant sees their own state, never the queue.",
      "Unchanged at commitment.",
      "Annual reviews join the same queue from the first anniversary.",
    ),
    sections: [
      { kind: "empty", what: "No applications",
        because: "No identity exists to apply. The worked flow demonstrates the applicant's side; " +
                 "this is where each application would land for decision.",
        when: "Each entry shows days remaining on the clock — COMPLETE-THEN-SUSPEND (§24b) means " +
              "an application in flight always completes." },
    ],
  },
  "/admin/compliance/conflicts": {
    title: "Conflicts",
    eyebrow: "Office · compliance",
    lead: "Declared interests, and the gate that keeps a conflicted office out of a decision.",
    disclosure: d(
      "Nothing — internal.", "Nothing at KYC.",
      "A conflicted decision names the recusal in its record; partners see that.",
      "Live from the first declared interest.",
    ),
    sections: [
      { kind: "empty", what: "No declared conflicts",
        because: "Nine capabilities are conflict-sensitive (I-07) and each checks the register " +
                 "before executing. The register is empty because there is nobody to declare.",
        when: "A declaration records the interest, its scope, and every decision it touched." },
    ],
  },
  "/admin/compliance/events": {
    title: "Compliance events",
    eyebrow: "Office · compliance",
    lead: "Filings made, deadlines met or missed, conditions discharged. The derived calendar's ledger.",
    disclosure: d(
      "Nothing — internal.", "Nothing at KYC.",
      "Material failures affecting partner rights must be disclosed to them — that rule is in the registry.",
      "The ledger runs from incorporation; the first entries are Form 3 and PAN/TAN.",
    ),
    sections: [
      { kind: "empty", what: "No events",
        because: "The event ledger needs persistence, which is not connected.",
        when: "Events derive from the statutory mirror — each obligation fires calendar entries " +
              "that resolve to met, missed or discharged." },
      { kind: "links", items: [{ t: "The statutory mirror", to: "/admin/compliance", primary: true }] },
    ],
  },

  "/admin/failure": {
    title: "Constitutional failure",
    eyebrow: "Office · the last surface",
    lead: "Where the platform admits an invariant broke. Reached by link from an incident, never browsed to.",
    disclosure: d(
      "Nothing — and its title never leaks to anonymous visitors either.",
      "Nothing at KYC.",
      "Material failures affecting investor rights are disclosed to those affected, by notice.",
      "In operation this page carries the incident record: what broke, what it touched, what was done.",
    ),
    sections: [
      { kind: "prose", paras: [
        "A constitutional failure is an invariant caught false in production — money not conserving, " +
        "an aperture widening, a sealed ballot readable. The response is stated here in advance: " +
        "stop the affected capability, record the incident, notify the affected, fix the cause, " +
        "and prove the fix with the same check that caught it.",
        "No failure has occurred. This page exists before the first one so the procedure is not " +
        "invented during it.",
      ] },
    ],
  },

  "/admin/governance": {
    title: "Governance",
    eyebrow: "Office · the operating law",
    lead: "Not a fourth business function: the constitutional layer that governs Space, Time and Capital.",
    disclosure: d(
      "The doctrine is public at /structure; the machinery is not.",
      "Nothing at KYC.",
      "Partners live inside this layer: resolutions, thresholds, registers.",
      "The governance calendar derives from the statutory mirror and runs from incorporation.",
    ),
    sections: [
      { kind: "kv", label: "Thresholds · §24a",
        rows: GOVERNANCE.map((g) => ({ k: g.k, v: g.v })) },
      { kind: "cards", label: "The machinery", items: [
        { t: "Resolutions", meta: "Register", body: "Contribution-weighted, ADR-0008: secret ballot, transparent outcome." },
        { t: "Committees", meta: "Offices", body: "Constituted quorums holding named rights. The Board acts by resolution, never by password." },
        { t: "Policies", meta: "Standing", body: "The documents in force, versioned, including every constitutional amendment." },
      ] },
      { kind: "table", label: "The four workflows (constants/operating-model.ts)",
        cols: [{ h: "Id" }, { h: "Workflow" }, { h: "Sequence" }],
        rows: WORKFLOWS.map((w) => [
          { v: w.id, mono: true }, w.name, { v: w.sequence.join(" → "), dim: true },
        ]),
        note: "Every workflow carries named control points; the docket state machine refuses " +
              "shortcuts, self-review, and evidence-free review (lib/access-admin.ts)." },
      { kind: "kv", label: "AI escalates — never approves — when a matter involves",
        rows: AI_ESCALATION_MATTERS.map((m, i) => ({ k: String(i + 1), v: m })) },
      { kind: "links", items: [
        { t: "Resolutions", to: "/admin/governance/resolutions", primary: true },
        { t: "Committees", to: "/admin/governance/committees" },
        { t: "Policies", to: "/admin/governance/policies" },
        { t: "Authority", to: "/admin/authority" },
      ] },
    ],
  },
  "/admin/governance/committees": {
    title: "Committees",
    eyebrow: "Office · governance",
    lead: "The constituted quorums. Each is an office with rights, members and a threshold — never a person with a password.",
    disclosure: d(
      "Nothing — internal.", "Nothing at KYC.",
      "Partners see committee DECISIONS through resolutions.",
      "Meeting records accumulate from the first constituted meeting.",
    ),
    sections: [
      { kind: "table", label: "Constituted offices",
        cols: [{ h: "Office" }, { h: "Rights", num: true }],
        rows: Object.entries(ROLE_RIGHTS).map(([role, rights]) => [
          roleName(role), { v: String(rights.length), mono: true },
        ]),
        note: "Membership is empty until identity connects; the offices exist constitutionally " +
              "regardless — a right can be defined before anyone holds it." },
    ],
  },
  "/admin/governance/policies": {
    title: "Policies",
    eyebrow: "Office · governance",
    lead: "Standing documents in force, and the amendment machinery that changes them.",
    disclosure: d(
      "The standing documents are public in full under /legal.",
      "Identical.",
      "Version changes notify every partner with the diff.",
      "Unchanged — policy is stage-independent law.",
    ),
    sections: [
      { kind: "prose", paras: [
        "Every standing document lives under /legal with its version and effective date. This " +
        "surface exists for the amendment side: proposing a change, carrying it through the " +
        "required threshold, and recording the new version — including §33 amendments, which is " +
        "how the domain model's registered candidates become ratified objects.",
      ] },
      { kind: "kv", label: "The §33 queue",
        rows: REGISTERED_CANDIDATES.map((c) => ({ k: c, v: "registered · awaiting Board", mono: true })),
        note: "Each candidate is needed by named constituents in constants/vehicle-domain.ts. " +
              "Ratifying one moves those constituents from registered to object." },
      { kind: "links", items: [{ t: "The legal corpus", to: "/legal", primary: true }] },
    ],
  },
  "/admin/governance/resolutions": {
    title: "Resolutions",
    eyebrow: "Office · governance",
    lead: "The register, across every vehicle. None has been opened.",
    disclosure: d(
      "Nothing — resolutions are partner business.",
      "Nothing at KYC.",
      "Partners vote on and read their vehicle's resolutions in the console.",
      "The register is append-only from the first opened resolution.",
    ),
    sections: [
      { kind: "empty", what: "No resolutions",
        because: "The vehicle is in formation-stage governance: decisions so far are the LLP " +
                 "Agreement itself, which is a document, not a resolution.",
        when: "Each entry carries its threshold, open and close dates, and — after close — the " +
              "tally. Never who voted how (ADR-0008)." },
      { kind: "kv", label: "Thresholds that will apply",
        rows: GOVERNANCE.filter((g) => g.k.includes("resolution") || g.k.includes("voting") || g.k.includes("Basis"))
          .map((g) => ({ k: g.k, v: g.v })) },
    ],
  },
  "/admin/governance/resolutions/[ref]": ((ref: string) => ({
    title: `Resolution ${ref.toUpperCase()}`,
    eyebrow: "Office · governance",
    lead: "No resolution answers to this reference.",
    disclosure: d(
      "Nothing — partner business.", "Nothing at KYC.",
      "A partner reads it in the console once it exists.",
      "Permanent reference from the moment of opening.",
    ),
    sections: [
      { kind: "empty", what: `Nothing at ${ref.toUpperCase()}`,
        because: "The register is empty — no resolution has been opened on any vehicle.",
        when: "References are permanent once issued." },
      { kind: "links", items: [{ t: "The register", to: "/admin/governance/resolutions", primary: true }] },
    ],
  })),

  "/admin/ledger": {
    title: "Ledger",
    eyebrow: "Office · capital",
    lead: "The money spine: every movement, bigint minor units, largest-remainder splits, nothing lost.",
    disclosure: d(
      "Nothing — the ledger is internal.",
      "Nothing at KYC.",
      "Partners see their slice through statements, never raw entries.",
      "Live from the first real movement — the ₹50,000 deposit is likely first.",
    ),
    sections: [
      { kind: "empty", what: "No entries",
        because: "No payment processor and no persistence. Money exists in this build only as " +
                 "modelled figures, each marked as modelled.",
        when: "The first entry will be a deposit; the ledger is append-only from then on." },
      { kind: "kv", label: "The rules already in force", rows: [
        { k: "Representation", v: "bigint minor units, scaled 10⁴ — never a float" },
        { k: "Splits", v: "Largest remainder — parts sum exactly, always" },
        { k: "Waterfall", v: "Six stages, closes to 100% of gross, checked at load" },
        { k: "Reserve", v: `${inr(rate(GROSS, 250))} per ${inr(GROSS)} of revenue (2.5%)`, money: true },
      ], note: "These are running in the model today, with " + String(WATERFALL.length - 1) + " stages proven to conserve every minor unit in tests." },
    ],
  },

  "/admin/reports": {
    title: "Reports",
    eyebrow: "Office · reporting",
    lead: "Period statements at office vantage, across vehicles. None exists to show.",
    disclosure: d(
      "Nothing — internal.", "Nothing at KYC.",
      "Partners receive per-vehicle statements at /member/reports.",
      "Quarterly from the first operating period; audited annually.",
    ),
    sections: [
      { kind: "empty", what: "No closed period", because: NO_OPS,
        when: "Construction periods report programme progress; operating periods report the four statements." },
    ],
  },

  "/admin/research": {
    title: "Research",
    eyebrow: "Office · platform tier",
    lead: "Market intelligence and research live ABOVE any vehicle — they exist before a vehicle does.",
    disclosure: d(
      "Published research appears in the Journal.",
      "Dossier-grade material attaches to the offering at accreditation.",
      "Unchanged at commitment.",
      "Operating data flows BACK into research from go-live — the loop closes.",
    ),
    sections: [
      { kind: "prose", paras: [
        "In the domain model, Market Intelligence and Research sit in the Platform tier: they are " +
        "inputs to forming a vehicle, not constituents of one. What a vehicle learns in operation " +
        "returns here, which is how the second property is chosen better than the first.",
      ] },
      { kind: "empty", what: "No structured research records",
        because: "Research today lives as the published Journal and the property dossiers.",
        when: "Structured records join when the intelligence objects gain persistence." },
      { kind: "links", items: [{ t: "The Journal", to: "/journal", primary: true }] },
    ],
  },

  "/admin/telemetry": {
    title: "Telemetry",
    eyebrow: "Office · operations",
    lead: "What each property's systems report, and how stale each feed is. Honesty about staleness is the feature.",
    disclosure: d(
      "A property's public page shows its telemetry state chip only.",
      "Identical at KYC.",
      "Partners see their vehicle's feed state in the console.",
      "This is the operational surface: live feeds begin at first commissioning.",
    ),
    sections: [
      { kind: "table", label: "Feeds",
        cols: [{ h: "Property" }, { h: "State" }, { h: "Last seen" }],
        rows: [
          ...PROPERTIES.map((x) => [
            x.ufr0060,
            { v: x.telemetry.state === "live" ? "live" : "STALE", mono: true },
            { v: x.telemetry.at, mono: true, dim: true },
          ]),
          [SITE.name, { v: "none", mono: true }, { v: "pre-construction — nothing to report", dim: true }],
        ],
        note: "A stale feed says stale. Model data; the pipe that would make it real is the " +
              "operational build." },
    ],
  },

  "/admin/vehicles": {
    title: "Vehicles",
    eyebrow: "Office · the register",
    lead: "Every constitutional vehicle the platform governs. One exists.",
    disclosure: d(
      "A vehicle's existence and its property are public.",
      "Offering-level detail at accreditation.",
      "Partners hold the console for their own vehicle.",
      "Statutory state (filings, audit) accrues per vehicle from incorporation.",
    ),
    sections: [
      { kind: "table", label: "Register",
        cols: [{ h: "Vehicle" }, { h: "LLPIN" }, { h: "Property" }, { h: "Stage" }, { h: "Equity", num: true }],
        rows: [[
          LLP.name, { v: LLP.llpin, mono: true }, `${SITE.name} · ${SITE.assetId}`,
          SITE.lifecycle, { v: inr(EQUITY), money: true },
        ]] },
      { kind: "links", items: [
        { t: "Open the vehicle", to: "/admin/vehicles/aac-4471", primary: true },
        { t: "Form a new vehicle", to: "/admin/vehicles/new" },
      ] },
    ],
  },
  "/admin/vehicles/[llpin]": ((llpin: string) => (isPDB(llpin) ? {
    title: LLP.name,
    eyebrow: `Office · vehicle · ${LLP.llpin}`,
    lead: "The vehicle record: entity, capital, subscription and its statutory spine.",
    disclosure: d(
      "Name, property and stage are public.",
      "Capital structure detail at accreditation.",
      "Partners read this same record through the console.",
      "Filings, charges and audit state accrue here per year.",
    ),
    sections: [
      { kind: "kv", label: "Entity", rows: [
        { k: "LLPIN", v: LLP.llpin, mono: true },
        { k: "Incorporated", v: LLP.incorporated, mono: true },
        { k: "Agreement dated", v: LLP.agreementDated, mono: true },
        { k: "Registered office", v: LLP.office },
        { k: "Registrar", v: LLP.registrar },
      ] },
      { kind: "figures", items: [
        { label: "Equity", value: inr(EQUITY), money: true,
          sub: `${SUBSCRIBED_UNITS}/${UNITS_IN_VEHICLE} units subscribed` },
        { label: "Facility", value: inr(STACK.debt), money: true, sub: "construction only" },
        { label: "Gross revenue (model)", value: inr(GROSS_REVENUE), money: true,
          sub: "at stabilisation", conf: "modelled" },
      ] },
      { kind: "links", items: [
        { t: "Filings", to: `/admin/vehicles/${llpin}/filings`, primary: true },
        { t: "Partners", to: `/admin/vehicles/${llpin}/partners` },
        { t: "Formation", to: `/admin/vehicles/${llpin}/formation` },
        { t: "Charges", to: `/admin/vehicles/${llpin}/charges` },
        { t: "Audit", to: `/admin/vehicles/${llpin}/audit` },
        { t: "Resolutions", to: `/admin/vehicles/${llpin}/resolutions` },
      ] },
    ],
  } : {
    title: "Unknown vehicle",
    eyebrow: "Office · vehicles",
    lead: "No vehicle answers to this identifier.",
    disclosure: d("Vehicle existence is public.", "Identical.", "Identical.", "Identical."),
    sections: [
      { kind: "empty", what: "Nothing at this LLPIN",
        because: "One vehicle exists: " + LLP.name + " at " + LLP.llpin + ".",
        when: "The register is complete." },
      { kind: "links", items: [{ t: "The register", to: "/admin/vehicles", primary: true }] },
    ],
  })),
  "/admin/vehicles/[llpin]/filings": ((llpin: string) => ({
    title: "Filings",
    eyebrow: `Office · ${isPDB(llpin) ? LLP.name : llpin.toUpperCase()}`,
    lead: "The statutory mirror, applied to this vehicle. Every obligation, its due date, its state.",
    disclosure: d(
      "Filings are public record at the MCA anyway; the working state here is not.",
      "Nothing at KYC.",
      "Partners see filing outcomes in the console's documents panel.",
      "Every row goes live at incorporation and resolves met / missed per cycle.",
    ),
    sections: isPDB(llpin) ? [
      { kind: "table", label: "Obligations",
        cols: [{ h: "Ref" }, { h: "Instrument" }, { h: "Due" }, { h: "State" }],
        rows: STATUTORY_MIRROR.map((s) => [
          { v: s.ref, mono: true }, s.instrument, s.due,
          { v: s.ref === "ST-01" ? "assumed filed at formation" : "pending first cycle", dim: true },
        ]),
        note: "States are placeholders until the compliance ledger persists — marked as such rather " +
              "than shown green." },
    ] : [
      { kind: "empty", what: "Unknown vehicle", because: "One vehicle exists.",
        when: "See the register." },
    ],
  })),
  "/admin/vehicles/[llpin]/partners": ((llpin: string) => ({
    title: "Partners",
    eyebrow: `Office · ${isPDB(llpin) ? LLP.name : llpin.toUpperCase()}`,
    lead: "The partner register — the record the Member Law writes.",
    disclosure: d(
      "Never public. The register is the most protected record on the platform.",
      "Nothing at KYC.",
      "A partner sees their own entry, and the aggregate — never other partners' identities.",
      "Form 4 files within 30 days of every change, from the first admission.",
    ),
    sections: isPDB(llpin) ? [
      { kind: "figures", items: [
        { label: "Units subscribed", value: `${SUBSCRIBED_UNITS} of ${UNITS_IN_VEHICLE}`,
          sub: pct(REMAINING_BPS) + " remains" },
        { label: "Registered partners", value: "0", sub: "no settlement has occurred" },
      ] },
      { kind: "empty", what: "No registered partners",
        because: "Subscription interest is not partnership. The Member Law fires on settlement — " +
                 "funds cleared against a signed Vehicle Agreement — and none has.",
        when: "Each admission writes the register and fires Form 4 (ST-08) within 30 days." },
    ] : [
      { kind: "empty", what: "Unknown vehicle", because: "One vehicle exists.", when: "See the register." },
    ],
  })),
  "/admin/vehicles/[llpin]/formation": ((llpin: string) => ({
    title: "Formation",
    eyebrow: `Office · ${isPDB(llpin) ? LLP.name : llpin.toUpperCase()}`,
    lead: "The formation sequence this vehicle followed — the same one /admin/vehicles/new runs forward.",
    disclosure: d(
      "The doctrine of formation is public at /structure.",
      "Nothing at KYC.",
      "Partners inherit the completed record in the console.",
      "Formation closes at incorporation; this page becomes history.",
    ),
    sections: isPDB(llpin) ? [
      { kind: "stages", label: "Sequence",
        items: FORMATION.map((s, i) => ({ n: s.n, t: s.title, st: i < 4 ? "complete" : "in progress", now: i === 4 })),
        note: "Gates are rights and resolutions, not clicks: each stage names the right that may " +
              "perform it." },
    ] : [
      { kind: "empty", what: "Unknown vehicle", because: "One vehicle exists.", when: "See the register." },
    ],
  })),
  "/admin/vehicles/[llpin]/charges": ((llpin: string) => ({
    title: "Charges",
    eyebrow: `Office · ${isPDB(llpin) ? LLP.name : llpin.toUpperCase()}`,
    lead: "Security interests over the vehicle's assets. The facility will create the first.",
    disclosure: d(
      "Registered charges are public at the MCA.",
      "The facility's existence is disclosed in the offering.",
      "Partners see the facility and its rank in the console.",
      "The charge registers when the facility draws — construction start.",
    ),
    sections: isPDB(llpin) ? [
      { kind: "empty", what: "No charge registered",
        because: "The " + inr(STACK.debt) + " facility is committed but undrawn; its charge " +
                 "registers at first drawdown, programmed for " + PROGRAMME[1].w + ".",
        when: "DebtFacility is a §33 candidate — until ratified, the facility's terms live in the " +
              "offering record. A covenant nobody can query is a covenant nobody monitors." },
    ] : [
      { kind: "empty", what: "Unknown vehicle", because: "One vehicle exists.", when: "See the register." },
    ],
  })),
  "/admin/vehicles/[llpin]/audit": ((llpin: string) => ({
    title: "Audit",
    eyebrow: `Office · ${isPDB(llpin) ? LLP.name : llpin.toUpperCase()}`,
    lead: "Every GC vehicle is audited: contribution crosses ₹25 lakh at formation, before the first rupee of revenue.",
    disclosure: d(
      "The audit requirement is public law.",
      "Nothing at KYC.",
      "Partners receive audited statements yearly.",
      "The first audit covers the first financial year; Form 8 follows it by 30 October.",
    ),
    sections: isPDB(llpin) ? [
      { kind: "kv", label: "Position", rows: [
        { k: "Threshold test", v: `Contribution ${inr(EQUITY)} > ₹25,00,000 — audit required`, mono: true },
        { k: "Consequence", v: "ITR-5 due 31 October, not 31 July" },
        { k: "Auditor", v: "Not yet appointed" },
        { k: "First audit period", v: "FY of incorporation (2026–27)" },
      ] },
      { kind: "empty", what: "No audit filed",
        because: "The first financial year has not closed.",
        when: "Statutory audit precedes Form 8 (ST-03/ST-04 in the mirror)." },
    ] : [
      { kind: "empty", what: "Unknown vehicle", because: "One vehicle exists.", when: "See the register." },
    ],
  })),
  "/admin/vehicles/[llpin]/resolutions": ((llpin: string) => ({
    title: "Resolutions",
    eyebrow: `Office · ${isPDB(llpin) ? LLP.name : llpin.toUpperCase()}`,
    lead: "This vehicle's resolution register. Empty — formation decisions live in the Agreement.",
    disclosure: d(
      "Nothing — partner business.",
      "Nothing at KYC.",
      "Partners vote here through the console from the first opened resolution.",
      "Reserved matters (land disposal, borrowing beyond ₹6 Cr) can ONLY happen through this register.",
    ),
    sections: isPDB(llpin) ? [
      { kind: "empty", what: "No resolutions",
        because: "No partner is registered to vote. The first resolutions typically follow first " +
                 "settlement: bank mandates, auditor appointment.",
        when: "Contribution-weighted per §24a; a tie is not approval." },
    ] : [
      { kind: "empty", what: "Unknown vehicle", because: "One vehicle exists.", when: "See the register." },
    ],
  })),
};
