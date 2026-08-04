/**
 * THE REMEDIATION REGISTRY — what violates the public laws, and where
 *
 * Authority: constants/public-laws.ts. Evidence: the remediation audit of
 * 4 Aug 2026, verified against this repository before anything was
 * written down. Every item below names the actual files involved, because
 * an item that says "the about page" makes the next agent re-run the
 * whole investigation.
 *
 * ── WHAT THIS REGISTRY IS ────────────────────────────────────────────
 * The work queue for the remediation program, as data. Day 01 creates it
 * and deliberately fixes nothing: the brief's core instruction is that
 * future sessions must be able to execute without interpreting prose, and
 * that requires the prose to become contracts first.
 *
 * ── VERIFIED, NOT TRANSCRIBED ────────────────────────────────────────
 * The audit was written against the deployed site. Each finding was
 * checked against source before being seeded, and the registry corrects
 * the audit where the code says otherwise. Two examples:
 *
 * The audit's "invented press quotes" on /about — /about renders the
 * Surface SCAFFOLD (app/_system/surface.tsx), which prints the assembly
 * registry's declared sections. The quotes are AS-32's registered section
 * copy showing through an unported surface. Same defect, different fix:
 * nothing to delete, a page to build.
 *
 * The audit's "~18% yield" — the figure is not hardcoded. It is folded
 * from the waterfall in app/_assemblies/data.ts and carries FORECAST.
 * What is missing is the BASIS travelling with it, not the class.
 *
 * ── STATUS DISCIPLINE ────────────────────────────────────────────────
 * An item moves to RESOLVED only when its acceptance criteria pass, and
 * NEEDS_HUMAN_CANON is a real status, not a failure: several fixes need a
 * decision no agent may invent — a lifecycle vocabulary, a figure basis,
 * a legal claim. Guessing those is the one way to make this registry
 * worse than the audit it replaces.
 */

import type { PublicLawId, ReviewType, Severity } from "./public-laws";

export type RemediationStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "NEEDS_HUMAN_CANON"
  | "READY_FOR_REVIEW"
  | "RESOLVED"
  | "WAIVED";

export type Viewport = "ALL" | "MOBILE" | "TABLET" | "DESKTOP";

export interface RemediationItem {
  readonly id: string;
  readonly title: string;
  /** Route path(s), or GLOBAL where the defect lives in shared chrome. */
  readonly route: string | readonly string[];
  readonly viewport: Viewport;
  readonly severity: Severity;
  readonly lawIds: readonly PublicLawId[];
  /** The defect, stated as a fact about the code. */
  readonly issue: string;
  /** Where it was verified. File:line where possible, audit § otherwise. */
  readonly evidence: readonly string[];
  readonly affectedSources: readonly string[];
  readonly recommendation: string;
  readonly acceptanceCriteria: readonly string[];
  readonly reviewType: ReviewType;
  /** Ids of items that must land first. */
  readonly dependencies: readonly string[];
  readonly status: RemediationStatus;
  /** What a human must decide, where status is NEEDS_HUMAN_CANON. */
  readonly humanCanonNeeded?: string;
}

const R = (r: RemediationItem): RemediationItem => Object.freeze(r);

