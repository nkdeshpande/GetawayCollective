import type { NextConfig } from "next";
import { REDIRECTS } from "./constants/redirects";
import { contentSecurityPolicy } from "./lib/csp";

/**
 * Legacy addresses remain usable, but authored navigation points directly
 * at the canonical IA. The registry validates every destination at load.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [...REDIRECTS];
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
