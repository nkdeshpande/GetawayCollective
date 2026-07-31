/**
 * ASSEMBLIES — whole screens
 *
 * Wave 6.5 · from the Kyoto prototype set
 * Authority: L1-01 §29 · GC.SYSTEM Tier 05/06
 *
 * ── THE TIER ─────────────────────────────────────────────────────────
 * Atom → Molecule → Organism → Aperture → ASSEMBLY → Route.
 *
 * An organism answers one question about one object. An aperture decides
 * how much of that object a given vantage may see. An assembly is the
 * whole screen: the sections in order, what each one is for, and what the
 * person arriving is supposed to walk away knowing.
 *
 * ── WHY THIS TIER HAS TO EXIST ───────────────────────────────────────
 * Every prototype in the source set is beautiful section by section and
 * inconsistent screen by screen. The same Kyoto House appears in four
 * files with four different valuations, three different yields and two
 * incompatible waterfalls. None of that is visible while you look at one
 * file. It is only visible when the screens are written down as data and
 * compared.
 *
 * So each assembly declares its sections AND its corrections: what the
 * source prototype asserted, and what the canon actually says.
 */

import type { RouteGroup } from "./layout";
import type { Vantage } from "./apertures";
import { SURFACE_STRATEGY } from "./layout";

export type SectionKind =
  /** Sets the subject. Image, name, one figure at most. */
  | "masthead"
  /** Prose. Explains something that a table cannot. */
  | "narrative"
  /** Organisms in a repeating grid. */
  | "grid"
  /** A single organism at full width. */
  | "feature"
  /** Tabular. The densest thing on the screen. */
  | "ledger"
  /** A chart. */
  | "figure"
  /** Something the viewer does. */
  | "action"
  /** Where they go next. */
  | "onward";

export interface Section {
  ref: string;
  name: string;
  kind: SectionKind;
  /** What this section is for, in one line. */
  purpose: string;
  /** What this section RENDERS. Organism ids, aperture ids, component refs. */
  contains: readonly string[];
  /**
   * Apertures this section LINKS TO but does not render.
   *
   * The distinction is load-bearing. A gateway section that RENDERS the
   * console aperture has widened it — the visitor now gets console
   * disclosure on a marketing page. A gateway section that ROUTES to the
   * console has done the opposite: it has said where the rest is kept,
   * which is precisely what a narrow aperture owes the person reading it.
   *
   * Authorisation is checked at the destination, never here.
   */
  routesTo?: readonly string[];
  /** Present when this section carries a constraint worth stating. */
  rule?: string;
}

/**
 * A place the source prototype and the canon disagree.
 *
 * Recorded rather than silently resolved. A correction with no `was` is a
 * gap the prototype left open; one with a `was` is a contradiction.
 */
export interface Correction {
  /** Which prototype file. */
  source: string;
  /** What it asserted. Absent where it simply omitted. */
  was?: string;
  /** What the canon says. */
  now: string;
  /** Why it matters. Never "for consistency". */
  because: string;
  kind: "constitutional" | "accessibility" | "vocabulary" | "numeric" | "interaction";
}

export interface Assembly {
  id: string;
  name: string;
  route: RouteGroup;
  vantage: Vantage;
  /** What this screen is for. */
  intent: string;
  /** The one thing someone should know within five seconds of arriving. */
  answers: string;
  sections: readonly Section[];
  corrections?: readonly Correction[];
  notes?: string;
}

/** Sixth argument is the rule as a bare string, or `{ rule, routesTo }`. */
const S = (
  ref: string, name: string, kind: SectionKind, purpose: string,
  contains: readonly string[],
  extra?: string | { rule?: string; routesTo?: readonly string[] },
): Section => ({
  ref, name, kind, purpose, contains,
  ...(typeof extra === "string" ? { rule: extra } : extra ?? {}),
});

// ─────────────────────────────────────────────────────────────────────
// THE KYOTO SET — the screens the prototypes actually got right
// ─────────────────────────────────────────────────────────────────────

/**
 * AS-01 · THE GATEWAY GRID
 *
 * Source: GC_onboardDoc.html, gateway view.
 *
 * Three properties as photographs. A name in titan type. One figure,
 * revealed on intent. This is the best screen in the whole source set and
 * it survives almost intact — the aperture is genuinely narrow, and the
 * restraint is the point.
 *
 * What did NOT survive: the reveal was hover-only. On a phone there is no
 * hover, so the yield simply never appeared. On a keyboard there was no
 * focus state, so it never appeared there either. A "deferred" field that
 * is unreachable is not deferred, it is missing.
 */
