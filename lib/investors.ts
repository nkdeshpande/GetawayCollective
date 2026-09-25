/**
 * WHO IS SIGNED IN, AS AN INVESTOR — read side
 *
 * 24 Sep 2026. Until today nothing linked a signed-in identity to the
 * Investor record, so no partner could reach their own surfaces
 * (lib/session.ts said: "when the investor record lands, this is the single
 * function that changes"). This is that record, read:
 *
 *   - an identity is linked to an Investor by the VERIFIED sign-in address
 *     (UFR-0166), matched case-insensitively;
 *   - member and accredited come from the record (the Member Law and
 *     accreditation), never from the presence of a session;
 *   - holdings are the positions in ownership_position, matched to the
 *     register's estates through investment_vehicle.register_key (UFR-0028).
 *
 * Every read fails closed: no database, no column, no row — no standing.
 * Nothing here ever reads a ciphertext column; the profile returns only the
 * last four digits the record keeps beside it.
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { investor, ownership_position, investment_vehicle } from "../generated/db-schema";

const g = globalThis as unknown as { __gcInvSql?: ReturnType<typeof postgres>; __gcInvDb?: ReturnType<typeof drizzle> };
function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!g.__gcInvDb) {
    g.__gcInvSql ??= postgres(url, { max: 3, prepare: false });
    g.__gcInvDb = drizzle(g.__gcInvSql);
  }
  return g.__gcInvDb;
}

export interface Standing { readonly investorId: string; readonly member: boolean; readonly accredited: boolean }
export interface Holding { readonly key: string; readonly units: string; readonly votingPercent: string }
export interface InvestorProfile {
  readonly legalName: string;
  readonly memberState: string;
  readonly accreditationState: string;
  readonly accreditationExpiresOn: string | null;
  readonly taxJurisdiction: string;
  readonly becameMemberOn: string | null;
  readonly kycState: string | null;
  readonly kycStages: Readonly<Record<string, string>> | null;
  readonly kycVerifiedOn: string | null;
  readonly kycReviewDueOn: string | null;
  readonly panLast4: string | null;
  readonly bank: {
    readonly holder: string | null; readonly name: string | null; readonly ifsc: string | null;
    readonly last4: string | null; readonly verifiedOn: string | null; readonly method: string | null;
  };
}

const iso = (d: Date | null | undefined) => (d ? d.toISOString() : null);

/** Accreditation is current only while it has not expired (I-03). */
export const accreditationCurrent = (state: string, expires: Date | null, now = new Date()) =>
  state === "accredited" && (!expires || expires.getTime() > now.getTime());

/** The investor record behind a verified address, or null. Never throws. */
export async function investorRowByEmail(email: string | null | undefined) {
  const d = db();
  if (!d || !email) return null;
  try {
    const rows = await d.select().from(investor).where(sql`lower(${investor.email}) = ${email.trim().toLowerCase()}`).limit(2);
    /* Two records claiming one address is a data fault, not a login: fail closed. */
    return rows.length === 1 ? rows[0] : null;
  } catch {
    return null;
  }
}

export async function standingByEmail(email: string | null | undefined): Promise<Standing | null> {
  const r = await investorRowByEmail(email);
  if (!r) return null;
  return { investorId: r.id, member: r.member_state === "member", accredited: accreditationCurrent(r.accreditation_state, r.accreditation_expires_on) };
}

/** The register keys of the estates this investor holds a position in. */
export async function holdingsOf(investorId: string): Promise<readonly Holding[]> {
  const d = db();
  if (!d) return [];
  try {
    const rows = await d
      .select({ key: investment_vehicle.register_key, units: ownership_position.units_held, voting: ownership_position.voting_rights_percent })
      .from(ownership_position)
      .innerJoin(investment_vehicle, eq(ownership_position.vehicle_id, investment_vehicle.id))
      .where(eq(ownership_position.investor_id, investorId));
    return rows.filter((r) => !!r.key).map((r) => ({ key: r.key!, units: String(r.units), votingPercent: String(r.voting) }));
  } catch {
    return [];
  }
}

/** What the investor may see of their own record. Never a ciphertext. */
export function profileOf(r: NonNullable<Awaited<ReturnType<typeof investorRowByEmail>>>): InvestorProfile {
  return {
    legalName: r.legal_name,
    memberState: r.member_state,
    accreditationState: r.accreditation_state,
    accreditationExpiresOn: iso(r.accreditation_expires_on),
    taxJurisdiction: r.tax_jurisdiction,
    becameMemberOn: iso(r.became_member_on),
    kycState: r.kyc_state ?? null,
    kycStages: (r.kyc_stages as Record<string, string> | null) ?? null,
    kycVerifiedOn: iso(r.kyc_verified_on),
    kycReviewDueOn: iso(r.kyc_review_due_on),
    panLast4: r.pan_last4 ?? null,
    bank: {
      holder: r.bank_account_holder ?? null, name: r.bank_name ?? null, ifsc: r.bank_ifsc ?? null,
      last4: r.bank_account_last4 ?? null, verifiedOn: iso(r.bank_verified_on), method: r.bank_verification_method ?? null,
    },
  };
}

/**
 * Whether this viewer may open this estate's partner view. The Office may
 * open any; an investor only the estates they hold. Pure, so it is tested.
 */
export function mayOpenEstate(viewer: { office: boolean; holdings: readonly Holding[] }, key: string): boolean {
  return viewer.office || viewer.holdings.some((h) => h.key === key);
}
