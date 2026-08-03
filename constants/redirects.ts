/**
 * THE v3 → v4.0 REDIRECT MAP — every old URL answers with a 301
 *
 * Wave 10 · The Rebuild
 *
 * The v4.0 restructure renamed or folded 110 of 135 live URLs on a
 * sitemap that was already public and indexable. A URL that was ever
 * public is a promise: crawlers hold it, people bookmark it, and a 404
 * where a page used to be is the platform breaking its word. Every
 * Rename and Fold from the migration therefore lands here as a
 * permanent redirect.
 *
 * ── DERIVED SHAPE, CHECKED SHAPE ─────────────────────────────────────
 * The map was derived from the migration tab of GC-IA-V4-CANONICAL.xlsx
 * and is CHECKED at load against the live route table: a destination
 * that is not a real v4.0 route throws, and a source that still exists
 * as a route throws harder — a path cannot be both a page and a
 * redirect, and whichever was added second is the mistake.
 *
 * Dynamic segments use Next.js syntax (`:vehicle`) because this feeds
 * next.config redirects() directly. `[property]` became `:vehicle`
 * everywhere: the vehicle is the object; the property is its Space.
 */

import { ROUTES } from "./routes";

export interface Redirect {
  source: string;
  destination: string;
  permanent: true;
}

const go = (source: string, destination: string): Redirect =>
  ({ source, destination, permanent: true });

export const REDIRECTS: readonly Redirect[] = [
  // ── The worked flow → the investor realm ──────────────────────────
  go("/flow", "/invest/slowspace-coastal"),
  go("/flow/accreditation", "/invest/qualify"),
  go("/flow/risk", "/invest/slowspace-coastal/risks"),
  go("/flow/commit", "/invest/slowspace-coastal/commit"),
  go("/flow/settled", "/portfolio/slowspace-coastal"),

  // ── The passport → qualification ──────────────────────────────────
  go("/passport", "/invest/qualify"),
  go("/passport/:stage", "/invest/qualify"),

  // ── Property chapters: [property] → [vehicle], renamed segments ───
  go("/collection/:vehicle/location", "/collection/:vehicle/place"),
  go("/collection/:vehicle/gallery", "/collection/:vehicle/life"),
  go("/collection/:vehicle/space", "/collection/:vehicle/asset"),
  go("/collection/:vehicle/capital", "/collection/:vehicle/investment"),
  go("/collection/:vehicle/time", "/collection/:vehicle/ownership"),

  // ── Public folds ──────────────────────────────────────────────────
  go("/gallery", "/collection/slowspace-coastal/life"),
  go("/portfolio-narrative", "/collection"),
  go("/story", "/about"),
  go("/voices", "/about"),
  go("/roles", "/about"),
  go("/roles/:code", "/about"),
  go("/collective/partners", "/about"),
  go("/collective/operators", "/about"),
  go("/collective/press", "/about"),
  go("/collective/gallery", "/collection/slowspace-coastal/life"),
  go("/answers", "/how-it-works"),
  go("/structure", "/how-it-works"),
  go("/space", "/how-it-works"),
  go("/time", "/how-it-works"),
  go("/how-capital-works", "/collection/slowspace-coastal/investment"),
  go("/communique/request", "/collection/slowspace-coastal/enquire"),
  go("/journal/:story/comments", "/journal/:story"),

  // ── Member realm ──────────────────────────────────────────────────
  go("/member", "/home"),
  go("/member/holdings", "/portfolio"),
  go("/member/holdings/:vehicle", "/portfolio/:vehicle"),
  go("/member/position", "/portfolio/slowspace-coastal/capital"),
  go("/member/entitlement", "/portfolio/slowspace-coastal/time"),
  go("/member/entitlement/:year", "/portfolio/slowspace-coastal/time"),
  go("/member/resolutions", "/portfolio/slowspace-coastal/governance"),
  go("/member/resolutions/:ref", "/portfolio/slowspace-coastal/governance"),
  go("/member/documents", "/portfolio/slowspace-coastal/documents"),
  go("/member/documents/:id", "/portfolio/slowspace-coastal/documents"),
  go("/member/distributions", "/portfolio/slowspace-coastal/capital"),
  go("/member/distributions/:ref", "/portfolio/slowspace-coastal/capital"),
  go("/member/calls", "/portfolio/slowspace-coastal/capital"),
  go("/member/calls/:ref", "/portfolio/slowspace-coastal/capital"),
  go("/member/reports", "/portfolio/slowspace-coastal/capital"),
  go("/member/notifications", "/activity"),
  go("/member/settings", "/profile"),
  go("/member/settings/:section", "/profile"),
  go("/member/profile", "/profile"),
  go("/member/signal", "/activity"),
  /* Retired surfaces still redirect somewhere sensible rather than 404:
     retirement is our decision, and the cost of it should fall on us. */
  go("/member/calibration", "/home"),
  go("/member/codex", "/home"),
  go("/member/pass", "/home"),

  // ── Admin → Office ────────────────────────────────────────────────
  go("/admin", "/office"),
  go("/admin/vehicles", "/office/collection"),
  go("/admin/vehicles/new", "/office/collection"),
  go("/admin/vehicles/:llpin", "/office/collection/slowspace-coastal"),
  go("/admin/vehicles/:llpin/partners", "/office/collection/slowspace-coastal/partners"),
  go("/admin/vehicles/:llpin/filings", "/office/collection/slowspace-coastal/governance/compliance"),
  go("/admin/vehicles/:llpin/formation", "/office/collection/slowspace-coastal/governance/entity"),
  go("/admin/vehicles/:llpin/charges", "/office/collection/slowspace-coastal/capital/debt"),
  go("/admin/vehicles/:llpin/audit", "/office/collection/slowspace-coastal/governance/audit"),
  go("/admin/vehicles/:llpin/resolutions", "/office/collection/slowspace-coastal/governance/resolutions"),
  go("/admin/governance", "/office/collection/slowspace-coastal/governance"),
  go("/admin/governance/resolutions", "/office/collection/slowspace-coastal/governance/resolutions"),
  go("/admin/governance/resolutions/:ref", "/office/collection/slowspace-coastal/governance/resolutions"),
  go("/admin/governance/committees", "/office/collection/slowspace-coastal/governance"),
  go("/admin/governance/policies", "/office/collection/slowspace-coastal/governance/constitution"),
  go("/admin/compliance", "/office/collection/slowspace-coastal/governance/compliance"),
  go("/admin/compliance/:section", "/office/collection/slowspace-coastal/governance/compliance"),
  go("/admin/authority", "/office/settings/access"),
  go("/admin/authority/:section", "/office/settings/access"),
  go("/admin/content", "/office/collection/slowspace-coastal/documents"),
  go("/admin/media", "/office/collection/slowspace-coastal/documents"),
  go("/admin/ledger", "/office/collection/slowspace-coastal/capital/reports"),
  go("/admin/reports", "/office/collection/slowspace-coastal/capital/reports"),
  go("/admin/research", "/office/network"),
  go("/admin/telemetry", "/office/network"),
  go("/admin/failure", "/office/settings"),

  // ── /capital retired as a primary destination ─────────────────────
  go("/capital", "/office/collection"),
  go("/capital/properties", "/office/collection"),
  go("/capital/properties/:id", "/office/collection/slowspace-coastal"),
  go("/capital/properties/:id/programme", "/office/collection/slowspace-coastal/project/timeline"),
  go("/capital/properties/:id/valuations", "/office/collection/slowspace-coastal/capital/valuation"),
  go("/capital/calls", "/office/collection/slowspace-coastal/capital/contributions"),
  go("/capital/distributions", "/office/collection/slowspace-coastal/capital/distributions"),
  go("/capital/distributions/:ref", "/office/collection/slowspace-coastal/capital/distributions"),
  go("/capital/offerings", "/office/collection"),
  go("/capital/waterfall", "/collection/slowspace-coastal/investment"),
  go("/capital/risk", "/office/collection/slowspace-coastal/project/risks"),

  // ── Parameterised commit path ─────────────────────────────────────
  go("/commit/:offering", "/invest/:offering"),
  go("/commit/:offering/risk", "/invest/:offering/risks"),
  go("/commit/:offering/execute", "/invest/:offering/commit"),

  // ── Auth ──────────────────────────────────────────────────────────
  go("/auth/sign-in", "/sign-in"),
  go("/auth/verify", "/verify"),
  go("/auth/sign-out", "/sign-in"),
];

