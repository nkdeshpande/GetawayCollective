/**
 * WHO GC SENDS AS
 *
 * ── WHY THIS IS A CONSTANT AND NOT AN ENVIRONMENT VARIABLE ───────────
 * It was `process.env.RESEND_FROM ?? "Getaway Collective
 * <onboarding@resend.dev>"`, repeated in three files. That default is
 * Resend's SANDBOX sender: it delivers only to the Resend account
 * owner's own address and rejects every other recipient.
 *
 * The failure lands at send time rather than at configuration time, so
 * everything reads as wired — the provider attaches, the health check
 * goes green, the founder tests it and receives the link — and the first
 * real person to sign in simply never gets anything. That is the worst
 * shape a defect can have: it works for whoever is checking.
 *
 * It happened here. RESEND_API_KEY was set, RESEND_FROM was not, and
 * production reported magicLinkSignIn: true while being unable to reach
 * anybody but one mailbox.
 *
 * The address is not a secret and not per-deployment. It is a fact about
 * Getaway Collective, exactly like the reply-to addresses that have
 * always been in lib/email/send.ts. Facts about GC belong in the
 * codebase, where they are reviewed, tested and deployed atomically with
 * the code that uses them — not in a console field that one person has
 * to remember to fill in.
 *
 * ── THE OVERRIDE STAYS, AND IS NOW ONLY AN OVERRIDE ──────────────────
 * RESEND_FROM still wins where it is set, which a fork or a staging
 * domain needs. What it no longer does is decide whether mail works at
 * all.
 *
 * ── THE DOMAIN ───────────────────────────────────────────────────────
 * getawaycollective.co was verified in Resend on 3 Aug 2026 with DKIM
 * and SPF. hello@ is the general address the founder confirmed, and is a
 * real mailbox rather than one invented for this constant — a sign-in
 * link that cannot be replied to is a small cruelty.
 */

export const SENDER = "Getaway Collective <hello@getawaycollective.co>";

/**
 * The sender this deployment will actually use.
 *
 * One place resolves it, so the three call sites cannot drift and no
 * future one can reintroduce the sandbox default by copying a line.
 */
export const senderAddress = (): string => process.env.RESEND_FROM?.trim() || SENDER;

/**
 * True when the resolved sender can only reach the account owner.
 *
 * Kept as a check rather than assumed away: somebody can still SET
 * RESEND_FROM to a resend.dev address, and the health endpoint should
 * say so rather than trusting that the constant saved us.
 */
export const isSandboxSender = (): boolean => senderAddress().includes("resend.dev");
