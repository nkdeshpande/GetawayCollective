/**
 * ROBOTS — one rule, derived from the same access model as the guard.
 *
 * Everything at "office" or "member" access already 403s for an
 * anonymous crawler, so disallowing those paths is belt-and-braces
 * rather than the thing standing between them and the public. It exists
 * so a search engine does not waste a crawl budget on 403s, and so a
 * denied path never appears in a results page even as a bare URL.
 */

import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://getawaycollective.co").replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/member", "/admin", "/capital", "/auth", "/passport", "/api"],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
