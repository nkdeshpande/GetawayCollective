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
import "./globals.css";

export const metadata: Metadata = {
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
      <body>{children}</body>
    </html>
  );
}
