/**
 * THE DESK — who wrote in, and how far each estate's enquiries go
 *
 * V2.0, 9 Oct 2026. Both are read from inbound_contact, which every public
 * form and every deposit already writes; nothing new is collected.
 *
 *   enquiries()   the latest people who wrote in, with what they asked
 *   funnelFrom()  for each estate: enquiries, deposit orders opened, paid
 */
import { desc, inArray } from "drizzle-orm";
import { VEHICLES } from "../constants/vehicles";
import { inboundContact } from "./events/schema";
import { depositRows, eventDb } from "./events/store";
import { holdsFrom, type Hold } from "./holds";

const ENQUIRY_SOURCES = ["dossier", "waitlist", "signal", "iris"];
const KIND: Readonly<Record<string, string>> = { dossier: "Enquiry", waitlist: "Waitlist", signal: "The Signal", iris: "Asked IRIS" };

export interface Enquiry { readonly id: string; readonly at: string; readonly kind: string; readonly name: string; readonly email: string; readonly estate: string; readonly note: string }
export interface ContactLite { readonly source: string; readonly vehicleSlug: string | null }
export interface FunnelLine { readonly estate: string; readonly enquiries: number; readonly waitlist: number; readonly opened: number; readonly paid: number }

const estateName = (slug: string | null) => (slug ? VEHICLES.find((v) => v.slug === slug)?.propertyName ?? slug : "No estate named");

export async function enquiries(limit = 100): Promise<readonly Enquiry[]> {
  const d = eventDb();
  if (!d) return [];
  const rows = await d.select().from(inboundContact).where(inArray(inboundContact.source, ENQUIRY_SOURCES)).orderBy(desc(inboundContact.receivedAt)).limit(limit);
  return rows.map((r) => ({
    id: r.contactId, at: String(r.receivedAt), kind: KIND[r.source] ?? r.source, name: r.name ?? "", email: r.email,
    estate: r.source === "signal" ? "" : estateName(r.vehicleSlug), note: (r.note ?? "").slice(0, 600),
  }));
}

/** Pure: enquiry to order to paid deposit, for each estate that has any. */
export function funnelFrom(contacts: readonly ContactLite[], holds: readonly Hold[]): FunnelLine[] {
  const m = new Map<string, FunnelLine>();
  const at = (slug: string | null) => {
    const k = estateName(slug);
    if (!m.has(k)) m.set(k, { estate: k, enquiries: 0, waitlist: 0, opened: 0, paid: 0 });
    return m.get(k)!;
  };
  const bump = (l: FunnelLine, f: keyof Omit<FunnelLine, "estate">) => m.set(l.estate, { ...l, [f]: l[f] + 1 });
  for (const c of contacts) {
    if (c.source === "dossier") bump(at(c.vehicleSlug), "enquiries");
    else if (c.source === "waitlist") bump(at(c.vehicleSlug), "waitlist");
  }
  for (const h of holds) { bump(at(h.vehicleSlug), "opened"); if (h.status === "paid") bump(at(h.vehicleSlug), "paid"); }
  return [...m.values()].sort((a, b) => (b.enquiries + b.opened) - (a.enquiries + a.opened));
}

export async function funnel(): Promise<{ lines: readonly FunnelLine[]; signal: number }> {
  const d = eventDb();
  if (!d) return { lines: [], signal: 0 };
  const [contacts, deposits] = await Promise.all([
    d.select({ source: inboundContact.source, vehicleSlug: inboundContact.vehicleSlug }).from(inboundContact).where(inArray(inboundContact.source, ENQUIRY_SOURCES)).limit(5000),
    depositRows(),
  ]);
  return { lines: funnelFrom(contacts, holdsFrom(deposits)), signal: contacts.filter((c) => c.source === "signal").length };
}
