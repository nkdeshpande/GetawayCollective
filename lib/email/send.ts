/**
 * SENDING A NOTICE
 *
 * ── IT REFUSES TO SEND A NOTICE THAT IS NOT WIRED ────────────────────
 * `NoticeSpec.wired` is false for sixteen of the seventeen, and the
 * catalogue's own header explains why the flag exists: a notification
 * surface that looked live while nothing generated events would be the
 * platform lying about its own state.
 *
 * The same applies with more force to email. A specimen rendered on a
 * page is a specimen; the same specimen in somebody's inbox is a claim
 * about their money. So sending one that is not wired is refused here
 * rather than trusted to the caller.
 *
 * `preview()` exists for exactly that case — render it, look at it, do
 * not post it.
 *
 * ── AND IT REFUSES A CHANNEL THE NOTICE DOES NOT DECLARE ─────────────
 * Some notices are product-only by design. `channels` says which apply,
 * and a notice never meant for email does not become one because a
 * caller passed an address.
 *
 * ── DELIVERY IS RECORDED, OR THE SEND DID NOT HAPPEN ─────────────────
 * LG-10's exit condition is a delivery record, not a sent message. This
 * returns what happened rather than a boolean, so a caller can write it
 * down. Nothing here writes to the event log yet — the notice delivery
 * table is the next piece, and pretending otherwise would repeat the
 * mistake this module refuses to make.
 */

import { noticeById, SPECIMEN_CONTEXT } from "../../content/notifications";
import type { SpecimenContext } from "../../content/notifications";
import { renderNotice } from "./render";
import type { RenderedEmail } from "./render";

export type SendOutcome =
  | { ok: true; id: string; to: string; providerId?: string }
  | { ok: false; id: string; reason:
      | "unknown-notice"
      | "not-wired"
      | "not-an-email-notice"
      | "not-configured"
      | "send-failed";
      detail?: string };

/**
 * Render a notice without sending it.
 *
 * The only way to look at a specimen safely. Takes the same context the
 * product feed uses, so what you see is what an inbox would get.
 */
export function preview(noticeId: string, ctx: SpecimenContext = SPECIMEN_CONTEXT): RenderedEmail | null {
  const spec = noticeById(noticeId);
  if (!spec) return null;
  return renderNotice(spec.render(ctx));
}

export async function sendNotice(
  noticeId: string,
  to: string,
  ctx: SpecimenContext = SPECIMEN_CONTEXT,
): Promise<SendOutcome> {
  const spec = noticeById(noticeId);
  if (!spec) return { ok: false, id: noticeId, reason: "unknown-notice" };

  if (!spec.channels.includes("email")) {
    return { ok: false, id: noticeId, reason: "not-an-email-notice" };
  }

  /* The guard that matters. Sixteen of seventeen are specimens, and a
     specimen in an inbox is a false statement about somebody's money. */
  if (!spec.wired) {
    return {
      ok: false,
      id: noticeId,
      reason: "not-wired",
      detail:
        `${noticeId} is a specimen — nothing generates its event yet. Use preview() to look at it. ` +
        `Set wired:true in content/notifications.ts only when a real event fires it.`,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`[email] RESEND_API_KEY is not set — dropped ${noticeId} intended for ${to}`);
    return { ok: false, id: noticeId, reason: "not-configured" };
  }

  const { subject, html, text } = renderNotice(spec.render(ctx));
  const from = process.env.RESEND_FROM ?? "Getaway Collective <onboarding@resend.dev>";

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({ from, to, subject, html, text });
    if (error) {
      console.error(`[email] Resend rejected ${noticeId}:`, error);
      return { ok: false, id: noticeId, reason: "send-failed", detail: String(error.message ?? error) };
    }
    return { ok: true, id: noticeId, to, providerId: data?.id };
  } catch (err) {
    console.error(`[email] Resend threw on ${noticeId}:`, err);
    return {
      ok: false,
      id: noticeId,
      reason: "send-failed",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
