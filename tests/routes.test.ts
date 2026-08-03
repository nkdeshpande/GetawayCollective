/** Canonical IA v5 route registry. */

import { describe, expect, it } from "vitest";
import {
  ACCESS_FOR_VANTAGE,
  ACCESS_RANK,
  GROUP_VANTAGE,
  IA_LAWS,
  INVESTOR_ROUTES,
  LEGAL_ROUTES,
  MEMBER_ROUTES,
  OFFICE_ROUTES,
  PUBLIC_ROUTES,
  ROUTES,
  SYSTEM_ROUTES,
  accessOf,
  allParams,
  isIndexable,
  routeByIA,
  routeByPath,
  routesFor,
} from "../constants/routes";
import { APERTURES } from "../constants/apertures";
import { ASSEMBLIES, scopeOf } from "../constants/assemblies";
import { REDIRECTS } from "../constants/redirects";

const assemblyById = (id: string) => ASSEMBLIES.find((assembly) => assembly.id === id);
const vantageOf = (route: (typeof ROUTES)[number]) =>
  route.assembly ? assemblyById(route.assembly)?.vantage ?? GROUP_VANTAGE[route.group] : GROUP_VANTAGE[route.group];

describe("canonical IA v5", () => {
  /* 110 = 104 canonical URLs + three design-review aliases + the two
     framework conventions (/404, /500) + GC-440 /contact.

     GC-440 rather than GC-410: the Numbering Law never recycles an id,
     and 410/420/430 were spent on the v4 About sub-pages before they
     were consolidated into GC-400. */
  it("wires 104 canonical URLs plus the aliases, conventions and general contact", () => {
    expect(ROUTES).toHaveLength(110);
    expect(new Set(ROUTES.map((route) => route.path)).size).toBe(110);
    const records = ROUTES.flatMap((route) => [route.ia, ...(route.coLocatedIa ?? [])]);
    expect(records).toHaveLength(111);
    expect(new Set(records).size).toBe(records.length);
  });

  it("co-locates the Partners module and Register without duplicating the URL", () => {
    const partners = routeByPath("/office/collection/[vehicle]/partners")!;
    expect(partners.ia).toBe("OFF-160");
    expect(partners.coLocatedIa).toEqual(["PAR-100"]);
    expect(routeByIA("PAR-100")).toBe(partners);
  });

  it("covers every route group", () => {
    for (const group of ["gateway", "space", "capital", "time", "member", "admin"] as const) {
      expect(routesFor(group).length, group).toBeGreaterThan(0);
    }
  });

  it("uses lowercase paths and declares every dynamic segment", () => {
    for (const route of ROUTES) {
      expect(route.path).toBe(route.path.toLowerCase());
      expect(route.path.startsWith("/")).toBe(true);
      if (route.path.length > 1) expect(route.path.endsWith("/")).toBe(false);
      const inPath = [...route.path.matchAll(/\[(\w+)\]/g)].map((match) => match[1]).sort();
      expect([...(route.params ?? [])].sort(), route.path).toEqual(inPath);
    }
  });

  it("renders only registered screen assemblies", () => {
    for (const route of ROUTES) {
      if (route.assembly) expect(assemblyById(route.assembly), route.path).toBeDefined();
    }
    const rendered = new Set(ROUTES.map((route) => route.assembly).filter(Boolean));
    const missing = ASSEMBLIES.filter((assembly) => scopeOf(assembly) === "screen" && !rendered.has(assembly.id));
    expect(missing.map((assembly) => assembly.id)).toEqual([]);
  });
});

