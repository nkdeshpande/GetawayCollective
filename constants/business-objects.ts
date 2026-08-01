/**
 * L2 Business Object Taxonomy — 27 institutional objects
 *
 * RATIFIED 30 Jul 2026 · L1-01 §33 (BLANK-20)
 *
 * Getaway Collective is an INVESTMENT PLATFORM, not an operating company.
 * These objects reflect institutional real estate management, not hospitality.
 *
 * This is the complete and exhaustive L2 layer. Only these objects may exist.
 *
 * SUPERSEDES the earlier 12-object hospitality model (BO-01…BO-12), whose
 * nouns are now forbidden and belong to Sensory Getaways (Operating Company).
 * See OPERATING_COMPANY_NOUNS below for the excluded set.
 *
 * The Constitutional Test: "Would an Investment Committee discuss this?"
 * If no, it does not belong here.
 */

/**
 * THE DOMAINS — rebuilt around the vehicle, 1 Aug 2026.
 *
 * SUPERSEDES the six flat peer domains (Enterprise · Assets · Capital ·
 * Governance · Performance · Intelligence). That layout had a defect the
 * flatness concealed: the Investment Vehicle sat INSIDE one of six equal
 * boxes, as though the LLP were a peer of its own constituents. It is
 * not. Everything below the platform tier exists only as a constituent
 * of some vehicle — the LLP owns the property, allocates the time,
 * receives the capital. The domain model now says so:
 *
 *                    PLATFORM
 *              (Getaway Collective)
 *                        │
 *                     VEHICLE
 *               (the LLP — the apex)
 *                        │
 *           ┌────────────┼────────────┐
 *         SPACE        TIME        CAPITAL
 *           └────────────┼────────────┘
 *                   GOVERNANCE
 *
 * SPACE — what the LLP owns: land, build, furniture and fittings.
 * TIME — what each partner controls: a static yearly allocation × stake.
 * CAPITAL — the complete financial position of the LLP.
 *
 * GOVERNANCE IS NOT A FOURTH BUSINESS FUNCTION. It is the constitutional
 * layer that governs the other three — the vehicle's operating law. It
 * owns no asset, allocates no time and holds no capital; it defines the
 * legal and administrative frame the other three exist inside, and it
 * mirrors the statutory obligations of the LLP Act 2008 so that every
 * government compliance has a named counterpart in the domain.
 *
 * PLATFORM holds the few objects that exist ABOVE any single vehicle:
 * the organization itself, the portfolio view across vehicles, and the
 * intelligence gathered before a vehicle exists to hold it.
 *
 * The full constitutional model — sections, constituents, what backs
 * each one, and the statutory mirror — is constants/vehicle-domain.ts.
 * This file keeps only the object-to-domain assignment.
 */
export enum Domain {
  /** Above any vehicle: the organization, the portfolio, the research. */
  Platform = "platform",
  /** The apex. Exactly one object lives here: the Investment Vehicle. */
  Vehicle = "vehicle",
  /** What the LLP owns. Land + build + furniture and fittings. */
  Space = "space",
  /** What each partner controls. Yearly allocation × stake — derived, never typed. */
  Time = "time",
  /** The complete financial position of the LLP. */
  Capital = "capital",
  /** The constitutional layer. Governs the other three; owns nothing. */
  Governance = "governance",
}

export enum BusinessObjectType {
  // ── Enterprise ──────────────────────────────────────────────────
  Organization = "organization",
  InvestmentVehicle = "investmentVehicle",
  Portfolio = "portfolio",

  // ── Assets ──────────────────────────────────────────────────────
  Property = "property",
  Acquisition = "acquisition",
  Valuation = "valuation",
  Disposition = "disposition",

  // ── Capital ─────────────────────────────────────────────────────
  InvestmentOffering = "investmentOffering",
  Investor = "investor",
  Commitment = "commitment",
  CapitalCall = "capitalCall",
  Investment = "investment",
  OwnershipPosition = "ownershipPosition",
  Distribution = "distribution",

