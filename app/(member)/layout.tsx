/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route group  (member)
 * Vantage      member
 * Access       member
 * 
 * The guard runs here rather than in each page, so a page added by
 * hand inside this group is still gated. It fails closed: an
 * unresolved subject is anonymous, and anonymous satisfies "public"
 * only.
 */

import { GroupGuard } from "@/app/_system/guard";

export default function PmemberLayout({ children }: { children: React.ReactNode }) {
  return <GroupGuard group="member">{children}</GroupGuard>;
}
