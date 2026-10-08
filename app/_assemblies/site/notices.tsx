/**
 * YOUR NOTICES — what this site has sent to the person signed in
 *
 * V2.0, 8 Oct 2026 · GC-08-DS-001, step 3. /notices (GC-907).
 *
 * The outbox written back to its reader (lib/notices/inbox.ts): every
 * message sent to the address they signed in with, newest first, in the
 * words it was sent in, with whether the mail went. Under it, the notices
 * they may decline, and a plain statement of the ones they may not.
 *
 * A notice is a record, so nothing here can be deleted or dismissed. Opening
 * the page is what reads them: the browser says so once it has drawn
 * (./notices-wire.ts), never the server while rendering, so a link that is
 * only prefetched reads nothing.
 */
import { choicesFor, inboxFor, stateLabel, when } from "@/lib/notices/inbox";
import { currentAddress } from "@/lib/session";
import { TXT, esc, fill } from "./render";
import type { Block, SitePage } from "./types";

export async function SiteNotices() {
  const address = await currentAddress();
  /* Middleware refuses anyone not signed in; an address is still required to match on. */
  const [items, choices] = address
    ? await Promise.all([inboxFor(address).catch(() => []), choicesFor(address).catch(() => [])])
    : [[], []];
  const unread = items.filter((i) => i.unread).length;

  const list = items.length
    ? items.map((i) =>
        `<article class="ntc-item"${i.unread ? " data-unread" : ""}>` +
        `<span class="eb">${esc(when(i.at))} · ${esc(stateLabel(i.state))}${i.unread ? " · New" : ""}</span>` +
        `<h3>${esc(i.subject)}</h3><p class="ntc-body">${esc(i.text)}</p></article>`).join("")
    : '<p class="ntc-none">Nothing has been sent to this address yet. When something is, it is kept here as well as sent by email.</p>';

  const prefs =
    '<div class="ntc-prefs"><span class="eb">What you receive</span>' +
    choices.map((c) =>
      `<label class="ack"><input type="checkbox" data-ntc-pref="${esc(c.noticeId)}"${c.allowed ? " checked" : ""}><span> ${esc(c.label)}</span></label>`).join("") +
    '<p class="ntc-note" data-ntc-said role="status"></p>' +
    '<p class="ntc-note">Receipts for money, settlement, votes, distributions, changes to the standing documents and security notices are always sent. They cannot be switched off.</p></div>';

  const P = {
    key: "notices", path: "/notices", next: null,
    eyebrow: "Your account", title: "Your <span>notices.</span>",
    lead: items.length
      ? `Everything this site has sent to your address, newest first${unread ? `. ${unread} new` : ""}.`
      : "Everything this site sends to your address is kept here.",
    blocks: [
      { html: `<div class="ntc" data-ntc="${unread}"><div class="ntc-list">${list}</div>${prefs}</div>` },
      { links: [["The collection", "/collection"] as const, ["Write to Investor Relations", "/contact"] as const] },
    ] as Block[],
  } as unknown as SitePage;
  return <div className="pg" dangerouslySetInnerHTML={{ __html: fill(TXT(P)) }} />;
}