/* ── Checks ──────────────────────────────────────────────────────── */
{
  /* A destination must be a live v4.0 route once its :params are
     normalised back to [param] or bound to the worked vehicle. */
  const live = new Set(ROUTES.map((r) => r.path));
  const normalise = (d: string) =>
    d
      .replace("/slowspace-coastal", "/[vehicle]")
      .replace(/:vehicle/g, "[vehicle]")
      .replace(/:offering/g, "[vehicle]")
      .replace(/:story/g, "[story]")
      .replace(/:year/g, "[year]");

  for (const r of REDIRECTS) {
    const d = normalise(r.destination);
    const ok =
      live.has(d) ||
      live.has(d.replace("/[vehicle]", "")) ||
      /* stage family: /invest/qualify/discover stands in for all 16 */
      live.has(d);
    if (!ok) {
      throw new Error(
        `Redirect ${r.source} → ${r.destination} targets ${d}, which is not a v4.0 route. ` +
        `A redirect into a 404 is worse than no redirect: it looks deliberate.`,
      );
    }
  }

  /* A source that still exists as a route is a page and a redirect at
     once, and whichever was added second is the mistake. */
  for (const r of REDIRECTS) {
    const asRoute = r.source.replace(/:(\w+)/g, "[$1]");
    if (live.has(asRoute) || live.has(r.source)) {
      throw new Error(`${r.source} is both a live route and a redirect source.`);
    }
  }

  /* No source redirects twice. */
  const seen = new Set<string>();
  for (const r of REDIRECTS) {
    if (seen.has(r.source)) throw new Error(`${r.source} redirects twice.`);
    seen.add(r.source);
  }
}
