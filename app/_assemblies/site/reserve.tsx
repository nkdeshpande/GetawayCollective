/**
 * /reserve/[vehicle] — reserve a slot, in one place (GC-906), V2.0, 6 Oct 2026
 *
 * Founder: "a seamless investment and capital allocation, with
 * the ability to pay and reserve their slot." Until now the deposit form sat
 * at the foot of the enquiry page and a payer was told a reference and
 * nothing else. This page is the whole of it:
 *
 *   1. the slots: every unit offered, and which are free
 *   2. the allocation: choose units and see the capital, the share of the
 *      estate, the vote, the nights, what is paid today and what is left
 *   3. the payment: the same holding deposit, to the same LLP (lib/deposit.ts)
 *   4. the hold: its reference and where it stands, here and by email
 *
 * Every figure is the register's (constants/vehicles.ts). The units shown as
 * held are read from the deposit rows (lib/holds.ts). Nothing here
 * forecasts a return, and a hold makes nobody a partner.
 *
 * The status of a hold is opened with `#r=<reference>`: a fragment,
 * so the reference is not part of the page's address as a server or a
 * referrer sees it. The page then asks /api/deposit/status for it.
 */
import { notFound } from "next/navigation";
import { vehicleBySlug, stanceFor } from "@/constants/vehicles";
import { ESTATES } from "@/content/site/estates";
import { depositRows } from "@/lib/events/store";
import { heldUnits, nightsFor, holdsFrom } from "@/lib/holds";
import { TXT, esc, fill } from "./render";
import { fundingComplete, openReading, publicName, read, rupees, rupeesFull } from "./registry";
import type { Block, SitePage } from "./types";

const pctOf = (bps: number) => `${(bps / 100).toFixed(bps % 100 ? 1 : 0)}%`;

