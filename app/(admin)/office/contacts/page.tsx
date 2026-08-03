/**
 * GENERATED — do not edit.
 *
 * Written by scripts/gen-app.js from constants/routes.ts.
 * Run `npm run app` to regenerate, `npm run app:check` to verify.
 *
 * Route     /office/contacts
 * Access    office   (derived from vantage)
 * Assembly  AS-13 · The LLP Docket
 * Rights    compliance.record
 * 
 */

import type { Metadata } from "next";
import { ContactDesk } from "@/app/_assemblies/contactdesk";
import { canReach } from "@/lib/access";
import { currentSubject } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const reachable = canReach("/office/contacts", await currentSubject()).ok;
  return {
    title: reachable ? "The Desk · Getaway Collective" : "Getaway Collective",
    robots: { index: false, follow: false },
  };
}

export default async function Poffice_contacts() {
  return <ContactDesk />;
}
