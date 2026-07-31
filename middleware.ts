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
 * — /how-capital-works and /legal/risk-disclosure in (capital), because
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
 * ── IT FAILS CLOSED ──────────────────────────────────────────────────
 * `resolveSubject()` returns ANONYMOUS because authentication is not
 * built, so every non-public surface denies. That is the correct
 * behaviour for an unfinished system: a guard that admitted everyone
 * while the session was pending would ship, because it would work and
 * nothing would complain.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canReach, denialRoute } from "@/lib/access";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const verdict = canReach(pathname);

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

  const res = NextResponse.rewrite(url);

  /* The status is honest even though the body is a rewrite. A 200 on a
     refused request tells caches and crawlers the page is fine. */
  return new NextResponse(res.body, {
    status: to === "/404" ? 404 : 403,
    headers: res.headers,
  });
}

export const config = {
  /* Everything except Next's own assets. The guard has to see a request
     to decide on it, and an exclusion list is where a hole gets added by
     someone in a hurry — so this one covers only paths that cannot carry
     a surface. */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
