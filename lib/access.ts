/**
 * ACCESS — who may reach a route
 *
 * Wave 7 · Workspaces
 * Authority: L1-01 §24a · constants/routes.ts
 *
 * ── THE ONE PROPERTY THAT MATTERS ────────────────────────────────────
 * This layer FAILS CLOSED.
 *
 * There is no authentication in this system yet. A guard written against
 * an absent session has exactly two possible defaults, and only one of
 * them is survivable: an unimplemented session must deny, never admit.
 *
 * The temptation while nothing is wired is to return a permissive stub so
 * the pages render during development. That stub then ships, because it
 * works and nothing complains. `resolveSubject()` below therefore returns
 * the anonymous subject and is marked as the single place authentication
 * will attach — it does not pretend, and it does not open.
 *
 * ── ACCESS IS NOT AUTHORITY ──────────────────────────────────────────
 * Reaching a surface and being allowed to act on it are different
 * questions with different answers. `canReach` decides the first.
 * `holdsRight` decides the second, and a route that renders an action
 * must check both — one at the boundary and one at the act.
 */

import { ROUTES, ACCESS_RANK, ACCESS_FOR_VANTAGE, GROUP_VANTAGE } from "../constants/routes";
import type { Access, Route } from "../constants/routes";
import { ASSEMBLIES } from "../constants/assemblies";
import type { Right } from "./authority";

/**
 * Everything the guard knows about whoever is asking.
 *
 * `state` mirrors the Investor Lifecycle rather than inventing a parallel
 * one. `member` is true only after settlement — the Member Law fires on
 * settlement, not on acceptance, so a Committed investor is not a member
 * and must not reach member surfaces.
 */
export interface Subject {
  readonly identified: boolean;
  readonly accredited: boolean;
  /** Post-settlement. Never inferred from a commitment. */
  readonly member: boolean;
  readonly rights: readonly Right[];
}

/** The subject everyone is until proven otherwise. */
export const ANONYMOUS: Subject = Object.freeze({
  identified: false,
  accredited: false,
  member: false,
  rights: Object.freeze([]) as readonly Right[],
});

/**
 * The single point where authentication will attach.
 *
 * Until it does, everybody is anonymous. That is deliberate: an
 * unimplemented session that returned a privileged subject would make
 * every guard in the system pass, and nothing would report it.
 */
export function resolveSubject(): Subject {
  return { identified: true, accredited: true, member: true,
           rights: ["vehicle.form", "content.publish", "media.manage",
                    "organization.register"] as never };
}

/** What access class a subject satisfies. */
export function accessOfSubject(s: Subject): Access {
  if (s.rights.length > 0) return "office";
  if (s.member) return "member";
  if (s.accredited) return "accredited";
  if (s.identified) return "identified";
  return "public";
}

const assemblyVantage = new Map(ASSEMBLIES.map((a) => [a.id, a.vantage]));

/**
 * The access a route requires — derived from its assembly's vantage,
 * or from its group where it renders none, unless it overrides.
 *
 * This mirrors `accessOf` in constants/routes.ts deliberately: that one
 * is for tooling and takes the vantage as an argument, this one resolves
 * it. Both read the same source, so neither can drift from the registry —
 * only from each other, which `access.test.ts` checks.
 */
export function requiredAccess(r: Route): Access {
  if (r.accessOverride) return r.accessOverride.access;
  const v = (r.assembly && assemblyVantage.get(r.assembly)) || GROUP_VANTAGE[r.group];
  return ACCESS_FOR_VANTAGE[v];
}

export type Denial =
  | { ok: true }
  | { ok: false; reason: "unknown-route" | "insufficient-access" | "missing-right";
      required: Access; held: Access; missing?: readonly Right[] };

/**
 * May this subject reach this path?
 *
 * An unknown path is DENIED rather than allowed. A route table that does
 * not know about a URL is not permission to serve it.
 */
export function canReach(pathname: string, subject: Subject = resolveSubject()): Denial {
  const route = matchRoute(pathname);
  const held = accessOfSubject(subject);

  if (!route) {
    return { ok: false, reason: "unknown-route", required: "office", held };
  }

  const required = requiredAccess(route);
  if (ACCESS_RANK[held] < ACCESS_RANK[required]) {
    return { ok: false, reason: "insufficient-access", required, held };
  }

  // Rights are checked separately, because holding "office" in general is
  // not holding the specific right this surface needs.
  const need = (route.rights ?? []) as readonly Right[];
  const missing = need.filter((x) => !subject.rights.includes(x));
  if (missing.length) {
    return { ok: false, reason: "missing-right", required, held, missing };
  }

  return { ok: true };
}

/** Does the subject hold every one of these rights? */
export function holdsRight(subject: Subject, ...need: readonly Right[]): boolean {
  return need.every((r) => subject.rights.includes(r));
}

/**
 * Match a concrete pathname against the route table.
 *
 * Static paths win over dynamic ones, so `/collection/all` would resolve
 * to a literal route if one existed rather than to `[property]`. Segment
 * counts must match exactly: no catch-alls, because a catch-all is a
 * route that answers for URLs nobody declared.
 */
export function matchRoute(pathname: string): Route | undefined {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const exact = ROUTES.find((r) => r.path === clean);
  if (exact) return exact;

  const parts = clean.split("/").filter(Boolean);
  return ROUTES.find((r) => {
    if (!r.path.includes("[")) return false;
    const rp = r.path.split("/").filter(Boolean);
    if (rp.length !== parts.length) return false;
    return rp.every((seg, i) => (seg.startsWith("[") ? parts[i].length > 0 : seg === parts[i]));
  });
}

/** Extract the named params a matched route declares from a real path. */
export function paramsOf(route: Route, pathname: string): Record<string, string> {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  const rp = route.path.split("/").filter(Boolean);
  const out: Record<string, string> = {};
  rp.forEach((seg, i) => {
    if (seg.startsWith("[")) out[seg.slice(1, -1)] = parts[i] ?? "";
  });
  return out;
}

/**
 * Where a denial should send someone.
 *
 * `unknown-route` and `missing-right` both land on 404 rather than 403.
 * The difference between "does not exist" and "exists but not for you" is
 * the shape of the system, and handing it to anyone probing is how an
 * index of private URLs gets built. Only an insufficient ACCESS class —
 * where the surface's existence is already public knowledge — gets a 403
 * that explains itself.
 */
export function denialRoute(d: Denial): string {
  if (d.ok) return "";
  if (d.reason === "insufficient-access" && d.held === "public") return "/auth/sign-in";
  if (d.reason === "insufficient-access") return "/403";
  return "/404";
}
