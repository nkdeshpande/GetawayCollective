/**
 * THE WORKSPACE FRAME — the signed-in surfaces in the site's language
 *
 * 24 Sep 2026. One bar for the Office, the partner and the investor
 * surfaces, in place of the rail's "GC." strip and the second header each
 * workspace drew under it. The monogram and the name as on the public site,
 * then which opening you are looking through, then that opening's own
 * places, then the way out.
 *
 * The opening is the aperture system's word made visible (constants/
 * apertures.ts): the same record, shown to a partner wider than to the
 * public and to the Office wider still. The small drawn mark beside the
 * label opens with it.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { MARK_BOX } from "@/constants/brand-system";
import { Mark } from "../brandmark";

export type Opening = "public" | "investor" | "partner" | "office";

export const OPENINGS: readonly { readonly id: Opening; readonly label: string; readonly width: number; readonly who: string }[] = [
  { id: "public", label: "Public", width: 8, who: "Anyone reading the site" },
  { id: "investor", label: "Investor", width: 14, who: "An accredited investor doing diligence" },
  { id: "partner", label: "Partner", width: 22, who: "A partner of the estate's LLP" },
  { id: "office", label: "Office", width: 28, who: "The people who keep the record" },
];

/** The skylight cut at a given opening: the same shaft, its left edge moved
 *  out. At 22 it is exactly MARK_CUT, the ratified mark. */
export const cutAt = (w: number) => `M${50 - w} 83V61L${72 - w} 17H72L50 61V83Z`;

export function ApertureMark({ opening, size = 22 }: { opening: Opening; size?: number }) {
  const cut = cutAt(OPENINGS.find((o) => o.id === opening)?.width ?? 22);
  return (
    <svg className="ws-amark" viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" focusable="false">
      <path className="ws-amark-box" fillRule="evenodd" d={`${MARK_BOX} ${cut}`} />
      <path className="ws-amark-cut" d={cut} />
    </svg>
  );
}

export interface WsTab { readonly href: string; readonly label: string }

export function WsFrame({ opening, tabs, current, preview = false, children }: {
  opening: Opening; tabs: readonly WsTab[]; current?: string; preview?: boolean; children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const o = OPENINGS.find((x) => x.id === opening)!;
  /* An explicit current tab wins (the previews share one path); otherwise
     the path decides, and /office matches only itself. */
  const here = (t: WsTab) => {
    if (current) return t.label === current;
    const m = t.href.split("?")[0];
    return m === "/office" ? pathname === "/office" : pathname === m || pathname.startsWith(m + "/");
  };
  return (
    <div className="ws">
      <header className="ws-bar">
        <Link className="ws-brand" href="/" aria-label="Getaway Collective, public site">
          <Mark size={24} /><span><b>Getaway</b> Collective</span>
        </Link>
        <span className="ws-opening" title={o.who}><ApertureMark opening={opening} size={16} />{o.label}{preview ? <em>Preview · example material</em> : null}</span>
        <nav className="ws-tabs" aria-label={`${o.label} places`}>
          {tabs.map((t) => <Link key={t.href} href={t.href} aria-current={here(t) ? "page" : undefined}>{t.label}</Link>)}
        </nav>
        <div className="ws-out">
          <Link href="/collection">Public site</Link>
          {preview ? <Link href="/sign-in">Sign in</Link>
            : <button type="button" onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>}
        </div>
      </header>
      <div className="ws-body">{children}</div>
    </div>
  );
}

export const OFFICE_TABS: readonly WsTab[] = [
  { href: "/office", label: "Overview" },
  { href: "/office/collection", label: "Estates" },
  { href: "/office/contacts", label: "Contacts" },
  { href: "/office/investors", label: "Investors" },
  { href: "/office/register", label: "Register an estate" },
  { href: "/office/settings", label: "Settings" },
];

export const OFFICE_PREVIEW_TABS: readonly WsTab[] = [
  { href: "/office-workspace-preview?view=lifecycle", label: "Overview" },
  { href: "/office-workspace-preview?view=collection", label: "Estates" },
  { href: "/office-workspace-preview?view=contacts", label: "Contacts" },
  { href: "/office-workspace-preview?view=vehicle", label: "One estate" },
];
