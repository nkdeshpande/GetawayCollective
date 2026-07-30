/**
 * L2 Business Object Taxonomy — 25 institutional objects
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

export enum Domain {
  Enterprise = "enterprise",
  Assets = "assets",
  Capital = "capital",
  Governance = "governance",
  Performance = "performance",
  Intelligence = "intelligence",
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

export const BUSINESS_OBJECT_DOMAIN: Record<BusinessObjectType, Domain> = {
  [BusinessObjectType.Organization]: Domain.Enterprise,
  [BusinessObjectType.InvestmentVehicle]: Domain.Enterprise,
  [BusinessObjectType.Portfolio]: Domain.Enterprise,

  [BusinessObjectType.Property]: Domain.Assets,
  [BusinessObjectType.Acquisition]: Domain.Assets,
  [BusinessObjectType.Valuation]: Domain.Assets,
  [BusinessObjectType.Disposition]: Domain.Assets,

  [BusinessObjectType.InvestmentOffering]: Domain.Capital,
  [BusinessObjectType.Investor]: Domain.Capital,
  [BusinessObjectType.Commitment]: Domain.Capital,
  [BusinessObjectType.CapitalCall]: Domain.Capital,
  [BusinessObjectType.Investment]: Domain.Capital,
  [BusinessObjectType.OwnershipPosition]: Domain.Capital,
  [BusinessObjectType.Distribution]: Domain.Capital,

  [BusinessObjectType.Agreement]: Domain.Governance,
  [BusinessObjectType.Resolution]: Domain.Governance,
  [BusinessObjectType.Policy]: Domain.Governance,
  [BusinessObjectType.Committee]: Domain.Governance,
  [BusinessObjectType.ComplianceEvent]: Domain.Governance,

  [BusinessObjectType.PerformanceReport]: Domain.Performance,
  [BusinessObjectType.Benchmark]: Domain.Performance,
  [BusinessObjectType.Forecast]: Domain.Performance,
  [BusinessObjectType.Risk]: Domain.Performance,

  [BusinessObjectType.DueDiligence]: Domain.Intelligence,
  [BusinessObjectType.InvestmentThesis]: Domain.Intelligence,
  [BusinessObjectType.MarketIntelligence]: Domain.Intelligence,
  [BusinessObjectType.Research]: Domain.Intelligence,
};

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
  return `"${candidate}" is not one of the 25 ratified L2 business objects (L1-01 §33).`;
}
