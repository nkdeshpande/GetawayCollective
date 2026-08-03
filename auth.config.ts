/**
 * AUTH — the edge-safe half
 *
 * ── WHY THE CONFIG IS SPLIT IN TWO ───────────────────────────────────
 * middleware.ts runs on the Edge runtime, where there are no TCP sockets
 * and therefore no Postgres. The Drizzle adapter and the Resend provider
 * both reach for things the edge does not have, so importing the full
 * config into middleware fails at build time with an error that names a
 * transitive dependency rather than the real cause.
 *
 * This file holds only what the edge can run: the OAuth provider, the
 * session shape, and the pages. auth.ts adds the adapter, the magic-link
 * provider and the callback that reads authority from the database.
 *
 * ── WHAT THE TOKEN CARRIES, AND WHAT IT IS TRUSTED FOR ───────────────
 * The token carries a COARSE access class, stamped when it is issued.
 * Middleware gates on that and nothing more.
 *
 * It is deliberately not the last word. Authority can be revoked between
 * two requests, and a token minted before the revocation would still
 * claim it — so lib/session.ts re-reads grants from the database on every
 * server render and that reading is authoritative. Middleware is the fast
 * boundary; the server component is the true one. A stale token can
 * therefore admit someone to a page whose own guard then refuses them,
 * which is the safe direction for the error to run in.
 *
 * `maxAge` is 30 minutes to bound how long a stale claim can survive.
 */

import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

/** The coarse classes middleware can decide on. Mirrors `Access`. */
export type TokenAccess = "public" | "identified" | "accredited" | "member" | "office";

export const authConfig = {
  /* Trust the host header on Vercel, where the deployment URL varies per
     preview and AUTH_URL cannot be pinned to one value. */
  trustHost: true,

  session: { strategy: "jwt", maxAge: 30 * 60 },

  pages: {
    signIn: "/sign-in",
    verifyRequest: "/verify",
    error: "/sign-in",
  },

  /* Registered only when BOTH credentials are present.
     Auth.js will happily register a provider with `clientId: undefined`,
     and the result is a Continue-with-Google button that redirects into
     a Google error page. An absent provider is honest; a present one that
     cannot work is not. /sign-in reads this list from
     /api/auth/providers, so the button simply is not drawn.

     Google is edge-safe: a redirect handshake, no database.

     `allowDangerousEmailAccountLinking` stays OFF. With it on, anyone who
     can get Google to assert an address takes over the existing account
     for that address — precisely the takeover an investment platform
     cannot afford. */
  providers:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : [],

  callbacks: {
    /**
     * Copy the claims the token already holds onto the session.
     *
     * This runs on the edge, so it must not read anything. Every value
     * here was stamped by the `jwt` callback in auth.ts, which does have
     * a database.
     */
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? "";
        session.user.access = (token.access as TokenAccess) ?? "identified";
        session.user.rights = (token.rights as string[]) ?? [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
