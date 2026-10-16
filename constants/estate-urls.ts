/**
 * ESTATE ADDRESSES — the name a visitor reads, over the key the records keep
 *
 * 16 Oct 2026 (SEO audit). Three estates were published at addresses that
 * name something else: Streamside Creek at /collection/coorg-coffee-creek,
 * Seaside Confluence at /collection/slowspace-coastal, Solace at
 * /collection/slowspace-solace. The slug cannot simply change: it is the
 * key on every deposit and hold already written (lib/events/schema.ts,
 * vehicle_slug), and the units an estate has left are counted by it, so a
 * second spelling would split that count.
 *
 * So the key stays, and the address changes in front of it:
 *   - next.config rewrites each public address to the internal one, so the
 *     page, its params and its records are exactly as before;
 *   - the old address answers with a permanent redirect to the new one, so
 *     every link, bookmark and search result already out there still lands;
 *   - pages, the sitemap and canonicals print the public address (toPublic).
 *
 * Only the public surfaces move: /collection/… and /reserve/…. A partner's
 * own pages (/portfolio/…) and the Office keep the key.
 */

/** Internal slug (the record key) → the address a visitor sees. */
export const PUBLIC_SLUG: Readonly<Record<string, string>> = {
  "coorg-coffee-creek": "streamside-creek",
  "slowspace-coastal": "seaside-confluence",
  "slowspace-solace": "solace",
};

const INTERNAL_SLUG: Readonly<Record<string, string>> = Object.fromEntries(Object.entries(PUBLIC_SLUG).map(([k, v]) => [v, k]));

const SURFACES = ["collection", "reserve"] as const;
const swap = (map: Readonly<Record<string, string>>) => {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length).join("|");
  /* not inside the Office's or a partner's own paths, which keep the key */
  const re = new RegExp(`(?<!/(?:office|portfolio|admin))/(${SURFACES.join("|")})/(${keys})(?=$|[/"'?#\\s<])`, "g");
  return (s: string) => s.replace(re, (_, surface: string, slug: string) => `/${surface}/${map[slug]}`);
};

/** Every /collection/<key> and /reserve/<key> in a path or a piece of HTML, as the visitor's address. */
export const toPublic: (s: string) => string = swap(PUBLIC_SLUG);
/** The reverse, for code handed a public path that must find the record. */
export const toInternal: (s: string) => string = swap(INTERNAL_SLUG);

/** next.config: the public address serves the internal page. */
export const ESTATE_REWRITES = SURFACES.flatMap((s) => Object.entries(PUBLIC_SLUG).flatMap(([key, pub]) => [
  { source: `/${s}/${pub}`, destination: `/${s}/${key}` },
  { source: `/${s}/${pub}/:rest*`, destination: `/${s}/${key}/:rest*` },
]));

/** next.config: the old address goes, permanently, to the new one. */
export const ESTATE_REDIRECTS = SURFACES.flatMap((s) => Object.entries(PUBLIC_SLUG).flatMap(([key, pub]) => [
  { source: `/${s}/${key}`, destination: `/${s}/${pub}`, permanent: true as const },
  { source: `/${s}/${key}/:rest*`, destination: `/${s}/${pub}/:rest*`, permanent: true as const },
]));
