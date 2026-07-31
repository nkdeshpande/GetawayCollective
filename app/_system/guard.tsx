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
 * `resolveSubject()` returns ANONYMOUS because authentication is not
 * built. That means every non-public group denies right now, and that is
 * the correct behaviour for an unfinished system — a guard that admitted
 * everyone while the session was pending would ship, because it works and
 * nothing complains.
 *
 * The denial is visible rather than silent, so the state is obvious in
 * development instead of being discovered in production.
 */

import Link from "next/link";
import { ACCESS_FOR_VANTAGE, GROUP_VANTAGE, ACCESS_RANK } from "@/constants/routes";
import type { RouteGroup } from "@/constants/layout";
import { resolveSubject, accessOfSubject } from "@/lib/access";

/**
 * Defence in depth, deliberately weaker than the middleware.
 *
 * This can only see the GROUP, and an access override belongs to a ROUTE
 * — which is why the first version of this denied /legal/risk-disclosure
 * and /how-capital-works, both public by override inside (capital). The
 * real decision now happens in middleware.ts, which sees the pathname.
 *
 * It stays because middleware can be misconfigured and a matcher can grow
 * a hole. If both are bypassed the surface still refuses, and it refuses
 * on the group's rule rather than on nothing.
 *
 * `respectsOverride` is how a generated layout says "middleware already
 * approved a route in this group that the group itself would refuse".
 */
export function GroupGuard({
  group,
  respectsOverride = true,
  children,
}: {
  group: RouteGroup;
  respectsOverride?: boolean;
  children: React.ReactNode;
}) {
  const required = ACCESS_FOR_VANTAGE[GROUP_VANTAGE[group]];
  const subject = resolveSubject();
  const held = accessOfSubject(subject);

  if (respectsOverride) return <>{children}</>;
  if (ACCESS_RANK[held] >= ACCESS_RANK[required]) return <>{children}</>;

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
        <Link className="btn primary" href="/auth/sign-in">
          Sign in
        </Link>
        <Link className="btn" href="/">
          Back to the collection
        </Link>
      </div>

      <p className="gate-note">
        Authentication is not yet built, so every signed-in surface denies. That is deliberate: a
        guard that admitted everyone while the session was pending would have shipped, because it
        would have worked and nothing would have complained.
      </p>
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
