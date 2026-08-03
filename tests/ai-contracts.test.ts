/**
 * ATLAS and IRIS operating contracts.
 *
 * These are the enforcement. There is no engine yet, so the tests are
 * what stop a contract being added that grants an agent something the
 * constitution refuses it — in particular the cross-file invariant that
 * neither agent can hold a right, which is true in digital-profiles.ts
 * and would be silently untrue if a contract here implied otherwise.
 */
import { describe, it, expect } from "vitest";
import {
  AI_CONTRACTS, AGENTS, OUTPUT_OBJECTS, contractsFor, contractById, AI_LAWS,
} from "../constants/ai-contracts";
import { DIGITAL_PROFILES } from "../constants/digital-profiles";

describe("the contract register", () => {
  it("declares eleven contracts — six ATLAS, five IRIS", () => {
    expect(AI_CONTRACTS).toHaveLength(11);
    expect(contractsFor("ATLAS")).toHaveLength(6);
    expect(contractsFor("IRIS")).toHaveLength(5);
  });

  it("numbers ATLAS in the 000s and IRIS in the 100s", () => {
    for (const c of contractsFor("ATLAS")) expect(c.id, c.id).toMatch(/^AI-00\d$/);
    for (const c of contractsFor("IRIS")) expect(c.id, c.id).toMatch(/^AI-10\d$/);
  });

  it("gives every contract a unique id", () => {
    const ids = AI_CONTRACTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("resolves a contract by id", () => {
    expect(contractById("AI-003")?.outputObject).toBe("Distribution Proposal");
    expect(contractById("AI-999")).toBeUndefined();
  });
});

describe("every contract is governed", () => {
  it("names a governed output object — the unit of audit", () => {
    for (const c of AI_CONTRACTS) {
      expect(c.outputObject, c.id).toBeTruthy();
      expect(c.outputObject.length, c.id).toBeGreaterThan(3);
    }
    expect(OUTPUT_OBJECTS.length).toBeGreaterThanOrEqual(10);
  });

  it("requires provenance on every output, with no exceptions", () => {
    // An AI claim with no source is the one kind of claim a reader
    // cannot assess.
    for (const c of AI_CONTRACTS) {
      expect(c.provenance, c.id).toBeTruthy();
      expect(c.provenance.length, c.id).toBeGreaterThan(10);
    }
  });

  it("names a human gate on every contract", () => {
    for (const c of AI_CONTRACTS) expect(c.humanGate, c.id).toBeTruthy();
  });

  it("names what each contract may not do", () => {
    for (const c of AI_CONTRACTS) expect(c.prohibited, c.id).toBeTruthy();
  });

  it("states a cross-agent rule on every contract", () => {
    for (const c of AI_CONTRACTS) expect(c.crossAgentRule, c.id).toBeTruthy();
  });

  it("explains any mutation it permits", () => {
    // "May mutate" with no detail is a permission nobody can review.
    for (const c of AI_CONTRACTS) {
      if (c.mayMutate !== "none") expect(c.mutationDetail, c.id).toBeTruthy();
    }
  });
});

describe("the boundary neither agent crosses", () => {
  it("never permits a mutation above draft", () => {
    const allowed = ["none", "acknowledgement", "consented-memory", "metadata", "task", "draft"];
    for (const c of AI_CONTRACTS) expect(allowed, c.id).toContain(c.mayMutate);
  });

  it("keeps both agents incapable of holding a right, by construction", () => {
    // The constitutional half of the boundary. Not policy — the shape of
    // the type in digital-profiles.ts.
    for (const a of Object.values(AGENTS)) {
      const p = DIGITAL_PROFILES.find((x) => x.id === a.profile);
      expect(p, a.id).toBeTruthy();
      expect(p!.kind, a.id).toBe("ai");
      expect(p!.requestableRoles, a.id).toEqual([]);
    }
  });

  it("bars the distribution agent from approving or executing one", () => {
    const d = contractById("AI-003")!;
    expect(d.prohibited).toMatch(/execute/i);
    expect(d.humanGate).toMatch(/human/i);
    expect(d.mayMutate).toBe("draft");
  });

  it("bars IRIS from accrediting, recommending or binding", () => {
    expect(AGENTS.IRIS.never).toMatch(/accredit/i);
    expect(AGENTS.IRIS.never).toMatch(/recommend/i);
    expect(AGENTS.IRIS.never).toMatch(/bind/i);
  });

  it("bars ATLAS from approving capital or granting authority", () => {
    expect(AGENTS.ATLAS.never).toMatch(/capital/i);
    expect(AGENTS.ATLAS.never).toMatch(/authority/i);
  });

  it("keeps a vote human on the one contract that touches voting", () => {
    const v = contractById("AI-105")!;
    expect(v.humanGate).toMatch(/vote is always human/i);
    expect(v.prohibited).toMatch(/vote/i);
  });

  it("never lets an agent read the other's realm directly", () => {
    // Two directions, two controls. Where IRIS PULLS from ATLAS the rule
    // is a policy or disclosure gate; where ATLAS PUSHES to IRIS the rule
    // is that only approved facts cross. Neither direction is a direct
    // read of the other's graph, which is the invariant that matters.
    for (const c of contractsFor("IRIS")) {
      if (!/ATLAS/.test(c.crossAgentRule)) continue;
      expect(c.crossAgentRule, c.id).toMatch(/gate|approved/i);
    }
  });
});

describe("the agents", () => {
  it("binds each to its existing digital profile and code", () => {
    expect(AGENTS.ATLAS.code).toBe("GC-01");
    expect(AGENTS.IRIS.code).toBe("GC-02");
    expect(AGENTS.ATLAS.profile).toBe("gc_01_platform_operations_agent");
    expect(AGENTS.IRIS.profile).toBe("gc_02_investor_intelligence_agent");
  });

  it("gives each an escalation path with an owner", () => {
    expect(AGENTS.ATLAS.escalates).toMatch(/owner/i);
    expect(AGENTS.ATLAS.escalates).toMatch(/deadline/i);
    expect(AGENTS.IRIS.escalates).toMatch(/named human/i);
  });

  it("keeps the realms apart", () => {
    expect(AGENTS.ATLAS.realm).toMatch(/office/i);
    expect(AGENTS.IRIS.realm).not.toMatch(/office/i);
  });
});

describe("the laws", () => {
  it("records escalation, governed output and provenance as law", () => {
    expect(AI_LAWS.escalationNeverApproval).toMatch(/escalate/i);
    expect(AI_LAWS.governedOutput).toMatch(/FIX-10/);
    expect(AI_LAWS.noRightByConstruction).toMatch(/requestableRoles/);
    expect(AI_LAWS.provenanceIsNotOptional).toMatch(/source/i);
  });
});