export const GATEWAY_GRID: Assembly = {
  id: "AS-01",
  name: "The Gateway Grid",
  route: "gateway",
  vantage: "gateway",
  intent: "Make someone want to know more about a property, without telling them anything untrue.",
  answers: "What does this collection hold, and does any of it interest me?",
  sections: [
    S("AS-01.a", "Signal Line", "masthead",
      "System identity and nothing else. One mono line.",
      ["A-01"],
      "No figure appears above the grid. A headline number here is a claim made before any context exists."),
    S("AS-01.b", "Property Grid", "grid",
      "One narrow aperture per property, in a 4:5 frame.",
      ["AP-01", "O-01"],
      "Photograph, name, and at most two deferred figures. The valuation is not here — see AP-01's withholding."),
    S("AS-01.c", "Into the Console", "onward",
      "One route out, to the wide aperture on the same object.",
      [], {
      routesTo: ["AP-02"],
      rule:
        "The gateway never dead-ends. Everything it withholds is one navigation away, and it " +
        "says so — which is why a route to a wider aperture is not a widening." }),
  ],
  corrections: [
    {
      source: "GC_onboardDoc.html",
      was: "Yield and availability revealed by `group-hover:opacity-100` only.",
      now: "Revealed on hover, focus-visible, or tap. Present in the DOM at all times.",
      because:
        "On a phone there is no hover and on a keyboard there is no pointer, so the figure was " +
        "unreachable for both. Progressive disclosure hides a value until asked; this hid it from " +
        "anyone who could not ask with a mouse.",
      kind: "accessibility",
    },
    {
      source: "GC_onboardDoc.html",
      was: "`cursor: none` on body, with a custom ring div following the pointer.",
      now: "Ring on fine pointers only; native cursor on coarse and on `prefers-reduced-motion`.",
      because:
        "A page with no cursor and a ring that never arrives is a page you cannot click. The ring " +
        "is an ornament; the pointer is the interface.",
      kind: "interaction",
    },
    {
      source: "GC_onboardDoc.html",
      was: "Label tone `steel #4A4A4A` at 2.25:1 against its own void.",
      now: "steel #6B6B6B at 3.72:1, or steelDim #8E8E8E at 7.04:1 where the text is body-sized.",
      because: "2.25:1 fails AA for any text size. It carried every label on the console screen.",
      kind: "accessibility",
    },
    {
      source: "GC_onboardDoc.html",
      was: "Yield shown as a bare figure — `YIELD: 8.4%`.",
      now: "Yield carries its confidence class, or it is not shown.",
      because:
        "A forward-looking figure rendered identically to a settled one is the single easiest way " +
        "to mislead without stating anything false.",
      kind: "constitutional",
    },
  ],
};

/**
 * AS-02 · THE PROPERTY CONSOLE
 *
 * Source: GC_onboardDoc.html, console view.
 *
 * The same three properties, wide open. Asset id, valuation, valuation
 * source directly beneath it, yield, lifecycle, telemetry.
 *
 * The prototype's console cards were the strongest argument in the set for
 * why the aperture tier had to exist: identical objects, deliberately
 * different disclosure, one screen apart.
 */
