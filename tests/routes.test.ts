/**
 * The information architecture
 *
 * Wave 7 · Workspaces
 */

import { describe, it, expect } from "vitest";
import {
  ROUTES, PUBLIC_ROUTES, LEGAL_ROUTES, AUTH_ROUTES, MEMBER_ROUTES,
  CAPITAL_ROUTES, ADMIN_ROUTES, SYSTEM_ROUTES, FLOW_ROUTES, PASSPORT_STAGES,
  ACCESS_RANK, ACCESS_FOR_VANTAGE, GROUP_VANTAGE, IA_LAWS,
  accessOf, isIndexable, routeByPath, routesFor, allParams,
} from "../constants/routes";
import { ASSEMBLIES } from "../constants/assemblies";
import { APERTURES } from "../constants/apertures";

const assemblyById = (id: string) => ASSEMBLIES.find((a) => a.id === id);
const vantageOf = (r: (typeof ROUTES)[number]) =>
  r.assembly ? assemblyById(r.assembly)?.vantage ?? GROUP_VANTAGE[r.group] : GROUP_VANTAGE[r.group];

describe("the route table", () => {
  it("covers every route group", () => {
    for (const g of ["gateway", "space", "capital", "time", "member", "admin"] as const) {
      expect(routesFor(g).length, `${g} has no route`).toBeGreaterThan(0);
    }
  });

  it("holds one entry per path", () => {
    const paths = ROUTES.map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("uses lowercase paths with no trailing slash", () => {
    for (const r of ROUTES) {
      expect(r.path, r.path).toBe(r.path.toLowerCase());
      expect(r.path.startsWith("/"), r.path).toBe(true);
      if (r.path.length > 1) expect(r.path.endsWith("/"), r.path).toBe(false);
    }
  });

  it("declares every dynamic segment it uses", () => {
    for (const r of ROUTES) {
      const inPath = [...r.path.matchAll(/\[(\w+)\]/g)].map((m) => m[1]);
      expect([...(r.params ?? [])].sort(), r.path).toEqual(inPath.sort());
    }
  });

  it("renders only assemblies that exist", () => {
    for (const r of ROUTES) {
      if (r.assembly) expect(assemblyById(r.assembly), `${r.path} → ${r.assembly}`).toBeDefined();
    }
  });

  it("makes every assembly reachable", () => {
    // An assembly nobody can navigate to is a screen that was built and
    // lost. Chrome composes into other screens rather than routing.
    const COMPOSED = new Set(["AS-20", "AS-21", "AS-22"]);
    const rendered = new Set(ROUTES.map((r) => r.assembly).filter(Boolean));
    const orphan = ASSEMBLIES
      .filter((a) => !rendered.has(a.id) && !COMPOSED.has(a.id))
      .map((a) => a.id);
    expect(orphan, `unreachable: ${orphan.join(" ")}`).toEqual([]);
  });
});

describe("access", () => {
  it("derives from the vantage rather than being declared", () => {
    // The aperture tier already decided what each vantage may see. A route
    // restating it would be a second source of truth.
    for (const r of ROUTES) {
      if (r.accessOverride) continue;
      expect(accessOf(r, vantageOf(r)), r.path).toBe(ACCESS_FOR_VANTAGE[vantageOf(r)]);
    }
  });

  it("gives every override a reason", () => {
    const overrides = ROUTES.filter((r) => r.accessOverride);
    expect(overrides.length).toBeGreaterThan(0);
    for (const r of overrides) {
      expect(r.accessOverride!.because.length, r.path).toBeGreaterThan(40);
    }
  });

  it("never widens past the apertures the assembly renders", () => {
    // An override may relax the route. It may not relax the disclosure
    // model underneath it.
    const apVantage = new Map(APERTURES.map((a) => [a.id, a.vantage]));
    for (const r of ROUTES) {
      if (!r.accessOverride || !r.assembly) continue;
      const a = assemblyById(r.assembly)!;
      const rendered = a.sections.flatMap((s) => s.contains).filter((x) => /^AP-\d+$/.test(x));
      for (const ap of rendered) {
        const needs = ACCESS_FOR_VANTAGE[apVantage.get(ap)!];
        expect(
          ACCESS_RANK[r.accessOverride.access],
          `${r.path} widened to ${r.accessOverride.access} but renders ${ap}`,
        ).toBeGreaterThanOrEqual(ACCESS_RANK[needs]);
      }
    }
  });

  it("indexes nothing that requires authentication", () => {
    // An indexed URL behind auth leaks its existence and usually its title.
    for (const r of ROUTES) {
      const access = accessOf(r, vantageOf(r));
      if (isIndexable(r, access)) expect(access, r.path).toBe("public");
    }
  });

  it("keeps every legal document public", () => {
    // A legal document behind a sign-in is one nobody can rely on before
    // they sign in, which is exactly when they need it.
    for (const r of LEGAL_ROUTES) {
      expect(accessOf(r, vantageOf(r)), r.path).toBe("public");
    }
  });

  it("puts the risk disclosure in front of the commitment path", () => {
    expect(routeByPath("/legal/risk-disclosure")?.assembly).toBe("AS-14");
    expect(routeByPath("/commit/[offering]/risk")?.assembly).toBe("AS-14");
    // Public to READ. The acknowledgement still requires identity.
    expect(accessOf(routeByPath("/legal/risk-disclosure")!, "capital")).toBe("public");
  });
});

describe("authority", () => {
  it("names rights, never roles", () => {
    // Rights are granted and revoked. A route bound to a role would
    // survive the revocation.
    const all = ROUTES.flatMap((r) => r.rights ?? []);
    expect(all.length).toBeGreaterThan(20);
    for (const right of all) expect(right, right).toMatch(/^[a-z_]+\.[a-z_]+$/);
  });

  it("has no super-admin, and no route grants every right", () => {
    // The eight roles are offices and committees, not tiers. A super-admin
    // holds every right, which is what separationViolations() detects.
    expect(IA_LAWS.noSuperAdmin).toContain("separationViolations");
    const most = Math.max(...ROUTES.map((r) => (r.rights ?? []).length));
    expect(most, "no route should gate on a large bundle of rights").toBeLessThanOrEqual(2);
  });

  it("requires a right for every admin route that renders something", () => {
    for (const r of ADMIN_ROUTES) {
      expect((r.rights ?? []).length, `${r.path} names no right`).toBeGreaterThan(0);
    }
  });

  it("routes constitutional failure through a resolution, not a login", () => {
    const cf = routeByPath("/admin/failure")!;
    expect(cf.rights).toContain("constitutional_failure.declare");
    expect(cf.notes).toContain("resolution reference, not a role");
  });
});

describe("the passport", () => {
  it("runs sixteen stages, each its own URL", () => {
    expect(PASSPORT_STAGES).toHaveLength(16);
    for (const st of PASSPORT_STAGES) {
      expect(routeByPath(`/passport/${st}`), st).toBeDefined();
    }
  });

  it("is reachable before membership exists", () => {
    // The passport is how someone BECOMES a member. Requiring membership
    // would close the only door into the system.
    for (const st of PASSPORT_STAGES) {
      const r = routeByPath(`/passport/${st}`)!;
      expect(r.accessOverride?.access, st).toBe("identified");
      expect(r.accessOverride?.because, st).toContain("Member Law fires on");
    }
  });

  it("keeps the commitment path reachable by an accredited investor", () => {
    for (const p of ["/commit/[offering]", "/commit/[offering]/risk", "/commit/[offering]/execute"]) {
      expect(routeByPath(p)?.accessOverride?.access, p).toBe("accredited");
    }
  });
});

describe("system routes", () => {
  it("never confirms whether a forbidden thing exists", () => {
    // The difference between "no" and "not for you" is the shape of the
    // system, handed to anyone probing it.
    expect(routeByPath("/403")?.notes).toContain("Never says whether it EXISTS");
    expect(IA_LAWS.notFoundNeverConfirms).toContain("shape of the system");
  });

  it("keeps the verification token out of the path", () => {
    const v = routeByPath("/auth/verify")!;
    expect(v.params ?? []).toEqual([]);
    expect(v.notes).toContain("QUERY parameter");
    expect(v.notes).toContain("single-use");
  });

  it("scopes search to the viewer rather than opening the index", () => {
    expect(routeByPath("/search")?.accessOverride?.access).toBe("identified");
  });
});

describe("IA laws", () => {
  it("states six", () => {
    expect(Object.keys(IA_LAWS)).toHaveLength(6);
  });

  it("collects every dynamic segment used", () => {
    const p = allParams();
    expect(p).toContain("property");
    expect(p).toContain("llpin");
    expect(p).toContain("ref");
    expect(new Set(p).size).toBe(p.length);
  });

  it("splits into the declared sections without overlap", () => {
    const SECTIONS = [
      PUBLIC_ROUTES, LEGAL_ROUTES, AUTH_ROUTES, MEMBER_ROUTES,
      CAPITAL_ROUTES, ADMIN_ROUTES, SYSTEM_ROUTES, FLOW_ROUTES,
    ];
    const total = SECTIONS.reduce((n, s) => n + s.length, 0);
    expect(ROUTES).toHaveLength(total);

    /*
     * A count alone says the arithmetic works, not that the same routes
     * are on both sides. Adding FLOW_ROUTES to ROUTES while forgetting
     * this list is what the count caught; forgetting to SPREAD a section
     * into ROUTES while adding it here would balance just as neatly and
     * hide a whole section from the guard. Compare the paths.
     */
    const declared = SECTIONS.flatMap((s) => s.map((r) => r.path)).sort();
    const actual = ROUTES.map((r) => r.path).sort();
    expect(actual).toEqual(declared);
  });
});
