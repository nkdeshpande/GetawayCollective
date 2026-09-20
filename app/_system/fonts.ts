/**
 * TYPEFACES — hand-written, not generated
 *
 * Wave 7 · Workspaces
 *
 * The design system names four faces (constants/tokens.ts FONT). Until
 * this file existed none of them loaded: the token stacks fell through to
 * a system serif, and because `--gc-font-*` was not emitted to CSS at all,
 * every `font:` shorthand using it was invalid and the whole type scale
 * collapsed to 16px Times.
 *
 * `next/font/google` self-hosts. No CDN link, no render-blocking request,
 * and no third party seeing who reads this site — which matters more here
 * than on most products, because the audience is a list of investors.
 */

import { Outfit, Inter, Space_Mono, Playfair_Display } from "next/font/google";

/**
 * 200 is here for the wordmark and nothing else.
 *
 * BR-01 sets the mark at Outfit 200. The face was loaded at 300-700, so a
 * wordmark asking for 200 silently fell to 300 and the ratified weight
 * could not render at all. The type scale also asks for 200 at display-xl
 * and display-l (constants/typography.ts), which had the same problem.
 */
export const display = Outfit({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

/** Narrative callout only, and only once per screen (§29b). */
export const editorial = Playfair_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const fontVars = [display, body, mono, editorial]
  .map((f) => f.variable)
  .join(" ");