export const PROPERTY_CONSOLE_SCREEN: Assembly = {
  id: "AS-02",
  name: "The Property Console",
  route: "capital",
  vantage: "capital",
  intent: "Let someone accountable for these assets see everything bearing on them.",
  answers: "What is each asset worth, on whose authority, and is anything wrong?",
  sections: [
    S("AS-02.a", "Console Header", "masthead",
      "Vehicle, as-at date, and the reserve band. Three facts.",
      ["O-04"],
      "The reserve band appears before any property does. A console that shows assets before it " +
      "shows whether the vehicle can meet its obligations has the priority backwards."),
    S("AS-02.b", "Asset Grid", "grid",
      "One wide aperture per property.",
      ["AP-02", "O-01"],
      "Valuation source renders directly beneath the valuation, never in a tooltip."),
    S("AS-02.c", "Telemetry Strip", "figure",
      "Live operational status per asset, and when it last spoke.",
      ["A-11"],
      "A stale telemetry reading renders as stale, not as silence. Silence reads as healthy."),
    S("AS-02.d", "Console Actions", "action",
      "Sync, record valuation, open ledger.",
      ["O-08"],
      "Recording a valuation is a provenance event. It captures source and date or it does not commit."),
  ],
  corrections: [
    {
      source: "GC_onboardDoc.html",
      was: "`scrambleText()` cycling random digits into the valuation for ~400ms on recalibrate.",
      now: "Money counts from its previous value. Scramble stays permitted on identifiers.",
      because:
        "A scramble renders figures that were never the value, in the currency tone, at the " +
        "currency's size. An identifier has no magnitude to misread; ₹12,4X,XX,XXX does.",
      kind: "interaction",
    },
    {
      source: "GC_onboardDoc.html",
      was: "Placeholder cards generated with `Math.random()` and labelled `VOID` / `PENDING_KYC`.",
      now: "An empty console states what is absent and the action that would fill it.",
      because:
        "Random figures in a console are indistinguishable from real ones at a glance, and the " +
        "screenshot outlives the demo.",
      kind: "numeric",
    },
    {
      source: "GC_onboardDoc.html",
      was: "Live-status dot in `moss #123C32` at 1.63:1.",
      now: "confirm at 6.55:1, with a text label beside it.",
      because:
        "1.63:1 is invisible, and a dot alone carries meaning by colour only. Both fail — the " +
        "second one fails for anyone who cannot distinguish the hue at all.",
      kind: "accessibility",
    },
  ],
};

/**
 * AS-03 · THE PROPERTY MASTHEAD
 *
 * Source: Hero+tabs.html.
 *
 * Kyoto House full-bleed, then Space / Capital / Time as tabs. That tab
 * triple is the Trinity Lens, arrived at independently in a rough file —
 * which is a good sign it is the right decomposition.
 */
