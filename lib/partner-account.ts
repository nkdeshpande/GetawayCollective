/**
 * THE PARTNER'S RELATIONSHIP SUMMARY — the layer above each estate
 *
 * V2.0, 8 Oct 2026. The first module of the partner area
 * (GC-MEMBER-RELATIONSHIP-MODULE.html, MEM-000): what a signed-in partner
 * should see before opening any one estate. Everything here is read for the
 * address they signed in with, from records that already exist:
 *
 *   holds     paid holding deposits opened under that address (lib/holds.ts)
 *   notices   what the platform has sent them (lib/notices/inbox.ts)
 *
 * It is assembled on the server and handed to the page as plain strings, so
 * the browser never receives a row it has to interpret, and never anybody
 * else's. With no address or no database every part is empty, and the page
 * says so plainly; nothing is ever shown as an example outside the preview.
 */
import { or, eq, sql, desc } from "drizzle-orm";
import { VEHICLES, vehicleBySlug } from "../constants/vehicles";
import { eventLog } from "./events/schema";
import { depositRows, eventDb } from "./events/store";
import { investorRowByEmail } from "./investors";
import { holdsFrom, holdsOf, type Hold } from "./holds";
import { inboxFor, unreadFor, when, type InboxItem } from "./notices/inbox";

export interface PartnerAccount {
  readonly unread: number;
  /** Paid holds: the estate, the units and when the deposit was paid. */
  readonly holds: readonly { readonly estate: string; readonly slug: string | null; readonly units: number; readonly paid: string; readonly href: string | null }[];
  /** The three most recent notices: when, and the subject they were sent under. */
  readonly notices: readonly { readonly at: string; readonly subject: string; readonly unread: boolean }[];
  /** The relationship's ledger, newest first. Read only for /activity. */
  readonly activity?: readonly ActivityLine[];
}

export interface ActivityLine { readonly at: string; readonly when: string; readonly what: string; readonly detail: string }
export interface PartnerEvent { readonly type: string; readonly at: string; readonly payload: Readonly<Record<string, unknown>> }

export const EMPTY_ACCOUNT: PartnerAccount = { unread: 0, holds: [], notices: [] };

/** Pure: the summary from rows already read. Kept apart so it can be tested without a database. */
export function accountFrom(holds: readonly Hold[], inbox: readonly InboxItem[], unread: number): PartnerAccount {
  return {
    unread,
    holds: holds.map((h) => {
      const v = h.vehicleSlug ? vehicleBySlug(h.vehicleSlug) : undefined;
      return {
        estate: v?.propertyName ?? "An estate", slug: v?.slug ?? null, units: h.units, paid: h.paidAt ? when(h.paidAt) : "",
        href: v ? `/reserve/${v.slug}#r=${h.reference}` : null,
      };
    }),
    notices: inbox.slice(0, 3).map((i) => ({ at: when(i.at), subject: i.subject, unread: i.unread })),
  };
}

/* ── the ledger: one dated list of the relationship (MEM-200) ────── */

const words = (s: string) => s.replace(/_/g, " ");
const units = (n: unknown) => { const x = Number(n); return Number.isFinite(x) && x > 0 ? `${x} unit${x === 1 ? "" : "s"}` : ""; };
const estateName = (key: unknown) => VEHICLES.find((v) => v.key === key || v.slug === key)?.propertyName ?? "";

/**
 * What each recorded act is, said to the person it is about. Only these are
 * shown: an event type this table does not name stays in the Office. Never
 * the actor, and never the reason the Office typed, which is an audit note.
 */
const EVENT_WORDS: Readonly<Record<string, (p: Readonly<Record<string, unknown>>) => readonly [string, string]>> = {
  InvestorRegistered: () => ["You were added to the investor register", ""],
  KycRecorded: (p) => ["Your identity checks were reviewed", typeof p.state === "string" ? `Now: ${words(p.state)}` : ""],
  BankAccountRecorded: () => ["The account your distributions are paid to was recorded", "If this was not you, write to ir@getawaycollective.co at once"],
  OwnershipPositionOpened: (p) => ["Your position was entered on the register", [estateName(p.estate), units(p.units)].filter(Boolean).join(" · ")],
  MemberStatePromoted: () => ["You became a partner", "On settlement of your position"],
};

/** Pure: the ledger from rows already read, newest first. */
export function activityFrom(events: readonly PartnerEvent[], holds: readonly Hold[], inbox: readonly InboxItem[], limit = 100): ActivityLine[] {
  const lines: { at: string; what: string; detail: string }[] = [];
  for (const e of events) {
    const say = EVENT_WORDS[e.type];
    if (!say) continue;
    const [what, detail] = say(e.payload);
    lines.push({ at: e.at, what, detail });
  }
  for (const h of holds) {
    const about = [estateName(h.vehicleSlug), units(h.units)].filter(Boolean).join(" · ");
    if (h.openedAt) lines.push({ at: h.openedAt, what: "You opened a holding deposit", detail: about });
    if (h.paidAt) lines.push({ at: h.paidAt, what: "Your holding deposit was paid", detail: about });
  }
  for (const i of inbox) lines.push({ at: i.at, what: "We sent you a notice", detail: i.subject });
  const time = (s: string) => { const t = Date.parse(s); return Number.isFinite(t) ? t : 0; };
  return lines.sort((a, b) => time(b.at) - time(a.at)).slice(0, limit).map((l) => ({ ...l, when: when(l.at) }));
}

/** Events about one investor: on their record, or naming them in the payload. */
async function eventsAbout(investorId: string): Promise<PartnerEvent[]> {
  const d = eventDb();
  if (!d) return [];
  const rows = await d.select({ type: eventLog.type, at: eventLog.occurredAt, payload: eventLog.payload }).from(eventLog)
    .where(or(eq(eventLog.objectId, investorId), sql`${eventLog.payload}->>'investorId' = ${investorId}`))
    .orderBy(desc(eventLog.occurredAt)).limit(300);
  return rows.map((r) => ({ type: r.type, at: r.at, payload: (r.payload ?? {}) as Record<string, unknown> }));
}

export async function partnerAccount(address: string | null, want: { activity?: boolean } = {}): Promise<PartnerAccount> {
  if (!address) return EMPTY_ACCOUNT;
  const [rows, inbox, unread] = await Promise.all([
    depositRows().catch(() => []), inboxFor(address, want.activity ? 50 : 3).catch(() => []), unreadFor(address).catch(() => 0),
  ]);
  const all = holdsFrom(rows);
  const base = accountFrom(holdsOf(all, address), inbox, unread);
  if (!want.activity) return base;
  const me = await investorRowByEmail(address);
  const events = me ? await eventsAbout(me.id).catch(() => []) : [];
  const a = address.toLowerCase().trim();
  /* The ledger lists an opened order too; the summary lists only what is held. */
  return { ...base, activity: activityFrom(events, all.filter((h) => h.email.toLowerCase().trim() === a), inbox) };
}
