"use client";

/**
 * THE INVESTOR'S OWN VIEW — redesigned 24 Sep 2026
 *
 * Founder brief, same date: a signed-in investor sees the property, the LLP
 * structure, the capital and their time entitlement — and nothing for
 * using or arranging nights, which belongs to the operating partner, not
 * to this platform — plus their own profile, with KYC and the bank account
 * distributions are paid to.
 *
 * Two kinds of fact, kept apart on purpose:
 *
 *  - THE ESTATE'S facts are the register's (constants/vehicles.ts) on every
 *    route: place, land, keys, the LLP, its thresholds, its capital stack,
 *    its night pool. They are the partner opening of the aperture.
 *  - THE PERSON'S facts — units held, KYC stage, bank account — are not yet
 *    wired from the database to these screens. The preview shows labelled
 *    examples; a real route says the record is not connected, rather than
 *    showing somebody else's numbers as theirs. (The previous version showed
 *    "SlowSpace Coastal LLP · 18.50%" to every partner.)
 */

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { VEHICLES, TENURE_LABEL, vehicleBySlug, type Vehicle } from "@/constants/vehicles";
import { rupees, rupeesFull } from "./site/registry";
import { WsFrame, type WsTab } from "./workspace/frame";
import { ApertureCard, stateOf } from "./workspace/aperture";
import { DA } from "./da/DA";

/** The signed-in investor's own record, as lib/session.ts currentInvestor() reads it. */
export interface Person {
  readonly holdings: readonly { readonly key: string; readonly units: string; readonly votingPercent: string }[];
  readonly profile: {
    readonly legalName: string; readonly memberState: string; readonly accreditationState: string; readonly accreditationExpiresOn: string | null;
    readonly taxJurisdiction: string; readonly becameMemberOn: string | null; readonly kycState: string | null;
    readonly kycStages: Readonly<Record<string, string>> | null; readonly kycVerifiedOn: string | null; readonly kycReviewDueOn: string | null;
    readonly panLast4: string | null;
    readonly bank: { readonly holder: string | null; readonly name: string | null; readonly ifsc: string | null; readonly last4: string | null; readonly verifiedOn: string | null; readonly method: string | null };
  };
}
type MemberProps = { path: string; param?: string; person?: Person | null; office?: boolean };
type RowT = readonly (readonly [string, string, boolean?])[];

const day = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null);
const titleCase = (s: string) => s.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
const KYC_STAGES = [["identity", "Identity"], ["address", "Address"], ["tax_residency", "Tax residency and PAN"], ["source_of_funds", "Source of funds"], ["suitability", "Suitability"], ["screening", "Screening"]] as const;
type View = "home" | "portfolio" | "vehicle" | "property" | "structure" | "capital" | "entitlement" | "documents" | "profile";

const ESTATE_VIEWS: readonly (readonly [View, string, string])[] = [
  ["vehicle", "Overview", ""], ["property", "Property", "/space"], ["structure", "LLP structure", "/governance"],
  ["capital", "Capital", "/capital"], ["entitlement", "Entitlement", "/time"], ["documents", "Documents", "/documents"],
];

function viewFor(path: string, requested: string | null): View {
  if (path === "/member-workspace-preview") return (requested as View) || "home";
  if (path === "/home") return "home";
  if (path === "/portfolio" || path === "/activity") return "portfolio";
  if (path === "/profile") return "profile";
  const last = path.split("/").at(-1);
  return last === "space" ? "property" : last === "governance" || last === "partners" ? "structure" : last === "capital" ? "capital"
    : last === "time" ? "entitlement" : last === "documents" ? "documents" : "vehicle";
}


function Rows({ rows }: { rows: readonly (readonly [string, string, boolean?])[] }) {
  return <dl className="iv-rows">{rows.map(([k, v, money]) => <div key={k}><dt>{k}</dt><dd className={money ? "money" : ""}>{v}</dd></div>)}</dl>;
}

