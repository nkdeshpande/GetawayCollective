/**
 * WHERE A SIGN-IN LANDS — one sign-in for everyone, one destination each
 *
 * 25 Sep 2026, founder: nobody chooses a type of login, and nobody is
 * stopped from creating one. Everyone signs in the same way; the record
 * decides where they arrive, so each lands where their work is:
 *
 *   an Office right          → the Office
 *   a settled holding        → their holdings
 *   current accreditation    → the full offering of the estate raising now
 *   a sign-in, nothing more  → the estate raising now, where a unit can be
 *                              held today
 *
 * KYC decides none of this. It is a parallel process that completes before
 * the LLP agreement is signed — the last step of becoming a partner, never
 * a gate on looking, asking or holding.
 */

import { VEHICLES } from "../constants/vehicles";

export interface Standing {
  readonly identified: boolean;
  readonly accredited: boolean;
  readonly member: boolean;
  readonly office: boolean;
}

/** The estate raising now: an open offering with units left, read from the register. */
export const raisingSlug = (): string | null =>
  VEHICLES.find((v) => v.lifecycle === "raising" && v.offering.available > 0)?.slug ?? null;

export function landingFor(s: Standing, raising: string | null = raisingSlug()): string {
  if (!s.identified) return "/sign-in";
  if (s.office) return "/office";
  if (s.member) return "/home";
  if (s.accredited) return raising ? `/invest/${raising}` : "/collection";
  return raising ? `/collection/${raising}` : "/collection";
}

export { accountLabel } from "./account-label";
