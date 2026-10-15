/**
 * POSTHOG — product analytics, sent from this server, never from the page
 *
 * 15 Oct 2026. The Office asked for one integrated view of who comes, what
 * they read and how far they go. The visit counter (lib/visits.ts) counts
 * pages; this adds the path a visit takes, and puts both on one Office page
 * (app/_assemblies/officerecords.tsx, OfficeAnalytics).
 *
 * How it is built, and why:
 *   - No PostHog script runs in the browser. The page sends its few events to
 *     this site (/api/visit, /api/ev) and this server forwards them. So there
 *     is no third-party tag, no cookie, and nothing an ad blocker breaks.
 *   - No person. Each event carries a random id for one browser tab, kept in
 *     sessionStorage and gone when the tab closes; person profiles are off
 *     ($process_person_profile: false). No name, email, phone or address is
 *     ever sent: the allowlist below is the only way in.
 *   - No address. The request's IP is not forwarded and PostHog's own geo
 *     lookup is disabled; the country Vercel derives is sent instead.
 *   - Dormant until switched on. Without POSTHOG_KEY nothing is sent and
 *     every call returns at once. A browser asking not to be tracked (DNT,
 *     GPC) is never forwarded, exactly as the visit counter.
 *
 * The Cookie Notice (content/legal.ts, /legal/cookies, A.2 in v2.1) discloses
 * exactly this: tab-scoped records, no identity, PostHog as processor, and
 * DNT/GPC honoured. Its wording was approved by the founder on 15 Oct 2026
 * (GC-17-AN-001). Change what is sent here and that clause must change too.
 *
 * Environment (names only):
 *   POSTHOG_KEY               project API key (phc_…) — switches sending on
 *   POSTHOG_HOST              ingest host, default https://us.i.posthog.com
 *   POSTHOG_PROJECT_ID        numeric project id     — with the next, switches the Office view on
 *   POSTHOG_PERSONAL_API_KEY  personal key (phx_…), read-only "query" scope
 *   POSTHOG_APP_HOST          app host, default derived from POSTHOG_HOST
 */

import { countablePath } from "./visits";

const env = (k: string) => (process.env[k] || "").trim();
const host = () => (env("POSTHOG_HOST") || "https://us.i.posthog.com").replace(/\/+$/, "");
const appHost = () => (env("POSTHOG_APP_HOST") || host().replace("://us.i.", "://us.").replace("://eu.i.", "://eu.")).replace(/\/+$/, "");

export const sending = () => env("POSTHOG_KEY").length > 0;
export const viewing = () => /^\d+$/.test(env("POSTHOG_PROJECT_ID")) && env("POSTHOG_PERSONAL_API_KEY").length > 0;
/** What is missing before each half works, by name only. */
export function missing(): { send: string[]; view: string[] } {
  return {
    send: sending() ? [] : ["POSTHOG_KEY"],
    view: [!/^\d+$/.test(env("POSTHOG_PROJECT_ID")) ? "POSTHOG_PROJECT_ID" : "", !env("POSTHOG_PERSONAL_API_KEY") ? "POSTHOG_PERSONAL_API_KEY" : ""].filter(Boolean),
  };
}
export const projectUrl = () => (viewing() ? `${appHost()}/project/${env("POSTHOG_PROJECT_ID")}` : null);

/* ── what may be sent ──────────────────────────────────────────────── */

/** The events the page may name, and the properties each may carry. Nothing else passes. */
export const EVENTS: Readonly<Record<string, readonly string[]>> = {
  $pageview: ["path", "landing", "source"],
  cta: ["label", "href"],
  enquiry_sent: ["form", "vehicle"],
  deposit_opened: ["vehicle", "units"],
  deposit_paid: ["vehicle"],
  hero_film: ["state"],
};

/** A tab id: what the page made, or null. Random, 8–40 safe characters. */
export const tabId = (raw: unknown): string | null => (typeof raw === "string" && /^[A-Za-z0-9_-]{8,40}$/.test(raw) ? raw : null);

/** One property value made safe: short text, a number or a boolean. Never an address. */
function clean(v: unknown): string | number | boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v !== "string") return undefined;
  const s = v.replace(/\s+/g, " ").trim().slice(0, 120);
  if (!s || /@|\+?\d[\d\s-]{7,}/.test(s)) return undefined; // anything that looks like an email or a phone number is dropped
  return s;
}

