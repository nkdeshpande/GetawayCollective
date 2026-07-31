/**
 * SITEMAP — generated from the route table, not hand-typed.
 *
 * Every static public route comes from ROUTES via the same accessOf() /
 * isIndexable() functions the guard and the generator already use, so
 * this cannot list a route the middleware would deny, and cannot omit
 * one that is genuinely public.
 *
 * Dynamic routes ([property], [slug], [code]) are expanded from the
 * same data each page renders from — PROPERTIES, JOURNAL, ROLES — so a
 * property added to the collection appears here without anyone
 * remembering to add it by hand.
 */

import type { MetadataRoute } from "next";
import { ROUTES, accessOf, isIndexable } from "@/constants/routes";
import { PROPERTIES, toSlug } from "@/app/_assemblies/data";
import { JOURNAL } from "@/content/journal";
import { ROLES } from "@/content/gateway";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://getawaycollective.in").replace(/\/+$/, "");

const SPACE_SUFFIXES = ["", "/space", "/capital", "/time", "/location", "/gallery"];

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
    for (const suffix of SPACE_SUFFIXES) {
      entries.push({ url: `${BASE}/collection/${slug}${suffix}` });
    }
  }

  for (const e of JOURNAL) entries.push({ url: `${BASE}/journal/${e.slug}` });
  for (const role of ROLES) entries.push({ url: `${BASE}/roles/${role.code}` });

  return entries;
}
