/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /roles/[code]
 * Access    public   (derived from vantage)
 * Assembly  AS-18 · Recruitment
 * 
 */

import type { Metadata } from "next";
import { Surface } from "@/app/_system/surface";

export const metadata: Metadata = {
  title: "Role · Getaway Collective",
  robots: { index: true, follow: true },
};

export default async function Proles_code(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  return (
    <Surface
      path="/roles/[code]"
      assembly={"AS-18"}
      params={params}
    />
  );
}
