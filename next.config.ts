import type { NextConfig } from "next";
import { REDIRECTS } from "./constants/redirects";
import { ESTATE_REDIRECTS, ESTATE_REWRITES, toPublic } from "./constants/estate-urls";
import { contentSecurityPolicy } from "./lib/csp";

/**
 * Legacy addresses remain usable, but authored navigation points directly
 * at the canonical IA. The registry validates every destination at load.
 */
const nextConfig: NextConfig = {
  /* 16 Oct 2026: estates answer at their own names (constants/estate-urls.ts).
     Old addresses redirect; the new ones serve the page kept under the key. */
  async redirects() {
    return [...REDIRECTS.map((r) => ({ ...r, destination: toPublic(r.destination) })), ...ESTATE_REDIRECTS];
  },
  async rewrites() {
    return { beforeFiles: [...ESTATE_REWRITES], afterFiles: [], fallback: [] };
  },
  /* The Content-Security-Policy (lib/csp.ts). The other security headers
     stay in vercel.json; this one is here so development runs under it. */
  async headers() {
    const csp = contentSecurityPolicy({
      dev: process.env.NODE_ENV !== "production",
      preview: process.env.VERCEL_ENV === "preview",
    });
    return [{ source: "/(.*)", headers: [{ key: "Content-Security-Policy", value: csp }] }];
  },
};

export default nextConfig;