function Section({ eb, title, children, note }: { eb: string; title: string; children: React.ReactNode; note?: string }) {
  return (
    <section className="ws-section">
      <div className="ws-sec-head"><span className="eb">{eb}</span><h2 className="ws-h2" dangerouslySetInnerHTML={{ __html: title }} /></div>
      {children}
      {note ? <p className="ws-note">{note}</p> : null}
    </section>
  );
}

/** A person's fact: the record's, when it is on file; an example in the preview; otherwise said plainly. */
function Personal({ preview, example, what, real }: { preview: boolean; example: RowT; what: string; real?: RowT | null }) {
  if (preview) return <div className="ws-card iv-card"><span className="iv-example">Example</span><Rows rows={example} /></div>;
  if (real && real.length) return <div className="ws-card iv-card"><Rows rows={real} /></div>;
  return <div className="ws-card iv-card iv-empty"><b>{what} is not on record here yet.</b><p>Investor Relations holds it and will send it on request. It appears here once it is recorded on the platform.</p><Link className="btn" href="/contact">Ask Investor Relations</Link></div>;
}

function EstateViews({ v, view, preview, person }: { v: Vehicle; view: View; preview: boolean; person?: Person | null }) {
  const o = v.offering, s = v.stack, g = v.governance, e = v.entitlement, w = v.operating.waterfall;
  const held = person?.holdings.find((h) => h.key === v.key);
  if (view === "vehicle") return <>
    <Section eb="Your position" title="What you hold <span>here.</span>">
      <Personal preview={preview} what="Your position" example={[["Units held", "2"], ["Share of the equity", "20%"], ["Settled on", "14 Jul 2026"], ["Votes", "Weighted by your equity"]]}
        real={held ? [["Units held", held.units], ["Share of the votes", `${held.votingPercent}%`], ["Votes", "Weighted by your equity"]] : null} />
    </Section>
    <Section eb="The estate" title="As its partners <span>see it.</span>"><ApertureCard v={v} opening="partner" /></Section>
  </>;
  if (view === "property") return (
    <Section eb="Property" title="What the LLP <span>owns.</span>" note="Photographs, surveys and drawings are shared through Investor Relations until the document library is connected.">
      <div className="ws-card iv-card"><Rows rows={[
        ["Estate", v.propertyName], ["Place", v.jurisdiction], ["Coordinates", v.coordinates ?? "Not yet recorded"],
        ["Land", v.landArea], ["Tenure", v.tenure ? TENURE_LABEL[v.tenure] : "Not yet stated"], ["Keys", String(v.keys)],
        ["Build stage", v.buildStage.replace(/-/g, " ")], ["Commitments", v.commitments],
      ]} /></div>
    </Section>
  );
  if (view === "structure") return <>
    <Section eb="LLP structure" title="The partnership <span>that holds it.</span>">
      <div className="ws-card iv-card"><Rows rows={[
        ["Registered name", v.registeredName], ["LLPIN", v.llpin ?? "Not yet issued"], ["Incorporated", v.incorporated ?? "Not yet"],
        ["Agreement dated", v.agreementDated ?? "Not yet"], ["Registered office", v.registeredOffice ?? "Not yet stated"], ["Registrar", v.registrar],
        ["Audited", v.audited ? "Yes" : "Not yet"],
      ]} /></div>
    </Section>
    <Section eb="Who does what" title="Three parties, <span>never one.</span>">
      <div className="ws-card iv-card"><DA kind="entities" /></div>
    </Section>
    <Section eb="Decisions" title="How the partners <span>decide.</span>">
      <div className="ws-card iv-card">{g ? <>
        <DA kind="vote" vehicle={v.key} />
        <Rows rows={[["Reserved matters", g.reservedMatters], ["Transfer", g.transferRule], ["Designated partners", g.designatedPartners]]} />
      </> : <p className="iv-pad">The thresholds are not yet stated for this vehicle.</p>}</div>
    </Section>
  </>;
  if (view === "capital") return <>
    <Section eb="Capital" title="How the estate <span>is paid for.</span>" note="Figures come from the estate's record, and the offering letter governs each of them. Capital is at risk.">
      <div className="ws-card iv-card"><DA kind="stack" vehicle={v.key} /></div>
      <div className="ws-card iv-card"><DA kind="units" vehicle={v.key} /></div>
      <div className="ws-card iv-card"><Rows rows={[
        ["Moratorium", s.moratorium], ["Covenant", s.covenant],
        ["Unit price", rupees(o.unitPrice), true], ["Holding deposit", o.deposit === null ? "Not stated" : rupeesFull(o.deposit), true], ["Lock-in", o.lockIn],
      ]} /></div>
    </Section>
    <Section eb="The waterfall" title="Where each rupee <span>of revenue goes.</span>">
      <div className="ws-card iv-card">{w ? <DA kind="waterfall" vehicle={v.key} money /> : <p className="iv-pad">The waterfall is not yet stated for this vehicle.</p>}</div>
    </Section>
    <Section eb="Your capital" title="What you have <span>contributed.</span>">
      <Personal preview={preview} what="Your capital account" example={[["Contributed", "₹80,00,000", true], ["Distributions to date", "None yet"], ["Next statement", "Quarter ending 31 Dec 2026"]]} />
    </Section>
  </>;
  if (view === "entitlement") return <>
    <Section eb="Entitlement" title="Nights that follow <span>your share.</span>"
      note="This platform records the entitlement only. Choosing and arranging nights is done with the operating partner, Sensory Getaways, not here.">
      <div className="ws-card iv-card"><Rows rows={e ? [
        ["Night pool", `${e.nightPoolMin} to ${e.nightPoolMax} nights a year across the estate`], ["Held back for operations", `${e.reservedDays} days`],
        ["Begins", e.begins], ["Your share", "In proportion to your equity"], ["Carried forward", "No; unused nights do not accrue"],
      ] : [["Night pool", "The allocation rule is not yet set for this estate"], ["Your share", "In proportion to your equity, once set"]]} /></div>
    </Section>
    {e ? <Section eb="At a glance" title="Nights, <span>by units held.</span>">
      <div className="ws-card iv-card"><DA kind="position" vehicle={v.key} /></div>
    </Section> : null}
    <Section eb="Your entitlement" title="This <span>year.</span>">
      <Personal preview={preview} what="Your entitlement" example={[["Your share", "20% of the pool"], ["This year", "24 nights"], ["Arranged through", "Sensory Getaways"]]}
        real={held ? [["Your share", `${held.votingPercent}% of the pool, following your equity`], ["This year", "Set by the estate's annual policy"], ["Arranged through", "Sensory Getaways"]] : null} />
    </Section>
  </>;
  return (
    <Section eb="Documents" title="The instruments <span>themselves.</span>" note="Until the document library is connected, Investor Relations sends each document on request, with its version and date.">
      <div className="ws-card iv-card"><Rows rows={[["LLP agreement", v.agreementDated ? `Dated ${v.agreementDated}` : "Not yet executed"], ["Offering letter", "From Investor Relations"], ["Risk disclosure", "Published at /legal/risk-disclosure"], ["Statements", "Quarterly, once distributions begin"]]} /></div>
    </Section>
  );
}

