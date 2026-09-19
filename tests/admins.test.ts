import { describe, expect, it } from "vitest";
import { ADMINS, ADMIN_BY_ID, NON_ADMIN_ROLE, rolesForAdmins, type AdminId } from "../constants/admins";
import { ROLE_RIGHTS, SEPARATION_TRIADS, type Right, type Role } from "../lib/authority";
import { CAPABILITIES } from "../lib/commands";

/**
 * The three-admin surface is only safe because of a property of the role
 * table, and the role table is editable. These tests are what stop somebody
 * widening a role next year and silently collapsing the separation the
 * whole surface rests on.
 */

const rightsOf = (roles: readonly Role[]): Set<Right> => new Set(roles.flatMap((r) => ROLE_RIGHTS[r]));
const breach = (roles: readonly Role[]): readonly Right[] | undefined => {
  const held = rightsOf(roles);
  return SEPARATION_TRIADS.find((t) => t.every((x) => held.has(x)));
};
const ids = ADMINS.map((a) => a.id);

describe("three admins — the surface", () => {
  it("is three, and stays three", () => {
    expect(ADMINS.length, "the point of this file is that the surface does not grow").toBe(3);
  });

  it("names only real roles, each exactly once", () => {
    const all = ADMINS.flatMap((a) => a.roles);
    for (const r of all) expect(Object.keys(ROLE_RIGHTS)).toContain(r);
    expect(all.length, "a role in two admins makes the boundary meaningless").toBe(new Set(all).size);
  });

  it("covers every role except the partner-facing one", () => {
    const covered = new Set(ADMINS.flatMap((a) => a.roles));
    const uncovered = (Object.keys(ROLE_RIGHTS) as Role[]).filter((r) => !covered.has(r));
    expect(uncovered, "an uncovered role is authority no admin can be given").toEqual([NON_ADMIN_ROLE]);
  });

  it("keeps the partner role out of every admin", () => {
    for (const a of ADMINS) expect(a.roles).not.toContain(NON_ADMIN_ROLE);
  });

  it("states a remit and a keystone for each", () => {
    for (const a of ADMINS) {
      expect(a.remit.trim().length, `${a.id} has no stated remit`).toBeGreaterThan(60);
      expect(a.keystone, `${a.id} does not say what only it can do`).toMatch(/[a-z_]+\.[a-z_]+/);
    }
  });

  it("names a right it actually holds in each keystone", () => {
    for (const a of ADMINS) {
      const named = a.keystone.match(/^([a-z_]+\.[a-z_]+)/)?.[1] as Right | undefined;
      expect(named, `${a.id}'s keystone does not open with a right`).toBeDefined();
      expect([...rightsOf(a.roles)], `${a.id} claims ${named} but does not carry it`).toContain(named);
    }
  });

  it("gives each keystone to exactly one admin", () => {
    for (const a of ADMINS) {
      const named = a.keystone.match(/^([a-z_]+\.[a-z_]+)/)![1] as Right;
      const alsoHold = ADMINS.filter((o) => o.id !== a.id && rightsOf(o.roles).has(named));
      expect(alsoHold.map((o) => o.id), `${named} is not exclusive to ${a.id}`).toEqual([]);
    }
  });
});

describe("three admins — separation of powers", () => {
  it("holds each admin lawful on its own", () => {
    for (const a of ADMINS) {
      expect(breach(a.roles), `${a.id} completes a separation triad by itself`).toBeUndefined();
    }
  });

  /**
   * The load-bearing one. A three-person operation cannot run if no two
   * admins may be combined, and it is not a separation of powers if all
   * three may be. Both halves are asserted.
   */
  it("permits any two in one identity", () => {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const pair = rolesForAdmins([ids[i], ids[j]]);
        expect(breach(pair), `${ids[i]} + ${ids[j]} must be holdable by one person`).toBeUndefined();
      }
    }
  });

  it("refuses all three in one identity", () => {
    const all = breach(rolesForAdmins(ids));
    expect(all, "if one identity may hold all three, this is not a separation of powers").toBeDefined();
    expect([...all!].sort()).toEqual(["capital.deploy", "distribution.execute", "resolution.resolve"].sort());
  });

  it("keeps each leg of that triad in a different admin", () => {
    for (const leg of ["capital.deploy", "distribution.execute", "resolution.resolve"] as Right[]) {
      const holders = ADMINS.filter((a) => rightsOf(a.roles).has(leg)).map((a) => a.id);
      expect(holders, `${leg} must sit in exactly one admin for the refusal to bite`).toHaveLength(1);
    }
  });
});

describe("three admins — coverage", () => {
  it("leaves no capability unreachable by every admin", () => {
    const adminRights = rightsOf(rolesForAdmins(ids));
    const unreachable = CAPABILITIES.filter((c) => !adminRights.has(c.requiredRight)).map((c) => c.name);
    /* CastVote is the only capability that belongs to the partner role, and
       an admin holding it would let an operator vote in a partner ballot. */
    expect(unreachable).toEqual(["CastVote"]);
  });

  it("resolves rolesForAdmins to the union, without duplicates", () => {
    const both = rolesForAdmins(["office", "governance"]);
    expect(both).toEqual([...ADMIN_BY_ID.office.roles, ...ADMIN_BY_ID.governance.roles]);
    expect(rolesForAdmins(["office", "office"] as AdminId[])).toEqual(ADMIN_BY_ID.office.roles);
  });
});