export const REMEDIATION: readonly RemediationItem[] = [
  /* ═══ P0 ═══════════════════════════════════════════════════════ */

  R({
    id: "REM-001",
    title: "/about renders the internal scaffold, not an about page",
    route: "/about",
    viewport: "ALL",
    severity: "P0",
    lawIds: ["PUBLIC.01"],
    issue:
      "GC-400 maps to AS-32 with no ported component and no BY_PATH entry, so it falls through to " +
      "the Surface scaffold — which prints 'AS-32 · gateway vantage · public', the assembly's " +
      "declared sections, and scaffold language about unported components. The audit read this as " +
      "internal documentation routed to /about; it is an unported surface rendering its own " +
      "registry entry. Same wound, different fix: nothing to delete, a page to build.",
    evidence: [
      "constants/routes.ts:237 — GC-400 → AS-32",
      "scripts/gen-app.js PORTED/BY_PATH — no mapping for /about",
      "app/_system/surface.tsx — the scaffold and its header language",
      "audit §1",
    ],
    affectedSources: [
      "app/_system/surface.tsx", "scripts/gen-app.js", "constants/assemblies.ts", "content/public.ts",
    ],
    recommendation:
      "Build the real About surface answering: what GC is, why it exists, who is responsible, how " +
      "it is structurally different. The entity triad the footer already states is the spine. Map " +
      "it in gen-app like every other ported assembly.",
    acceptanceCriteria: [
      "/about renders no assembly id, vantage word or scaffold text.",
      "The four questions are answered above the fold in order.",
      "The Surface scaffold remains for genuinely unported office routes.",
    ],
    reviewType: "editorial",
    dependencies: [],
    status: "RESOLVED",
  }),

  R({
    id: "REM-002",
    title: "'Land acquired' overstates a possession-only record",
    route: "/collection/coorg-coffee-creek",
    viewport: "ALL",
    severity: "P0",
    lawIds: ["PUBLIC.03", "PUBLIC.10"],
    issue:
      "The property hero maps propertyLifecycle 'acquired' to the words 'Land acquired' while the " +
      "same vehicle's record states 'Land held under possession; title, Land Reforms Act position " +
      "and conversion status unverified.' To a public reader 'acquired' implies settled title. The " +
      "hero label is presentation-invented — exactly what PUBLIC.03 forbids.",
    evidence: [
      "app/_assemblies/property.tsx — hero renders 'Land acquired' from propertyLifecycle",
      "constants/vehicles.ts — coorgcreek commitments state possession, title unverified",
      "audit §8",
    ],
    affectedSources: [
      "constants/vehicles.ts", "app/_assemblies/property.tsx", "app/api/brochure/[vehicle]/route.ts",
    ],
    recommendation:
      "Replace the three-value PropertyLifecycle with a tenure-honest vocabulary (site secured / " +
      "possession obtained / diligence incomplete / title verified / conveyance complete / under " +
      "development / stabilised), set each vehicle's value from its record, and derive every label " +
      "from the canonical value. No surface words its own state.",
    acceptanceCriteria: [
      "No public label implies stronger tenure than the vehicle record states.",
      "The Creek's state reads as possession with diligence incomplete, everywhere it renders.",
      "A test fails if a label string appears that is not derived from the lifecycle value.",
    ],
    reviewType: "legal",
    dependencies: [],
    status: "NEEDS_HUMAN_CANON",
    humanCanonNeeded:
      "The lifecycle vocabulary itself, and which value each of the three vehicles holds today. " +
      "Legal state names are not an agent's to invent.",
  }),

  R({
    id: "REM-003",
    title: "Forecast yields render without their basis",
    route: ["/collection", "/collection/[vehicle]"],
    viewport: "ALL",
    severity: "P0",
    lawIds: ["PUBLIC.02", "PUBLIC.10"],
    issue:
      "The yield is registry-derived and carries FORECAST — the class discipline already exists. " +
      "What does not travel with the number is its BASIS: yield on what (the offering equity), " +
      "before what (tax), at what point (stabilised year). '~18.0% Forecast' still lets a reader " +
      "choose between yield, return and share-of-gross.",
    evidence: [
      "app/_assemblies/data.ts — yieldOf() folds toPartners/totalEquity, conf FORECAST",
      "app/_assemblies/gateway.tsx:65,252 — Pct + ConfidenceTag, no basis",
      "audit §9",
    ],
    affectedSources: [
      "app/_assemblies/data.ts", "app/_assemblies/gateway.tsx", "app/_assemblies/property.tsx",
      "app/api/brochure/[vehicle]/route.ts",
    ],
    recommendation:
      "A canonical FinancialFigure component whose type requires metric, class, basis and period — " +
      "so a figure without them fails to compile rather than fails review. The basis string itself " +
      "is human canon.",
    acceptanceCriteria: [
      "No forward-looking percentage renders on a public surface without metric and basis.",
      "The compiler rejects a financial figure constructed without them.",
      "The same figure carries the same semantics on card, page and brochure.",
    ],
    reviewType: "financial",
    dependencies: [],
    status: "NEEDS_HUMAN_CANON",
    humanCanonNeeded:
      "The exact basis wording per vehicle: pre- or post-tax, which year it stabilises, gross or " +
      "net of the reserve stages. The arithmetic is in the registry; the words are not.",
  }),

  R({
    id: "REM-004",
    title: "The complaints policy promises /status figures that /status does not show",
    route: ["/status", "/legal/complaints"],
    viewport: "ALL",
    severity: "P0",
    lawIds: ["PUBLIC.10", "PUBLIC.03"],
    issue:
      "content/legal.ts states complaint totals 'are published at /status each quarter'. The " +
      "status surface renders four hardcoded health rows and no complaint figure. A promise made " +
      "in a standing legal document is unkept by the surface it names.",
    evidence: [
      "content/legal.ts:990 — the publication promise",
      "app/_assemblies/systempages.tsx:121-126 — the hardcoded health array",
      "audit §13",
    ],
    affectedSources: ["app/_assemblies/systempages.tsx", "content/legal.ts", "lib/events/store.ts"],
    recommendation:
      "Publish the figure. Zero is publishable: 'Complaints this quarter: 0'. Derive it from the " +
      "inbound-contact record rather than typing it — a typed count on a status page is the same " +
      "defect as a typed yield.",
    acceptanceCriteria: [
      "/status shows the current quarter's complaint total, derived from a record.",
      "The legal document and the surface agree without either being edited to match the other.",
    ],
    reviewType: "legal",
    dependencies: [],
    status: "RESOLVED",
  }),

  R({
    id: "REM-005",
    title: "Sign-in is presented as live while status says it is not connected",
    route: ["/sign-in", "GLOBAL"],
    viewport: "ALL",
    severity: "P0",
    lawIds: ["PUBLIC.03", "PUBLIC.09"],
    issue:
      "Header and shell render a primary Sign in link on every public page. The deployed page " +
      "detects no provider and says 'Sign-in is not configured in this deployment'; /status " +
      "simultaneously lists sign-in as 'Not connected in this build'. The code fails honestly — " +
      "the defect is offering the threshold everywhere while it is known-dead. This is a " +
      "DEPLOYMENT ENVIRONMENT state (AUTH_SECRET absent in production), so the durable fix is the " +
      "affordance degrading with the capability, not copy.",
    evidence: [
      "app/_assemblies/systempages.tsx:92 — the not-configured branch",
      "app/_assemblies/systempages.tsx:123 — status row",
      "app/_assemblies/atoms.tsx Header · app/_assemblies/shell.tsx rail — the standing links",
      "audit §15",
    ],
    affectedSources: [
      "app/_assemblies/atoms.tsx", "app/_assemblies/shell.tsx", "app/_assemblies/systempages.tsx",
    ],
    recommendation:
      "Either configure production auth (the variables exist; see docs/SETUP-CREDENTIALS.md) or " +
      "have the header affordance read capability and degrade to 'Private access is not yet open'. " +
      "Prefer the first: the capability is one environment variable away.",
    acceptanceCriteria: [
      "No public surface offers an action its own status page reports as not connected.",
      "When sign-in is unavailable, the affordance says so before navigation, not after.",
    ],
    reviewType: "code",
    dependencies: [],
    status: "RESOLVED",
  }),

  /* ═══ P1 ═══════════════════════════════════════════════════════ */

  R({
    id: "REM-006",
    title: "System ontology leaks across every public surface",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P1",
    lawIds: ["PUBLIC.01"],
    issue:
      "The shell prints '{group} vantage' over every generated page; Header prints 'gateway " +
      "vantage'; system pages print corners like 'GC-900 · PUBLIC · SESSION REQUEST'; the legal " +
      "index leads with document ids. Individually defensible as provenance; at this frequency the " +
      "visitor navigates the implementation model. Rule: human title first, identifier tertiary — " +
      "classify every occurrence REQUIRED / TERTIARY / INTERNAL-ONLY / REMOVE rather than sweeping.",
    evidence: [
      "app/_assemblies/shell.tsx:340 — p-hero-shell eyebrow",
      "app/_assemblies/atoms.tsx:189 — Header vantage label",
      "app/_assemblies/systempages.tsx — four system corners",
      "audit §2",
    ],
    affectedSources: [
      "app/_assemblies/shell.tsx", "app/_assemblies/atoms.tsx", "app/_assemblies/systempages.tsx",
      "app/_system/surface.tsx",
    ],
    recommendation:
      "Inventory first (the ontology audit generates the list), then demote: identifiers move to " +
      "tertiary provenance or behind the office vantage. UX-02 is not violated by removing labels — " +
      "apertures redact, and an identifier is not truth, it is filing.",
    acceptanceCriteria: [
      "No public heading is visually subordinate to an identifier.",
      "Vantage words do not appear on public surfaces.",
      "Every retained identifier has a classification recorded in the ontology audit.",
    ],
    reviewType: "visual",
    dependencies: ["REM-016"],
    status: "OPEN",
  }),

  R({
    id: "REM-007",
    title: "The mobile viewport inherits the desktop rail",
    route: "GLOBAL",
    viewport: "MOBILE",
    severity: "P1",
    lawIds: ["PUBLIC.04", "PUBLIC.06"],
    issue:
      "The shell's navigation rail persists at phone width, consuming reading width while carrying " +
      "little information — the audit's screenshot finding. How-it-works stacks global nav, " +
      "vantage, lens navigator and numbered sequence into competing orientation systems.",
    evidence: ["app/_assemblies/shell.tsx — the rail", "audit §3, §14 screenshot"],
    affectedSources: ["app/_assemblies/shell.tsx", "app/_assemblies/assemblies.css"],
    recommendation:
      "Below the mobile breakpoint the rail collapses to the existing header pattern. One global " +
      "navigation, at most one local navigator, content owns the width. Desktop unchanged.",
    acceptanceCriteria: [
      "No persistent side rail at 360/390/430px on public routes.",
      "scrollWidth never exceeds viewport width at those sizes.",
      "Desktop rendering is unchanged.",
      "Keyboard navigation still reaches everything the rail reached.",
    ],
    reviewType: "visual",
    dependencies: [],
    status: "RESOLVED",
  }),

  R({
    id: "REM-008",
    title: "25 declared media absences render as 25 placeholders",
    route: "/collection/[vehicle]",
    viewport: "ALL",
    severity: "P1",
    lawIds: ["PUBLIC.08"],
    issue:
      "Every MediaSlot without an asset renders a labelled placeholder, and each page counts '0 of " +
      "25 frames produced'. Honest, and publicly it reads as unfinished on the exact proposition — " +
      "extraordinary places — where absence hurts most. The shot list is a commission brief; the " +
      "public page is not where a brief lives.",
    evidence: ["app/_assemblies/property.tsx Frame() empty branch", "audit §7"],
    affectedSources: ["app/_assemblies/property.tsx", "constants/property-page.ts"],
    recommendation:
      "Public surfaces render produced frames only, plus at most one consolidated disclosure. The " +
      "full slot inventory and gap count move to the office vantage, where they are the brief.",
    acceptanceCriteria: [
      "At most one missing-media disclosure per public page.",
      "Layout gives no weight to unproduced frames beyond it.",
      "mediaGap() and the slot list remain available to the office.",
    ],
    reviewType: "visual",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-009",
    title: "Public links cross into gated routes without warning",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P1",
    lawIds: ["PUBLIC.09"],
    issue:
      "Footer links /portfolio; property pages link /invest/qualify and /portfolio. The routes " +
      "correctly 403, but nothing at the link says a requirement exists — the reader discovers the " +
      "boundary by hitting it.",
    evidence: ["app/_assemblies/atoms.tsx footer", "constants/property-page.ts EVIDENCE_TIERS", "audit §16"],
    affectedSources: ["app/_assemblies/atoms.tsx", "app/_assemblies/property.tsx", "constants/routes.ts"],
    recommendation:
      "A gated-link primitive that derives the requirement from the route table's access class and " +
      "states it at the link: 'Portfolio · sign-in required'. Derived, not typed per link.",
    acceptanceCriteria: [
      "Every public link to a non-public route states its requirement at the link.",
      "The label derives from requiredAccess(), never hand-typed.",
    ],
    reviewType: "code",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-010",
    title: "The home proposition resolves too slowly",
    route: "/",
    viewport: "ALL",
    severity: "P1",
    lawIds: ["PUBLIC.05"],
    issue:
      "'Own the quiet. Keep the proof.' is right as poetry and the primitive — an interest in a " +
      "dedicated vehicle holding one asset, with defined economic, governance and usage rights — " +
      "arrives pages later. A first-time reader should hold it inside ten seconds.",
    evidence: ["app/_assemblies/publicpages.tsx home sections", "audit §4"],
    affectedSources: ["app/_assemblies/publicpages.tsx", "content/public.ts"],
    recommendation:
      "One plain-language primitive statement directly under the hero. Poetry above and below it, " +
      "as the audit puts it. Recorded today; not rewritten today.",
    acceptanceCriteria: [
      "The ownership primitive is stated in one sentence above the fold.",
      "No figure appears in it that lacks PUBLIC.02 semantics.",
    ],
    reviewType: "editorial",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-011",
    title: "The Collection defends itself before it seduces",
    route: "/collection",
    viewport: "ALL",
    severity: "P2",
    lawIds: ["PUBLIC.05"],
    issue:
      "The index opens with what cannot be said without provenance — constraint before object. " +
      "Right order: desire, orientation, evidence.",
    evidence: ["content/gateway.ts collection intro copy", "audit §6"],
    affectedSources: ["content/gateway.ts", "app/_assemblies/gateway.tsx"],
    recommendation:
      "Move the constraint language after the cards. The discipline stays; it stops being the greeting.",
    acceptanceCriteria: [
      "The first screenful of /collection is places, not disclosure rules.",
      "The provenance explanation remains on the page, after the objects.",
    ],
    reviewType: "editorial",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-012",
    title: "IRIS is everywhere and introduced nowhere",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P2",
    lawIds: ["PUBLIC.01"],
    issue:
      "The panel mounts on every gateway page with no public explanation of what it is or what " +
      "grounds its answers — omnipresence without establishment reads as a generic chatbot over a " +
      "non-generic platform.",
    evidence: ["app/_system/guard.tsx IRIS mount", "audit §17"],
    affectedSources: ["app/_assemblies/iris.tsx", "content/iris.ts"],
    recommendation:
      "One-line establishment on first open (the greeting already carries most of it) plus a short " +
      "public introduction where the platform explains itself. Grounding claim: answers come from " +
      "the same records the pages render.",
    acceptanceCriteria: [
      "A first-time reader can learn what IRIS is without opening it.",
      "The panel's first screen states its grounding and its boundary.",
    ],
    reviewType: "editorial",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-013",
    title: "Footer entity disclosure repeats at full weight everywhere",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P2",
    lawIds: ["PUBLIC.06"],
    issue:
      "The three-entity block renders verbatim on every surface — strong trust mechanism become " +
      "wallpaper, spending 150–200px per page.",
    evidence: ["app/_assemblies/atoms.tsx Footer", "audit §18"],
    affectedSources: ["app/_assemblies/atoms.tsx"],
    recommendation:
      "Compress to a one-line relationship strip — governance → vehicle → operator — expanding on " +
      "demand. Legal clarity retained, vertical cost paid once.",
    acceptanceCriteria: [
      "The triad remains present and expandable on every page.",
      "Default footer height drops materially without losing any entity fact.",
    ],
    reviewType: "visual",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-014",
    title: "System Status sits in primary navigation",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P2",
    lawIds: ["PUBLIC.05"],
    issue:
      "Status beside About/Contact/Legal makes the site read as an infrastructure product. For a " +
      "prospective owner it is tertiary.",
    evidence: ["app/_assemblies/shell.tsx rail links", "audit §14"],
    affectedSources: ["app/_assemblies/shell.tsx", "app/_assemblies/atoms.tsx"],
    recommendation: "Move to the footer's system layer. The page itself is good and stays.",
    acceptanceCriteria: ["/status reachable from the footer; absent from primary navigation."],
    reviewType: "visual",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-015",
    title: "Typography and contrast floor below perceptual comfort",
    route: "GLOBAL",
    viewport: "MOBILE",
    severity: "P1",
    lawIds: ["PUBLIC.07"],
    issue:
      "token-lint proves AA mathematically (2,176 elements, no failures) while several elements " +
      "remain perceptually faint — the audit's 'AA compliance ≠ perceptual hierarchy'. Minimums to " +
      "hold: 16px body, 11px metadata, 44px touch targets at mobile width.",
    evidence: ["constants/tokens.ts type scale", "legal/accessibility statement", "audit §12"],
    affectedSources: ["constants/tokens.ts", "app/_assemblies/assemblies.css"],
    recommendation:
      "Audit computed sizes at mobile widths against the minimums; raise the floor in tokens, not " +
      "per-route overrides.",
    acceptanceCriteria: [
      "No informational body text below 16px at 360px.",
      "No meaningful metadata below 11px; targets ≥44px.",
    ],
    reviewType: "accessibility",
    dependencies: [],
    status: "OPEN",
  }),

  /* ═══ Inventories that unblock the above ══════════════════════ */

  R({
    id: "REM-016",
    title: "Public ontology inventory (classification, not deletion)",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P1",
    lawIds: ["PUBLIC.01"],
    issue:
      "REM-006 cannot be executed safely without a per-occurrence classification — some ids are " +
      "legal provenance (document ids on /legal earn their place), some are filing leakage.",
    evidence: ["scripts/gen-remediation-audits.js output"],
    affectedSources: ["scripts/gen-remediation-audits.js"],
    recommendation:
      "Generated audit listing every public occurrence of GC-/AS-/vantage/implementation words, " +
      "each classified REQUIRED / TERTIARY / INTERNAL-ONLY / REMOVE. The generator keeps it " +
      "current; classifications are human.",
    acceptanceCriteria: ["Every occurrence in the generated audit carries a classification."],
    reviewType: "semantic",
    dependencies: [],
    status: "OPEN",
  }),

  R({
    id: "REM-017",
    title: "Border-role inventory",
    route: "GLOBAL",
    viewport: "ALL",
    severity: "P3",
    lawIds: ["PUBLIC.06"],
    issue:
      "Borders serve structure, interactivity and evidence without a declared role, producing the " +
      "audit's 'border entropy'. Inventory before any redesign.",
    evidence: ["app/_assemblies/*.css", "audit §5"],
    affectedSources: ["app/_assemblies/assemblies.css"],
    recommendation: "Classify structural / interactive / evidence. No visual change on Day 01.",
    acceptanceCriteria: ["A written classification exists before any border is redesigned."],
    reviewType: "visual",
    dependencies: [],
    status: "OPEN",
  }),
];

