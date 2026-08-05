/**
 * GET /api/health — which configuration reached the running deployment
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────
 * Auth.js answers a missing secret with "There was a problem with the
 * server configuration. Check the server logs for more information." That
 * is the correct thing to tell the public and useless to the operator: it
 * is the same message whether the secret is absent, misnamed, scoped to
 * the wrong environment, or set and not redeployed.
 *
 * Diagnosing it otherwise means reading Vercel's function logs, which is
 * a round trip per guess. This turns it into one request.
 *
 * ── WHY IT IS SAFE TO LEAVE PUBLIC ───────────────────────────────────
 * It reports PRESENCE and nothing else. No values, no lengths, no
 * prefixes, no masked fragments — a length is a meaningful clue when a
 * secret has a known format, and a four-character prefix identifies a
 * provider.
 *
 * What it discloses is that a variable is unset, which the 500 already
 * discloses to anyone who asks for /api/auth/csrf. It tells an attacker
 * nothing they could not already infer, and it tells the operator the one
 * thing they cannot currently see.
 *
 * It sits under /api, so the route-table guard does not cover it — the
 * matcher excludes /api and each endpoint authorises itself. This one
 * needs no authorisation because it holds nothing worth authorising, and
 * it must keep working precisely when authentication does not.
 */

import { NextResponse } from "next/server";
import { senderAddress, isSandboxSender } from "@/constants/sender";

export const runtime = "nodejs";
/* Never cached. A cached health check reports the configuration of
   whenever it was cached, which is the one answer that must be current. */
export const dynamic = "force-dynamic";

/** True when the variable is set to something other than whitespace. */
const present = (name: string): boolean => Boolean(process.env[name]?.trim());

export async function GET() {
  const auth = {
    /* Auth.js v5 reads AUTH_SECRET. v4 read NEXTAUTH_SECRET, and a guide
       written for v4 is the commonest way to set the right value under the
       wrong name — so both are reported rather than only the one we use. */
    AUTH_SECRET: present("AUTH_SECRET"),
    NEXTAUTH_SECRET_legacy: present("NEXTAUTH_SECRET"),
    GOOGLE_CLIENT_ID: present("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: present("GOOGLE_CLIENT_SECRET"),
  };

  const data = {
    DATABASE_URL: present("DATABASE_URL"),
    /* The pooled endpoint is required on serverless. Reported as a shape
       fact, not a value: whether the host contains "-pooler". */
    DATABASE_URL_is_pooled: (process.env.DATABASE_URL ?? "").includes("-pooler"),
  };

  const mail = {
    RESEND_API_KEY: present("RESEND_API_KEY"),
    /* Was the commonest way this deployment broke silently: the Vercel
       integration injects the key and never this, so mail fell back to
       Resend's sandbox sender and reached one mailbox. The address is now
       a constant (constants/sender.ts) and this is an override. */
    /* An OVERRIDE now, not a requirement — constants/sender.ts carries
       the address. Reported so an operator can see whether one is in
       force, which matters when mail goes somewhere unexpected. */
    RESEND_FROM_override: present("RESEND_FROM"),
    RESEND_FROM_is_sandbox: isSandboxSender(),
  };

  const site = {
    NEXT_PUBLIC_SITE_URL: present("NEXT_PUBLIC_SITE_URL"),
    UPSTASH_REDIS_REST_URL: present("UPSTASH_REDIS_REST_URL"),
    GC_OFFICE_BOOTSTRAP: present("GC_OFFICE_BOOTSTRAP"),
  };

  /* What each capability needs, and whether it has it. This is the part
     an operator actually reads. */
  const canSignIn = auth.AUTH_SECRET;
  const canMagicLink = auth.AUTH_SECRET && data.DATABASE_URL && mail.RESEND_API_KEY;
  const canGoogle = auth.AUTH_SECRET && auth.GOOGLE_CLIENT_ID && auth.GOOGLE_CLIENT_SECRET;
  /* The KEY is the requirement; the sender is now guaranteed. This read
     `&& mail.RESEND_FROM`, so it went false whenever the variable was
     unset — which was correct then and would be a lie now. */
  const canReachRealRecipients = mail.RESEND_API_KEY && !mail.RESEND_FROM_is_sandbox;

  /**
   * Which deployment is answering, and what Vercel thinks it is.
   *
   * Without this, "I set the variable and it is still missing" has three
   * indistinguishable causes: not redeployed, scoped to the wrong
   * environment, or never saved. `env` settles the second — a variable
   * ticked for Preview only will read as missing here while `env` says
   * production — and `commit` settles the first, because a deployment
   * older than the change never saw it.
   *
   * All three values are Vercel's own build-time metadata. A commit SHA
   * is already public in the repository.
   */
  const deployment = {
    env: process.env.VERCEL_ENV ?? "local",
    commit: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7) || "unknown",
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? "unknown",
  };

  return NextResponse.json(
    {
      ok: canSignIn,
      deployment,
      capabilities: {
        authEndpointsRespond: canSignIn,
        magicLinkSignIn: canMagicLink,
        googleSignIn: canGoogle,
        emailReachesAnyRecipient: canReachRealRecipients,
        contactsPersist: data.DATABASE_URL,
        rateLimitIsDurable: site.UPSTASH_REDIS_REST_URL,
      },
      present: { ...auth, ...data, ...mail, ...site },
      /* The sender is not a secret and is the single most useful thing
         an operator can see when mail arrives from the wrong place. */
      sender: senderAddress(),
      note:
        "Presence only, except the sender address, which is public. " +
        "Environment changes require a redeploy before they reach a running deployment.",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
