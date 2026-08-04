/**
 * ROUTE CONTRACTS — what each public route owes its reader
 *
 * Authority: constants/public-laws.ts. Day 01 of the remediation program.
 *
 * ── WHAT A CONTRACT IS ───────────────────────────────────────────────
 * One row per public route: its human purpose, the question a visitor
 * arrives with, the single action the page exists to enable, what system
 * metadata may appear, and what must never dominate. Future work on a
 * route is judged against its contract, not against taste.
 *
 * These are deliberately compact. A contract that takes longer to read
 * than the page it governs will not be read, and the acceptance detail
 * lives on the remediation items, not here.
 *
 * ── PURPOSE IS HUMAN CANON ───────────────────────────────────────────
 * The purposes below restate what constants/routes.ts already declares in
 * its notes — they are not invented. Where a route's purpose was not
 * derivable from the route table, it is marked, because a contract
 * guessed by an agent is worse than no contract.
 */

import type { PublicLawId } from "./public-laws";

/** What system metadata a route may show. The default is TERTIARY. */
export type MetadataAllowance =
  /** Ids may appear at full weight — they ARE the content (legal docs). */
  | "provenance-is-content"
  /** Ids as tertiary detail only: small, last, never above a human title. */
  | "tertiary"
  /** None. The route exists to persuade, and filing language breaks it. */
  | "none";

export interface RouteContract {
  readonly route: string;
  /** What the page is FOR, in one sentence a stranger could confirm. */
  readonly purpose: string;
  /** The question the visitor arrives holding. */
  readonly visitorQuestion: string;
  /** The one action the page exists to enable. */
  readonly primaryAction: string;
  readonly metadata: MetadataAllowance;
  /** What must never dominate this route. */
  readonly forbidden: readonly string[];
  /** The laws that bite hardest here. All laws apply; these are watched. */
  readonly watchLaws: readonly PublicLawId[];
  /** Mobile expectation beyond the global laws, where one exists. */
  readonly mobileNote?: string;
}

const C = (c: RouteContract): RouteContract => Object.freeze(c);

