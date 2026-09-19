import { describe, expect, it } from "vitest";
import {
  DOCUMENT_KINDS, DECLARED_ACTS, PIPELINE, ESCALATION_TRIGGERS, BULK_RULES,
} from "../constants/intake";
import { CAPABILITIES } from "../lib/commands";
import { ALL_RIGHTS, ROLE_RIGHTS, type Role } from "../lib/authority";
import { INTERNAL_ONLY_RIGHTS } from "../lib/access-admin";
import { CONFIDENCE_ORDER } from "../lib/provenance";

/**
 * The generator enforces closure, but `npm run verify` does not run the
 * generator — so without this the framework could break and the only thing
 * that noticed would be whoever next regenerated the document. Enforcement
 * that runs on a human's initiative is not enforcement.
 */

const CAP_NAMES = CAPABILITIES.map((c) => c.name);
const FILE_BORNE = [...new Set(DOCUMENT_KINDS.flatMap((d) => d.proposes))];
const DECLARED = DECLARED_ACTS.map((a) => a.command);

describe("intake framework — closure", () => {
  it("recovers a non-empty registry", () => {
    expect(DOCUMENT_KINDS.length).toBeGreaterThan(0);
    expect(DECLARED_ACTS.length).toBeGreaterThan(0);
    expect(CAP_NAMES.length).toBeGreaterThan(0);
  });

  it("reaches every capability by exactly one lane", () => {
    const orphans = CAP_NAMES.filter((c) => !FILE_BORNE.includes(c) && !DECLARED.includes(c));
    const both = CAP_NAMES.filter((c) => FILE_BORNE.includes(c) && DECLARED.includes(c));
    expect(orphans, "capabilities reachable by no lane are unreachable and nobody would notice").toEqual([]);
    expect(both, "evidenced and decided are not both true of the same capability").toEqual([]);
  });

  it("names no capability that does not exist", () => {
    const ghosts = [...FILE_BORNE, ...DECLARED].filter((c) => !CAP_NAMES.includes(c));
    expect(ghosts).toEqual([]);
  });

  it("accounts for every capability exactly once", () => {
    expect(FILE_BORNE.length + DECLARED.length).toBe(CAP_NAMES.length);
  });

  it("declares no capability twice across document kinds", () => {
    const all = DOCUMENT_KINDS.flatMap((d) => d.proposes);
    const dupes = all.filter((c, i) => all.indexOf(c) !== i);
    expect(dupes, "a capability proposed by two kinds resolves differently depending on which file arrives").toEqual([]);
  });
});

describe("intake framework — routing", () => {
  const rolesFor = (command: string): Role[] => {
    const cap = CAPABILITIES.find((c) => c.name === command);
    if (!cap) return [];
    return (Object.keys(ROLE_RIGHTS) as Role[]).filter((r) => ROLE_RIGHTS[r].includes(cap.requiredRight));
  };

  it("routes every proposing document kind to at least one role", () => {
    const stranded = DOCUMENT_KINDS
      .filter((d) => d.proposes.length > 0 && d.proposes.every((p) => rolesFor(p).length === 0))
      .map((d) => d.id);
    expect(stranded, "uploads that queue to nobody are silently lost work").toEqual([]);
  });

  it("routes every declared act to a role that can perform it", () => {
    const unperformable = DECLARED_ACTS.filter((a) => rolesFor(a.command).length === 0).map((a) => a.command);
    expect(unperformable).toEqual([]);
  });
});

describe("intake framework — confidence ceilings", () => {
  it("declares a real confidence class on every kind", () => {
    for (const d of DOCUMENT_KINDS) {
      expect(CONFIDENCE_ORDER, `${d.id} declares ceiling "${d.ceiling}"`).toContain(d.ceiling);
    }
  });

  it("states why each ceiling sits where it does", () => {
    for (const d of DOCUMENT_KINDS) {
      expect(d.ceilingWhy.trim().length, `${d.id} has no stated reason for its ceiling`).toBeGreaterThan(30);
    }
  });

  /**
   * A ceiling of VERIFIED means the document is issued or attested outside
   * GC. A kind GC produces itself cannot reach it however clean it parses —
   * this is the check that stops a future edit promoting a convenient
   * internal workbook to the top of the confidence order.
   */
  it("reserves VERIFIED for externally issued or attested kinds", () => {
    const SELF_PRODUCED = ["llp-intake-workbook", "spatial-ledger", "performance-pack",
      "investment-thesis", "draft-document", "media-drop", "construction-report", "conflict-declaration"];
    for (const id of SELF_PRODUCED) {
      const d = DOCUMENT_KINDS.find((k) => k.id === id);
      expect(d, `${id} is named here but is not a document kind`).toBeDefined();
      expect(d!.ceiling, `${id} is produced by or for GC and cannot reach VERIFIED`).not.toBe("VERIFIED");
    }
  });

  it("never extracts a figure from a file-level citation", () => {
    for (const d of DOCUMENT_KINDS.filter((k) => k.citation === "file")) {
      for (const p of d.proposes) {
        expect(p, `${d.id} cites at file level, which is metadata only`).toMatch(/Media/);
      }
    }
  });
});

describe("intake framework — the refusals", () => {
  it("keeps every internal-only right out of routine bulk disposal", () => {
    /* Not a property of the data — a property of the rules, asserted so the
       rule cannot be quietly dropped from BULK_RULES. */
    const joined = BULK_RULES.map((b) => b.rule).join(" ").toLowerCase();
    expect(joined).toContain("internal-only");
    expect(INTERNAL_ONLY_RIGHTS.length).toBeGreaterThan(0);
  });

  it("states what each pipeline stage refuses, not only what it does", () => {
    expect(PIPELINE.length).toBeGreaterThan(0);
    for (const s of PIPELINE) {
      expect(s.does.trim().length, `${s.name} does nothing`).toBeGreaterThan(30);
      expect(s.refuses.trim().length, `${s.name} refuses nothing — the load-bearing half is missing`).toBeGreaterThan(30);
    }
  });

  it("gives every declared act a reason and a permitted alternative", () => {
    for (const a of DECLARED_ACTS) {
      expect(a.why.trim().length, `${a.command} does not say why no file may produce it`).toBeGreaterThan(40);
      expect(a.aiMay.trim().length, `${a.command} does not say what the intelligence may do instead`).toBeGreaterThan(20);
    }
  });

  it("gives every escalation trigger a stated cost of proceeding", () => {
    expect(ESCALATION_TRIGGERS.length).toBeGreaterThan(0);
    const ids = ESCALATION_TRIGGERS.map((t) => t.id);
    expect(new Set(ids).size, "duplicate trigger ids").toBe(ids.length);
    for (const t of ESCALATION_TRIGGERS) {
      expect(t.because.trim().length, `${t.id} does not say why proceeding would be wrong`).toBeGreaterThan(40);
    }
  });

  /* The three highest-consequence capital movements are declared acts, and
     an edit moving any of them into a document kind would make them
     proposable. That edit would look reasonable in isolation. */
  it("holds capital movement and authority conferral in the declared lane", () => {
    for (const command of ["ExecuteDistribution", "DeployCapital", "CallCapital", "GrantAuthority", "RevokeAuthority"]) {
      expect(DECLARED, `${command} must never be proposable from a file`).toContain(command);
      expect(FILE_BORNE).not.toContain(command);
    }
  });

  it("keeps every right the capabilities require inside the rights union", () => {
    for (const c of CAPABILITIES) {
      expect(ALL_RIGHTS, `${c.name} requires "${c.requiredRight}"`).toContain(c.requiredRight);
    }
  });
});
