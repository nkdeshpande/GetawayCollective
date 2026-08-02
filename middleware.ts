/**
 * THE ACCESS GUARD — hand-written, not generated
 *
 * Wave 7 · Workspaces
 *
 * ── WHY IT LIVES HERE AND NOT IN A LAYOUT ────────────────────────────
 * The first version guarded in each route-group layout, which put it at
 * the wrong granularity: a layout knows its GROUP, and an access override
 * belongs to a ROUTE.
 *
 * Three routes are public by override while sitting in non-public groups
 * — /collection/[vehicle]/investment and /legal/risk-disclosure in
 * (capital), because
 * the waterfall explainer and the risk disclosure are the two documents a
 * prospective investor most needs before deciding anything. The group
 * guard denied all three. It was enforcing the right rule against the
 * wrong subject.
 *
 * Middleware sees the actual pathname, so it resolves the actual route and
 * honours the actual override. It also covers pages nobody generated: an
 * unmatched path is denied rather than served, so a hand-added page.tsx
 * inside a guarded tree does not quietly become a public URL.
 *
 * ── IT STILL FAILS CLOSED ────────────────────────────────────────────
 * Authentication is wired now, and the failure mode did not change. No
 * session means the ANONYMOUS subject, and every non-public surface
 * denies. A thrown token decode means the same. There is no branch here
 * that admits anyone on the strength of something being absent.
 *
 * ── WHAT THIS TRUSTS, AND WHAT IT DOES NOT ───────────────────────────
 * The subject is built from the signed JWT — a claim the server minted
 * and signed, not anything the browser can author. But it is a SNAPSHOT:
 * it was stamped when the token was issued, so a grant revoked one minute
 * ago may still appear here for up to the 30-minute token life.
 *
 * That is why this is not the last word. lib/session.ts re-reads the
 * grant table on every server render, and that read is authoritative. The
 * staleness therefore runs in the safe direction only — the edge may
 * admit someone the page then refuses; it can never let them past the
 * page itself.
 */

import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import { canReach, denialRoute, ANONYMOUS } from "@/lib/access";
import type { Subject } from "@/lib/access";
import type { Right } from "@/lib/authority";

const { auth } = NextAuth(authConfig);

/**
 * The session claim, as the guard's own vocabulary.
 *
 * `accredited` and `member` come from the coarse class rather than being
 * inferred from the presence of a session — see the jwt callback in
 * auth.ts for why neither is provable at sign-in today.
 */
function subjectFrom(session: unknown): Subject {
  const u = (session as { user?: { access?: string; rights?: string[] } } | null)?.user;
  if (!u) return ANONYMOUS;

  const access = u.access ?? "identified";
  return Object.freeze({
    identified: true,
    accredited: access === "accredited" || access === "member" || access === "office",
    member: access === "member" || access === "office",
    rights: Object.freeze((u.rights ?? []) as Right[]) as readonly Right[],
  });
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const verdict = canReach(pathname, subjectFrom(req.auth));

  if (verdict.ok) return NextResponse.next();

  const to = denialRoute(verdict);

  /* REWRITE, not redirect.
     A redirect writes the denied path AND the destination into browser
     history, so "I was refused /admin/failure" survives in a place the
     viewer does not control. A rewrite serves the denial at the URL that
     was asked for and leaves no trail. */
  const url = req.nextUrl.clone();
  url.pathname = to;
  url.search = "";

  /* The one exception to clearing the query. Sending someone to sign in
     and then dumping them on the home page is a dark pattern by neglect,
     and the destination here is the viewer's OWN path — it is not
     disclosure, and the rewrite means it never enters history anyway.
     Only ever set for /sign-in, and only ever a same-origin path. */
  if (to === "/sign-in") url.searchParams.set("from", pathname);

  const res = NextResponse.rewrite(url);

  /* The status is honest even though the body is a rewrite. A 200 on a
     refused request tells caches and crawlers the page is fine. */
  return new NextResponse(res.body, {
    status: to === "/404" ? 404 : 403,
    headers: res.headers,
  });
});

export const config = {
  /* Everything except Next's own assets. The guard has to see a request
     to decide on it, and an exclusion list is where a hole gets added by
     someone in a hurry — so this one covers only paths that cannot carry
     a surface.
     images / icon / apple-icon / opengraph-image are the same category as
     favicon.ico: framework-owned metadata routes, generated at build
     time from app/icon.tsx and friends, present at these exact literal
     paths and nowhere in constants/routes.ts. Without this exclusion the
     guard treats each as an undeclared route and 404s it — found by
     actually requesting them against the production build, not by
     reading the matcher and assuming it was complete.

     /api is excluded for a different reason, and it is a real widening
     that deserves stating plainly. constants/routes.ts models SURFACES —
     things a person navigates to — and has no vocabulary for an
     endpoint. Passing /api through canReach() therefore 404s every
     route handler, including the two public lead-capture endpoints.

     It is also what makes /api/auth/* reachable, which it has to be:
     everybody is anonymous until the sign-in handshake answers, so a
     guard that denied the endpoint would deny the only way to stop being
     anonymous. Auth.js authorises those requests itself — signed state,
     CSRF token, provider signature.

     The consequence: an API route is NOT protected by this guard. Each
     one is responsible for its own authorisation, and the two that
     exist today (/api/signal, /api/dossier) are deliberately public —
     they accept an email address and send it onward, nothing more.
     Any future endpoint touching a vehicle, a right or money must call
     authorise() from lib/authority.ts itself. That is a rule a person
     has to keep rather than one the matcher keeps for them, which is
     exactly the kind of rule that gets broken — so it is written here,
     at the place where the exemption is granted. */
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|icon|apple-icon|opengraph-image).*)",
  ],
};
