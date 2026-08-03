import type { NextConfig } from "next";
import { REDIRECTS } from "./constants/redirects";

/**
 * Legacy addresses remain usable, but authored navigation points directly
 * at the canonical IA. The registry validates every destination at load.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [...REDIRECTS];
  },
};

export default nextConfig;