describe("access and authority", () => {
  it("derives access from vantage unless a reasoned override narrows arrival", () => {
    for (const route of ROUTES) {
      if (route.accessOverride) {
        expect(route.accessOverride.because.length, route.path).toBeGreaterThan(40);
      } else {
        expect(accessOf(route, vantageOf(route)), route.path).toBe(ACCESS_FOR_VANTAGE[vantageOf(route)]);
      }
    }
  });

  it("never indexes a protected route", () => {
    for (const route of ROUTES) {
      const access = accessOf(route, vantageOf(route));
      if (isIndexable(route, access)) expect(access, route.path).toBe("public");
    }
  });

  it("never widens beyond an aperture rendered by its assembly", () => {
    const apertureVantage = new Map(APERTURES.map((aperture) => [aperture.id, aperture.vantage]));
    for (const route of ROUTES) {
      if (!route.accessOverride || !route.assembly) continue;
      const assembly = assemblyById(route.assembly)!;
      const rendered = assembly.sections.flatMap((section) => section.contains).filter((ref) => /^AP-\d+$/.test(ref));
      for (const ref of rendered) {
        const required = ACCESS_FOR_VANTAGE[apertureVantage.get(ref)!];
        expect(ACCESS_RANK[route.accessOverride.access], route.path).toBeGreaterThanOrEqual(ACCESS_RANK[required]);
      }
    }
  });

  it("gates every Office surface on at least one declared right", () => {
    for (const route of OFFICE_ROUTES) {
      expect((route.rights ?? []).length, route.path).toBeGreaterThan(0);
    }
  });

  it("does not inherit a wider access class from a reused assembly", () => {
    expect(accessOf(routeByIA("MEM-120")!, vantageOf(routeByIA("MEM-120")!))).toBe("member");
    expect(accessOf(routeByIA("GOV-130")!, vantageOf(routeByIA("GOV-130")!))).toBe("office");
  });
});

describe("realm workflows", () => {
  it("uses one resumable qualification route and an accredited commitment record", () => {
    const qualification = routeByPath("/invest/qualify")!;
    expect(qualification.ia).toBe("INV-090");
    expect(qualification.accessOverride?.access).toBe("identified");
    expect(routeByPath("/invest/[vehicle]/commit")?.accessOverride?.access).toBe("accredited");
    expect(INVESTOR_ROUTES).toHaveLength(9);
  });

  it("puts risk before commitment in the vehicle diligence sequence", () => {
    expect(routeByPath("/invest/[vehicle]/risks")?.assembly).toBe("AS-14");
    expect(routeByPath("/invest/[vehicle]/commit")?.assembly).toBe("AS-19");
  });

  it("serves all legal instruments through one dynamic governed renderer", () => {
    expect(LEGAL_ROUTES).toHaveLength(1);
    expect(LEGAL_ROUTES[0].path).toBe("/legal/[document]");
    expect(accessOf(LEGAL_ROUTES[0], vantageOf(LEGAL_ROUTES[0]))).toBe("public");
  });

  /* Six, not four. /404 and /500 are framework CONVENTIONS rather than
     pages — Next.js compiles them to not-found.tsx and error.tsx — but
     they are addressable states the architecture has to describe, and the
     Migration sheet marks both Keep.

     Dropping them from this table did not merely lose two rows: gen-app
     removed both files as orphans, and production fell back to Next's
     stock pages, which is the one place a stack trace can still reach a
     visitor. The count is pinned here so that cannot recur silently. */
  it("keeps exactly the six canonical system states public", () => {
    expect(SYSTEM_ROUTES.map((route) => route.path))
      .toEqual(["/sign-in", "/verify", "/status", "/403", "/404", "/500"]);
    for (const route of SYSTEM_ROUTES) expect(accessOf(route, vantageOf(route))).toBe("public");
    expect(routeByPath("/verify")?.params ?? []).toEqual([]);
    expect(routeByPath("/verify")?.notes).toContain("single-use");
  });

  it("keeps design-review aliases explicit and non-sensitive", () => {
    for (const path of ["/investor-workspace-preview", "/member-workspace-preview", "/office-workspace-preview"]) {
      const route = routeByPath(path)!;
      expect(route.notes, path).toContain("Design-review surface only");
      expect(accessOf(route, vantageOf(route))).toBe("public");
    }
  });
});

describe("registry helpers", () => {
  it("keeps the retired capital address mapped to the canonical investment surface", () => {
    expect(REDIRECTS.find((entry) => entry.source === "/how-capital-works"))
      .toEqual({
        source: "/how-capital-works",
        destination: "/collection/slowspace-coastal/investment",
        permanent: true,
      });
  });

  it("collects the canonical dynamic segments", () => {
    expect(allParams()).toEqual(["document", "event", "partner", "story", "vehicle", "year"]);
  });

  it("splits into declared sections without overlap", () => {
    const sections = [PUBLIC_ROUTES, LEGAL_ROUTES, INVESTOR_ROUTES, MEMBER_ROUTES, OFFICE_ROUTES, SYSTEM_ROUTES];
    expect(sections.reduce((count, section) => count + section.length, 0)).toBe(ROUTES.length);
    expect(sections.flatMap((section) => section.map((route) => route.path)).sort())
      .toEqual(ROUTES.map((route) => route.path).sort());
  });

  it("retains the six governing IA laws", () => {
    expect(Object.keys(IA_LAWS)).toHaveLength(6);
  });
});
