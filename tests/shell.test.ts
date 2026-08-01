/**
 * AS-37 · the shell's navigation canon.
 *
 * The rail is filtered by reachability at render; these hold the canon
 * it filters, so a path that stops existing, or a section that would
 * leak a surface's existence, fails here first.
 */
import { describe, it, expect } from "vitest";
import { PRIMARY_NAV, NAV_FOOT } from "../constants/navigation";
import { ROUTES, accessOf } from "../constants/routes";
import { canReach } from "../lib/access";

const ALL = [...PRIMARY_NAV.flatMap((s) => s.items), ...NAV_FOOT];
const routeFor = (p: string) => ROUTES.find((r) => r.path === p);

describe("primary navigation", () => {
  it("points only at routes that exist", () => {
    // Prominence cannot outlive existence. The module throws at load if
    // this breaks; the test states the rule where a reader will find it.
    for (const i of ALL) expect(routeFor(i.path), i.path).toBeDefined();
  });

  it("lists no path twice", () => {
    const paths = ALL.map((i) => i.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("gives every item a label short enough for the rail", () => {
    for (const i of ALL) {
      expect(i.label.length, i.path).toBeGreaterThan(2);
      expect(i.label.length, i.path).toBeLessThanOrEqual(20);
    }
  });

  it("gives every section a unique id", () => {
    const ids = PRIMARY_NAV.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the foot reachable at every vantage", () => {
    // The foot renders for anonymous visitors, so anything in it that
    // needed a position would simply vanish — and a rail whose foot
    // disappears for most viewers is a rail with a hole in it.
    for (const i of NAV_FOOT) {
      expect(accessOf(routeFor(i.path)!), i.path).toBe("public");
    }
  });

  it("shows an anonymous viewer nothing beyond the public surface", () => {
    // THE test. The rail filters through canReach() at render, and
    // lib/access.ts fails closed — an unresolved subject is anonymous.
    // This reproduces that filter over the whole canon and asserts what
    // survives, because a rail listing "Administration" to a stranger
    // confirms the surface exists as loudly as a 403 page would.
    const visible = [...PRIMARY_NAV.flatMap((s) => s.items), ...NAV_FOOT]
      .filter((i) => canReach(i.path).ok)
      .map((i) => i.path);

    expect(visible.length).toBeGreaterThan(6);
    for (const p of visible) {
      expect(accessOf(routeFor(p)!), `${p} reached anonymously`).toBe("public");
    }
    expect(visible.some((p) => p.startsWith("/admin"))).toBe(false);
    expect(visible.some((p) => p.startsWith("/member/"))).toBe(false);
  });

  it("drops a section entirely when nothing in it is reachable", () => {
    // An empty heading leaks the same fact more quietly than a listed
    // item does. The shell filters sections after items for that reason.
    const surviving = PRIMARY_NAV
      .map((s) => ({ id: s.id, items: s.items.filter((i) => canReach(i.path).ok) }))
      .filter((s) => s.items.length > 0)
      .map((s) => s.id);
    expect(surviving).not.toContain("member");
    expect(surviving).not.toContain("governance");
    expect(surviving).toContain("gateway");
  });
});