export const PROPERTY_MASTHEAD: Assembly = {
  id: "AS-03",
  name: "The Property Masthead",
  route: "space",
  vantage: "space",
  intent: "Present one property as an asset: what it is, what it costs, when it is available.",
  answers: "What am I looking at, and which of the three questions do I have?",
  sections: [
    S("AS-03.a", "Masthead", "masthead",
      "Full-bleed image, property name in display-xl, jurisdiction.",
      ["AP-03"],
      "One figure maximum over the image, and never the valuation. FB-1 bars full-bleed under numeric data."),
    S("AS-03.b", "Trinity Lens", "grid",
      "Space · Capital · Time as three lenses onto the same property.",
      ["AP-03"], {
      routesTo: ["AP-02", "AP-04"],
      rule:
        "Lenses, not steps. Tabs imply peers; a numbered sequence would imply an order that does " +
        "not exist. The Capital lens renders the SPACE aperture’s capital fields and routes to " +
        "the console for the rest — a visitor standing at the space vantage does not receive " +
        "console disclosure because a tab happens to be labelled Capital." }),
    S("AS-03.c", "Thesis", "narrative",
      "Why this asset should outperform. Prose, measure-capped.",
      [],
      "The one place editorial italic is permitted, once."),
    S("AS-03.d", "Into Commitment", "onward",
      "Route to AS-06 if the offering is open; to the register if not.",
      [],
      "An asset with no open offering says so plainly rather than showing a dead control."),
  ],
  corrections: [
    {
      source: "Hero+tabs.html",
      was: "`Digital Custody · Blockchain Backed Equity` as a capital-tab field.",
      now: "Removed. The share register is the record of ownership.",
      because:
        "Nothing in the canon tokenises equity, and a claim about how ownership is recorded is a " +
        "legal representation, not a design flourish.",
      kind: "constitutional",
    },
    {
      source: "Hero+tabs.html",
      was: "Time tab: `Awaiting Console Synchronisation. Calendar availability pending Digital Custody lock.`",
      now: "Entitlement state from the Time vantage, or a plain statement that entitlement begins at settlement.",
      because:
        "The copy described a system failure in the voice of a system feature. Someone reading it " +
        "cannot tell whether the calendar is broken or simply not yet theirs.",
      kind: "vocabulary",
    },
    {
      source: "Hero+tabs.html",
      was: "`--color-guide: #111111` used both as the hairline AND as a section background on black.",
      now: "Hairline stays a hairline; section grounds use the declared elevation step.",
      because:
        "1.11:1 — the section separation it was drawn to create was invisible. Depth is one " +
        "background step, and that step has to be a step.",
      kind: "accessibility",
    },
    {
      source: "Hero+tabs.html",
      was: "`--color-text-secondary: #666666` on pure black, carrying every caps-label.",
      now: "steel #6B6B6B on void, which clears 3:1 at the label's size and weight.",
      because: "3.66:1 passes only for large text; these labels are 10px.",
      kind: "accessibility",
    },
    {
      source: "Hero+tabs.html",
      was: "Valuation ₹12,40,00,000 with fraction price ₹1,03,33,333 for 1/12.",
      now: "Fraction price is derived from the valuation by largest-remainder, never stated separately.",
      because:
        "12 × ₹1,03,33,333 is ₹12,39,99,996 — four rupees short. Two independently-typed figures " +
        "that must agree eventually will not.",
      kind: "numeric",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────
// THE CAPITAL SET
// ─────────────────────────────────────────────────────────────────────

/**
 * AS-04 · THE CAPITAL EXPLAINER
 *
 * Source: TheCapital02feb_Good.HTML.
 *
 * The paper-ground waterfall in this file is the best single idea in the
 * set: the explanatory sections are dark and cinematic, and the moment the
 * page starts making financial claims the ground flips to paper. Light
 * means audited. That is now a system rule.
 *
 * Its numbers, however, are a different waterfall from ours.
 */
export const CAPITAL_EXPLAINER: Assembly = {
  id: "AS-04",
  name: "The Capital Explainer",
  route: "capital",
  vantage: "capital",
  intent: "Explain how money moves through the structure, to someone deciding whether to commit.",
  answers: "Where does the revenue go, in what order, and what am I last in line behind?",
  sections: [
    S("AS-04.a", "Premise", "masthead", "One claim, in display-xl. Dark ground.", []),
    S("AS-04.b", "The Structure", "narrative",
      "The three-entity model as a diagram: platform, vehicle, operating partner.",
      [],
      "The diagram states that the platform holds no equity in the vehicle. §27."),
    S("AS-04.c", "The Waterfall", "figure",
      "Six stages, in order, on paper ground.",
      ["O-03"],
      "PAPER GROUND. The ground flips to light the moment the page makes a financial claim — " +
      "that inversion is the strongest signal in the source set and it is now a rule."),
    S("AS-04.d", "The Floor", "feature",
      "Reserve floor and what happens when distribution would breach it.",
      ["O-04"],
      "The floor is the greater of six months' non-operational fixed obligations or the Board " +
      "minimum. It is not NAV-linked and the copy may not imply that it is."),
    S("AS-04.e", "Return Drivers", "narrative", "Yield and appreciation, stated as drivers not promises.", []),
    S("AS-04.f", "Onward", "onward", "Space · Time · Commitment.", []),
  ],
  corrections: [
    {
      source: "TheCapital02feb_Good.HTML",
      was: "Four-stage waterfall: Operator 35% → Platform Fee 15% → Sinking 2.5% → Net 47.5%.",
      now: "Six stages: OpCo → Brand → Admin Reserve 2.5% → Sinking Fund 2.5% → Debt Service → Partners.",
      because:
        "Debt service was absent entirely. A waterfall that omits the senior claim shows a " +
        "distributable figure that is not distributable.",
      kind: "constitutional",
    },
    {
      source: "TheCapital02feb_Good.HTML",
      was: "`MANAGEMENT FEE (AUM) 2.5% · Calculated on Asset Value`.",
      now: "Admin Reserve, 2.5% of revenue, at stage 3 of the waterfall.",
      because:
        "A fee on asset value and a reserve on revenue are different instruments with different " +
        "incentives. One rewards holding assets at a high mark; the other does not.",
      kind: "constitutional",
    },
    {
      source: "TheCapital02feb_Good.HTML",
      was: "`SPV (ASSET HOLDER) · 100% OWNERSHIP` with the platform in the chain.",
      now: "Governance Without Ownership. The platform holds no equity in the vehicles it governs.",
      because: "§27, as amended. The prototype predates the reversal.",
      kind: "constitutional",
    },
    {
      source: "TheCapital02feb_Good.HTML",
      was: "`We do not sell membership. We sell Equity.`",
      now: "Removed. A Member is an equity holder; the two were never alternatives.",
      because:
        "The Member Law makes membership the consequence of holding equity. The sentence sets " +
        "them against each other and contradicts the model it is introducing.",
      kind: "vocabulary",
    },
    {
      source: "TheCapital02feb_Good.HTML",
      was: "`AVG TIME TO EXIT: 14 DAYS` and `TARGET: 8-10%` as flat assertions.",
      now: "Both carry confidence class and as-at date, or neither appears.",
      because:
        "An average with no window and no basis is a forecast wearing the typography of a fact.",
      kind: "numeric",
    },
    {
      source: "TheCapital02feb_Good.HTML",
      was: "`cursor: crosshair` on the universal selector.",
      now: "Default cursor; pointer on interactive elements only.",
      because:
        "A crosshair over every element removes the only cue distinguishing what can be clicked " +
        "from what cannot.",
      kind: "interaction",
    },
    {
      source: "TheCapital02feb_Good.HTML",
      was: "Waterfall bars animate width from 0 on scroll, with a white flash.",
      now: "Bars animate under `prefers-reduced-motion: no-preference`; otherwise they render final.",
      because: "A full-viewport flash is a migraine trigger, and 35% growing from zero reads as 35% growing.",
      kind: "accessibility",
    },
  ],
};

/**
 * AS-05 · THE MEMBER CONSOLE
 *
 * Source: TheSteward_02Feb.HTML.
 *
 * Capital position, asset status, entitlement, documents — the right four
 * widgets in the right order. The file needed more correction than any
 * other in the set, and most of it was in the copy rather than the layout.
 */
export const MEMBER_CONSOLE: Assembly = {
  id: "AS-05",
  name: "The Member Console",
  route: "member",
  vantage: "member",
  intent: "Show a holder what they own, what it paid, and what needs them.",
  answers: "Is anything waiting on me, and what did my capital do?",
  sections: [
    S("AS-05.a", "Position", "feature",
      "Total position, change since entry, next distribution and its date.",
      ["O-02", "O-05"],
      "A blocked distribution renders at the same weight as a paid one, with its reason. " +
      "A member whose payment did not land is owed the reason, not a quieter number."),
    S("AS-05.b", "Assets", "grid",
      "One member-vantage aperture per held property.",
      ["AP-04", "O-01"]),
    S("AS-05.c", "Entitlement", "feature",
      "Nights held, nights used, what is scheduled.",
      [],
      "Phone-parity. Entitlement is a member act and must never require a desktop."),
    S("AS-05.d", "Documents", "ledger",
      "Agreements, certificates, filings. What is signed and what is not.",
      ["O-08"],
      "An unsigned document that needs the member is the only thing on this screen permitted to " +
      "use the critical tone."),
  ],
  corrections: [
    {
      source: "TheSteward_02Feb.HTML",
      was: "The screen, the badge and the role were all called `Steward`.",
      now: "Member. `Stewardship` survives as philosophy; the actor noun does not.",
      because: "§25 forbids it as an actor noun or schema type. The whole file was named after it.",
      kind: "vocabulary",
    },
    {
      source: "TheSteward_02Feb.HTML",
      was: "`VIEW CCTV FEED` and an `[ IMAGE FEED ]` panel on the asset widget.",
      now: "Removed. Asset condition comes from inspection records and the maintenance reserve.",
      because:
        "The asset is a place people occupy. A live camera feed shipped to equity holders is " +
        "surveillance of occupants, and no invariant permits it.",
      kind: "constitutional",
    },
    {
      source: "TheSteward_02Feb.HTML",
      was: "Sidebar items `CONCIERGE` and `BOOK / SWAP`.",
      now: "Entitlement, and the operating partner's own surface for anything operational.",
      because: "§25. Both belong to the Operating Company, which is a different entity.",
      kind: "vocabulary",
    },
    {
      source: "TheSteward_02Feb.HTML",
      was: "`MAINTENANCE FUND: HEALTHY` as a bare word.",
      now: "The reserve figure, its floor, and the band it sits in.",
      because:
        "`Healthy` is an assessment presented as an observation. The member cannot tell whether it " +
        "means 'above floor' or 'someone thought it looked fine'.",
      kind: "numeric",
    },
    {
      source: "TheSteward_02Feb.HTML",
      was: "A login gate with a hardcoded password field and a scripted `ACCESS GRANTED` sequence.",
      now: "Real authentication. No simulated handshake, no fake hash.",
      because:
        "A theatrical security sequence teaches members that security theatre is what security " +
        "looks like here.",
      kind: "interaction",
    },
    {
      source: "TheSteward_02Feb.HTML",
      was: "A fixed scanline overlay at 10% opacity over the entire document.",
      now: "Removed.",
      because:
        "It reduced the contrast of every figure beneath it by a margin nobody measured, and the " +
        "figures underneath were already at 3.55:1.",
      kind: "accessibility",
    },
    {
      source: "TheSteward_02Feb.HTML",
      was: "Body and secondary text at `#666666` (3.55:1) and `#888888` on a #050505 ground.",
      now: "steelDim for body-sized secondary text; steel only for micro labels.",
      because: "3.55:1 fails AA at body size. It carried the entire left column.",
      kind: "accessibility",
    },
  ],
};

/**
 * AS-06 · THE COMMITMENT FLOW
 *
 * Source: GC_Commit3.html.
 *
 * A 65/35 split: progressive steps on the left, the asset anchored on the
 * right, visible the whole way through. The anchor is the good idea — it
 * is very hard to lose track of what you are committing to when the thing
 * never leaves the screen.
 */
export const COMMITMENT_FLOW: Assembly = {
  id: "AS-06",
  name: "The Commitment Flow",
  route: "capital",
  vantage: "capital",
  intent: "Take an Investor from intent to a binding commitment, with nothing hidden at the moment of signing.",
  answers: "What exactly am I committing to, for how much, and what happens next?",
  sections: [
    S("AS-06.a", "Asset Anchor", "feature",
      "The property, the amount, and the terms. Sticky through every step.",
      ["AP-03"],
      "Never collapses, never scrolls away. On compact it pins to the top rather than being dropped."),
    S("AS-06.b", "Identity", "action", "Legal name, contact. Autosaved per field on blur.", []),
    S("AS-06.c", "Accreditation", "action",
      "PR-01. Resumable; a partial application survives the session.",
      ["O-07"],
      "COMPLETE-THEN-SUSPEND: an application already in flight completes before any suspension applies."),
    S("AS-06.d", "Review", "feature",
      "The full commitment, restated, with everything that binds.",
      [],
      "Nothing new appears after this section. A term first shown on the confirmation screen was " +
      "not disclosed, it was sprung."),
    S("AS-06.e", "The Piston", "action",
      "The commitment control. Linear, 3000ms, never eased.",
      ["M-04"],
      "The only control that moves capital. No Recovery Strip follows it — M-06 is for reversible acts."),
    S("AS-06.f", "Settled", "feature",
      "What was committed, and that membership begins at settlement, not here.",
      [],
      "The Member Law fires on settlement. This screen may not congratulate someone on becoming a " +
      "Member before their money has moved."),
  ],
  corrections: [
    {
      source: "GC_Commit3.html",
      was: "`COMPLETION WINDOW: 14 WORKING DAYS`.",
      now: "15 working days.",
      because: "§24b. A day short on a regulatory window is a breach, not a rounding.",
      kind: "numeric",
    },
    {
      source: "GC_Commit3.html",
      was: "`STATUS: RESERVED` / `ALLOCATION RESERVED` on payment of the commitment amount.",
      now: "The commitment state from the lifecycle, and settlement stated as the pending event.",
      because:
        "`Reserved` is not a state in the Investor Lifecycle. It reads as a completed act and the " +
        "screen followed it with 'no further action is required', which was not true.",
      kind: "constitutional",
    },
    {
      source: "GC_Commit3.html",
      was: "Completed steps dimmed to `opacity: 0.35` with `pointer-events: none`.",
      now: "Completed steps remain legible and re-openable until the piston fires.",
      because:
        "0.35 opacity on #EAEAEA lands near 2:1. Someone who wanted to check the name they typed " +
        "could neither read it nor click back to it.",
      kind: "accessibility",
    },
    {
      source: "GC_Commit3.html",
      was: "`EST. YIELD 4.2%` in gold beside a hard commitment figure.",
      now: "Forecast tone and confidence class, never the accent that marks settled money.",
      because:
        "Gold is the accent for value. An estimate wearing it, next to an exact rupee amount, " +
        "borrows that figure's certainty.",
      kind: "numeric",
    },
    {
      source: "GC_Commit3.html",
      was: "`maximum-scale=1.0, user-scalable=no` in the viewport meta.",
      now: "Removed.",
      because: "It disables pinch zoom on a form collecting a PAN number. WCAG 1.4.4.",
      kind: "accessibility",
    },
    {
      source: "GC_Commit3.html",
      was: "`text-transform: uppercase` on every input, including the email field.",
      now: "Uppercase on identifiers that are genuinely uppercase; never on email or name.",
      because:
        "It rendered what someone typed as something they did not type, on the screen where they " +
        "check what they typed.",
      kind: "interaction",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────
// THE NARRATIVE SET — gateway-only, and constrained accordingly
// ─────────────────────────────────────────────────────────────────────

/**
 * AS-07 · THE PORTFOLIO NARRATIVE
 *
 * Source: BO1.html.
 *
 * Three operating brands as three sections, each with a terminal grid of
 * three attributes. The structure is sound. The voice is not ours, and
 * the file is where §25 gets tested hardest.
 */
export const PORTFOLIO_NARRATIVE: Assembly = {
  id: "AS-07",
  name: "The Portfolio Narrative",
  route: "gateway",
  vantage: "gateway",
  intent: "Explain what the operating partner's brands are, and how they differ.",
  answers: "What actually gets built on these assets?",
  sections: [
    S("AS-07.a", "Premise", "masthead", "One claim over ambient media.", []),
    S("AS-07.b", "The Three", "narrative",
      "One section per brand: name, position, media, two paragraphs.",
      []),
    S("AS-07.c", "Attributes", "grid",
      "Three attributes per brand, in a hairline terminal grid.",
      [],
      "Attributes are descriptive. No figure appears in this grid — it is not a comparison table."),
    S("AS-07.d", "Onward", "onward", "Into the gateway grid.", []),
  ],
  corrections: [
    {
      source: "BO1.html",
      was: "Brand attributes scrambled on scroll via `data-val`.",
      now: "Scramble permitted here — these are labels, not figures.",
      because:
        "This is the one place the effect is legitimate: `MISTY DAYDREAM` has no magnitude to " +
        "misread. The rule was never about the animation, it was about currency.",
      kind: "interaction",
    },
    {
      source: "BO1.html",
      was: "`--text-muted: #444444` at 2.09:1, used for eyebrow labels throughout.",
      now: "steel, at 3.72:1, which clears AA for the label size and weight in use.",
      because: "2.09:1 fails at any size.",
      kind: "accessibility",
    },
    {
      source: "BO1.html",
      was: "`mechanisms of extraction`, `manipulate space, silence and time`, `designing consciousness`.",
      now: "Rewritten. Warm, confident, assertive, with pleasantness.",
      because:
        "The voice was cold and slightly menacing. Extraction and manipulation describe what is " +
        "done TO someone; this is a platform people join.",
      kind: "vocabulary",
    },
    {
      source: "BO1.html",
      was: "`::-webkit-scrollbar { display: none }` plus `scrollbar-width: none` globally.",
      now: "Scrollbars visible.",
      because: "The scrollbar is the only indicator of how much page is left.",
      kind: "accessibility",
    },
  ],
};

/**
 * AS-08 · THE STORY PLAYBACK
 *
 * Sources: STORY GRID + PLAYBACK.html, GallerySection+GalleryFrame.html.
 *
 * A grid that opens into a full-screen sequential player. Gateway only —
 * a timed, auto-advancing sequence is a fine way to show a place and a
 * terrible way to show a figure.
 */
export const STORY_PLAYBACK: Assembly = {
  id: "AS-08",
  name: "The Story Playback",
  route: "gateway",
  vantage: "gateway",
  intent: "Show a place at full bleed, in sequence, to someone who has not decided anything yet.",
  answers: "What does it feel like to be there?",
  sections: [
    S("AS-08.a", "Grid", "grid", "Tiles in a 4:5 frame. Each opens the player at its own index.", []),
    S("AS-08.b", "Player", "feature",
      "Full-screen sequence with progress, manual advance, and pause.",
      [],
      "NO FIGURE APPEARS IN THE PLAYER. A number on a timed card that advances in four seconds " +
      "cannot be read, checked, or returned to."),
    S("AS-08.c", "Exit", "onward", "Always visible, always reachable by Escape.", []),
  ],
  corrections: [
    {
      source: "STORY GRID + PLAYBACK.html",
      was: "Auto-advance every 4000ms, with pause available only by holding a touch.",
      now: "A visible pause control, plus Escape to exit. Auto-advance off under `prefers-reduced-motion`.",
      because:
        "WCAG 2.2.2: moving content lasting more than five seconds needs a mechanism to pause it. " +
        "Touch-hold is not a mechanism a keyboard has.",
      kind: "accessibility",
    },
    {
      source: "STORY GRID + PLAYBACK.html",
      was: "Advance and reverse by tap zone and swipe only.",
      now: "Arrow keys and focusable controls, in addition.",
      because: "The player was entirely unreachable by keyboard, including its exit.",
      kind: "accessibility",
    },
    {
      source: "GallerySection+GalleryFrame.html",
      was: "`mix-blend-mode: difference` on a custom cursor ring, with `cursor: none` globally.",
      now: "Ring on fine pointers only, native cursor otherwise.",
      because: "Same failure as AS-01: no pointer on touch, and nothing at all for a keyboard.",
      kind: "interaction",
    },
    {
      source: "GallerySection+GalleryFrame.html",
      was: "Card titles and manifesto text with `white-space: nowrap` and ellipsis truncation.",
      now: "Titles wrap. Truncation with the full value in the accessible name, never silent.",
      because:
        "A truncated title on a 75vw card at 2.2rem loses words with no indication that anything " +
        "was lost.",
      kind: "accessibility",
    },
    {
      source: "GallerySection+GalleryFrame.html",
      was: "`--gc-moss: #4A7C59` on black at 4.32:1, carrying `STATE: NOMINAL`.",
      now: "confirm, at 6.55:1.",
      because: "4.32:1 is below AA for the 0.65rem size the label actually used.",
      kind: "accessibility",
    },
  ],
  notes:
    "Gateway only. There is no member or capital variant of this assembly and there should not be: " +
    "the format's whole premise is that you cannot go back and check.",
};

// ─────────────────────────────────────────────────────────────────────

export const ASSEMBLIES: readonly Assembly[] = [
  GATEWAY_GRID,
  PROPERTY_CONSOLE_SCREEN,
  PROPERTY_MASTHEAD,
  CAPITAL_EXPLAINER,
  MEMBER_CONSOLE,
  COMMITMENT_FLOW,
  PORTFOLIO_NARRATIVE,
  STORY_PLAYBACK,
];

/**
 * THE GROUND INVERSION — the best idea in the source set.
 *
 * TheCapital runs dark and cinematic while it explains, and flips to
 * paper the moment it starts making financial claims. Nothing announces
 * the switch; you simply arrive somewhere that feels audited.
 *
 * It works because it is not decorative. It maps a real distinction —
 * narrative versus assertion — onto the one property of a screen nobody
 * can miss. So it becomes a rule rather than a treatment.
 */
export const GROUND_INVERSION = {
  narrative: "void",
  assertion: "paper",
  rule:
    "A section making a financial claim renders on paper ground. A section explaining, " +
    "persuading or setting scene renders on void.",
  why:
    "Light means audited. Once that holds everywhere, a figure on a dark ground is legible as " +
    "context rather than commitment, without a word of explanation.",
  appliesTo: ["AS-04.c", "AS-04.d"],
  /** Not negotiable per-screen. A rule that flexes is a preference. */
  perScreenOverride: false,
} as const;

export const ASSEMBLY_LAWS = {
  answersInFive:
    "Every assembly names the one thing a person should know within five seconds of arriving. " +
    "A screen that cannot state it does not have a purpose, it has contents.",
  correctionsAreRecorded:
    "Where a prototype and the canon disagree, both are written down. A silent resolution is a " +
    "decision nobody can review.",
  noFigureInMotion:
    "A figure never appears in a surface that advances on a timer. It cannot be read, checked, " +
    "or returned to.",
  groundMeansAudited:
    "Paper ground marks a financial claim. Void ground marks narrative. The inversion carries " +
    "meaning and may not be used for variety.",
  vantageDecidesDisclosure:
    "An assembly composes apertures; it never widens one. A screen cannot show more than the " +
    "vantage it sits at permits.",
} as const;

export const assemblyById = (id: string): Assembly | undefined =>
  ASSEMBLIES.find((a) => a.id === id);

export const assembliesFor = (route: RouteGroup): Assembly[] =>
  ASSEMBLIES.filter((a) => a.route === route);

/** Every correction, flattened, for the design reference and the changelog. */
export const CORRECTIONS: readonly (Correction & { assembly: string })[] =
  ASSEMBLIES.flatMap((a) => (a.corrections ?? []).map((c) => ({ ...c, assembly: a.id })));

/** Surface strategy is derived from the route, never declared per assembly. */
export const strategyOf = (a: Assembly) => SURFACE_STRATEGY[a.route];
