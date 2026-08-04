/**
 * THE PUBLIC LAWS — what the public surface owes a stranger
 *
 * Authority: GC remediation audit, 4 Aug 2026 (evidence, not canon).
 * Day 01 of the remediation program.
 *
 * ── WHY THIS IS CODE AND NOT A DOCUMENT ──────────────────────────────
 * The remediation brief proposed /docs/remediation/*.md as the home for
 * these laws. That would have been a second governance structure beside
 * the one this repository already runs on — twenty-one linters, each
 * reading a typed registry, each wired into `npm run verify`.
 *
 * Prose laws in a docs tree have one failure mode and it is fatal: they
 * * remain true while the code stops obeying them, and nothing says so. Every
 * LAWS constant already in this codebase exists because somebody decided
 * that a rule worth writing is worth checking. These are no different.
 *
 * So the laws live here, scripts/public-law-lint.js enforces the part
 * that is mechanically checkable today, and docs/remediation/ points at
 * this file rather than restating it.
 *
 * ── THE AUDIT IS EVIDENCE, THESE ARE CANON ───────────────────────────
 * The audit prose is a finding about a moment. It is cited in
 * constants/remediation.ts as evidence and is deliberately NOT a source
 * of truth: a future agent resolving a remediation item reads the LAW,
 * not the paragraph that prompted it. That distinction is the whole point
 * of Day 01 — otherwise the audit becomes a third canon nobody voted for.
 *
 * ── WHAT A LAW IS FOR ────────────────────────────────────────────────
 * Each states one thing a public page owes somebody who has never heard
 * of GC. They are not style preferences. Every one of them exists because
 * a specific confusion is possible and expensive: mistaking a forecast
 * for a return, a possession for a title, a proposed vehicle for an
 * incorporated one.
 */

/** Nine laws. Ordered by what a stranger encounters first. */
export type PublicLawId =
  | "PUBLIC.01" | "PUBLIC.02" | "PUBLIC.03" | "PUBLIC.04" | "PUBLIC.05"
  | "PUBLIC.06" | "PUBLIC.07" | "PUBLIC.08" | "PUBLIC.09" | "PUBLIC.10";

/**
 * How a violation is judged, and by whom.
 *
 * `code` violations a script can find. Everything else names the kind of
 * person who has to look — because "machine-testable" is a property of
 * the law, not an aspiration, and pretending a semantic law is testable
 * is how a green build starts meaning nothing.
 */
export type ReviewType =
  | "code" | "visual" | "semantic" | "financial" | "legal" | "accessibility" | "editorial";

export type Severity = "P0" | "P1" | "P2" | "P3";

export interface PublicLaw {
  readonly id: PublicLawId;
  readonly name: string;
  /** The law, in one sentence a person can hold. */
  readonly statement: string;
  /** Why it exists — the specific confusion it prevents. */
  readonly because: string;
  readonly severityDefault: Severity;
  /**
   * Whether a script can decide a violation WITHOUT a human.
   *
   * Deliberately conservative. A law marked testable must have a check in
   * scripts/public-law-lint.js or a test, and public-law-lint asserts
   * that — an unenforced "testable" law is worse than an honest untested
   * one, because the first reads as covered.
   */
  readonly machineTestable: boolean;
  readonly reviewType: ReviewType;
  /** How somebody knows it is satisfied. Concrete, not aspirational. */
  readonly acceptance: readonly string[];
}

const L = (l: PublicLaw): PublicLaw => Object.freeze(l);

