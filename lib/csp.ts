/**
 * CONTENT SECURITY POLICY — what a page may load, and from where
 *
 * 25 Sep 2026. The site sent every other security header (vercel.json)
 * and not this one, so nothing limited where a page could fetch a script,
 * post a form or send data. This is the whole list, and it is short
 * because the site depends on almost nothing outside itself: fonts are
 * self-hosted by next/font, images are local, and the only third party is
 * Razorpay's checkout, loaded only when someone pays a holding deposit
 * (app/_assemblies/site/behaviour.tsx).
 *
 * ── WHY 'unsafe-inline' IS STILL IN script-src ──────────────────────
 * Next.js writes its own inline bootstrap scripts. Removing the allowance
 * needs a per-request nonce, which makes every page dynamic and rules out
 * ever caching the public site. The policy still refuses every script
 * from anywhere but this origin and Razorpay, which is the attack that
 * matters most here: an injected <script src> pointing elsewhere.
 * connect-src limits where any script, inline or not, can send data.
 *
 * Lives in code rather than vercel.json so the same policy runs in local
 * development, where it can be tested, and so it can differ where it must:
 * development needs eval for fast refresh; a Vercel preview needs its
 * feedback toolbar.
 */

const RAZORPAY = "https://checkout.razorpay.com";
const RAZORPAY_ANY = "https://*.razorpay.com";

export function contentSecurityPolicy(env: { dev: boolean; preview: boolean }): string {
  const live = env.preview ? " https://vercel.live" : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${RAZORPAY}${env.dev ? " 'unsafe-eval'" : ""}${live}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${RAZORPAY_ANY}${live}`,
    "font-src 'self' data:",
    `connect-src 'self' ${RAZORPAY_ANY}${env.dev ? " ws: wss:" : ""}${live}${env.preview ? " wss://ws-us3.pusher.com" : ""}`,
    `frame-src ${RAZORPAY_ANY}${live}`,
    "worker-src 'self' blob:",
    "media-src 'self' blob: data:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    /* Google sign-in (auth.config.ts) posts here and is redirected on to
       Google; browsers apply form-action to that redirect. */
    "form-action 'self' https://accounts.google.com",
    "frame-ancestors 'none'",
    ...(env.dev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}
