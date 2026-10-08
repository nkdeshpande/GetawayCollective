/**
 * VISITS — counted without a cookie, a fingerprint or a person
 *
 * V2.0, 9 Oct 2026. The Office asked how many people come and from where.
 * This answers with counts only (lib/events/schema.ts, site_visit_daily):
 *
 *   - the browser says which page was read and, for the first page of a
 *     tab's visit, where it came from (app/_assemblies/site/visit-wire.ts)
 *   - this file reduces that to a day, a path and a source, and adds one
 *
 * Nothing identifies a reader: no id, no address, no device string is
 * stored; the request's address is used only to rate-limit and is never
 * kept. So "visits" here
 * means landings (first pages), not unique people; the page says so. A
 * browser that sends Do Not Track or Global Privacy Control is not counted
 * at all, and neither is a crawler or anything inside the Office.
 */
import { and, gte, sql } from "drizzle-orm";
import { siteVisitDaily } from "./events/schema";
import { eventDb } from "./events/store";

const OWN = new Set(["getawaycollective.co", "www.getawaycollective.co", "localhost"]);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|node-fetch/i;

/** The day in India for an instant, YYYY-MM-DD. */
export function istDay(at: Date): string {
  return new Date(at.getTime() + 330 * 60_000).toISOString().slice(0, 10);
}

/** A page path worth counting, or null. No query, no Office, no API, nothing odd. */
export function countablePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const p = raw.split(/[?#]/)[0];
  if (!/^\/[A-Za-z0-9\-._~/\[\]%]{0,180}$/.test(p)) return null;
  if (/^\/(api|office|_next)(\/|$)/.test(p)) return null;
  return p.length > 1 ? p.replace(/\/+$/, "") : "/";
}

/** Where a landing came from: a campaign, a referring host, or direct. */
export function sourceOf(landing: boolean, referrer: unknown, utm: unknown): string {
  if (!landing) return "internal";
  if (typeof utm === "string" && /^[A-Za-z0-9_.\-]{1,40}$/.test(utm)) return `utm:${utm.toLowerCase()}`;
  if (typeof referrer !== "string" || !referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
    if (!host || OWN.has(host) || OWN.has(`www.${host}`)) return "direct";
    return host.slice(0, 80);
  } catch { return "direct"; }
}

export const isBot = (userAgent: string | null): boolean => !userAgent || BOT.test(userAgent);

/** Add one. Returns whether it was counted; never throws. */
export async function countVisit(v: { path: unknown; landing: boolean; referrer?: unknown; utm?: unknown }, now: Date = new Date()): Promise<boolean> {
  const path = countablePath(v.path);
  const d = eventDb();
  if (!path || !d) return false;
  const source = sourceOf(v.landing, v.referrer, v.utm);
  try {
    await d.insert(siteVisitDaily).values({ day: istDay(now), path, source, views: 1, landings: v.landing ? 1 : 0 })
      .onConflictDoUpdate({
        target: [siteVisitDaily.day, siteVisitDaily.path, siteVisitDaily.source],
        set: { views: sql`${siteVisitDaily.views} + 1`, landings: sql`${siteVisitDaily.landings} + ${v.landing ? 1 : 0}` },
      });
    return true;
  } catch { return false; }   // the table is not there yet, or the database is away
}

export interface VisitRow { readonly day: string; readonly path: string; readonly source: string; readonly views: number; readonly landings: number }
export interface VisitReport {
  readonly ready: boolean;
  readonly days: readonly { day: string; views: number; visits: number }[];
  readonly pages: readonly { path: string; views: number; visits: number }[];
  readonly sources: readonly { source: string; visits: number }[];
  readonly views: number;
  readonly visits: number;
}

/** Pure: the report from rows already read. */
export function reportFrom(rows: readonly VisitRow[], top = 12): Omit<VisitReport, "ready"> {
  const by = <K extends string>(key: (r: VisitRow) => K) => {
    const m = new Map<K, { views: number; visits: number }>();
    for (const r of rows) { const x = m.get(key(r)) ?? { views: 0, visits: 0 }; x.views += r.views; x.visits += r.landings; m.set(key(r), x); }
    return m;
  };
  const days = [...by((r) => r.day)].map(([day, x]) => ({ day, ...x })).sort((a, b) => b.day.localeCompare(a.day));
  const pages = [...by((r) => r.path)].map(([path, x]) => ({ path, ...x })).sort((a, b) => b.views - a.views).slice(0, top);
  const sources = [...by((r) => r.source)].filter(([s]) => s !== "internal").map(([source, x]) => ({ source, visits: x.visits }))
    .filter((s) => s.visits > 0).sort((a, b) => b.visits - a.visits).slice(0, top);
  return { days, pages, sources, views: rows.reduce((n, r) => n + r.views, 0), visits: rows.reduce((n, r) => n + r.landings, 0) };
}

/** The last `span` days. `ready` is false where the table cannot be read. */
export async function visitReport(span = 30, now: Date = new Date()): Promise<VisitReport> {
  const empty = { ...reportFrom([]), ready: false };
  const d = eventDb();
  if (!d) return empty;
  try {
    const from = istDay(new Date(now.getTime() - (span - 1) * 86_400_000));
    const rows = await d.select().from(siteVisitDaily).where(and(gte(siteVisitDaily.day, from)));
    return { ...reportFrom(rows), ready: true };
  } catch { return empty; }
}
