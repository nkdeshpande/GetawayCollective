/**
 * ROOT LAYOUT — hand-written, not generated
 *
 * Wave 7 · Workspaces
 *
 * The only place the document shell is declared. Tokens come from
 * dist/tokens.css, which is generated from constants/tokens.ts and
 * verified by export-tokens in the gate — so a colour cannot enter the
 * application without passing token-lint first.
 */

import type { Metadata } from "next";
import { fontVars } from "./_system/fonts";
import { CookieConsent, Specimens } from "./_assemblies/dialogs";
import "./globals.css";

export const metadata: Metadata = {
  /* Required for every relative URL in metadata (icons, og:image) to
     resolve to an absolute one. Falls back to localhost so `next build`
     never fails for want of an env var; production sets
     NEXT_PUBLIC_SITE_URL to the real domain. */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Getaway Collective",
    template: "%s",
  },
  description:
    "An institutional investment platform for experiential real estate. Capital is at risk.",
  /* Individual routes set their own robots directive. Public routes index;
     everything else is explicitly excluded by the generator rather than
     left to a default somebody may later change. */
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* No `user-scalable=no`. AS-06 collects a PAN number and AS-14 is a
       mandatory reading surface; disabling zoom on either is WCAG 1.4.4. */
    <html lang="en-IN" className={fontVars}>
      <body>
        {children}
        {/* P-03: asserts at the foot, never blocks, declines by default.
            Specimens renders a dialog only when ?specimen= names one —
            zero footprint otherwise. */}
        <CookieConsent />
        <Specimens />
      </body>
    </html>
  );
}
