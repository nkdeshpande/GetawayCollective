/**
 * EMAIL RENDERING — a Notice becomes a message
 *
 * ── WHY THE COPY IS NOT WRITTEN HERE ─────────────────────────────────
 * It is already written. content/notifications.ts holds N-01…N-17, each
 * with a `render(ctx)` producing a title, body, facts, confidence class
 * and links — and its own header states the reason plainly: the feed, the
 * specimen page and the email sender all call the same template, so the
 * in-product copy and the mail copy cannot drift.
 *
 * This module adds no words. It takes a rendered Notice and puts it in an
 * envelope. If the wording is wrong, it is wrong in one place.
 *
 * ── WHY THERE ARE HEX LITERALS BELOW ─────────────────────────────────
 * Email clients do not support CSS custom properties. Gmail strips most
 * of a <style> block, Outlook renders through Word, and neither has ever
 * resolved a var(). An email that themed itself from tokens at runtime
 * would arrive unstyled.
 *
 * So the values are inlined — but IMPORTED from constants/tokens.ts, not
 * typed. §29 says a colour may not enter the application without passing
 * token-lint; the spirit of that is one source of truth, and this honours
 * it. Changing `COLOUR.hazard` changes the email. token-lint does not scan
 * lib/email (its dirs are components, app, lib/ui, packages), so nothing
 * here is exempted by pragma — it simply is not in scope, and deriving
 * the values rather than typing them is what keeps that honest.
 *
 * ── EVERY MESSAGE CARRIES A PLAIN-TEXT PART ──────────────────────────
 * Not politeness. A message with no text/plain alternative is scored as
 * likely spam by most filters, and an investor notice landing in junk is
 * a notice that was not delivered. The text part is generated from the
 * same Notice, so it cannot say something different from the HTML.
 */

import { COLOUR } from "../../constants/tokens";
import type { Notice } from "../../content/notifications";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://getawaycollective.co").replace(/\/+$/, "");

/** Escape before interpolation. A property name is content, not markup. */
const esc = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Relative route to absolute. A link in an inbox has no origin to resolve against. */
const abs = (to: string): string => (to.startsWith("http") ? to : `${BASE}${to}`);

/**
 * The confidence mark, carried into the inbox.
 *
 * A forward figure that loses its class on the way out of the product is
 * a figure the reader will take as settled. UX-05 does not stop at the
 * browser, and a distribution notice is exactly where it matters.
 */
const CONF_LABEL: Record<string, string> = {
  VERIFIED: "Verified",
  CORROBORATED: "Corroborated",
  REPORTED: "Reported",
  INFERRED: "Inferred",
  FORECAST: "Forecast — a modelled figure, not a settled one",
  UNKNOWN: "Unknown",
};

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export function renderNotice(notice: Notice, opts: { preheader?: string } = {}): RenderedEmail {
  const subject = notice.title;

  /* The preheader is the grey line an inbox shows after the subject. Left
     empty it fills with whatever markup comes first, which is usually the
     unsubscribe link or a table tag. */
  const preheader = opts.preheader ?? notice.body[0] ?? "";

  const facts = (notice.facts ?? [])
    .map(
      (f) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${COLOUR.steelDim}33;font:400 12px/1.4 monospace;letter-spacing:.08em;text-transform:uppercase;color:${COLOUR.steelOnPaper};">${esc(f.k)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${COLOUR.steelDim}33;font:${f.money ? "600" : "400"} 15px/1.4 -apple-system,Segoe UI,sans-serif;color:${COLOUR.ink};text-align:right;${f.money ? "font-variant-numeric:tabular-nums;" : ""}">${esc(String(f.v))}</td>
      </tr>`,
    )
    .join("");

  const links = (notice.links ?? [])
    .map(
      (l, i) => `
      <a href="${esc(abs(l.to))}" style="display:inline-block;margin:0 10px 10px 0;padding:12px 20px;font:400 14px/1 -apple-system,Segoe UI,sans-serif;text-decoration:none;${
        i === 0
          ? `background:${COLOUR.ink};color:${COLOUR.paper};`
          : `border:1px solid ${COLOUR.steelDim};color:${COLOUR.ink};`
      }">${esc(l.t)}</a>`,
    )
    .join("");

  const conf = notice.conf
    ? `<p style="margin:20px 0 0;font:400 12px/1.5 monospace;color:${COLOUR.steelOnPaper};">${esc(CONF_LABEL[notice.conf] ?? notice.conf)}</p>`
    : "";

  const html = `<!doctype html>
<html lang="en-IN"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOUR.paperPanel};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLOUR.paperPanel};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLOUR.paper};">

      <tr><td style="padding:28px 32px 0;">
        <p style="margin:0;font:400 11px/1 monospace;letter-spacing:.2em;text-transform:uppercase;color:${COLOUR.steelOnPaper};">Getaway Collective</p>
      </td></tr>

      <tr><td style="padding:20px 32px 0;">
        <h1 style="margin:0;font:600 26px/1.2 -apple-system,Segoe UI,sans-serif;letter-spacing:-.02em;color:${COLOUR.ink};">${esc(notice.title)}</h1>
      </td></tr>

      <tr><td style="padding:16px 32px 0;">
        ${notice.body.map((p) => `<p style="margin:0 0 12px;font:400 15px/1.6 -apple-system,Segoe UI,sans-serif;color:${COLOUR.ink};">${esc(p)}</p>`).join("")}
      </td></tr>

      ${facts ? `<tr><td style="padding:12px 32px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${facts}</table></td></tr>` : ""}

      ${conf ? `<tr><td style="padding:0 32px;">${conf}</td></tr>` : ""}

      ${links ? `<tr><td style="padding:24px 32px 0;">${links}</td></tr>` : ""}

      <tr><td style="padding:28px 32px 32px;">
        <p style="margin:0;font:400 12px/1.6 -apple-system,Segoe UI,sans-serif;color:${COLOUR.steelOnPaper};border-top:1px solid ${COLOUR.steelDim}33;padding-top:18px;">
          Getaway Collective is an investment platform. Capital is at risk and past performance is
          not a guide. This message reports a recorded outcome; it is not advice and it is not an
          offer.
        </p>
        <p style="margin:12px 0 0;font:400 12px/1.6 -apple-system,Segoe UI,sans-serif;color:${COLOUR.steelOnPaper};">
          <a href="${esc(abs("/legal/risk-disclosure"))}" style="color:${COLOUR.steelOnPaper};">Risk disclosure</a>
          &nbsp;·&nbsp;
          <a href="${esc(abs("/legal/privacy"))}" style="color:${COLOUR.steelOnPaper};">Privacy</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  /* Generated from the same Notice, so the two parts cannot disagree. */
  const text = [
    "GETAWAY COLLECTIVE",
    "",
    notice.title,
    "",
    ...notice.body,
    ...(notice.facts?.length ? ["", ...notice.facts.map((f) => `${f.k}: ${f.v}`)] : []),
    ...(notice.conf ? ["", CONF_LABEL[notice.conf] ?? notice.conf] : []),
    ...(notice.links?.length ? ["", ...notice.links.map((l) => `${l.t}: ${abs(l.to)}`)] : []),
    "",
    "—",
    "Getaway Collective is an investment platform. Capital is at risk and past",
    "performance is not a guide. This message reports a recorded outcome; it is",
    "not advice and it is not an offer.",
    `Risk disclosure: ${abs("/legal/risk-disclosure")}`,
  ].join("\n");

  return { subject, html, text };
}
