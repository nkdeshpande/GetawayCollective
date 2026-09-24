/**
 * THE PARTNER GATE — a partner sees the estates they hold, and no others
 *
 * 24 Sep 2026, founder ruling of the same date. Middleware already refuses
 * anyone below the member class; this is the per-estate check behind it,
 * which the class alone cannot make. An estate the viewer does not hold
 * answers 404 — not 403 — so the page does not confirm whose it is
 * (IA_LAWS.notFoundNeverConfirms). The Office may open any estate.
 *
 * It also carries the viewer's own record into the page: holdings and the
 * masked profile from lib/session.ts currentInvestor(), never a ciphertext.
 */

import { notFound } from "next/navigation";
import { vehicleBySlug } from "@/constants/vehicles";
import { currentInvestor, currentSubject } from "@/lib/session";
import { mayOpenEstate } from "@/lib/investors";
import { MemberSurface } from "./memberpages";

export async function PartnerSurface({ path, param }: { path: string; param?: string }) {
  const [subject, me] = await Promise.all([currentSubject(), currentInvestor()]);
  const office = subject.rights.length > 0;
  if (param) {
    const v = vehicleBySlug(param);
    if (!v || !mayOpenEstate({ office, holdings: me?.holdings ?? [] }, v.key)) notFound();
  }
  return <MemberSurface path={path} param={param} person={me} office={office} />;
}
