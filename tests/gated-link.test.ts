/**
 * REM-009 · PUBLIC.09 — a public link says what it will ask of you.
 *
 * The routes always refused correctly; `lib/access.ts` is fail-closed and
 * works. What nothing said was that a requirement existed, so the only way
 * to find the boundary was to walk into it.
 *
 * The assertion that matters most is the last one: the label is DERIVED.
 * A hand-typed "sign-in required" beside a link passes a human reading the
 * page and fails the moment a route changes access class.
 */
import { describe, it, expect } from "vitest";
import { ACCESS_EXPLANATION, ACCESS_REQUIREMENT, isGated } from "../constants/access-requirements";
import { ACCESS_RANK, ROUTES, type Access } from "../constants/routes";
import { requiredAccess } from "../lib/access";
import { requirementFor } from "../app/_assemblies/gatedlink";
import { REMEDIATION } from "../constants/remediation";

const ACCESSES: Access[] = ["public", "identified", "accredited", "member", "office"];

describe("the requirement is stated for every access class", () => {
  it("covers the whole ladder, and only public asks nothing", () => {
    for (const a of ACCESSES) {
      expect(ACCESS_REQUIREMENT).toHaveProperty(a);
      expect(ACCESS_EXPLANATION).toHaveProperty(a);
    }
    expect(ACCESS_REQUIREMENT.public).toBeNull();
    expect(isGated("public")).toBe(false);
    for (const a of ACCESSES.filter((x) => x !== "public")) {
      expect(isGated(a), a).toBe(true);
      expect(ACCESS_REQUIREMENT[a]!.length).toBeGreaterThan(3);
    }
  });

  it("never says 'office' to a visitor who is not staff", () => {
    // The platform's word for itself is not the reader's word.
    expect(ACCESS_REQUIREMENT.office).toBe("Staff only");
    expect(JSON.stringify(ACCESS_REQUIREMENT)).not.toContain("vantage");
  });

  it("states it without hedging, per VOICE", () => {
    const all = Object.values(ACCESS_REQUIREMENT).concat(Object.values(ACCESS_EXPLANATION));
    for (const phrase of all) {
      if (!phrase) continue;
      for (const banned of ["sorry", "unfortunately", "may not be able", "might not"]) {
        expect(phrase.toLowerCase()).not.toContain(banned);
      }
    }
  });
});

describe("the label is derived from the route table, never typed", () => {
  it("agrees with requiredAccess() for every route in the table", () => {
    for (const r of ROUTES) {
      if (r.path.includes("[")) continue;            // needs a real param to resolve
      const expected = ACCESS_REQUIREMENT[requiredAccess(r)];
      expect(requirementFor(r.path), r.path).toBe(expected);
    }
  });

  it("resolves a dynamic route from a real slug", () => {
    // /collection/[vehicle]/risk is public; /invest/[vehicle]/commit is not.
    expect(requirementFor("/collection/coorg-coffee-creek/risk")).toBeNull();
    expect(requirementFor("/invest/coorg-coffee-creek/commit")).toBe("Accreditation required");
  });

  it("ignores query and fragment, which are not part of a door", () => {
    expect(requirementFor("/portfolio?from=footer")).toBe("Members only");
    expect(requirementFor("/portfolio#top")).toBe("Members only");
  });

  it("says nothing about a path it does not own", () => {
    expect(requirementFor("https://example.com")).toBeNull();
    expect(requirementFor("mailto:hello@getawaycollective.co")).toBeNull();
  });

  it("marks the four crossings the audit named", () => {
    expect(requirementFor("/invest/qualify")).toBe("Sign-in required");
    expect(requirementFor("/portfolio")).toBe("Members only");
    expect(requirementFor("/office")).toBe("Staff only");
    expect(ACCESS_RANK.public).toBeLessThan(ACCESS_RANK.member);
  });
});

describe("the register records it as closed", () => {
  it("has REM-009 resolved, with the mechanism named", () => {
    const rem = REMEDIATION.find((r) => r.id === "REM-009")!;
    expect(rem.status).toBe("RESOLVED");
    expect(rem.acceptanceCriteria.join(" ")).toContain("requiredAccess()");
  });
});
