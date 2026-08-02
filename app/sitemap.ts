/**
 * SITEMAP — generated from the route table, not hand-typed.
 *
 * Every static public route comes from ROUTES via the same accessOf() /
 * isIndexable() functions the guard and the generator already use, so
 * this cannot list a route the middleware would deny, and cannot omit
 * one that is genuinely public.
 *
 * Dynamic routes are expanded from the same data each page renders from,
 * so a property added to the collection appears here without anyone
 * remembering to add it by hand.
 *
 * ── THE CHAPTER LIST IS DERIVED, NOT TYPED ───────────────────────────
 * It used to be a literal: ["", "/space", "/capital", "/time",
 * "/location", "/gallery"]. Those were the v3 chapter URLs. The v4/v5 IA
 * renamed every one of them — place, life, idea, asset, ownership,
 * investment, risk, progress — and the literal kept emitting the old
 * ones, so the sitemap was advertising six 404s per property to every
 * crawler that read it.
 *
 * Reading the suffixes off ROUTES means the next rename carries itself.
 * A sitemap that can name a URL the router does not have is a sitemap
 * that will do it again.
 */

import type { MetadataRoute } from "next";
import { ROUTES, accessOf, isIndexable } from "@/constants/routes";
import { PROPERTIES, toSlug } from "@/app/_assemblies/data";
import { JOURNAL } from "@/content/journal";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://getawaycollective.co").replace(/\/+$/, "");

/** Every indexable /collection/[vehicle]* chapter, straight off the table. */
const VEHICLE_CHAPTERS = ROUTES.filter(
  (r) => r.path.startsWith("/collection/[vehicle]") && isIndexable(r, accessOf(r)),
).map((r) => r.path.replace("/collection/[vehicle]", ""));

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const r of ROUTES) {
    if (r.params?.length) continue; // expanded below, from real data
    const access = accessOf(r);
    if (!isIndexable(r, access)) continue;
    entries.push({ url: BASE + (r.path === "/" ? "" : r.path) });
  }

  for (const p of PROPERTIES) {
    const slug = toSlug(p.ufr0060);
    for (const suffix of VEHICLE_CHAPTERS) {
      entries.push({ url: `${BASE}/collection/${slug}${suffix}` });
    }
  }

  /* /journal/[story] is indexable, so its entries belong here. /roles was
     RETIRED by the v4 migration (folded into /about) and its loop went
     with it — it was emitting a dead URL per role. */
  for (const e of JOURNAL) entries.push({ url: `${BASE}/journal/${e.slug}` });

  return entries;
}