/* ── Reading it ──────────────────────────────────────────────────── */

export const remediationById = (id: string): RemediationItem | undefined =>
  REMEDIATION.find((r) => r.id === id);

export const bySeverity = (s: Severity): RemediationItem[] =>
  REMEDIATION.filter((r) => r.severity === s);

export const openItems = (): RemediationItem[] =>
  REMEDIATION.filter((r) => r.status !== "RESOLVED" && r.status !== "WAIVED");

export const needsHuman = (): RemediationItem[] =>
  REMEDIATION.filter((r) => r.status === "NEEDS_HUMAN_CANON");

/** True when nothing release-blocking remains. P1 blocks unless waived. */
export const releaseClear = (): { ok: boolean; blocking: RemediationItem[] } => {
  const blocking = openItems().filter((r) => r.severity === "P0" || r.severity === "P1");
  return { ok: blocking.length === 0, blocking };
};

export const REMEDIATION_LAWS = {
  verifiedNotTranscribed:
    "Every seeded item was checked against source before entry. The registry corrects the audit " +
    "where the code says otherwise — an audit of a deployment is evidence about a moment.",
  humanCanonIsAStatus:
    "NEEDS_HUMAN_CANON is not a failure state. Lifecycle vocabularies, figure bases and legal " +
    "claims are decisions, and a registry that lets an agent 'resolve' them by inference has " +
    "reproduced the defect it was built to fix.",
  resolutionIsAcceptance:
    "An item is RESOLVED when its acceptance criteria pass, not when a commit mentions it.",
} as const;
