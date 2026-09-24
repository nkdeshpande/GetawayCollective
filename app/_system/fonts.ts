/**
 * TYPEFACES — hand-written, not generated
 *
 * Wave 7 · Workspaces · re-pointed 24 Sep 2026 (L1-01 §29-0b)
 *
 * The design system names four faces (constants/tokens.ts FONT). Until
 * this file existed none of them loaded: the token stacks fell through to
 * a system serif, and because `--gc-font-*` was not emitted to CSS at all,
 * every `font:` shorthand using it was invalid and the whole type scale
 * collapsed to 16px Times.
 *
 * Both loaders self-host. No CDN link, no render-blocking request, and no
 * third party seeing who reads this site — which matters more here than on
 * most products, because the audience is a list of investors.
 *
 * SATOSHI is not on Google Fonts. It is served from ./fonts under the
 * Fontshare licence (Indian Type Foundry, fontshare.com/terms), which
 * permits commercial use and asks that the face be credited by name.
 * Two weights ship, 400 and 500, exactly as the prototype carried them;
 * 600 and 700 in the stylesheet are synthesised from 500, as they were
 * there.
 */

import { Inter_Tight, Space_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * 100 and 800 are the wordmark — "Getaway" at 800 over "Collective" at
 * 100 (BR-01 as amended). The type scale asks for 200 and 300 at the
 * display roles (constants/typography.ts). All of them load, because a
 * weight that is asked for and not loaded falls to the nearest one
 * silently: that is the defect this file was first written to end.
 */
export const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const body = localFont({
  src: [
    { path: "./fonts/Satoshi-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Satoshi-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
});

export const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

/** The second voice is the display family at its thinnest; it needs no
 *  loader of its own, only its own variable so --gc-font-editorial keeps
 *  resolving for every surface that already asks for it. */
export const editorial = { variable: "gc-editorial-face" };

export const fontVars = [display, body, mono, editorial]
  .map((f) => f.variable)
  .join(" ");
