/**
 * THE INVESTOR RECORD — the rules, with nothing attached
 *
 * 25 Sep 2026. The Office can now put four facts about a person on the
 * record (lib/commands.ts: RegisterInvestor, RecordKyc, RecordBankAccount,
 * RecordRegisterEntry). Everything here is the checking and deriving those
 * acts need, kept free of the database and the network so that each rule
 * is tested on its own (tests/office-records.test.ts).
 *
 * Three rules carry most of the weight:
 *
 *   - VOTING SHARE IS DERIVED, never typed: units held over units issued
 *     (UFR-0243). A typed percentage is a second source of truth that
 *     drifts the first time units move.
 *   - CONSERVATION: the units recorded in a vehicle may never exceed the
 *     units it issued (UFR-0023, F-12). Fewer is normal while the register
 *     is being transcribed, and the Office is shown the gap.
 *   - VERIFIED MEANS EVERY STAGE: a KYC record reads verified only when
 *     all six checks do, and only with the date they were verified.
 *
 * The 10 % voting cap (UFR-0243: "Capped at 10 percent absent Board
 * approval") is FLAGGED, not enforced. Every estate on the register today
 * issues two to six units, so a single unit is 16.7 % or more of the votes,
 * and enforcing the cap would refuse every real position. That conflict is
 * the founder's to resolve; until then the record says so on its face.
 */

import { z } from "zod";

export const KYC_STATES = ["not_started", "in_progress", "verified", "needs_update"] as const;
export type KycState = (typeof KYC_STATES)[number];

/** The six checks, in the order the investor's own profile lists them. */
export const KYC_STAGE_KEYS = ["identity", "address", "tax_residency", "source_of_funds", "suitability", "screening"] as const;
export const KYC_STAGE_LABEL: Record<(typeof KYC_STAGE_KEYS)[number], string> = {
  identity: "Identity", address: "Address", tax_residency: "Tax residency and PAN",
  source_of_funds: "Source of funds", suitability: "Suitability", screening: "Screening",
};

/** UFR-0179: the three ways an account is verified. */
export const BANK_METHODS = ["penny_drop", "cancelled_cheque", "bank_statement"] as const;
export const BANK_METHOD_LABEL: Record<(typeof BANK_METHODS)[number], string> = {
  penny_drop: "Penny drop", cancelled_cheque: "Cancelled cheque", bank_statement: "Bank statement",
};

/** investment_vehicle.lifecycle_state (UFR-0027). */
export const VEHICLE_STATES = ["forming", "raising", "deployed", "stabilised", "winding_down", "dissolved"] as const;

export const VOTING_CAP_PERCENT = 10;

const trimmed = (min: number, max: number) => z.string().trim().min(min).max(max);
const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "a date as YYYY-MM-DD");
const reason = z.string().trim().min(8, "a reason of at least a few words (E-02)").max(600);
/** Rupees with at most two decimals. Stored as numeric(20, 4). */
const rupees = z.string().trim().regex(/^\d{1,16}(\.\d{1,2})?$/, "an amount in rupees, digits only");

export const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const ACCOUNT = /^\d{9,18}$/;

/* ── The four acts, as the Office submits them ───────────────────────── */

export const RegisterInvestorBody = z.object({
  legalName: trimmed(2, 200),
  email: z.string().trim().toLowerCase().email("a valid address").max(320),
  /* ISO 3166-2 (UFR-0164): a country, optionally with its subdivision. */
  taxJurisdiction: z.string().trim().toUpperCase().regex(/^[A-Z]{2}(-[A-Z0-9]{1,3})?$/, "an ISO 3166 code, such as IN or IN-KA"),
});

const Stage = z.enum(KYC_STATES);
/* Spaces and dashes are how people copy account numbers; they are not part of one. */
const digitsOnly = z.string().transform((v) => v.replace(/[\s-]/g, ""));

export const RecordKycBody = z.object({
  kycState: z.enum(KYC_STATES),
  stages: z.object({ identity: Stage, address: Stage, tax_residency: Stage, source_of_funds: Stage, suitability: Stage, screening: Stage }),
  verifiedOn: isoDay.optional().or(z.literal("")),
  reviewDueOn: isoDay.optional().or(z.literal("")),
  /* Optional: an update to the stages need not re-enter the PAN. */
  pan: z.string().trim().toUpperCase().regex(PAN, "a PAN in the form ABCDE1234F").optional().or(z.literal("")),
  reason,
});