export const PUBLIC_LAWS: readonly PublicLaw[] = [
  L({
    id: "PUBLIC.01",
    name: "Human before system",
    statement:
      "A public page must be understandable without knowing any GC identifier, vantage, assembly " +
      "id or implementation concept.",
    because:
      "The platform's own ontology is excellent and it is ours, not the reader's. A page that " +
      "requires it to be understood has asked a stranger to learn the filing system before the " +
      "proposition — and reads as an internal tool that escaped.",
    severityDefault: "P0",
    machineTestable: true,
    reviewType: "code",
    acceptance: [
      "The primary heading is human-readable and visually dominant.",
      "Identifiers appear as tertiary provenance or not at all.",
      "No implementation language — file paths, component names, port status, framework names — is visible.",
      "A first-time reader can state the page's purpose without knowing GC ontology.",
    ],
  }),

  L({
    id: "PUBLIC.02",
    name: "One number, one meaning",
    statement:
      "Every forward-looking figure carries its class, its metric, its basis and its denominator " +
      "wherever it renders.",
    because:
      "A percentage is the most portable thing on the page — it is screenshotted, quoted and " +
      "remembered without its surroundings. '~18%' can be read as a yield on equity, a share of " +
      "gross, a return or an ownership stake, and four readers will pick differently.",
    severityDefault: "P0",
    machineTestable: true,
    reviewType: "financial",
    acceptance: [
      "No forward-looking percentage renders without its figure class.",
      "The metric is named — a yield on what, over what period.",
      "The basis travels with the number rather than living in a tooltip or a footnote.",
      "No component authors a financial label by hand where a canonical one exists.",
    ],
  }),

  L({
    id: "PUBLIC.03",
    name: "One state, one truth",
    statement:
      "Asset, vehicle, legal and operational states render from canonical machine state, and no " +
      "editorial word may imply a stronger state than the record holds.",
    because:
      "'Acquired' means settled title to almost everybody. Applied to land held under possession " +
      "with conversion status unverified, it is not a shading — it is the difference between an " +
      "asset the vehicle owns and one it is still working to own.",
    severityDefault: "P0",
    machineTestable: true,
    reviewType: "legal",
    acceptance: [
      "Every state label is derived from a canonical value, never typed beside it.",
      "No label is stronger than the record it renders.",
      "The same entity shows the same state on every surface.",
      "Where a state is genuinely partial, the label says which part.",
    ],
  }),

  L({
    id: "PUBLIC.04",
    name: "One global, one local",
    statement:
      "At narrow viewports a page carries at most one global navigation and one contextual " +
      "navigator. Metadata is not navigation; numbering is not navigation.",
    because:
      "Three orientation systems on a phone do not orient — they compete. The reader stops " +
      "looking for where they are and starts looking for where to look.",
    severityDefault: "P1",
    machineTestable: false,
    reviewType: "visual",
    acceptance: [
      "At 360, 390 and 430px: no persistent public side rail.",
      "One global navigation, not two.",
      "At most one contextual section navigator.",
      "Current position remains legible without either.",
    ],
  }),

  L({
    id: "PUBLIC.05",
    name: "Desire, then evidence, then action",
    statement:
      "A public surface establishes why the place matters before it explains how its claims are " +
      "governed.",
    because:
      "Rigour offered before interest reads as defensiveness. A page that opens by explaining what " +
      "it cannot show has asked the reader to care about the epistemics of something they have not " +
      "yet been given a reason to want.",
    severityDefault: "P1",
    machineTestable: false,
    reviewType: "editorial",
    acceptance: [
      "The opening establishes the place or the proposition, not the platform's disclosure rules.",
      "Evidence remains reachable without dominating discovery.",
      "Constraint language sits after the thing it constrains, not before it.",
    ],
  }),

  L({
    id: "PUBLIC.06",
    name: "Content owns narrow viewports",
    statement:
      "At phone width the screen belongs to content. Desktop chrome does not survive into it.",
    because: "Reading width is the scarcest resource on a phone and the easiest to spend on furniture.",
    severityDefault: "P1",
    machineTestable: true,
    reviewType: "visual",
    acceptance: [
      "No persistent public side rail below the mobile breakpoint.",
      "No horizontal overflow: scrollWidth never exceeds the viewport.",
      "Display type wraps deliberately rather than overflowing.",
    ],
  }),

  L({
    id: "PUBLIC.07",
    name: "Quiet is not illegible",
    statement:
      "Restraint is achieved by what is said, not by making text too faint or too small to read.",
    because:
      "The accessibility statement reports 2,176 elements passing AA with no failures, and several " +
      "of those elements are still perceptually faint. Mathematical compliance is a floor, not a " +
      "hierarchy — and a floor is a strange thing to design to.",
    severityDefault: "P1",
    machineTestable: true,
    reviewType: "accessibility",
    acceptance: [
      "No informational body text below 16px at mobile width.",
      "No meaningful metadata below 11px.",
      "Touch targets are at least 44px.",
      "A secondary action never reads as disabled.",
    ],
  }),

  L({
    id: "PUBLIC.08",
    name: "Absence is not content",
    statement:
      "Missing media and unavailable records do not occupy the visual authority of the thing they " +
      "are missing.",
    because:
      "Declaring a shot list is right and rendering it twenty-five times is not. On a proposition " +
      "that turns on extraordinary physical places, twenty-five declared absences read as an " +
      "unfinished product rather than an honest one — which inverts the intent exactly.",
    severityDefault: "P1",
    machineTestable: true,
    reviewType: "visual",
    acceptance: [
      "A page renders at most one consolidated missing-media disclosure.",
      "Unproduced frames occupy no layout weight beyond that disclosure.",
      "The shot list remains available to the office, where it is a commission brief.",
    ],
  }),

  L({
    id: "PUBLIC.09",
    name: "Permission before boundary",
    statement:
      "A reader learns what a surface requires before they cross into it, never by being refused.",
    because:
      "Fail-closed is correct and a 403 arrived at by following an ordinary link is a dead end. The " +
      "denial is right; being surprised by it is the defect.",
    severityDefault: "P1",
    machineTestable: true,
    reviewType: "code",
    acceptance: [
      "Every public link to a gated route states the requirement at the link.",
      "No intentional action produces an unexplained refusal.",
      "An unavailable capability is not presented as an available one.",
    ],
  }),

  L({
    id: "PUBLIC.10",
    name: "Same truth, same representation",
    statement:
      "Equivalent canonical data renders identically across public surfaces, and a public promise " +
      "is kept by the surface that promised it.",
    because:
      "The complaints policy says totals are published at /status each quarter. A written promise " +
      "the platform does not keep is worse than no promise, because it was made in a document " +
      "whose whole purpose is being relied upon.",
    severityDefault: "P0",
    machineTestable: true,
    reviewType: "semantic",
    acceptance: [
      "The same value has the same shape and class wherever it appears.",
      "Every commitment made in a legal document has a surface that honours it.",
      "A status surface reports measured state, never a typed assertion about state.",
    ],
  }),
];