export const ROUTE_CONTRACTS: readonly RouteContract[] = [
  C({
    route: "/",
    purpose: "State what GC is and make one place worth a click within ten seconds.",
    visitorQuestion: "What is this, and what exactly would I own?",
    primaryAction: "Enter the Collection.",
    metadata: "none",
    forbidden: ["disclosure mechanics before the proposition", "any figure without PUBLIC.02 semantics"],
    watchLaws: ["PUBLIC.05", "PUBLIC.01", "PUBLIC.02"],
  }),
  C({
    route: "/collection",
    purpose: "Show the places. Desire first, orientation second, evidence reachable.",
    visitorQuestion: "What places exist, and which one is mine?",
    primaryAction: "Open a property.",
    metadata: "tertiary",
    forbidden: ["provenance rules as the greeting", "yields without basis"],
    watchLaws: ["PUBLIC.05", "PUBLIC.02"],
  }),
  C({
    route: "/collection/[vehicle]",
    purpose: "Make one place desirable, then let a serious reader inspect it without leaving.",
    visitorQuestion: "Do I want this place — and does the material hold up?",
    primaryAction: "Request an introduction.",
    metadata: "tertiary",
    forbidden: [
      "state words stronger than the record (PUBLIC.03)",
      "a wall of unproduced media (PUBLIC.08)",
      "figures for a vehicle that fails publishable()",
    ],
    watchLaws: ["PUBLIC.03", "PUBLIC.08", "PUBLIC.02", "PUBLIC.05"],
    mobileNote: "The spine is the one local navigator. Nothing else orients.",
  }),
  C({
    route: "/how-it-works",
    purpose: "Explain the model: three entities, the vehicle, the waterfall, the member law.",
    visitorQuestion: "How does owning a share of one house actually work?",
    primaryAction: "Proceed to qualification, informed.",
    metadata: "tertiary",
    forbidden: ["more than one local navigation device at phone width"],
    watchLaws: ["PUBLIC.04", "PUBLIC.06", "PUBLIC.01"],
    mobileNote: "One global nav plus at most one lens navigator. Numbering is not navigation.",
  }),
  C({
    route: "/journal",
    purpose: "Show how GC thinks, on subjects worth reading if GC sold nothing.",
    visitorQuestion: "Are these people worth listening to?",
    primaryAction: "Read an entry.",
    metadata: "tertiary",
    forbidden: ["brochure drift — the journal-lint distance ceiling is the same law upstream"],
    watchLaws: ["PUBLIC.05"],
  }),
  C({
    route: "/journal/[story]",
    purpose: "One argument, honestly made, with its sources beside it.",
    visitorQuestion: "Is this claim true, and who says so?",
    primaryAction: "Follow the onward link.",
    metadata: "tertiary",
    forbidden: ["figures typed into prose rather than read from the canon"],
    watchLaws: ["PUBLIC.02", "PUBLIC.10"],
  }),
  C({
    route: "/about",
    purpose: "Answer: what GC is, why it exists, who is responsible, how it is structurally different.",
    visitorQuestion: "Who is behind this and why should I trust the structure?",
    primaryAction: "Contact, or enter the Collection convinced.",
    metadata: "none",
    forbidden: ["scaffold output", "assembly ids", "implementation status of any kind"],
    watchLaws: ["PUBLIC.01"],
  }),
  C({
    route: "/contact",
    purpose: "Reach a person, with the right channel routed by intent.",
    visitorQuestion: "How do I talk to somebody?",
    primaryAction: "Send the enquiry.",
    metadata: "none",
    forbidden: ["routing a general enquiry through a vehicle"],
    watchLaws: ["PUBLIC.09"],
  }),
  C({
    route: "/legal",
    purpose: "The standing documents, versioned, with effective dates. Nothing paraphrases them.",
    visitorQuestion: "What are the actual terms, and are they current?",
    primaryAction: "Open a document.",
    metadata: "provenance-is-content",
    forbidden: ["vantage language — document ids earn their place here, filing words do not"],
    watchLaws: ["PUBLIC.10", "PUBLIC.01"],
  }),
  C({
    route: "/legal/[document]",
    purpose: "One binding document, whole, with its version and effective date.",
    visitorQuestion: "What exactly did I agree to, or would I be agreeing to?",
    primaryAction: "Read it.",
    metadata: "provenance-is-content",
    forbidden: ["summaries that could drift from the binding text"],
    watchLaws: ["PUBLIC.10"],
  }),
  C({
    route: "/status",
    purpose: "State the platform's measured condition, including every figure a legal document promises here.",
    visitorQuestion: "Is this thing running, and is it keeping its promises?",
    primaryAction: "Read the record.",
    metadata: "tertiary",
    forbidden: ["typed assertions about state where a measured value exists", "unkept publication promises"],
    watchLaws: ["PUBLIC.10", "PUBLIC.03"],
  }),
  C({
    route: "/sign-in",
    purpose: "Cross from public to private, or learn plainly that the crossing is not yet open.",
    visitorQuestion: "Can I get in?",
    primaryAction: "Sign in — or understand why not, before trying.",
    metadata: "tertiary",
    forbidden: ["offering the action while the capability is absent"],
    watchLaws: ["PUBLIC.03", "PUBLIC.09"],
  }),
  C({
    route: "/invest/qualify",
    purpose: "The gate to the private evidence layer. States what qualification asks before asking it.",
    visitorQuestion: "What do I have to show, and what do I get for it?",
    primaryAction: "Begin qualification.",
    metadata: "tertiary",
    forbidden: ["an unexplained 403 as the first contact with the gate"],
    watchLaws: ["PUBLIC.09"],
  }),
  C({
    route: "/portfolio",
    purpose: "The holder's own record. Public readers learn only that it exists and what it requires.",
    visitorQuestion: "Where is my position?",
    primaryAction: "Open it — or see the requirement stated at the boundary.",
    metadata: "tertiary",
    forbidden: ["public links arriving here without the requirement stated at the link"],
    watchLaws: ["PUBLIC.09"],
  }),
];

export const contractFor = (route: string): RouteContract | undefined =>
  ROUTE_CONTRACTS.find((c) => c.route === route);

export const ROUTE_CONTRACT_LAWS = {
  contractsJudgeWork:
    "A change to a public route is judged against its contract, not against taste. A change the " +
    "contract cannot judge means the contract is incomplete — amend it first, deliberately.",
  purposeIsRestated:
    "Purposes restate constants/routes.ts notes; none is invented. A route whose purpose cannot be " +
    "derived from ratified material needs a human sentence before it needs a contract.",
} as const;
