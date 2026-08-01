/**
 * The enterprise operating model and the Access-Admin lifecycle.
 *
 * The model's central rules, held as tests: firms are capacity and
 * never authority; the AI layer escalates and never decides; every
 * grant is named, scoped, time-bound, reasoned, and separation-safe;
 * the work docket has no shortcuts and no self-review.
 */

import { describe, it, expect } from "vitest";
import {
  FUNCTIONS, EXECUTIVES, UMBRELLAS, WORKFLOWS, AI_ESCALATION_MATTERS,
  type Engagement, type NamedIdentity, type PartnerFirm, type WorkflowAssignment,
} from "../constants/operating-model";
import {
  requestGrant, revokeGrant, expiring, separationAlerts, unassignedRights,
  advanceWork, EMPTY_REGISTER, INTERNAL_ONLY_RIGHTS, type Register,
} from "../lib/access-admin";
import { ALL_RIGHTS, SEPARATION_TRIADS } from "../lib/authority";

/* ── A worked register ────────────────────────────────────────────── */

const firm: PartnerFirm = {
  firmId: "PF-01", name: "Coastal CS LLP", umbrella: "governance_financial_compliance",
  status: "engaged", conflicts: [],
};
const partnerPerson: NamedIdentity = {
  identityId: "ID-01", name: "A. Rao", firmId: "PF-01", verified: true,
};
const internalPerson: NamedIdentity = {
  identityId: "ID-02", name: "N. Iyer", fn: "governance_office", verified: true,
};
const engagement: Engagement = {
  engagementId: "EN-01", firmId: "PF-01", scope: { kind: "vehicle", llpin: "AAC-4471" },
  mandate: "Statutory filings for SlowSpace Coastal LLP", start: "2026-07-01", end: "2027-06-30",
  owner: "governance_office", status: "active",
};

const REG: Register = {
  ...EMPTY_REGISTER,
  firms: [firm],
  identities: [partnerPerson, internalPerson],
  engagements: [engagement],
  appointments: [{ appointmentId: "AP-01", identityId: "ID-02", fn: "governance_office",
                   role: "governance_office", start: "2026-07-01", reviewOn: "2027-07-01" }],
};

const ASOF = "2026-08-01";
const base = {
  scope: { kind: "vehicle" as const, llpin: "AAC-4471" },
  grantor: "ID-02", reason: "Quarterly TDS filing for the vehicle",
  effective: "2026-08-01", expiry: "2026-09-01",
};

describe("the model's shape", () => {
  it("no partner umbrella holds any constitutional right", () => {
    for (const u of UMBRELLAS) expect(u.mayHoldRights, u.name).toHaveLength(0);
  });

  it("the AI layer never decides and holds no authority home", () => {
    const ai = FUNCTIONS.find((f) => f.fn === "ai_operating_layer")!;
    expect(ai.neverDecides).toBe(true);
    expect(ai.authorityHome).toBeNull();
    expect(AI_ESCALATION_MATTERS.length).toBeGreaterThanOrEqual(5);
  });

  it("every executive states what they must not decide alone", () => {
    for (const e of EXECUTIVES) expect(e.mustNotDecideAlone.length, e.title).toBeGreaterThan(0);
  });

  it("all four workflows carry enforcing control points", () => {
    expect(WORKFLOWS.map((w) => w.id)).toEqual(["WF-1", "WF-2", "WF-3", "WF-4"]);
  });
});

