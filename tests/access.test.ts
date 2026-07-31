/**
 * Access — the guard
 *
 * Wave 7 · Workspaces
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ANONYMOUS, resolveSubject, accessOfSubject, requiredAccess,
  canReach, holdsRight, matchRoute, paramsOf, denialRoute,
} from "../lib/access";
import type { Subject } from "../lib/access";
import { ROUTES, accessOf } from "../constants/routes";
import { ASSEMBLIES } from "../constants/assemblies";
import type { Right } from "../lib/authority";

const subj = (o: Partial<Subject>): Subject => ({ ...ANONYMOUS, ...o });
const vantageOf = (r: (typeof ROUTES)[number]) =>
  r.assembly ? ASSEMBLIES.find((a) => a.id === r.assembly)?.vantage : undefined;

describe("the guard fails closed", () => {
  it("resolves to anonymous while authentication is unbuilt", () => {
    // The single most important property here. An unimplemented session
    // that returned a privileged subject would make every guard pass and
    // nothing would report it.
    expect(resolveSubject()).toEqual(ANONYMOUS);
    expect(accessOfSubject(resolveSubject())).toBe("public");
  });

  it("denies every non-public route to the anonymous subject", () => {
    for (const r of ROUTES) {
      const need = requiredAccess(r);
      if (need === "public") continue;
      expect(canReach(r.path, ANONYMOUS).ok, r.path).toBe(false);
    }
  });

  it("denies a path the route table does not know", () => {
    // A route table that does not know about a URL is not permission to
    // serve it.
    const v = canReach("/definitely/not/declared", subj({ member: true }));
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.reason).toBe("unknown-route");
  });

  it("denies an office route when the specific right is missing", () => {
    // Holding "office" in general is not holding the right this surface
    // needs.
    const withWrongRight = subj({ rights: ["report.publish"] as Right[] });
    const v = canReach("/admin/failure", withWrongRight);
    expect(v.ok).toBe(false);
    if (!v.ok) {
      expect(v.reason).toBe("missing-right");
      expect(v.missing).toContain("constitutional_failure.declare");
    }
  });

  it("admits an office route when the right is held", () => {
    const ok = subj({ rights: ["constitutional_failure.declare"] as Right[] });
    expect(canReach("/admin/failure", ok).ok).toBe(true);
  });
});

describe("the Member Law at the boundary", () => {
  it("never infers membership from a commitment", () => {
    // The Member Law fires on settlement, not on acceptance. A Committed
    // investor is accredited and is not a member.
    const committed = subj({ identified: true, accredited: true });
    expect(committed.member).toBe(false);
    expect(canReach("/member", committed).ok).toBe(false);
    expect(canReach("/member/entitlement", committed).ok).toBe(false);
  });

  it("lets an accredited investor reach the commitment path", () => {
    // Nobody could ever become a member otherwise.
    const acc = subj({ identified: true, accredited: true });
    for (const p of ["/commit/[offering]", "/commit/[offering]/risk", "/commit/[offering]/execute"]) {
      expect(canReach(p, acc).ok, p).toBe(true);
    }
  });

  it("lets an identified prospect reach every passport stage", () => {
    const id = subj({ identified: true });
    const stages = ROUTES.filter((r) => r.path.startsWith("/passport/"));
    expect(stages.length).toBe(16);
    for (const r of stages) expect(canReach(r.path, id).ok, r.path).toBe(true);
  });
});

describe("requiredAccess agrees with the registry", () => {
  it("matches accessOf for every route", () => {
    // lib/access.ts and constants/routes.ts both derive access. They read
    // the same source, so they cannot drift from the registry — only from
    // each other, which is what this checks.
    for (const r of ROUTES) {
      expect(requiredAccess(r), r.path).toBe(accessOf(r, vantageOf(r)));
    }
  });

  it("honours route-level overrides that group-level logic would miss", () => {
    // The bug this catches: /legal/risk-disclosure and /how-capital-works
    // are public by override while sitting in the (capital) group. A
    // guard that only knew the group denied both.
    expect(requiredAccess(ROUTES.find((r) => r.path === "/legal/risk-disclosure")!)).toBe("public");
    expect(requiredAccess(ROUTES.find((r) => r.path === "/how-capital-works")!)).toBe("public");
    expect(canReach("/legal/risk-disclosure", ANONYMOUS).ok).toBe(true);
    expect(canReach("/how-capital-works", ANONYMOUS).ok).toBe(true);
  });
});

describe("matching", () => {
  it("prefers a static path over a dynamic one", () => {
    expect(matchRoute("/member/calls")?.path).toBe("/member/calls");
    expect(matchRoute("/member/calls/CC-2026-03")?.path).toBe("/member/calls/[ref]");
  });

  it("requires the segment count to match exactly", () => {
    // No catch-alls. A catch-all answers for URLs nobody declared.
    expect(matchRoute("/member/calls/CC-1/extra")).toBeUndefined();
  });

  it("ignores a trailing slash", () => {
    expect(matchRoute("/collection/")?.path).toBe("/collection");
  });

  it("extracts declared params", () => {
    expect(paramsOf(matchRoute("/admin/vehicles/AAB-8842")!, "/admin/vehicles/AAB-8842"))
      .toEqual({ llpin: "AAB-8842" });
  });
});

describe("denial routing", () => {
  it("sends an unknown route and a missing right to 404, not 403", () => {
    // "Does not exist" and "exists but not for you" are different
    // answers, and the difference is the shape of the system.
    expect(denialRoute(canReach("/nope", ANONYMOUS))).toBe("/404");
    const wrongRight = subj({ rights: ["report.publish"] as Right[] });
    expect(denialRoute(canReach("/admin/failure", wrongRight))).toBe("/404");
  });

  it("sends an anonymous visitor to sign-in", () => {
    expect(denialRoute(canReach("/member", ANONYMOUS))).toBe("/auth/sign-in");
  });
});

describe("holdsRight", () => {
  it("requires every right, not any", () => {
    const s = subj({ rights: ["vehicle.form"] as Right[] });
    expect(holdsRight(s, "vehicle.form")).toBe(true);
    expect(holdsRight(s, "vehicle.form", "vehicle.dissolve")).toBe(false);
  });
});

describe("the generated app tree", () => {
  const at = (p: string) => resolve(__dirname, "..", p);
  const readIf = (p: string) => {
    try { return readFileSync(at(p), "utf8"); } catch { return ""; }
  };

  it("guards in middleware, where the pathname is known", () => {
    const mw = readIf("middleware.ts");
    expect(mw, "middleware.ts is missing").not.toBe("");
    expect(mw).toContain("canReach");
    // A redirect writes the denied path into browser history; a rewrite
    // serves the denial at the URL asked for and leaves no trail.
    expect(mw).toContain("NextResponse.rewrite");
    expect(mw).not.toMatch(/NextResponse\.redirect/);
  });

  it("titles a non-public route generically until it is reachable", () => {
    // Static metadata resolves before any guard renders, so an anonymous
    // visitor to /admin/failure was getting "Constitutional Failure" in
    // the browser tab while being denied the page.
    const page = readIf("app/(admin)/admin/failure/page.tsx");
    expect(page).toContain("generateMetadata");
    expect(page).toContain('"Getaway Collective"');
    expect(page).toContain("canReach");
  });

  it("keeps public pages statically titled", () => {
    const page = readIf("app/(gateway)/collection/page.tsx");
    expect(page).toContain("export const metadata");
    expect(page).toContain("index: true");
  });

  it("marks every generated file as generated", () => {
    for (const p of [
      "app/(gateway)/collection/page.tsx",
      "app/(member)/member/page.tsx",
      "app/(admin)/layout.tsx",
      "app/not-found.tsx",
      "app/error.tsx",
    ]) {
      expect(readIf(p), p).toContain("GENERATED — do not edit");
    }
  });

  it("maps 404 and 500 to framework conventions, not pages", () => {
    // Next.js owns both. Emitting them as pages collides at build time —
    // the export step renames its own 500.html over the page.
    expect(readIf("app/not-found.tsx")).toContain("export default function NotFound");
    expect(readIf("app/error.tsx")).toContain('"use client"');
    // The error boundary never renders the error itself: a stack trace
    // tells someone probing the site what the stack is.
    expect(readIf("app/error.tsx")).not.toMatch(/\{error\.(message|stack)\}/);
  });
});