export const lawById = (id: PublicLawId): PublicLaw | undefined =>
  PUBLIC_LAWS.find((l) => l.id === id);

export const testableLaws = (): PublicLaw[] => PUBLIC_LAWS.filter((l) => l.machineTestable);

export const PUBLIC_LAW_META = {
  /** The audit that prompted these. Evidence — never cite it as authority. */
  evidence: "GC public-surface remediation audit, 4 Aug 2026",
  canonicalSince: "2026-08-04",
  enforcedBy: "scripts/public-law-lint.js · tests/remediation.test.ts",
} as const;

export const PUBLIC_LAW_DOCTRINE = {
  auditIsEvidence:
    "The audit is a finding about a moment. These laws are canon. An agent resolving a remediation " +
    "item reads the law, not the paragraph that prompted it — otherwise the audit quietly becomes a " +
    "third source of truth nobody ratified.",
  lawsAreExecutable:
    "Every law here is either enforced by a script or honestly marked as needing a person. A law " +
    "in a documents tree stays true while the code stops obeying it, and nothing says so.",
  humansDefineCanon:
    "Humans define canon, the system stores it, components render it, agents do not invent it. A " +
    "remediation item whose fix requires a new state, a new figure class or a new legal claim is " +
    "BLOCKED on a person, not resolvable by inference.",
} as const;