  // ── Governance ──────────────────────────────────────────────────
  Agreement = "agreement",
  Resolution = "resolution",
  Policy = "policy",
  Committee = "committee",
  ComplianceEvent = "complianceEvent",

  // ── Performance ─────────────────────────────────────────────────
  PerformanceReport = "performanceReport",
  Benchmark = "benchmark",
  Forecast = "forecast",
  Risk = "risk",

  // ── Intelligence ────────────────────────────────────────────────
  DueDiligence = "dueDiligence",
  InvestmentThesis = "investmentThesis",
  MarketIntelligence = "marketIntelligence",
  Research = "research",
}

/**
 * Where each of the 27 ratified objects now lives.
 *
 * The OBJECT SET is unchanged — §33 still holds and contracts.test.ts
 * still pins 27. What changed is the shelf each object sits on:
 *
 * · InvestmentVehicle moved OUT of a peer domain to the apex. It is the
 *   thing the other domains are constituents OF.
 * · Performance dissolved into Capital: a performance report, a forecast
 *   — these ARE financial position, stated over time. The directed
 *   model files Reporting under Capital, and the old layout disagreed
 *   because it grouped by document kind rather than by question.
 * · Intelligence split. DueDiligence and InvestmentThesis attach to the
 *   asset (the thesis is a Property attribute in the constitutional
 *   model) → Space. MarketIntelligence and Research exist before any
 *   vehicle does → Platform.
 * · Risk moved to Governance: the risk register is fiduciary oversight,
 *   not a performance artefact.
 * · Time holds NO ratified object — deliberately. Time is a derived
 *   quantity (yearly allocation × stake); its candidate objects
 *   (OwnershipCalendar, AllocationRight) are REGISTERED in
 *   vehicle-domain.ts and await a §33 amendment. An empty domain that
 *   says why beats a domain padded with a borrowed object.
 */
export const BUSINESS_OBJECT_DOMAIN: Record<BusinessObjectType, Domain> = {
  // ── Platform — above any single vehicle ─────────────────────────
  [BusinessObjectType.Organization]: Domain.Platform,
  [BusinessObjectType.Portfolio]: Domain.Platform,
  [BusinessObjectType.MarketIntelligence]: Domain.Platform,
  [BusinessObjectType.Research]: Domain.Platform,
  [BusinessObjectType.Benchmark]: Domain.Platform,

  // ── Vehicle — the apex ──────────────────────────────────────────
  [BusinessObjectType.InvestmentVehicle]: Domain.Vehicle,

  // ── Space — what the LLP owns ───────────────────────────────────
  [BusinessObjectType.Property]: Domain.Space,
  [BusinessObjectType.Acquisition]: Domain.Space,
  [BusinessObjectType.Disposition]: Domain.Space,
  [BusinessObjectType.Valuation]: Domain.Space,
  [BusinessObjectType.DueDiligence]: Domain.Space,
  [BusinessObjectType.InvestmentThesis]: Domain.Space,

  // ── Time — holds no ratified object; see the note above ─────────

  // ── Capital — the financial position of the LLP ─────────────────
  [BusinessObjectType.InvestmentOffering]: Domain.Capital,
  [BusinessObjectType.Investor]: Domain.Capital,
  [BusinessObjectType.Commitment]: Domain.Capital,
  [BusinessObjectType.CapitalCall]: Domain.Capital,
  [BusinessObjectType.Investment]: Domain.Capital,
  [BusinessObjectType.OwnershipPosition]: Domain.Capital,
  [BusinessObjectType.Distribution]: Domain.Capital,
  [BusinessObjectType.PerformanceReport]: Domain.Capital,
  [BusinessObjectType.Forecast]: Domain.Capital,

  // ── Governance — the constitutional layer ───────────────────────
  [BusinessObjectType.Agreement]: Domain.Governance,
  [BusinessObjectType.Resolution]: Domain.Governance,
  [BusinessObjectType.Policy]: Domain.Governance,
  [BusinessObjectType.Committee]: Domain.Governance,
  [BusinessObjectType.ComplianceEvent]: Domain.Governance,
  [BusinessObjectType.Risk]: Domain.Governance,
};

