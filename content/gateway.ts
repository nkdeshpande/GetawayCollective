/**
 * THE REMAINING GATEWAY SURFACES
 *
 * Wave 8 · Content
 *
 * Five pages linked from the footer that were still rendering the
 * registry scaffold: the portfolio narrative, the story playback, the
 * gallery frame, the knowledge base and recruitment.
 *
 * Each assembly already declares what its sections must hold and what
 * rule governs each. This file supplies the substance; the rules are
 * quoted where they shaped a decision.
 */

import { PROPERTIES } from "../app/_assemblies/data";
import { LLP, SITE } from "../app/_assemblies/slowspace";

/* ═══════════════════════════════════════════════════════════════════
   AS-07 · THE PORTFOLIO NARRATIVE

   Rule (AS-07.c): "Attributes are descriptive. No figure appears in
   this grid — it is not a comparison table." Three brands, three
   attributes each, and not one number among them.
   ═══════════════════════════════════════════════════════════════════ */

export interface Brand {
  name: string;
  position: string;
  hue: number;
  body: readonly string[];
  attributes: readonly { k: string; v: string }[];
}

export const BRANDS: readonly Brand[] = [
  {
    name: "SlowSpace",
    position: "Coastal and estuarine. Built heavy, held quiet.",
    hue: 198,
    body: [
      "The brand for sites where the weather is the main event. Mass is chosen for what it keeps " +
      "out rather than for what it costs, and the plan is arranged so the loudest edge of a " +
      "property is never the edge you sleep against.",
      "It is the slowest of the three to build and the least forgiving of a compromised site. " +
      "Where the land will not carry the specification, the site is not taken.",
    ],
    attributes: [
      { k: "Setting", v: "Coast, estuary, and the ground between them" },
      { k: "Construction", v: "Heavy mass, modular assembly, off-grid capable" },
      { k: "Occupancy shape", v: "Long and few, rather than short and many" },
    ],
  },
  {
    name: "Nine Hills",
    position: "Elevation. Weather as the thing you came for.",
    hue: 24,
    body: [
      "For sites where altitude does the work — cloud below the terrace, a temperature range that " +
      "makes glazing the hardest decision on the drawing.",
      "Access is the constraint that shapes everything else. A property that is beautiful and " +
      "four hours from an airport has a different occupancy profile from one that is beautiful " +
      "and forty minutes away, and the specification follows that rather than the view.",
    ],
    attributes: [
      { k: "Setting", v: "Highland and ridge" },
      { k: "Construction", v: "Thermal envelope first, glazing second" },
      { k: "Occupancy shape", v: "Seasonal, with a long shoulder" },
    ],
  },
  {
    name: "Coffee Acres",
    position: "Working land. The property sits inside something that already runs.",
    hue: 158,
    body: [
      "Sited within a working plantation, which means the property shares a road, a water table " +
      "and a labour calendar with an operation that predates it and will outlast it.",
      "That is a constraint and it is also the point: the surroundings are maintained by somebody " +
      "whose livelihood depends on them, rather than by a landscaping contract.",
    ],
    attributes: [
      { k: "Setting", v: "Within an operating agricultural estate" },
      { k: "Construction", v: "Light touch, minimal earthworks, existing access" },
      { k: "Occupancy shape", v: "Even through the year, with a harvest exclusion" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════
   AS-08 · THE STORY PLAYBACK
   AS-09 · THE GALLERY FRAME

   AS-08.b: "NO FIGURE APPEARS IN THE PLAYER. A number on a timed card
   that advances in four seconds cannot be read, checked or disputed."
   AS-09.a: "Advances only on intent. Nothing auto-plays, so no pause
   control is owed and none is faked."

   Both draw the same frames. The story is a sequence with a place at
   its centre; the gallery is the same set, addressable one at a time.
   ═══════════════════════════════════════════════════════════════════ */

export interface Frame {
  ref: string;
  place: string;
  caption: string;
  /** photograph | render | drawing. Never left to be guessed. */
  kind: "photograph" | "render" | "drawing";
  taken: string;
  hue: number;
}

/*
 * Every frame is a DRAWING. Not one property in the collection has been
 * photographed, and the two that are stabilised were acquired rather
 * than built by us.
 *
 * A gallery of renders presented as photographs is the commonest
 * misrepresentation in this industry and it needs no words to commit —
 * so each frame states its kind on the frame itself, and the set says
 * plainly that it contains no photographs yet.
 */
export const FRAMES: readonly Frame[] = [
  { ref: "F-01", place: SITE.name, kind: "drawing", taken: "2026-06-19",
    caption: "Section through the western edge. The wall thickness is the acoustic decision.",
    hue: 198 },
  { ref: "F-02", place: SITE.name, kind: "drawing", taken: "2026-06-19",
    caption: "Site plan. Two waters, and the sightline that keeps them from meeting inside.",
    hue: 198 },
  { ref: "F-03", place: "Kyoto House", kind: "drawing", taken: "2025-11-14",
    caption: "Machiya restoration. The timber reused stays visible as reused.", hue: 158 },
  { ref: "F-04", place: "Swiss Vault", kind: "drawing", taken: "2024-09-02",
    caption: "Passive house section. Every joint on this drawing is a thermal bridge avoided.",
    hue: 210 },
  { ref: "F-05", place: "Oslo Base", kind: "drawing", taken: "2026-07-15",
    caption: "Mass timber frame on district heat. Lease-up, so the drawing is what exists.",
    hue: 24 },
];

export const FRAMES_NOTE =
  "Every frame here is a drawing, and each says so. There are no photographs in this set because " +
  "no property in the collection has been photographed — two are stabilised and were acquired " +
  "rather than built, and the rest are at pre-construction or lease-up. A drawing labelled as a " +
  "drawing is worth more than a render that is not labelled at all.";

/* ═══════════════════════════════════════════════════════════════════
   AS-17 · THE KNOWLEDGE BASE

   Rule (AS-17.b): "Every answer cites a document. An uncited answer on
   a regulated platform is a claim with nothing behind it."
   ═══════════════════════════════════════════════════════════════════ */

export interface Answer {
  group: string;
  q: string;
  a: string;
  /** The governing instrument. Required — see the rule above. */
  cite: { label: string; href: string };
}

export const ANSWERS: readonly Answer[] = [
  {
    group: "What this is",
    q: "What am I actually buying?",
    a: "A contribution-weighted ownership interest in a body corporate that holds one property. " +
       "You contract with that vehicle, not with Getaway Collective, and your rights arise under " +
       "its Agreement and the Limited Liability Partnership Act 2008.",
    cite: { label: "Terms, Part A", href: "/legal/terms" },
  },
  {
    group: "What this is",
    q: "Does Getaway Collective own a share of the property?",
    a: "No. It holds no economic interest in any vehicle it governs, and that clause is " +
       "entrenched — changing it requires unanimity.",
    cite: { label: "Terms, Part A.4", href: "/legal/terms" },
  },
  {
    group: "Money",
    q: "When do I get paid, and how much?",
    a: "Revenue is applied in six stages, in order, and partners are stage six. Distribution " +
       "follows stabilisation, and stage six does not run at all if paying it would take the " +
       "administrative reserve below its floor.",
    cite: { label: "How capital works", href: "/how-capital-works" },
  },
  {
    group: "Money",
    q: "Can a profitable quarter pay nothing?",
    a: "Yes, and that is the mechanism working rather than failing. Five stages are satisfied " +
       "before partners, and the reserve floor blocks stage six independently of profit.",
    cite: { label: "Terms, Part E.3", href: "/legal/terms" },
  },
  {
    group: "Money",
    q: "What are the fees?",
    a: "The administrative reserve is 2.5% of revenue and the sinking fund is 2.5% of revenue. " +
       "There is no fee on committed capital, no fee on assets under management, no exit fee and " +
       "no performance fee.",
    cite: { label: "Terms, Part E.5", href: "/legal/terms" },
  },
  {
    group: "Getting out",
    q: "How do I sell?",
    a: "You find a buyer. There is no public market, no market maker, and no obligation on anyone " +
       "to buy at any price. A position is locked for the period in the vehicle's Agreement, and " +
       "after that a transfer needs consent.",
    cite: { label: "Asset Disclosure, Part G", href: "/legal/risk-disclosure" },
  },
  {
    group: "Getting out",
    q: "Is the internal register a market?",
    a: "No. It is a noticeboard of partners willing to buy or sell. It matches nobody, prices " +
       "nothing, and guarantees no counterparty.",
    cite: { label: "Terms, Part G.2", href: "/legal/terms" },
  },
  {
    group: "Nights",
    q: "How many nights do I get, and when do they start?",
    a: "In proportion to contribution, beginning at handover. Nothing is drawable against an " +
       "unbuilt asset, so the figure before handover is zero rather than a promise.",
    cite: { label: "Terms, Part F", href: "/legal/terms" },
  },
  {
    group: "Nights",
    q: "Who gets the popular dates?",
    a: "The partner who has drawn least that year goes first. Not the largest position and not " +
       "the earliest request.",
    cite: { label: "Terms, Part F.4", href: "/legal/terms" },
  },
  {
    group: "Risk",
    q: "Can I lose everything?",
    a: "Yes. Partners rank last, there is no capital protection, and no compensation scheme " +
       "stands behind a loss. Each vehicle holds one asset, so there is no diversification inside " +
       "it.",
    cite: { label: "Asset Disclosure, Part L", href: "/legal/risk-disclosure" },
  },
  {
    group: "Risk",
    q: "What happens if the operating partner is bad at this?",
    a: "It is measured against a Service Level and can be replaced. Replacement takes time and " +
       "the property earns less while it happens, and that cost falls on partners.",
    cite: { label: "The operators", href: "/collective/operators" },
  },
  {
    group: "Governance",
    q: "Can I be outvoted?",
    a: "Yes. Votes are weighted by contribution, so a small holder can be outvoted on everything " +
       "that is not entrenched. A tie is not approval — the resolution fails.",
    cite: { label: "The vehicle", href: "/structure" },
  },
];

/* ═══════════════════════════════════════════════════════════════════
   AS-18 · RECRUITMENT

   Rule (AS-18.a): "What the work is actually like. Two or three claims,
   all falsifiable."
   Rule (AS-18.b): "A filled role stays fully legible."
   ═══════════════════════════════════════════════════════════════════ */

export const HOW_WE_WORK: readonly { k: string; v: string }[] = [
  { k: "Everything is generated or checked",
    v: "Every registry has a generator and every rule has a linter that parses the canon rather " +
       "than copying it. If you dislike being told you are wrong by a script, you will dislike " +
       "this." },
  { k: "Nothing ships on a claim that a screen was looked at",
    v: "Contrast is measured against the built application on every route in both colour schemes. " +
       "The last several defects found were invisible to every linter and appeared only when " +
       "something was rendered." },
  { k: "Corrections are recorded with their reason",
    v: "There are 128 of them in the assembly registry, each naming what was there before and " +
       "why it changed. A decision with no recorded reason gets re-litigated every six months." },
];

export interface Role {
  code: string;
  title: string;
  owns: string;
  open: boolean;
  /* A filled role stays legible — AS-18.b. */
  closedNote?: string;
  detail: readonly string[];
}

export const ROLES: readonly Role[] = [
  {
    code: "ENG-01", title: "Systems engineer", open: true,
    owns: "The registries, the generators, and the checks that keep them honest.",
    detail: [
      "You would own the layer that decides what is true: the business objects, the route table, " +
      "the assembly registry, and the twelve linters that parse them.",
      "Most of the work is deciding what a check should refuse to pass, which is a design " +
      "question wearing engineering clothes.",
    ],
  },
  {
    code: "DES-01", title: "Interface designer", open: true,
    owns: "The design system, the ground inversion, and the accessibility floor.",
    detail: [
      "The system already has tokens, two grounds and a computed contrast audit. What it does not " +
      "have is somebody who owns the composition — how a screen carrying a settlement figure " +
      "should feel different from one carrying a photograph.",
      "You would be expected to argue with the brief. Several of the wireframes this platform is " +
      "built from asked for things that were accessible only with a pointer, and those arguments " +
      "were the useful part.",
    ],
  },
  {
    code: "FIN-01", title: "Vehicle administration", open: true,
    owns: "Formation, filings, the register, and the waterfall as it actually runs.",
    detail: [
      "One vehicle per property, each with its own filings, audit and distribution waterfall. You " +
      "would own that, and the arithmetic that has to close to the rupee.",
      "Having done this under Indian LLP law matters more here than having done it in hospitality.",
    ],
  },
  {
    code: "OPS-01", title: "Operating partner liaison", open: false,
    closedNote:
      "Filled in June 2026. Left visible because the work is a good description of what the " +
      "platform expects of an operator, and because a page that only shows open roles tells you " +
      "nothing about the shape of the organisation.",
    owns: "The Service Level, and the relationship with whoever runs each property.",
    detail: [
      "The operating partner is measured, paid at stage one, and replaceable. Somebody has to " +
      "hold that relationship without either capturing it or souring it.",
    ],
  },
];

export const APPLYING = {
  where: "roles@getawaycollective.co",
  send: [
    "Something you built, with the part you are least happy about pointed out.",
    "A page of writing. Any subject. We read for whether you can hold an argument, not for prose.",
    "No cover letter. If the two things above do not say it, a third document will not.",
  ],
  next:
    "Every application is answered, including the ones we decline, within ten working days. If " +
    "that does not happen, write again and say so — it is a failure on our side and we would " +
    "rather know.",
};

/* ═══════════════════════════════════════════════════════════════════ */

export const PROPERTY_COUNT = PROPERTIES.length;
export const VEHICLE = LLP.name;

/* ── Self-checks, at load ─────────────────────────────────────────── */
{
  /* AS-17.b: every answer cites a document. An uncited answer on a
     regulated platform is a claim with nothing behind it. */
  for (const a of ANSWERS) {
    if (!a.cite?.href || !a.cite.label) {
      throw new Error(`Answer "${a.q}" carries no citation`);
    }
  }

  /* AS-07.c: the attribute grid is descriptive, and no figure appears in
     it. Checked, because "no numbers" is exactly the rule that erodes
     the first time somebody wants to show a yield. */
  for (const b of BRANDS) {
    for (const at of b.attributes) {
      if (/\d/.test(at.v)) {
        throw new Error(
          `${b.name} attribute "${at.k}" contains a figure. AS-07.c: the grid is descriptive, ` +
            `not a comparison table.`,
        );
      }
    }
    if (b.attributes.length !== 3) throw new Error(`${b.name} must have three attributes`);
  }

  /* Every frame declares its kind. */
  for (const f of FRAMES) {
    if (!["photograph", "render", "drawing"].includes(f.kind)) {
      throw new Error(`Frame ${f.ref} has no kind`);
    }
  }
  const refs = FRAMES.map((f) => f.ref);
  if (new Set(refs).size !== refs.length) throw new Error("Duplicate frame ref");

  const codes = ROLES.map((r) => r.code);
  if (new Set(codes).size !== codes.length) throw new Error("Duplicate role code");
  for (const r of ROLES) {
    if (!r.open && !r.closedNote) {
      throw new Error(`${r.code} is closed and says nothing about why it is still listed`);
    }
  }
}
