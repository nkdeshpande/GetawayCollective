import { describe, expect, it } from "vitest";
import { assessGrant, grantsExpiringWithin } from "../lib/access-admin";
import type { AuthorityGrant, Engagement, NamedIdentity, PartnerFirm } from "../constants/operating-model";

const identity = (overrides: Partial<NamedIdentity> = {}): NamedIdentity => ({
  identityId: "person-1", name: "Named Person", firmId: "firm-1", verified: true, ...overrides,
});

const firm = (overrides: Partial<PartnerFirm> = {}): PartnerFirm => ({
  firmId: "firm-1", name: "Compliance Firm", umbrella: "governance_financial_compliance",
  status: "engaged", conflicts: [], ...overrides,
});

const engagement = (overrides: Partial<Engagement> = {}): Engagement => ({
  engagementId: "eng-1", firmId: "firm-1", scope: { kind: "vehicle", llpin: "LLP-1" },
  mandate: "Statutory records", start: "2026-01-01", end: "2027-01-01",
  owner: "governance_office", status: "active", ...overrides,
});

const request = {
  profileId: "financial_compliance_partner" as const,
  identityId: "person-1",
  right: "compliance.record" as const,
  scope: { kind: "vehicle", llpin: "LLP-1" } as const,
  grantor: "gov-1",
  reason: "Record statutory evidence",
  effective: "2026-08-01",
  expiry: "2026-12-31",
};

describe("Access Admin grant assessment", () => {
  it("allows a narrow, named, vehicle-scoped external compliance grant", () => {
    expect(assessGrant(request, [identity()], [firm()], [engagement()], [])).toEqual({ ok: true });
  });

  it("never grants authority to an AI profile", () => {
    expect(assessGrant({ ...request, profileId: "gc_01_platform_operations_agent" }, [identity({ firmId: undefined, fn: "ai_operating_layer" })], [], [], [])).toEqual({ ok: false, reason: "ai-cannot-hold-authority" });
  });

  it("rejects a partner grant without matching LLP scope", () => {
    expect(assessGrant({ ...request, scope: { kind: "enterprise" } }, [identity()], [firm()], [engagement()], [])).toEqual({ ok: false, reason: "partner-must-be-vehicle-scoped" });
  });

  it("rejects a profile that has not been allowed to request the right", () => {
    expect(assessGrant({ ...request, profileId: "legal_entity_advisory_partner" }, [identity()], [firm({ umbrella: "legal_entity_advisory" })], [engagement()], [])).toEqual({ ok: false, reason: "profile-does-not-permit-right" });
  });

  it("rejects the investment, financial execution, governance review triad", () => {
    const grants: AuthorityGrant[] = [
      { grantId: "g-1", identityId: "person-1", right: "capital.deploy", scope: { kind: "enterprise" }, grantor: "board", reason: "x", effective: "2026-01-01", expiry: "2027-01-01" },
      { grantId: "g-2", identityId: "person-1", right: "distribution.execute", scope: { kind: "enterprise" }, grantor: "board", reason: "x", effective: "2026-01-01", expiry: "2027-01-01" },
    ];
    const internal = { ...request, profileId: "board_member" as const, right: "resolution.resolve" as const };
    expect(assessGrant(internal, [identity({ firmId: undefined, fn: "governance_office" })], [], [], grants)).toEqual({ ok: false, reason: "separation-of-powers" });
  });

  it("lists live grants that need a review before expiry", () => {
    const grants: AuthorityGrant[] = [
      { grantId: "soon", identityId: "person-1", right: "compliance.record", scope: { kind: "vehicle", llpin: "LLP-1" }, grantor: "gov-1", reason: "x", effective: "2026-01-01", expiry: "2026-08-15" },
      { grantId: "later", identityId: "person-2", right: "compliance.record", scope: { kind: "vehicle", llpin: "LLP-1" }, grantor: "gov-1", reason: "x", effective: "2026-01-01", expiry: "2027-01-01" },
    ];
    expect(grantsExpiringWithin(grants, "2026-08-01", 30).map((grant) => grant.grantId)).toEqual(["soon"]);
  });
});
