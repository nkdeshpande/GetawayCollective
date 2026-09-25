/**
 * /start — where a sign-in lands (GC-905), 25 Sep 2026
 *
 * Every sign-in returns here unless it was sent from a particular page, and
 * this page only decides where to go next (lib/landing.ts). It renders
 * nothing of its own: the standing is read on the server, from the grants
 * and the investor record, on every visit, so a new grant or a settled
 * holding changes the destination at once.
 */
import { redirect } from "next/navigation";
import { currentSubject } from "@/lib/session";
import { landingFor } from "@/lib/landing";

export async function SiteStart(): Promise<null> {
  const s = await currentSubject();
  redirect(landingFor({ identified: s.identified, accredited: s.accredited, member: s.member, office: s.rights.length > 0 }));
  return null; // never reached: redirect() throws
}
