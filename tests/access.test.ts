/** Access boundary against Canonical IA v5. */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ANONYMOUS,
  accessOfSubject,
  canReach,
  denialRoute,
  holdsRight,
  matchRoute,
  paramsOf,
  requiredAccess,
  resolveSubject,
  type Subject,
} from "../lib/access";
import { ROUTES, accessOf } from "../constants/routes";
import { ASSEMBLIES } from "../constants/assemblies";
import type { Right } from "../lib/authority";

const subject = (changes: Partial<Subject>): Subject => ({ ...ANONYMOUS, ...changes });
const vantageOf = (route: (typeof ROUTES)[number]) =>
  route.assembly ? ASSEMBLIES.find((assembly) => assembly.id === route.assembly)?.vantage : undefined;

describe("the guard fails closed", () => {
  it("resolves to anonymous while authentication is unbuilt", () => {
    expect(resolveSubject()).toEqual(ANONYMOUS);
    expect(accessOfSubject(resolveSubject())).toBe("public");
  });

  it("denies every non-public route to an anonymous subject", () => {
    for (const route of ROUTES) {
      if (requiredAccess(route) === "public") continue;
      expect(canReach(route.path, ANONYMOUS).ok, route.path).toBe(false);
    }
  });

  it("denies an unknown path", () => {
    const verdict = canReach("/definitely/not/declared", subject({ member: true }));
    expect(verdict.ok).toBe(false);
    if (!verdict.ok) expect(verdict.reason).toBe("unknown-route");
  });

  it("requires the specific Office right", () => {
    const wrong = subject({ rights: ["report.publish"] as Right[] });
    const denied = canReach("/office/settings/access", wrong);
    expect(denied.ok).toBe(false);
    if (!denied.ok) {
      expect(denied.reason).toBe("missing-right");
      expect(denied.missing).toContain("authority.grant");
    }
    const correct = subject({ rights: ["authority.grant"] as Right[] });
    expect(canReach("/office/settings/access", correct).ok).toBe(true);
  });
});

describe("relationship state at the boundary", () => {
  it("never infers membership from accreditation", () => {
    const accredited = subject({ identified: true, accredited: true });
    expect(accredited.member).toBe(false);
    expect(canReach("/home", accredited).ok).toBe(false);
  });

  it("lets an accredited Investor reach the private commitment record", () => {
    const accredited = subject({ identified: true, accredited: true });
    expect(canReach("/invest/slowspace-coastal/commit", accredited).ok).toBe(true);
  });

  it("lets an identified prospect reach the single resumable qualification route", () => {
    const identified = subject({ identified: true });
    expect(canReach("/invest/qualify", identified).ok).toBe(true);
    expect(ROUTES.filter((route) => route.ia === "INV-090")).toHaveLength(1);
  });
});

describe("required access agrees with the registry", () => {
  it("matches the registry derivation for every route", () => {
    for (const route of ROUTES) {
      expect(requiredAccess(route), route.path).toBe(accessOf(route, vantageOf(route)));
    }
  });

  it("honours route-level overrides", () => {
    const progress = ROUTES.find((route) => route.path === "/collection/[vehicle]/progress")!;
    expect(requiredAccess(progress)).toBe("public");
    expect(canReach("/collection/slowspace-coastal/progress", ANONYMOUS).ok).toBe(true);
  });
});

describe("matching", () => {
  it("prefers the static collection path over the vehicle path", () => {
    expect(matchRoute("/office/collection")?.path).toBe("/office/collection");
    expect(matchRoute("/office/collection/slowspace-coastal")?.path).toBe("/office/collection/[vehicle]");
  });

  it("requires the exact segment count", () => {
    expect(matchRoute("/office/settings/access/extra")).toBeUndefined();
  });

  it("ignores a trailing slash", () => {
    expect(matchRoute("/collection/")?.path).toBe("/collection");
  });

  it("extracts every declared parameter", () => {
    const route = matchRoute("/office/collection/slowspace-coastal/partners/P-004/ownership")!;
    expect(paramsOf(route, "/office/collection/slowspace-coastal/partners/P-004/ownership"))
      .toEqual({ vehicle: "slowspace-coastal", partner: "P-004" });
  });
});

describe("denial routing", () => {
  it("does not disclose an unknown route or missing right", () => {
    expect(denialRoute(canReach("/nope", ANONYMOUS))).toBe("/404");
    const wrong = subject({ rights: ["report.publish"] as Right[] });
    expect(denialRoute(canReach("/office/settings/access", wrong))).toBe("/404");
  });

  it("sends an anonymous visitor to the canonical sign-in route", () => {
    expect(denialRoute(canReach("/home", ANONYMOUS))).toBe("/sign-in");
  });
});

describe("rights", () => {
  it("requires every cited right", () => {
    const actor = subject({ rights: ["vehicle.form"] as Right[] });
    expect(holdsRight(actor, "vehicle.form")).toBe(true);
    expect(holdsRight(actor, "vehicle.form", "vehicle.dissolve")).toBe(false);
  });
});

describe("the generated app tree", () => {
  const readIf = (file: string) => {
    try { return readFileSync(resolve(__dirname, "..", file), "utf8"); } catch { return ""; }
  };

  it("guards in middleware without redirecting the denied path", () => {
    const middleware = readIf("middleware.ts");
    expect(middleware).toContain("canReach");
    expect(middleware).toContain("NextResponse.rewrite");
    expect(middleware).not.toMatch(/NextResponse\.redirect/);
    expect(middleware).toContain("_next/image|images|favicon.ico");
  });

  it("connects the validated legacy-address registry to Next", () => {
    const nextConfig = readIf("next.config.ts");
    expect(nextConfig).toContain('import { REDIRECTS } from "./constants/redirects"');
    expect(nextConfig).toContain("return [...REDIRECTS]");
  });

  it("keeps protected metadata generic until authority resolves", () => {
    const page = readIf("app/(admin)/office/settings/access/page.tsx");
    expect(page).toContain("generateMetadata");
    expect(page).toContain('"Getaway Collective"');
    expect(page).toContain("canReach");
  });

  it("keeps public pages statically titled", () => {
    const page = readIf("app/(gateway)/collection/page.tsx");
    expect(page).toContain("export const metadata");
    expect(page).toContain("index: true");
  });

  it("marks generated pages and group layouts", () => {
    for (const file of [
      "app/(gateway)/collection/page.tsx",
      "app/(member)/home/page.tsx",
      "app/(admin)/layout.tsx",
      "app/(admin)/office/collection/[vehicle]/activity/page.tsx",
    ]) expect(readIf(file), file).toContain("GENERATED — do not edit");
  });
});