export async function SiteReserve({ vehicle: param }: { vehicle: string }) {
  const v = vehicleBySlug(param);
  if (!v) notFound();
  const E = Object.values(ESTATES).find((e) => e.slug === v.slug);
  const name = publicName(v);
  const R = read(v), o = v.offering;
  const stance = stanceFor(v);
  const open = stance.kind === "open" && o.deposit !== null && !fundingComplete(v.slug) && R.publishable;
  const base = { path: `/reserve/${v.slug}`, film: E ? ([E.pal, E.enquireHour || 18] as const) : undefined, img: E?.media?.enquire, next: null };

  /* ── an estate that cannot take a hold says so, and says where one can ── */
  if (!open) {
    const raising = openReading();
    const P = {
      ...base, key: `${v.key}-reserve`, eyebrow: `${esc(name)} · Reserve`, title: "Not open <span>to reserve.</span>",
      lead: `${esc(name)} cannot be reserved now: ${esc(R.availability.toLowerCase())}.` +
        (raising && raising.vehicle.slug !== v.slug ? ` ${esc(raising.name)} is open now.` : ""),
      blocks: [
        /* A hold already made here can still be looked up. */
        { html: '<div class="rsv" data-rsv="{}"><div class="rsv-status" data-rsv-status role="status" tabindex="-1" hidden></div></div>' },
        { links: [
          ...(raising && raising.vehicle.slug !== v.slug ? [[`Reserve at ${esc(raising.name)}`, `/reserve/${raising.vehicle.slug}`, "lead"] as const] : []),
          [`Back to ${esc(name)}`, `/collection/${v.slug}`] as const, ["The collection", "/collection"] as const,
        ] },
      ] as Block[],
    } as unknown as SitePage;
    return <div className={`pg${P.img ? " pg-col" : ""}`} dangerouslySetInnerHTML={{ __html: fill(TXT(P)) }} />;
  }

  const held = Math.min(stance.unitsAvailable, heldUnits(holdsFrom(await depositRows(v.slug).catch(() => [])), v.slug));
  const free = stance.unitsAvailable - held;
  const taken = o.units - stance.unitsAvailable;                 // subscribed in the register
  const deposit = o.deposit!;
  const rows = Array.from({ length: Math.max(1, free) }, (_, i) => {
    const u = i + 1, capital = o.unitPrice * BigInt(u);
    const bps = Number((capital * 10000n) / o.totalEquity);
    return { u, capital: rupees(capital), share: pctOf(bps), nights: String(nightsFor(bps / 100)), balance: rupees(capital > deposit ? capital - deposit : 0n) };
  });
  const first = rows[0];
  const cells = Array.from({ length: o.units }, (_, i) =>
    i < taken ? "sub" : i < taken + held ? "held" : "free");
  const data = esc(JSON.stringify({ slug: v.slug, estate: name, payee: v.registeredName, deposit: rupeesFull(deposit), taken, held, rows }));

  const tile = (k: string, label: string, value: string, note = "") =>
    `<div class="rsv-tile"><span class="eb">${label}</span><b data-rsv-f="${k}">${value}</b>${note ? `<em>${note}</em>` : ""}</div>`;
  const panel =
    `<div class="rsv" data-rsv="${data}">` +
    '<div class="rsv-status" data-rsv-status role="status" tabindex="-1" hidden></div>' +
    `<div class="rsv-slots"><div class="rsv-hd"><span class="eb">The slots</span><span class="mono">${o.units} units offered · ${free} free</span></div>` +
    `<div class="rsv-bar" role="img" aria-label="${o.units} units offered: ${taken} subscribed, ${held} held under a deposit, ${free} free">${cells.map((c) => `<i class="${c}"></i>`).join("")}</div>` +
    '<div class="rsv-key"><span><i class="you"></i>Yours</span><span><i class="free"></i>Free</span>' +
    (held ? '<span><i class="held"></i>Held under a deposit</span>' : "") + (taken ? '<span><i class="sub"></i>Subscribed</span>' : "") + "</div></div>" +
    (free > 0
      ? '<div class="rsv-pick"><span class="eb">Units you intend to take</span><div class="rsv-step" role="group" aria-label="Units">' +
        '<button type="button" data-rsv-d="-1" aria-label="One unit fewer">−</button>' +
        `<output data-rsv-f="u" aria-live="polite">1</output><span data-rsv-f="uw">unit</span>` +
        '<button type="button" data-rsv-d="1" aria-label="One unit more">+</button></div></div>' +
        '<div class="rsv-grid">' +
        tile("capital", "Your capital", first.capital, `at ${rupees(o.unitPrice)} a unit`) +
        tile("share", "Share of the estate", first.share, "your vote carries the same weight") +
        tile("nights", "Nights a year", first.nights, "one night for each 1% held, from handover") +
        tile("deposit", "Paid today", rupeesFull(deposit), "flat, whatever you take; refundable until you sign") +
        tile("balance", "Balance at signing", first.balance, "settled offline, with the Vehicle Agreement") +
        "</div>" +
        '<p class="rsv-note">Capital is at risk, and nothing here forecasts a return. The deposit holds your slot; it buys nothing on its own and makes nobody a partner.</p>'
      : '<p class="rsv-note">Every unit offered is now held under a deposit. Investor Relations can tell you if one is released.</p>') +
    "</div>";

  const blocks: Block[] = [
    { html: panel },
    ...(free > 0
      ? [{ h: "Reserve your slot" } as Block,
         { deposit: { vehicle: v.slug, payee: v.registeredName, incorporated: !!v.llpin, amount: rupeesFull(deposit), available: free, unitPrice: rupees(o.unitPrice) } } as Block]
      : []),
    { h: "What happens after you pay" },
    { steps: [
      ["Your slot is reserved", `The units you chose are held in your name at once. You see a reference on this page and receive it by email, with a link back to where your hold stands.`],
      ["KYC, alongside", "Investor Relations writes to you about identity checks. They run at your pace and are complete before you sign."],
      ["Read, then sign", `You receive the offering letter, the LLP agreement and the risk disclosure. If you go ahead, you sign the Vehicle Agreement and settle the balance with ${esc(v.registeredName)}.`],
      ["Or change your mind", "Until the Vehicle Agreement is signed, the deposit is refundable in full. Write to Investor Relations and it is returned."],
    ] },
    { rows: [
      ["Paid to", `${esc(v.registeredName)}${v.llpin ? "" : ", not yet incorporated"}. Getaway Collective holds none of it.`],
      ["Refund", "In full, until the Vehicle Agreement is signed"],
      ["Payment", "Card, UPI or netbanking through Razorpay. Payment details never reach this site."],
      ["Questions", '<span class="mono sel">ir@getawaycollective.co</span>'],
    ] },
    { links: [[`Back to ${esc(name)}`, `/collection/${v.slug}`], ["The investment", `/collection/${v.slug}/investment`], ["Risk", `/collection/${v.slug}/risk`], ["Ask first", `/collection/${v.slug}/enquire`]] },
  ];
  const P = {
    ...base, key: `${v.key}-reserve`, eyebrow: `${esc(name)} · Reserve`, title: "Reserve <span>your slot.</span>",
    lead: `Choose your units, see exactly what they are, and hold them with a ${rupeesFull(deposit)} deposit. Refundable in full until you sign.`,
    blocks,
  } as unknown as SitePage;
  return <div className={`pg${P.img ? " pg-col" : ""}`} dangerouslySetInnerHTML={{ __html: fill(TXT(P)) }} />;
}
