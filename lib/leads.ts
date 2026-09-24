/**
 * LEAD DISPATCH — the two public forms, and nothing else.
 *
 * This is infrastructure, not a constitutional capability: it does not
 * touch a vehicle, a right, or a waterfall, so it is deliberately kept
 * out of lib/commands.ts rather than forced into that model to look
 * consistent with it.
 *
 * ── FAILS LOUDLY ──────────────────────────────────────────────────────
 * If RESEND_API_KEY is absent, sendLead() returns ok:false rather than
 * pretending the message went anywhere. A form that tells a prospective
 * partner "received" and then silently drops their email is worse than
 * one that is honest about not being wired up yet — this platform does
 * not show a false positive anywhere else, and a contact form is not the
 * place to start.
 */

import { senderAddress } from "../constants/sender";
import { z } from "zod";

export const SignalLead = z.object({
  email: z.string().trim().min(1).email(),
});
export type SignalLeadInput = z.infer<typeof SignalLead>;

export const DossierLead = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().min(1).email(),
  city: z.string().trim().max(120).optional(),
  /**
   * Which vehicle this is about. Optional because the request can also
   * arrive from /communique/request, which is about the collection rather
   * than any one vehicle.
   *
   * It matters for more than filing: a vehicle with nothing left takes a
   * WAITLIST, not an enquiry, and Investor Relations has to be able to tell
   * the two apart before they reply. The route derives that from the
   * register rather than trusting a flag on the request, because a caller
   * can send any flag they like.
   */
  vehicle: z.string().trim().max(64).optional(),
  /**
   * What the person wrote, and the topics they ticked. Optional, capped,
   * and passed through as text only: the site's enquiry form has a
   * question field, and without this the question was dropped on the
   * floor while the page said it had been received. Added 24 Sep 2026.
   */
  note: z.string().trim().max(2000).optional(),
});
export type DossierLeadInput = z.infer<typeof DossierLead>;

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "send-failed" };

export async function sendLead(opts: { to: string; subject: string; text: string }): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = senderAddress();

  if (!apiKey) {
    console.error(`[leads] RESEND_API_KEY is not set — dropped "${opts.subject}" intended for ${opts.to}`);
    return { ok: false, reason: "not-configured" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from, to: opts.to, subject: opts.subject, text: opts.text,
    });
    if (error) {
      console.error("[leads] Resend rejected the message:", error);
      return { ok: false, reason: "send-failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[leads] Resend threw:", err);
    return { ok: false, reason: "send-failed" };
  }
}