function Profile({ preview, person }: { preview: boolean; person?: Person | null }) {
  const p = person?.profile;
  const b = p?.bank;
  return <>
    <Section eb="Your profile" title="Who the register <span>knows you as.</span>">
      <Personal preview={preview} what="Your investor record" example={[["Legal name", "Anika Rao"], ["Accreditation", "Accredited · renews 12 Aug 2027"], ["Tax residency", "India"], ["Partner since", "14 Jul 2026"]]}
        real={p ? [["Legal name", p.legalName], ["Accreditation", titleCase(p.accreditationState) + (p.accreditationExpiresOn ? ` · until ${day(p.accreditationExpiresOn)}` : "")],
          ["Tax residency", p.taxJurisdiction], ["Partner since", day(p.becameMemberOn) ?? "Not yet settled"], ["PAN", p.panLast4 ? `•••••${p.panLast4}` : "Not on record"]] : null} />
    </Section>
    <Section eb="KYC" title="Your checks, <span>stage by stage.</span>" note="Documents are checked by the platform and held under the Privacy Notice. Nothing here is shown to other partners.">
      {preview
        ? <ol className="iv-kyc">{[["Identity", "Verified"], ["Address", "Verified"], ["Tax residency and PAN", "Verified"], ["Source of funds", "Stated"], ["Suitability", "Completed"], ["Screening", "Clear"], ["Accreditation", "Issued"], ["Annual review", "Due Aug 2027"]].map(([k, st], i) => (
          <li key={k} className="ws-card"><span className="mono">{String(i + 1).padStart(2, "0")}</span><b>{k}</b><em className={/Due/.test(st) ? "due" : "ok"}>{st}</em></li>))}</ol>
        : p?.kycState ? <>
          <div className="ws-card iv-card"><Rows rows={[["Overall", titleCase(p.kycState)], ["Last verified", day(p.kycVerifiedOn) ?? "Not yet"], ["Next review", day(p.kycReviewDueOn) ?? "Not set"]]} /></div>
          {p.kycStages ? <ol className="iv-kyc">{KYC_STAGES.map(([k, label], i) => { const st = p.kycStages?.[k] ?? "not started"; return (
            <li key={k} className="ws-card"><span className="mono">{String(i + 1).padStart(2, "0")}</span><b>{label}</b><em className={/verified|clear|complete|stated/i.test(st) ? "ok" : "due"}>{titleCase(st)}</em></li>); })}</ol> : null}
        </> : <Personal preview={false} what="Your KYC record" example={[]} />}
    </Section>
    <Section eb="Bank account" title="Where distributions <span>are paid.</span>"
      note="The account number is held encrypted and shown only by its last four digits, never in full. To change it, write to Investor Relations; a new account is verified before any payment is made to it.">
      {preview
        ? <div className="ws-card iv-card"><span className="iv-example">Example</span><Rows rows={[["Account holder", "Anika Rao"], ["Bank", "HDFC Bank"], ["Account", "•••• •••• 4821"], ["IFSC", "HDFC0••••12"], ["Verified", "By penny drop, 16 Jul 2026"]]} /></div>
        : <Personal preview={false} what="Your bank account" example={[]}
            real={b?.last4 ? [["Account holder", b.holder ?? "Not on record"], ["Bank", b.name ?? "Not on record"], ["Account", `•••• •••• ${b.last4}`],
              ["IFSC", b.ifsc ? `${b.ifsc.slice(0, 4)}••••${b.ifsc.slice(-2)}` : "Not on record"],
              ["Verified", b.verifiedOn ? `${b.method ? titleCase(b.method) + ", " : ""}${day(b.verifiedOn)}` : "Not yet verified"]] : null} />}
    </Section>
  </>;
}