/** The event as PostHog will receive it, or null if it is not one we send. */
export function shape(event: unknown, props: unknown, tab: unknown, ctx: { path?: unknown; country?: string | null } = {}) {
  if (typeof event !== "string" || !(event in EVENTS)) return null;
  const id = tabId(tab);
  if (!id) return null;
  const allowed = EVENTS[event], given = (props && typeof props === "object" ? props : {}) as Record<string, unknown>;
  const properties: Record<string, unknown> = { $process_person_profile: false, $geoip_disable: true, $session_id: id };
  for (const k of allowed) { const c = clean(given[k]); if (c !== undefined) properties[k] = c; }
  const path = countablePath(ctx.path);
  if (path) { properties.$pathname = path; properties.$current_url = `https://getawaycollective.co${path}`; }
  if (ctx.country && /^[A-Z]{2}$/.test(ctx.country)) properties.country = ctx.country;
  return { event, distinct_id: id, properties };
}

/** Forward one event. Never throws, never waits more than 1.5 s, sends nothing when dormant. */
export async function capture(e: ReturnType<typeof shape>): Promise<boolean> {
  if (!e || !sending()) return false;
  try {
    const r = await fetch(`${host()}/i/v0/e/`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ api_key: env("POSTHOG_KEY"), ...e, timestamp: new Date().toISOString() }),
      signal: AbortSignal.timeout(1500), cache: "no-store",
    });
    return r.ok;
  } catch { return false; }
}

/* ── the Office's view ─────────────────────────────────────────────── */

async function hogql(query: string): Promise<unknown[][] | null> {
  if (!viewing()) return null;
  try {
    const r = await fetch(`${appHost()}/api/projects/${env("POSTHOG_PROJECT_ID")}/query/`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env("POSTHOG_PERSONAL_API_KEY")}` },
      body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
      signal: AbortSignal.timeout(8000), cache: "no-store",
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { results?: unknown[][] };
    return Array.isArray(j.results) ? j.results : null;
  } catch { return null; }
}

/** The path a visit takes, as five steps, each counted in browser tabs. */
export const STEPS = [
  ["Arrived", "event = '$pageview'"],
  ["Looked at an estate", "event = '$pageview' AND properties.$pathname LIKE '/collection/%'"],
  ["Read an offering", "event = '$pageview' AND properties.$pathname LIKE '%/investment'"],
  ["Enquired or subscribed", "event = 'enquiry_sent'"],
  ["Paid a deposit", "event = 'deposit_paid'"],
] as const;

export interface VisitPaths {
  ready: true; days: number; url: string | null;
  steps: { label: string; tabs: number }[];
  ctas: { label: string; clicks: number }[];
  countries: { country: string; tabs: number }[];
  film: { played: number; tabs: number };
}

/** Thirty days of visitPaths, or why there are none. */
export async function visitPaths(days = 30): Promise<VisitPaths | { ready: false; why: string }> {
  if (!viewing()) return { ready: false, why: `Waiting on ${missing().view.join(" and ")}.` };
  const since = `timestamp > now() - INTERVAL ${Math.max(1, Math.min(90, Math.floor(days)))} DAY`;
  const steps = STEPS.map(([, w]) => `uniqIf(distinct_id, ${w})`).join(", ");
  const [s, c, k, f] = await Promise.all([
    hogql(`SELECT ${steps} FROM events WHERE ${since}`),
    hogql(`SELECT properties.label AS l, count() AS n FROM events WHERE event = 'cta' AND ${since} GROUP BY l ORDER BY n DESC LIMIT 10`),
    hogql(`SELECT properties.country AS c, uniq(distinct_id) AS n FROM events WHERE event = '$pageview' AND ${since} GROUP BY c ORDER BY n DESC LIMIT 8`),
    hogql(`SELECT countIf(properties.state = 'playing'), uniqIf(distinct_id, properties.state = 'playing') FROM events WHERE event = 'hero_film' AND ${since}`),
  ]);
  if (!s) return { ready: false, why: "PostHog did not answer. The keys may be wrong, or PostHog may be down; nothing on the site depends on it." };
  const n = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
  return {
    ready: true, days, url: projectUrl(),
    steps: STEPS.map(([label], i) => ({ label, tabs: n(s[0]?.[i]) })),
    ctas: (c ?? []).map((r) => ({ label: String(r[0] ?? "—"), clicks: n(r[1]) })),
    countries: (k ?? []).map((r) => ({ country: String(r[0] || "Unknown"), tabs: n(r[1]) })),
    film: { played: n(f?.[0]?.[0]), tabs: n(f?.[0]?.[1]) },
  };
}
