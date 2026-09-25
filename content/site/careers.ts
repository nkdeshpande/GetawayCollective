/**
 * CAREERS — two roles for the whole company
 *
 * Founder brief, 25 Sep 2026: the business runs as two roles, kept apart on
 * purpose (the Strategic Partition). This is that brief, restated against
 * the register and the constitution rather than copied:
 *
 *   - the vehicles are limited liability partnerships, one per estate, so
 *     the brief's company instruments (SPV, SHA, AoA, DVRs, CCDs, PAS-4) do
 *     not appear;
 *   - the waterfall is the canon's six stages closing to 10,000 bps, not
 *     50/35/15, and no split of revenue is stated here at all;
 *   - Getaway Collective governs and holds no equity (Governance Without
 *     Ownership), and title sits in the partnership's own name;
 *   - replacing an operator is stated as the operating-partner page states
 *     it — possible, slow, and a disclosed risk — not as a 48-hour takeover;
 *   - nothing about letting nights to others is stated: the LLP agreement
 *     governs it, and at Tidal Club counsel is still advising;
 *   - the operator is Sensory Getaways, as the register names it.
 * Words the vocabulary forbids are not used (constants/vocabulary.ts).
 *
 * Roles, not vacancies: no opening, salary or headcount is stated until the
 * founder states one.
 */

export interface CareerRole {
  readonly label: string;
  readonly holder: string;
  readonly title: string;
  readonly stamp: string;
  readonly purpose: string;
  readonly orientation: string;
  readonly holds: readonly string[];
}

export const ROLES: readonly CareerRole[] = [
  {
    label: "Developer and asset manager",
    holder: "Getaway Collective · capital and governance",
    title: "The master developer and asset manager",
    stamp: "Governs",
    purpose:
      "Faces the partners. Forms each estate's partnership, secures its land, raises and reports its capital, and governs the operator on the partners' behalf. It holds no equity in any estate it governs.",
    orientation: "Investor-facing · fiduciary · legal · financial · portfolio governance",
    holds: [
      "Capital and partner relations: qualification, suitability, offering letters, and every communication with partners.",
      "Vehicles and legal engineering: one limited liability partnership per estate, its LLP agreement, its reserved matters and its resolutions.",
      "Land and title: finding the land, diligence on its title, conversion clearances, and title held in the partnership's own name.",
      "The record and its reporting: the register every figure is read from, the six-stage waterfall, the sinking fund, and what partners receive.",
      "Governance of the operator: its Service Level, its audits, and replacing an operator that falls short, where the agreement provides.",
    ],
  },
  {
    label: "Operating and brand partner",
    holder: "Sensory Getaways · operations and brand",
    title: "The operating and brand partner",
    stamp: "Operates",
    purpose:
      "Runs each estate day to day, under contract to its partnership, and carries the brands that bring people to it. It is measured against a Service Level and paid from stage one of the waterfall.",
    orientation: "Technical operations · administration · on-site delivery · marketing",
    holds: [
      "Estate operations and partner care: the team on site, and each estate made ready for the partners who use it.",
      "Technical upkeep: the structure and its systems (water, power, solar, pools), repairs, and renewals paid from the sinking fund.",
      "Administration and the site: local procurement, vendors, health, safety and statutory compliance (FSSAI, fire, labour codes), payroll, and operational risk.",
      "Marketing and brand: the estates' brands, their public channels, and their campaigns.",
    ],
  },
];

/** Why the company is two roles and not one: each point as the site already states it. */
export const WHY: readonly { readonly t: string; readonly sub: string; readonly text: string }[] = [
  {
    t: "Liability sits with the work",
    sub: "Three entities, each answerable for its own part",
    text: "The partnership owns the estate. The operating partner does the daily work and answers for it. The Terms state what each of the three, Getaway Collective, the partnership and the operator, is and is not responsible for.",
  },
  {
    t: "Each is paid for its own job",
    sub: "From disclosed stages of one waterfall",
    text: "The operating partner is paid from stage one of the waterfall and measured against a Service Level. Getaway Collective is paid from one disclosed stage and holds no equity in any estate.",
  },
  {
    t: "The operator can be replaced",
    sub: "Governed, not owned",
    text: "An operator that falls short can be replaced. Replacement takes time, and the estate earns less while it happens; that cost falls on partners and is disclosed as a risk rather than described as a safeguard.",
  },
];

/** How to apply: one address, and one question answered instead of a CV. */
export const APPLY = {
  address: "hello@getawaycollective.co",
  ask: "Name the role in the subject line. Instead of a CV, tell us about one thing you have built or run: what it was, what went wrong, and what you did about it.",
} as const;
