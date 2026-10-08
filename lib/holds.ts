/**
 * HOLDS — a held slot, read from what was already recorded
 *
 * V2.0, 6 Oct 2026. A holding deposit has three moments and each is already
 * written down as an inbound contact (lib/deposit.ts, app/api/deposit):
 *
 *   deposit-intent    an order was opened at Razorpay; nothing is paid
 *   deposit-paid      the checkout signature was verified on this site
 *   deposit-captured  Razorpay's own webhook reported the money captured
 *
 * All three carry one reference (the correlation id). A hold is those
 * rows read together, so it needs no table of its own and nothing here can
 * disagree with the record: there is only the record.
 *
 * ── WHAT A HOLD IS NOT ────────────────────────────────────────
 * It is not a holding, a commitment or a position. It makes nobody a
 * partner (the Member Law). It says a deposit was taken against a number of
 * units, so that the next visitor is not offered the same ones.
 */

export interface DepositRow {
  readonly source: string;
  readonly note: string | null;
  readonly email: string;
  readonly vehicleSlug: string | null;
  readonly correlationId: string;
  readonly receivedAt: string | Date;
}

export type HoldStatus = "opened" | "paid";

export interface Hold {
  readonly reference: string;
  readonly vehicleSlug: string | null;
  readonly units: number;
  readonly status: HoldStatus;
  readonly orderId: string | null;
  readonly paymentId: string | null;
  readonly email: string;
  /** When the order was opened, and when the money was first seen. */
  readonly openedAt: string | null;
  readonly paidAt: string | null;
}

const DEPOSIT_SOURCES = new Set(["deposit-intent", "deposit-paid", "deposit-captured"]);
const line = (note: string | null, key: string): string | null => {
  const m = (note ?? "").match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return m ? m[1].trim() : null;
};
const iso = (d: string | Date): string => (d instanceof Date ? d.toISOString() : String(d));

/** Rows to holds, one per reference. Pure: the same rows always read the same. */
export function holdsFrom(rows: readonly DepositRow[]): Hold[] {
  const by = new Map<string, DepositRow[]>();
  for (const r of rows) {
    if (!DEPOSIT_SOURCES.has(r.source)) continue;
    by.set(r.correlationId, [...(by.get(r.correlationId) ?? []), r]);
  }
  const out: Hold[] = [];
  for (const [reference, group] of by) {
    const sorted = [...group].sort((a, b) => iso(a.receivedAt).localeCompare(iso(b.receivedAt)));
    const intent = sorted.find((r) => r.source === "deposit-intent");
    const paid = sorted.find((r) => r.source === "deposit-paid" || r.source === "deposit-captured");
    const first = <T,>(f: (r: DepositRow) => T | null): T | null => { for (const r of sorted) { const x = f(r); if (x !== null) return x; } return null; };
    const units = Number(first((r) => line(r.note, "Units")) ?? 0);
    out.push({
      reference,
      vehicleSlug: first((r) => r.vehicleSlug),
      units: Number.isInteger(units) && units > 0 ? units : 0,
      status: paid ? "paid" : "opened",
      orderId: first((r) => line(r.note, "Order")),
      paymentId: first((r) => line(r.note, "Payment")),
      email: (intent ?? sorted[0]).email,
      openedAt: intent ? iso(intent.receivedAt) : null,
      paidAt: paid ? iso(paid.receivedAt) : null,
    });
  }
  return out;
}

/** Units under a paid deposit at one estate: not available to the next visitor. */
/**
 * The paid holds opened under one address, newest first (V2.0, 8 Oct 2026).
 * For the signed-in person's own account: a sign-in proves the address, and
 * only a hold whose order was opened with it is theirs. An order opened and
 * never paid holds nothing, so it is not listed.
 */
export function holdsOf(holds: readonly Hold[], address: string): Hold[] {
  const a = address.toLowerCase().trim();
  if (!a) return [];
  return holds
    .filter((h) => h.status === "paid" && h.email.toLowerCase().trim() === a)
    .sort((x, y) => (y.paidAt ?? "").localeCompare(x.paidAt ?? ""));
}

export function heldUnits(holds: readonly Hold[], slug: string): number {
  return holds.filter((r) => r.status === "paid" && r.vehicleSlug === slug).reduce((n, r) => n + r.units, 0);
}

/** a••••@example.com — enough to recognise your own address, not enough to learn one. */
export function maskEmail(email: string): string {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "";
  return `${name.charAt(0)}${"•".repeat(Math.max(1, Math.min(6, name.length - 1)))}@${domain}`;
}

/** One night a year for each 1% of the estate held (founder, 6 Oct 2026). */
export function nightsFor(sharePct: number): number {
  return Math.floor(sharePct + 1e-9);
}
