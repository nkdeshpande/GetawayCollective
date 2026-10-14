/**
 * THE MORNING CLOCK — notices that fire on time passing
 *
 * Founder rulings of 15 Oct 2026 (GC-08-DS-001, D-02 and D-04):
 *
 *   N-18  an order opened at least 12 hours ago, unpaid, under a week old:
 *         one reminder to the person, and never a second
 *   O-06  a hold paid 21 days ago or more: one line to the desk, once
 *   quiet hours run 21:00 to 08:00 India time; the clock runs at 08:00
 *
 * It runs from the daily job (app/api/cron/notices). Every message goes
 * through the outbox under a key that can exist once, so a second run on
 * the same day, or any later day, sends nothing twice. KYC is never chased
 * (founder, 8 Oct 2026): nothing here mentions it.
 */
import { VEHICLES } from "../../constants/vehicles";
import { SPECIMEN_CONTEXT } from "../../content/notifications";
import { renderForSend } from "../email/send";
import { depositRows } from "../events/store";
import { holdsFrom, type Hold } from "../holds";
import { dedupeKey, dispatch } from "./outbox";

const HOUR = 3_600_000, DAY = 24 * HOUR;

/** Pure: which holds are due a reminder, and which the desk should hear about. */
export function dueOnTheClock(holds: readonly Hold[], now: Date): { unpaid: Hold[]; stalled: Hold[] } {
  const age = (iso: string | null) => (iso ? now.getTime() - Date.parse(iso) : -1);
  return {
    unpaid: holds.filter((h) => h.status === "opened" && age(h.openedAt) >= 12 * HOUR && age(h.openedAt) < 7 * DAY && !!h.vehicleSlug && h.units > 0),
    stalled: holds.filter((h) => h.status === "paid" && age(h.paidAt) >= 21 * DAY),
  };
}

export async function runClock(now: Date = new Date()): Promise<{ reminded: number; desk: number }> {
  const { unpaid, stalled } = dueOnTheClock(holdsFrom(await depositRows().catch(() => [])), now);
  let reminded = 0, desk = 0;
  for (const h of unpaid) {
    const v = VEHICLES.find((x) => x.slug === h.vehicleSlug);
    if (!v) continue;
    const mail = renderForSend("N-18", { ...SPECIMEN_CONTEXT, hold: { estate: v.propertyName, slug: v.slug, payee: v.registeredName, units: h.units, payment: "", reference: h.reference } });
    if (!mail.ok) continue;
    const out = await dispatch({
      key: dedupeKey("N-18", h.reference, h.email), noticeId: "N-18", to: h.email,
      audience: mail.audience, urgency: mail.urgency, subject: mail.subject, text: mail.text, html: mail.html, replyTo: mail.replyTo,
    }, now).catch(() => null);
    if (out && (out.outcome === "sent" || out.outcome === "queued")) reminded++;
  }
  const to = process.env.DOSSIER_LEAD_EMAIL ?? "communique@getawaycollective.co";
  for (const h of stalled) {
    const v = VEHICLES.find((x) => x.slug === h.vehicleSlug);
    const out = await dispatch({
      key: dedupeKey("O-06", h.reference, to), noticeId: "O-06", to, audience: "office", urgency: "normal",
      subject: `A hold paid 21 days ago - ${v?.propertyName ?? "estate not named"}`,
      text: `This hold was paid 21 or more days ago. Decide with the person whether to continue, extend or refund.\n\n` +
        `Reference: ${h.reference}\nUnits: ${h.units}\nPaid: ${h.paidAt}\nPayer: ${h.email}`,
    }, now).catch(() => null);
    if (out && (out.outcome === "sent" || out.outcome === "queued")) desk++;
  }
  return { reminded, desk };
}
