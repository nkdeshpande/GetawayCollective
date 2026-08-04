/**
 * THE GROUP GUARD — hand-written, not generated
 *
 * Wave 7 · Workspaces
 *
 * Runs in the layout of every route group, so a page added by hand inside
 * a group is still gated. That is the point of putting it here rather than
 * in each page: the generator can only protect the files it writes, and
 * the guard has to protect the ones it does not.
 *
 * ── IT FAILS CLOSED ──────────────────────────────────────────────────
 * No session means the ANONYMOUS subject, and every non-public group
 * denies. That did not change when authentication landed: there is still
 * no branch here that admits anyone because something was absent.
 *
 * The denial is visible rather than silent, so the state is obvious in
 * development instead of being discovered in production.
 *
 * ── THIS READ IS THE AUTHORITATIVE ONE ───────────────────────────────
 * `currentSubject()` re-reads the grant table rather than trusting the
 * token's snapshot, so a revocation lands here on the very next request
 * even while a 30-minute token still claims otherwise. Middleware is the
 * fast boundary; this is the true one.
 */

import Link from "next/link";
import { ACCESS_FOR_VANTAGE, GROUP_VANTAGE, ACCESS_RANK } from "@/constants/routes";
import type { RouteGroup } from "@/constants/layout";
import { accessOfSubject } from "@/lib/access";
import { currentSubject } from "@/lib/session";
import { IrisPanel } from "@/app/_assemblies/iris";

/**
 * Defence in depth, deliberately weaker than the middleware.
 *
 * This can only see the GROUP, and an access override belongs to a ROUTE
 * — which is why the first version of this denied /legal/risk-disclosure
 * and /collection/slowspace-coastal/investment, both public by override
 * inside (capital). The
 * real decision now happens in middleware.ts, which sees the pathname.
 *
 * It stays because middleware can be misconfigured and a matcher can grow
 * a hole. If both are bypassed the surface still refuses, and it refuses
 * on the group's rule rather than on nothing.
 *
 * `respectsOverride` is how a generated layout says "middleware already
 * approved a route in this group that the group itself would refuse".
 */
export async function GroupGuard({
  group,
  respectsOverride = true,
  children,
}: {
  group: RouteGroup;
  respectsOverride?: boolean;
  children: React.ReactNode;
}) {
  const required = ACCESS_FOR_VANTAGE[GROUP_VANTAGE[group]];
  const subject = await currentSubject();
  const held = accessOfSubject(subject);

  /*
   * IRIS mounts here rather than in the Footer, and the reason is the
   * group.
   *
   * AI-101's realm is "GC-*" — the public surface. The Footer renders on
   * every screen including the Office, and an agent that answers "what is
   * the minimum commitment" has no business floating over a governance
   * ledger. GroupGuard is the only hand-written component that knows
   * which realm it is in, so it is the only correct mount point.
   *
   * ATLAS is deliberately NOT mounted globally anywhere. It produces
   * findings about a named vehicle for a named owner, so it belongs on
   * that vehicle's screen and nowhere else.
   */
  const withIris = (
    <>
      {children}
      {group === "gateway" ? <IrisPanel /> : null}
    </>
  );

  if (respectsOverride) return withIris;
  if (ACCESS_RANK[held] >= ACCESS_RANK[required]) return withIris;

  /* 403 states that the viewer may not see it. It never says whether the
     thing exists — the difference between "no" and "not for you" is the
     shape of the system, handed to anyone probing it. */
  return (
    <main className="gate">
      <p className="eyebrow">Not available to you</p>
      <h1>You are signed out.</h1>
      <p className="lede">
        This part of the platform needs {label(required)}. Sign in and it will be here if it is
        yours.
      </p>

      <div className="gate-actions">
        <Link className="btn primary" href="/sign-in">
          Sign in
        </Link>
        <Link className="btn" href="/">
          Back to the collection
        </Link>
      </div>
    </main>
  );
}

function label(a: string): string {
  switch (a) {
    case "identified":
      return "you to be signed in";
    case "accredited":
      return "completed accreditation";
    case "member":
      return "a settled position";
    case "office":
      return "an office of the platform";
    default:
      return "nothing";
  }
}
