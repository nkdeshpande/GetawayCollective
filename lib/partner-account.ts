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
import { vehicleBySlug } from "../constants/vehicles";
import { depositRows } from "./events/store";
import { holdsFrom, holdsOf, type Hold } from "./holds";
import { inboxFor, unreadFor, when, type InboxItem } from "./notices/inbox";

export interface PartnerAccount {
  readonly unread: number;
  /** Paid holds: the estate, the units and when the deposit was paid. */
  readonly holds: readonly { readonly estate: string; readonly units: number; readonly paid: string; readonly href: string | null }[];
  /** The three most recent notices: when, and the subject they were sent under. */
  readonly notices: readonly { readonly at: string; readonly subject: string; readonly unread: boolean }[];
}

export const EMPTY_ACCOUNT: PartnerAccount = { unread: 0, holds: [], notices: [] };

/** Pure: the summary from rows already read. Kept apart so it can be tested without a database. */
export function accountFrom(holds: readonly Hold[], inbox: readonly InboxItem[], unread: number): PartnerAccount {
  return {
    unread,
    holds: holds.map((h) => {
      const v = h.vehicleSlug ? vehicleBySlug(h.vehicleSlug) : undefined;
      return {
        estate: v?.propertyName ?? "An estate", units: h.units, paid: h.paidAt ? when(h.paidAt) : "",
        href: v ? `/reserve/${v.slug}#r=${h.reference}` : null,
      };
    }),
    notices: inbox.slice(0, 3).map((i) => ({ at: when(i.at), subject: i.subject, unread: i.unread })),
  };
}

export async function partnerAccount(address: string | null): Promise<PartnerAccount> {
  if (!address) return EMPTY_ACCOUNT;
  const [rows, inbox, unread] = await Promise.all([
    depositRows().catch(() => []), inboxFor(address, 3).catch(() => []), unreadFor(address).catch(() => 0),
  ]);
  return accountFrom(holdsOf(holdsFrom(rows), address), inbox, unread);
}
