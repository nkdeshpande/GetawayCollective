/**
 * The v5 role eligibility layer, and LAW 2 on the role-grant path.
 *
 * The linter checks that the declaration binds to registries that exist.
 * These check the constitutional claims the declaration makes — the ones
 * that would still be wrong if every id resolved.
 */

import { describe, it, expect } from "vitest";
import {
  PRINCIPALS, ELIGIBILITY_LAWS, principalsIn, principalById,
} from "../constants/role-eligibility";
import { ROLE_RIGHTS, SEPARATION_TRIADS } from "../lib/authority";
import type { Grant, Role } from "../lib/authority";
import { completesSeparationTriad, rightsFrom } from "../lib/auth/grants";

const grant = (role: Role, over: Partial<Grant> = {}): Grant => ({
  grantId: `g-${role}`,
  identityId: "i-1",
  role,
  scope: { kind: "enterprise" },
  grantedBy: "test",
  grantedAt: "2026-01-01T00:00:00.000Z",
  ...over,
});

describe("v5 role eligibility layer", () => {
  it("declares all fourteen principals across the four tiers", () => {
    expect(PRINCIPALS).toHaveLength(14);
    expect(principalsIn("gc_governance")).toHaveLength(3);
    expect(principalsIn("vehicle")).toHaveLength(3);
    expect(principalsIn("external")).toHaveLength(6);
    expect(principalsIn("ai")).toHaveLength(2);
  });

  it("gives every principal a boundary and a vehicle-scoped view", () => {
    for (const p of PRINCIPALS) {
      expect(p.boundary, p.id).toBeTruthy();
      expect(p.sees, p.id).toBeTruthy();
      expect(p.profiles.length, p.id).toBeGreaterThan(0);
    }
  });

  /* Capacity is never authority. This is the claim the whole external
     tier rests on: a lender, an auditor and a contractor are engaged, not
     empowered, and neither agent may hold a right at all. */
  it("gives no role to the external or AI tiers", () => {
    for (const p of [...principalsIn("external"), ...principalsIn("ai")]) {
      expect(p.role, p.id).toBeUndefined();
    }
  });

  it("gives every governance and vehicle principal an eligible role", () => {
    for (const p of [...principalsIn("gc_governance"), ...principalsIn("vehicle")]) {
      expect(p.role, p.id).toBeTruthy();
      expect(Object.keys(ROLE_RIGHTS)).toContain(p.role);
    }
  });

  /* The sheet is explicit: signing authority is "a named, expiring grant
     per mandate — not a property of the role". A distinct role would
     outlive the mandate that justified it, which is the exact failure
     LAW 1 exists to prevent. So all three vehicle principals are one
     role, and two of them are mandates over it. */
  it("models the vehicle tier as one role wearing three mandates", () => {
    const vehicle = principalsIn("vehicle");
    expect(new Set(vehicle.map((p) => p.role))).toEqual(new Set(["member"]));

    expect(principalById("designated_partner")?.mandate).toBe(true);
    expect(principalById("authorised_signatory")?.mandate).toBe(true);
    expect(principalById("partner")?.mandate).toBeUndefined();
  });

  it("states each law with the mechanism that enforces it", () => {
    for (const law of Object.values(ELIGIBILITY_LAWS)) {
      expect(law.length).toBeGreaterThan(80);
    }
    expect(ELIGIBILITY_LAWS.noSeparationTriad).toContain("completesSeparationTriad");
    expect(ELIGIBILITY_LAWS.roleIsNotAccess).toContain("reasoned grant");
  });
});

describe("LAW 2 on the role-grant path", () => {
  it("allows a grant that completes no triad", () => {
    expect(completesSeparationTriad([], "member")).toBeNull();
    expect(completesSeparationTriad([grant("compliance_office")], "member")).toBeNull();
  });

  /* board + investment_committee + executive_office assembles both
     declared triads between them. No single role does, which is what
     separationViolations() already proves — so the danger only ever
     arrives by accumulation, and only this check sees it. */
  it("refuses the grant that completes a triad by accumulation", () => {
    const held = [grant("board"), grant("investment_committee")];
    const triad = completesSeparationTriad(held, "executive_office");

    expect(triad).not.toBeNull();
    expect(SEPARATION_TRIADS.map((t) => [...t])).toContainEqual(triad);
  });

  it("refuses whichever grant happens to be last", () => {
    /* Order must not matter: the test is on the resulting set, because a
       triad is dangerous however it was assembled. */
    expect(completesSeparationTriad([grant("board"), grant("executive_office")], "investment_committee")).not.toBeNull();
    expect(completesSeparationTriad([grant("investment_committee"), grant("executive_office")], "board")).not.toBeNull();
  });

  it("ignores revoked and expired grants when computing the result", () => {
    const revoked = grant("board", { grantId: "g-rev", revokedAt: "2026-02-01T00:00:00.000Z" });
    const expired = grant("investment_committee", { grantId: "g-exp", expiresAt: "2026-01-02T00:00:00.000Z" });

    expect(rightsFrom([revoked, expired], "2026-06-01T00:00:00.000Z")).toEqual([]);
    /* With both dead, the third grant completes nothing. */
    expect(
      completesSeparationTriad([revoked, expired], "executive_office", "2026-06-01T00:00:00.000Z"),
    ).toBeNull();
  });
});
