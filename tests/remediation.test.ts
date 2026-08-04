/**
 * THE REMEDIATION CONTROL LAYER — laws, registry and contracts
 *
 * scripts/public-law-lint.js checks the same bodies by parsing source.
 * These check them by importing, and several assert COUNTS so a broken
 * parse in the linter cannot masquerade as a clean surface — the same
 * guard-the-guard convention as every other suite here.
 *
 * Two of these are RATCHETS rather than targets. The type floor test
 * asserts sizes never drop below today's measured values, not the 16px
 * target — asserting the target on a day that fixes nothing would either
 * fail the build or force a cosmetic fix, and Day 01 does neither. The
 * target belongs to REM-015; the ratchet belongs here.
 */

import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  PUBLIC_LAWS, lawById, testableLaws,
} from "../constants/public-laws";
import {
  REMEDIATION, bySeverity, openItems, needsHuman, releaseClear,
} from "../constants/remediation";
import {
  VEHICLES, BUILD_LABEL, TENURE_LABEL, waterfallState,
} from "../constants/vehicles";
import { ROUTE_CONTRACTS, contractFor } from "../constants/route-contracts";
import { PROPERTIES, propertyBySlug } from "../app/_assemblies/data";
import { ROUTES } from "../constants/routes";

const ROOT = path.join(__dirname, "..");

describe("the public laws", () => {
  it("is exactly ten, with unique ids", () => {
    expect(PUBLIC_LAWS.length).toBe(10);
    expect(new Set(PUBLIC_LAWS.map((l) => l.id)).size).toBe(10);
  });

  it("states, justifies and makes acceptable every law", () => {
    for (const l of PUBLIC_LAWS) {
      expect(l.statement.length, l.id).toBeGreaterThan(40);
      expect(l.because.length, l.id).toBeGreaterThan(40);
      expect(l.acceptance.length, l.id).toBeGreaterThanOrEqual(2);
    }
  });

  it("marks a law testable only when something enforces it", () => {
    /* The lint carries the ENFORCED_BY map and fails on a gap; this
       asserts the two lists describe the same laws, so neither can be
       edited alone. */
    const lint = fs.readFileSync(path.join(ROOT, "scripts", "public-law-lint.js"), "utf8");
    for (const l of testableLaws()) {
      expect(lint.includes(`"${l.id}":`), `${l.id} testable but absent from ENFORCED_BY`).toBe(true);
    }
  });
});

describe("the remediation registry", () => {
  it("holds the seeded program", () => {
    expect(REMEDIATION.length).toBeGreaterThanOrEqual(17);
    expect(new Set(REMEDIATION.map((r) => r.id)).size).toBe(REMEDIATION.length);
  });

  it("cites only real laws, and at least one per item", () => {
    for (const r of REMEDIATION) {
      expect(r.lawIds.length, r.id).toBeGreaterThan(0);
      for (const id of r.lawIds) expect(lawById(id), `${r.id} cites ${id}`).toBeDefined();
    }
  });

  it("names only files that exist", () => {
    for (const r of REMEDIATION) {
      for (const s of r.affectedSources) {
        expect(fs.existsSync(path.join(ROOT, s)), `${r.id} → ${s}`).toBe(true);
      }
    }
  });

  it("gives every P0 and P1 real acceptance criteria and evidence", () => {
    for (const r of [...bySeverity("P0"), ...bySeverity("P1")]) {
      expect(r.acceptanceCriteria.length, r.id).toBeGreaterThanOrEqual(1);
      expect(r.evidence.length, r.id).toBeGreaterThanOrEqual(1);
      expect(r.issue.length, r.id).toBeGreaterThan(80);
    }
  });

  it("says what the human must decide, wherever one must", () => {
    for (const r of needsHuman()) expect(r.humanCanonNeeded, r.id).toBeTruthy();
  });

  it("does not claim the release is clear while blocking items stand", () => {
    /* Day 02 closed four: REM-001 (/about), REM-004 (complaints),
       REM-005 (sign-in threshold), REM-007 (mobile rail). What remains
       blocking is the two decisions that need a person plus the P1s.
       This assertion is meant to keep failing until they are answered. */
    const { ok, blocking } = releaseClear();
    expect(ok).toBe(false);
    expect(blocking.length).toBeGreaterThan(0);
    expect(openItems().length).toBeLessThan(REMEDIATION.length);
  });

  it("keeps every human decision open until a person answers it", () => {
    /* REM-002 and REM-003 closed on 4 Aug when the founder supplied the
       tenure position and the yield basis. REM-018 opened in the same
       breath: the basis still says nothing about tax, and that word is
       not an agent's to choose. */
    expect(needsHuman().map((r) => r.id)).toEqual(["REM-018"]);
  });

  it("keeps the audit as evidence, not canon", () => {
    /* Every item that cites the audit also cites at least one code
       location — a finding supported only by prose was transcribed, not
       verified. */
    for (const r of REMEDIATION) {
      const auditOnly = r.evidence.every((e) => e.startsWith("audit"));
      expect(auditOnly, `${r.id} rests on audit prose alone`).toBe(false);
    }
  });
});

