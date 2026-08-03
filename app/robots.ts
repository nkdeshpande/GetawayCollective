/**
 * ROBOTS — one rule, derived from the same access model as the guard.
 *
 * Everything at "office" or "member" access already 403s for an
 * anonymous crawler, so disallowing those paths is belt-and-braces
 * rather than the thing standing between them and the public. It exists
 * so a search engine does not waste a crawl budget on 403s, and so a
 * denied path never appears in a results page even as a bare URL.
 *
 * ── THE LIST IS DERIVED, AND THAT IS THE FIX ─────────────────────────
 * It used to be a literal: ["/member", "/admin", "/capital", "/auth",
 * "/passport"]. Every one of those was a v3 path, and the v4/v5 IA
 * retired or renamed all five. Meanwhile the namespaces that actually
 * hold private material now — /office, /invest, /portfolio, /home,
 * /activity, /profile — appeared nowhere, so the file named nothing that
 * existed and protected nothing that did.
 *
 * It is computed off ROUTES instead. A file claiming to guard a namespace
 * must not be able to fall a whole IA behind the namespaces it guards.
 */

import type { MetadataRoute } from "next";
import { ROUTES, accessOf, isIndexable } from "@/constants/routes";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://getawaycollective.co").replace(/\/+$/, "");

/**
 * The first segment of every non-indexable route.
 *
 * Top-level segments only: /office covers the whole Office in one line,
 * where enumerating sixty descendants would be a map of the private
 * estate published at a well-known URL.
 *
 * A route is excluded if any INDEXABLE route shares its first segment —
 * "/collection" holds both public chapters and nothing private, and
 * disallowing it over one non-indexable child would delist the Collection.
 */
function disallowed(): string[] {
  const publicRoots = new Set<string>();
  const privateRoots = new Set<string>();

  for (const r of ROUTES) {
    const root = "/" + (r.path.split("/").filter(Boolean)[0] ?? "");
    if (root === "/") continue;
    (isIndexable(r, accessOf(r)) ? publicRoots : privateRoots).add(root);
  }

  return [...privateRoots].filter((p) => !publicRoots.has(p)).sort();
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* /api is added by hand: it holds endpoints, not surfaces, so it is
         absent from the route table by design and cannot be derived. */
      disallow: [...disallowed(), "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
