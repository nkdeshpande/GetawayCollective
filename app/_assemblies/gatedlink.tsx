/**
 * A LINK THAT SAYS WHAT IT WILL ASK OF YOU — REM-009 · PUBLIC.09
 *
 * Wraps next/link and, where the destination is not public, states the
 * requirement beside the label. The requirement is read from the route
 * table through `requiredAccess()`; this component never takes one as a
 * prop, because a prop is a second place to be wrong and the one that
 * goes stale when a route changes class.
 *
 * An unknown href renders as a plain link rather than throwing. A visitor
 * should not meet a crash because a path is missing from the table —
 * `lint:links` already fails the build on a dead internal link, which is
 * the right place for that to be caught.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { ACCESS_REQUIREMENT } from "../../constants/access-requirements";
import { matchRoute, requiredAccess } from "../../lib/access";

export interface GatedLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
  /**
   * Render the requirement as its own line rather than inline.
   * For rails and cards, where the label and the requirement stack.
   */
  readonly stacked?: boolean;
}

/** The requirement a path will impose, or null where it imposes none. */
export function requirementFor(href: string): string | null {
  /* Query and fragment are not part of a route. `/portfolio?x=1` is the
     same door as `/portfolio`, and matching with them attached silently
     returns undefined — which would render a gated link as an open one. */
  const path = href.split("?")[0].split("#")[0];
  if (!path.startsWith("/")) return null;      // external or mailto: not ours to label
  const route = matchRoute(path);
  return route ? ACCESS_REQUIREMENT[requiredAccess(route)] : null;
}

export function GatedLink({ href, children, className, stacked }: GatedLinkProps) {
  const requirement = requirementFor(href);

  if (!requirement) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return (
    <Link
      href={href}
      className={`gated-link${stacked ? " stacked" : ""}${className ? ` ${className}` : ""}`}
      /* The requirement is part of the link's accessible name, not a
         decoration beside it. A screen reader that announces "Portfolio"
         and stops has told the listener exactly what the sighted reader
         was told before this existed. */
      aria-label={`${typeof children === "string" ? children : ""} — ${requirement}`.trim()}
    >
      <span className="gated-label">{children}</span>
      <span className="gated-note t-micro" aria-hidden="true">{requirement}</span>
    </Link>
  );
}