function MemberWorkspace({ path, param, person, office = false }: MemberProps) {
  const search = useSearchParams();
  const preview = path === "/member-workspace-preview";
  const view = viewFor(path, search.get("view"));
  const v = (param && vehicleBySlug(param)) || VEHICLES[0];
  const estateHref = (x: Vehicle, suffix = "") => (preview ? `/member-workspace-preview?view=${suffix ? ESTATE_VIEWS.find((e) => e[2] === suffix)![0] : "vehicle"}` : `/portfolio/${x.slug}${suffix}`);
  const tabs: readonly WsTab[] = preview
    ? [{ href: "/member-workspace-preview?view=home", label: "Holdings" }, { href: "/member-workspace-preview?view=vehicle", label: "An estate" }, { href: "/member-workspace-preview?view=profile", label: "Profile" }]
    : [{ href: "/home", label: "Holdings" }, { href: "/portfolio", label: "Estates" }, { href: "/profile", label: "Profile" }];
  const current = preview ? (view === "home" || view === "portfolio" ? "Holdings" : view === "profile" ? "Profile" : "An estate") : undefined;
  const inEstate = !["home", "portfolio", "profile"].includes(view);
  const shown = VEHICLES.filter((x) => (preview ? stateOf(x) !== "forming" : office || person?.holdings.some((h) => h.key === x.key)));

  return (
    <main className="p-hero-own">
      <WsFrame opening="partner" tabs={tabs} current={current} preview={preview}>
        {view === "home" || view === "portfolio" ? <>
          <header className="ws-head"><div><span className="eb">Your holdings</span><h1 className="ws-h1">Everything you own, <span>in one place.</span></h1>
            <p>Each estate you hold is its own partnership. Open one to see its property, its structure, its capital and your entitlement.</p></div></header>
          <Section eb="Your positions" title="Across <span>the collection.</span>">
            <Personal preview={preview} what="Your list of positions" example={[["SlowSpace Coastal", "2 units · settled 14 Jul 2026"], ["Coorg Coffee Creek", "Holding deposit paid · 23 Sep 2026"]]}
              real={person?.holdings.length ? person.holdings.map((h) => [VEHICLES.find((x) => x.key === h.key)?.propertyName ?? h.key, `${h.units} units · ${h.votingPercent}% of the votes`] as const) : null} />
          </Section>
          <Section eb="Where each estate stands" title="One track, <span>every estate.</span>">
            <div className="ws-card iv-card"><DA kind="stages" /></div>
          </Section>
          <Section eb="The estates" title="Open <span>an estate.</span>">
            {/* A partner sees the estates they hold; the Office, every one. */}
            {shown.length
              ? <div className="ap-grid">{shown.map((x) => <ApertureCard key={x.key} v={x} opening={preview ? "public" : "partner"} href={estateHref(x)} />)}</div>
              : <div className="ws-card iv-card iv-empty"><b>No estate is recorded against your name yet.</b><p>An estate appears here once your position in it is settled on the register. If you hold one and it is missing, Investor Relations will correct the record.</p><Link className="btn" href="/contact">Ask Investor Relations</Link></div>}
          </Section>
        </> : null}

        {inEstate ? <>
          <header className="ws-head"><div><span className="eb">{v.registeredName}</span><h1 className="ws-h1">{v.propertyName}<span>.</span></h1>
            <p>The estate as its partners see it: the property, the partnership, the capital and your entitlement. Nights are used and arranged with the operating partner, not here.</p></div></header>
          <nav className="ws-subnav" aria-label="This estate"><div>
            {ESTATE_VIEWS.map(([id, label, suffix]) => <Link key={id} href={estateHref(v, suffix)} aria-current={view === id ? "page" : undefined}>{label}</Link>)}
          </div></nav>
          <EstateViews v={v} view={view} preview={preview} person={person} />
        </> : null}

        {view === "profile" ? <>
          <header className="ws-head"><div><span className="eb">Profile</span><h1 className="ws-h1">Your record, <span>and your checks.</span></h1>
            <p>Your identity, your KYC and the account distributions are paid to. Changes to any of them are made with Investor Relations and recorded.</p></div></header>
          <Profile preview={preview} person={person} />
        </> : null}
      </WsFrame>
    </main>
  );
}

export function MemberSurface(props: MemberProps) {
  return <Suspense fallback={<main className="p-hero-own" aria-busy="true" />}><MemberWorkspace {...props} /></Suspense>;
}