/* The apex is singular. A second Vehicle-domain object would mean two
   things claim to be the thing the constituents belong to. */
{
  const apex = Object.values(BusinessObjectType).filter(
    (o) => BUSINESS_OBJECT_DOMAIN[o] === Domain.Vehicle,
  );
  if (apex.length !== 1 || apex[0] !== BusinessObjectType.InvestmentVehicle) {
    throw new Error(`The Vehicle domain must hold exactly the Investment Vehicle; got [${apex.join(", ")}]`);
  }
}

export const BUSINESS_OBJECT_NAMES: Record<BusinessObjectType, string> = {
  [BusinessObjectType.Organization]: "Organization",
  [BusinessObjectType.InvestmentVehicle]: "Investment Vehicle",
  [BusinessObjectType.Portfolio]: "Portfolio",
  [BusinessObjectType.Property]: "Property",
  [BusinessObjectType.Acquisition]: "Acquisition",
  [BusinessObjectType.Valuation]: "Valuation",
  [BusinessObjectType.Disposition]: "Disposition",
  [BusinessObjectType.InvestmentOffering]: "Investment Offering",
  [BusinessObjectType.Investor]: "Investor",
  [BusinessObjectType.Commitment]: "Commitment",
  [BusinessObjectType.CapitalCall]: "Capital Call",
  [BusinessObjectType.Investment]: "Investment",
  [BusinessObjectType.OwnershipPosition]: "Ownership Position",
  [BusinessObjectType.Distribution]: "Distribution",
  [BusinessObjectType.Agreement]: "Agreement",
  [BusinessObjectType.Resolution]: "Resolution",
  [BusinessObjectType.Policy]: "Policy",
  [BusinessObjectType.Committee]: "Committee",
  [BusinessObjectType.ComplianceEvent]: "Compliance Event",
  [BusinessObjectType.PerformanceReport]: "Performance Report",
  [BusinessObjectType.Benchmark]: "Benchmark",
  [BusinessObjectType.Forecast]: "Forecast",
  [BusinessObjectType.Risk]: "Risk",
  [BusinessObjectType.DueDiligence]: "Due Diligence",
  [BusinessObjectType.InvestmentThesis]: "Investment Thesis",
  [BusinessObjectType.MarketIntelligence]: "Market Intelligence",
  [BusinessObjectType.Research]: "Research",
};

export const ALL_BUSINESS_OBJECTS = Object.values(BusinessObjectType);

/**
 * Nouns that belong to the Operating Company, never to this platform.
 * Listed so that a rejection can explain itself rather than merely fail.
 */
export const OPERATING_COMPANY_NOUNS = [
  "guest", "journey", "experience", "stay", "reservation", // vocab-lint-ignore
  "studio", "cabin", "room", "unit", // vocab-lint-ignore
  "concierge", "housekeeping", "wellness", "amenity", // vocab-lint-ignore
] as const;

export function isApprovedBusinessObject(
  candidate: unknown,
): candidate is BusinessObjectType {
  return ALL_BUSINESS_OBJECTS.includes(candidate as BusinessObjectType);
}

export function objectsInDomain(domain: Domain): BusinessObjectType[] {
  return ALL_BUSINESS_OBJECTS.filter((o) => BUSINESS_OBJECT_DOMAIN[o] === domain);
}

/** Explains WHY a rejected noun was rejected, rather than just rejecting it. */
export function rejectionReason(candidate: string): string | null {
  const lower = candidate.toLowerCase();
  if (isApprovedBusinessObject(lower)) return null;
  if ((OPERATING_COMPANY_NOUNS as readonly string[]).includes(lower)) {
    return `"${candidate}" belongs to the Operating Company (Sensory Getaways), not the investment platform. Constitutional Test: would an Investment Committee discuss it?`;
  }
  return `"${candidate}" is not one of the 27 ratified L2 business objects (L1-01 §33).`;
}