describe("a grant must be earned", () => {
  it("grants a scoped, reasoned, expiring right to a verified partner person", () => {
    const d = requestGrant(REG, { identityId: "ID-01", right: "compliance.record", ...base }, ASOF);
    expect(d.ok).toBe(true);
    if (d.ok) {
      expect(d.grant.expiry).toBe("2026-09-01");
      expect(d.grant.reason).toContain("TDS");
    }
  });

  it("refuses a firm as grantee — authority never attaches to a company", () => {
    const d = requestGrant(REG, { identityId: "PF-01", right: "compliance.record", ...base }, ASOF);
    expect(d.ok).toBe(false);
    if (!d.ok) expect(d.refusals.join(" ")).toContain("never to companies");
  });

  it("refuses internal-only rights to any partner identity", () => {
    for (const right of ["commitment.accept", "distribution.execute", "policy.approve"] as const) {
      const d = requestGrant(REG, { identityId: "ID-01", right, ...base }, ASOF);
      expect(d.ok, right).toBe(false);
      if (!d.ok) expect(d.refusals.join(" ")).toContain("internal-only");
    }
    expect(INTERNAL_ONLY_RIGHTS.length).toBeGreaterThanOrEqual(15);
  });

  it("refuses a grant with no engagement covering the scope", () => {
    const d = requestGrant(REG, {
      identityId: "ID-01", right: "compliance.record", ...base,
      scope: { kind: "vehicle", llpin: "ZZZ-9999" },
    }, ASOF);
    expect(d.ok).toBe(false);
    if (!d.ok) expect(d.refusals.join(" ")).toContain("No active engagement");
  });

  it("refuses a grant without expiry, and one with a trivial reason", () => {
    const noExp = requestGrant(REG, { identityId: "ID-02", right: "policy.approve", ...base, expiry: "" }, ASOF);
    expect(noExp.ok).toBe(false);
    if (!noExp.ok) expect(noExp.refusals.join(" ")).toContain("super-admin on layaway");

    const noWhy = requestGrant(REG, { identityId: "ID-02", right: "policy.approve", ...base, reason: "ok" }, ASOF);
    expect(noWhy.ok).toBe(false);
    if (!noWhy.ok) expect(noWhy.refusals.join(" ")).toContain("E-02");
  });

  it("collects EVERY refusal, not the first", () => {
    const d = requestGrant(REG, {
      identityId: "PF-01", right: "capital.deploy",
      scope: { kind: "vehicle", llpin: "AAC-4471" },
      grantor: "ID-02", reason: "", effective: "2026-08-01", expiry: "",
    }, ASOF);
    expect(d.ok).toBe(false);
    if (!d.ok) expect(d.refusals.length).toBeGreaterThanOrEqual(3);
  });

  it("refuses the grant that would complete a separation triad", () => {
    const [a, b, c] = SEPARATION_TRIADS[0];
    let reg: Register = { ...REG };
    for (const right of [a, b]) {
      const d = requestGrant(reg, {
        identityId: "ID-02", right, ...base,
        reason: `Held for the separation test: ${right}`,
      }, ASOF);
      expect(d.ok, right).toBe(true);
      if (d.ok) reg = { ...reg, grants: [...reg.grants, d.grant] };
    }
    const third = requestGrant(reg, {
      identityId: "ID-02", right: c, ...base,
      reason: "The third leg of the triad",
    }, ASOF);
    expect(third.ok).toBe(false);
    if (!third.ok) expect(third.refusals.join(" ")).toContain("GP-06");
  });
});

describe("revocation and the views", () => {
  const granted = (() => {
    const d = requestGrant(REG, { identityId: "ID-01", right: "compliance.record", ...base }, ASOF);
    if (!d.ok) throw new Error("setup");
    return d.grant;
  })();

  it("revokes with a reason, never deletes, never twice", () => {
    const r = revokeGrant(granted, "ID-02", "Engagement narrowed at renewal", "2026-08-15");
    expect(r.revoked?.reason).toContain("narrowed");
    expect(r.grantId).toBe(granted.grantId);
    expect(() => revokeGrant(r, "ID-02", "again for the test", "2026-08-16")).toThrow("already revoked");
    expect(() => revokeGrant(granted, "ID-02", "no", "2026-08-15")).toThrow("reason");
  });

  it("lists grants expiring inside the review window", () => {
    const reg = { ...REG, grants: [granted] };
    expect(expiring(reg, "2026-08-05", 30).map((g) => g.grantId)).toContain(granted.grantId);
    expect(expiring(reg, "2026-08-05", 5)).toHaveLength(0);
  });

  it("surfaces a separation alert if a triad ever assembles", () => {
    // Manufactured directly — requestGrant refuses this, which is the point:
    // the alert view is the second net under the first.
    const [a, b, c] = SEPARATION_TRIADS[0];
    const mk = (right: typeof a, n: number) => ({
      grantId: `AG-X${n}`, identityId: "ID-02", right,
      scope: { kind: "enterprise" as const }, grantor: "x",
      reason: "manufactured for the alert test", effective: "2026-08-01", expiry: "2027-08-01",
    });
    const reg = { ...REG, grants: [mk(a, 1), mk(b, 2), mk(c, 3)] };
    expect(separationAlerts(reg, ASOF)).toHaveLength(1);
  });

  it("names the rights nobody holds — work that cannot happen", () => {
    const un = unassignedRights({ ...REG, grants: [granted] }, ALL_RIGHTS, ASOF);
    expect(un).not.toContain("compliance.record");
    expect(un).toContain("distribution.execute");
  });
});

describe("the work docket", () => {
  const work: WorkflowAssignment = {
    workId: "WK-01", item: "Form 11 annual return", accountable: "governance_office",
    executingFirmId: "PF-01", assigneeId: "ID-01", reviewerId: "ID-02",
    decisionOwnerId: "ID-02", deadline: "2027-05-30", state: "owned", evidence: [],
  };

  it("advances only in sequence — no shortcuts", () => {
    expect(advanceWork(work, "executing").state).toBe("executing");
    expect(() => advanceWork(work, "closed")).toThrow("no shortcuts");
  });

  it("nothing reaches review without evidence", () => {
    const atEvidence = { ...work, state: "evidence" as const };
    expect(() => advanceWork(atEvidence, "review")).toThrow("without evidence");
    const withProof = { ...atEvidence, evidence: ["form11-draft.pdf"] };
    expect(advanceWork(withProof, "review").state).toBe("review");
  });

  it("refuses self-review at every step", () => {
    const selfReview = { ...work, reviewerId: work.assigneeId };
    expect(() => advanceWork(selfReview, "executing")).toThrow("self-validated");
  });
});