export const RecordBankBody = z.object({
  holder: trimmed(2, 200),
  bankName: trimmed(2, 120),
  ifsc: z.string().trim().toUpperCase().regex(IFSC, "an IFSC in the form ABCD0123456"),
  account: digitsOnly.pipe(z.string().regex(ACCOUNT, "an account number of 9 to 18 digits")),
  accountAgain: digitsOnly,
  method: z.enum(BANK_METHODS),
  verifiedOn: isoDay.optional().or(z.literal("")),
  reason,
}).refine((b) => b.account === b.accountAgain, { message: "The two account numbers do not match.", path: ["accountAgain"] });

export const RecordPositionBody = z.object({
  estate: z.string().min(1),
  units: z.string().trim().regex(/^\d{1,14}(\.\d{1,6})?$/, "units as a number, up to six decimals"),
  ownershipClass: trimmed(1, 24).default("A"),
  settledOn: isoDay,
  reason,
});

export const FormVehicleBody = z.object({
  estate: z.string().min(1),
  totalUnitsIssued: z.coerce.number().int().positive().max(1_000_000),
  reserveFloor: rupees,
  reserveBalance: rupees,
  lifecycleState: z.enum(VEHICLE_STATES),
  reason,
});

export const RegisterOrganizationBody = z.object({
  legalName: trimmed(2, 200),
  entityType: z.enum(["llp", "private_limited", "trust", "partnership", "sole_proprietor", "foreign_entity"]),
  jurisdiction: z.string().trim().toUpperCase().regex(/^[A-Z]{2}(-[A-Z0-9]{1,3})?$/, "an ISO 3166 code, such as IN or IN-KA"),
  registrationNumber: trimmed(3, 64),
  incorporatedOn: isoDay,
});

/* ── Derivations ─────────────────────────────────────────────────────── */

/**
 * Units as integer millionths, so the arithmetic is exact. numeric(20, 6)
 * in the database; a float here would let 0.1 + 0.2 decide who owns what.
 */
export function microUnits(units: string): bigint {
  const [whole, frac = ""] = units.trim().split(".");
  return BigInt(whole || "0") * 1_000_000n + BigInt((frac + "000000").slice(0, 6));
}

export const fromMicro = (m: bigint): string => {
  const whole = m / 1_000_000n, frac = (m % 1_000_000n).toString().padStart(6, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : String(whole);
};

/** UFR-0243: units held over units issued, as a percentage to six places. */
export function votingPercent(units: string, totalIssued: number): string {
  if (totalIssued <= 0) throw new Error("A vehicle with no units issued has no votes to share.");
  const scaled = (microUnits(units) * 100n * 1_000_000n) / (BigInt(totalIssued) * 1_000_000n);
  return fromMicro(scaled);
}

export const aboveVotingCap = (percent: string): boolean => microUnits(percent) > BigInt(VOTING_CAP_PERCENT) * 1_000_000n;

/**
 * F-12 / UFR-0023. The refusal names both numbers, because the Office's
 * next question is always "how many are left".
 */
export function conservationRefusal(alreadyRecorded: readonly string[], adding: string, totalIssued: number): string | null {
  const have = alreadyRecorded.reduce((n, u) => n + microUnits(u), 0n);
  const after = have + microUnits(adding);
  const cap = BigInt(totalIssued) * 1_000_000n;
  if (microUnits(adding) <= 0n) return "A position must hold more than zero units.";
  if (after > cap) {
    return `This would record ${fromMicro(after)} units in a vehicle that issued ${totalIssued}. ` +
      `${fromMicro(cap - have > 0n ? cap - have : 0n)} remain unrecorded. The units recorded may never exceed the units issued (F-12).`;
  }
  return null;
}

/** Verified only when every stage is, and only with a date (RecordKyc). */
export function kycRefusal(b: { kycState: KycState; stages: Record<string, KycState>; verifiedOn?: string }): string | null {
  if (b.kycState !== "verified") return null;
  const open = KYC_STAGE_KEYS.filter((k) => b.stages[k] !== "verified");
  if (open.length) return `KYC cannot read verified while ${open.map((k) => KYC_STAGE_LABEL[k]).join(", ")} ${open.length === 1 ? "is" : "are"} not.`;
  if (!b.verifiedOn) return "A verified KYC record needs the date it was verified.";
  return null;
}

/**
 * The register's lifecycle word mapped to the vehicle record's, only where
 * the two mean the same thing. "funded" and "live" have no exact twin
 * (deployed? stabilised?), so they map to nothing and the Office chooses.
 */
export function suggestedVehicleState(lifecycle: string): (typeof VEHICLE_STATES)[number] | null {
  return lifecycle === "forming" || lifecycle === "raising" || lifecycle === "dissolved" ? lifecycle : null;
}

/** Rupees as the register holds them (bigint, four decimal places) to a form value. */
export const rupeesFromMinor = (minor: bigint | null): string => (minor === null ? "" : (minor / 10000n).toString());

export const isUuid = (s: string): boolean => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
