/**
 * AUTH — the full configuration
 *
 * Server-only. middleware.ts must import auth.config.ts instead: this
 * file reaches for Postgres, which the Edge runtime cannot give it.
 *
 * ── TWO WAYS IN, AND WHY BOTH ────────────────────────────────────────
 * Google covers everyone who has one and makes the first sign-in a single
 * click. The magic link covers everyone who does not — an Indian family
 * office is not reliably on Google Workspace, and requiring it would gate
 * the platform on a vendor relationship nobody agreed to.
 *
 * Neither is a password. There is no password column in lib/auth/schema.ts
 * and there should not be one: a password is a credential this platform
 * would then be responsible for storing, rotating, breaching and
 * disclosing, in exchange for a worse experience than either option here.
 *
 * ── DEGRADING WITHOUT A DATABASE ─────────────────────────────────────
 * `DATABASE_URL` is not set in this repository yet.
 *
 *   Google      works. OAuth with a JWT session needs no adapter.
 *   Magic link  does NOT. A verification token has to be written down
 *               somewhere before it can be checked, and a link that
 *               cannot be verified is not a weaker login, it is a
 *               non-functional one.
 *
 * So the Resend provider is attached only when there is somewhere to
 * persist to. It disappears from the sign-in page rather than appearing
 * and failing, because an auth control that throws after the user commits
 * their address is worse than one that was never offered.
 */

import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import authConfig from "./auth.config";
import type { TokenAccess } from "./auth.config";
import { authDb } from "./lib/auth/db";
import { users, accounts, sessions, verificationTokens } from "./lib/auth/schema";
import { grantsFor, accessFromGrants, rightsFrom, ensureBootstrapGrant } from "./lib/auth/grants";

const db = authDb();

const emailProvider =
  db && process.env.RESEND_API_KEY
    ? [
        Resend({
          apiKey: process.env.RESEND_API_KEY,
          from: process.env.RESEND_FROM ?? "Getaway Collective <onboarding@resend.dev>",
        }),
      ]
    : [];

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: db
    ? DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      })
    : undefined,

  providers: [...authConfig.providers, ...emailProvider],

  callbacks: {
    ...authConfig.callbacks,

    /**
     * Stamp the coarse access class onto the token.
     *
     * Runs in the Node runtime — on sign-in and on every token rotation —
     * never on the edge, which is why it may read the database at all.
     *
     * `accredited` and `member` are NOT decided here, and deliberately
     * return `identified` instead of guessing. Both are properties of an
     * institutional record: accreditation is the PR-01 outcome, and the
     * Member Law fires on SETTLEMENT, not on sign-in. Neither record
     * exists yet. Inferring either from the presence of a session would
     * put a signed-in stranger on a member surface, so this stops at what
     * it can actually prove.
     */
    async jwt({ token, user, trigger }) {
      if (user?.id) token.sub = user.id;

      const id = token.sub;
      if (!id) {
        token.access = "identified" satisfies TokenAccess;
        return token;
      }

      /* The allowlist runs only on a real sign-in, never on rotation, and
         is a no-op unless GC_OFFICE_BOOTSTRAP names this address. */
      if (user) await ensureBootstrapGrant(id, user.email ?? token.email);

      /* Re-read on sign-in and on every explicit session update. Between
         those, the 30-minute maxAge in auth.config.ts bounds staleness. */
      if (user || trigger === "update" || token.access === undefined) {
        const grants = await grantsFor(id);
        token.access = accessFromGrants(grants);
        /* The rights ride on the token so middleware reaches the SAME
           verdict the server will. Without them the edge would deny every
           office route for want of a right it cannot look up, and the
           page behind it would then allow — a disagreement between two
           guards is worse than either being wrong on its own.
           Bounded by the Right union in lib/authority.ts, so this cannot
           grow past a few hundred bytes of cookie. */
        token.rights = rightsFrom(grants);
      }
      return token;
    },
  },
});