describe("the route contracts", () => {
  it("covers every public-facing route family the program names", () => {
    for (const route of [
      "/", "/collection", "/collection/[vehicle]", "/how-it-works", "/journal",
      "/journal/[story]", "/about", "/contact", "/legal", "/legal/[document]",
      "/status", "/sign-in", "/invest/qualify", "/portfolio",
    ]) {
      expect(contractFor(route), route).toBeDefined();
    }
  });

  it("contracts only routes the route table declares", () => {
    const canonical = new Set(ROUTES.map((r) => r.path));
    for (const c of ROUTE_CONTRACTS) expect(canonical.has(c.route), c.route).toBe(true);
  });

  it("forbids something concrete on every route", () => {
    for (const c of ROUTE_CONTRACTS) {
      expect(c.forbidden.length, c.route).toBeGreaterThan(0);
      expect(c.watchLaws.length, c.route).toBeGreaterThan(0);
    }
  });
});

describe("PUBLIC.02 — figures carry their class today", () => {
  it("classes every public yield, and reserves FORECAST for complete waterfalls", () => {
    expect(PROPERTIES.length).toBeGreaterThan(0);
    for (const p of PROPERTIES) {
      expect(["FORECAST", "UNKNOWN"], p.assetId).toContain(p.yield.conf);
      if (p.yield.conf === "UNKNOWN") expect(p.yield.v, p.assetId).toBe(0);
    }
  });
});

describe("PUBLIC.03 — state is derived, never worded", () => {
  it("gives every vehicle a canonical build stage and a labelled tenure", () => {
    for (const v of VEHICLES) {
      expect(BUILD_LABEL[v.buildStage], v.key).toBeTruthy();
      /* Null is a legitimate answer. What is NOT legitimate is a tenure
         value with no canonical label, or a label invented beside it. */
      if (v.tenure !== null) expect(TENURE_LABEL[v.tenure], v.key).toBeTruthy();
    }
  });

  it("never says 'acquired' about land again", () => {
    /* The exact word that started this: it reads as settled title to
       almost everybody, and was rendering over a record stating title
       was unverified. It is not in the vocabulary any more, and this
       fails if it returns to a public surface. */
    for (const f of ["app/_assemblies/property.tsx", "app/_assemblies/data.ts"]) {
      const src = fs.readFileSync(path.join(ROOT, f), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "");
      expect(/Land acquired/i.test(src), f).toBe(false);
    }
  });

  it("states diligence on The Creek, and infers tenure nowhere else", () => {
    const creek = VEHICLES.find((v) => v.key === "coorgcreek")!;
    expect(creek.tenure).toBe("diligence-complete");
    /* The other two records state no position, so neither may acquire
       one by inference from an adjacent sentence. */
    for (const k of ["slowspace", "solace"]) {
      expect(VEHICLES.find((v) => v.key === k)!.tenure, k).toBeNull();
    }
  });
});

describe("PUBLIC.02 — the basis travels with the number", () => {
  it("gives every complete waterfall a stated basis", () => {
    for (const v of VEHICLES) {
      if (waterfallState(v.operating.waterfall).state !== "complete") continue;
      expect(v.operating.yieldBasis, v.key).toBeTruthy();
      /* Denominator and period, both. Either alone still lets a reader
         pick the wrong reading. */
      expect(v.operating.yieldBasis!, v.key).toMatch(/equity/i);
      expect(v.operating.yieldBasis!, v.key).toMatch(/year 3|stabilis/i);
    }
  });

  it("carries the basis onto the public card beside the figure", () => {
    /* Identity, not existence: whatever the registry states is what the
       card shows, including null. A card inventing a basis the registry
       does not hold is the same defect as a card omitting one it does. */
    for (const v of VEHICLES) {
      expect(propertyBySlug(v.slug)!.yieldBasis, v.key).toBe(v.operating.yieldBasis);
    }
  });

  it("claims a basis exactly where a yield renders, and nowhere else", () => {
    /* A basis on a vehicle with no computable yield would describe a
       figure that does not exist; a yield without one is PUBLIC.02. The
       two must agree, and this is the assertion that keeps them agreeing
       as waterfalls get completed. */
    for (const v of VEHICLES) {
      const renders = waterfallState(v.operating.waterfall).state === "complete";
      if (renders) expect(v.operating.yieldBasis, v.key).toBeTruthy();
      else expect(v.operating.yieldBasis, v.key).toBeNull();
    }
  });
});

describe("PUBLIC.07 — the type floor may only rise", () => {
  it("holds today's measured floors until REM-015 raises them", () => {
    const css = fs.readFileSync(path.join(ROOT, "app", "_assemblies", "assemblies.css"), "utf8");
    const size = (cls: string): number => {
      const m = css.match(new RegExp(`\\.${cls}\\{font:[^}]*?(\\d+)px`));
      expect(m, `class .${cls} not found`).toBeTruthy();
      return Number(m![1]);
    };
    /* Measured 4 Aug 2026: body 15, body-s 13, micro 11. Body is BELOW
       the PUBLIC.07 16px target — that is REM-015's debt, recorded, not
       silently ratified. This test stops it getting worse. */
    expect(size("t-body")).toBeGreaterThanOrEqual(15);
    expect(size("t-body-s")).toBeGreaterThanOrEqual(13);
    expect(size("t-micro")).toBeGreaterThanOrEqual(11);
  });
});
