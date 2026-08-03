"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";

type MemberProps = { path: string; param?: string };
type MemberView = "home" | "portfolio" | "vehicle" | "space" | "capital" | "time" | "project" | "partners" | "governance" | "documents" | "activity" | "profile";
type RecordRow = readonly [string, string, string, string];

const generalViews = ["home", "portfolio", "activity", "profile"] as const;
const vehicleViews = ["vehicle", "space", "capital", "time", "project", "partners", "governance", "documents", "activity"] as const;

const copy: Record<MemberView, { ia: string; eyebrow: string; title: string; lead: string; guidance: string }> = {
  home: { ia: "MEM-000", eyebrow: "RELATIONSHIP / HOME", title: "Your relationship, in one clear view.", lead: "Ownership, rights, notices and the next material action across every investment vehicle.", guidance: "Start with the item requiring attention. Nothing here changes a vehicle record." },
  portfolio: { ia: "MEM-100", eyebrow: "RELATIONSHIP / PORTFOLIO", title: "Every interest you hold.", lead: "A cross-vehicle view of recorded ownership, current lifecycle state and the next material update.", guidance: "Choose an investment vehicle to enter its private record." },
  vehicle: { ia: "MEM-110", eyebrow: "VEHICLE / OVERVIEW", title: "The vehicle, as it stands.", lead: "One connected member view of Space, Capital, Time, Project, Partners, Governance and evidence.", guidance: "The source record is shared with the Office and redacted to the recorded relationship." },
  space: { ia: "MEM-120", eyebrow: "VEHICLE / SPACE", title: "What the LLP owns and protects.", lead: "The asset record, title basis, physical condition and current protection position.", guidance: "Open the evidence beside a fact when its basis matters." },
  capital: { ia: "MEM-130", eyebrow: "VEHICLE / CAPITAL", title: "Its financial position.", lead: "Your recorded interest, contributions, distributions, reserve basis and latest value reference.", guidance: "Amounts come from the governed ledger; estimates remain visibly classified." },
  time: { ia: "MEM-140", eyebrow: "VEHICLE / TIME", title: "Your time rights.", lead: "The approved annual pool, your derived entitlement and the handoff to the separate allocation platform.", guidance: "Entitlement follows recorded ownership and the effective policy." },
  project: { ia: "MEM-150", eyebrow: "VEHICLE / PROJECT", title: "Progress made legible.", lead: "Approved baseline, completed milestones, current work and material decisions affecting delivery.", guidance: "Photography and certification identify what exists today." },
  partners: { ia: "MEM-160", eyebrow: "VEHICLE / PARTNERS", title: "Who participates.", lead: "The constitutional Partner register, presented within the member disclosure boundary.", guidance: "Private identity material outside the shared relationship remains withheld." },
  governance: { ia: "MEM-170", eyebrow: "VEHICLE / GOVERNANCE", title: "How decisions are made.", lead: "Voting basis, current matters, resolutions, policies and the authority behind every decision.", guidance: "Voting power is derived from recorded equity." },
  documents: { ia: "MEM-180", eyebrow: "VEHICLE / DOCUMENTS", title: "The records themselves.", lead: "Effective instruments, reports and notices with version, source, custody and visibility.", guidance: "A newer version never erases the document trail." },
  activity: { ia: "MEM-190 / MEM-200", eyebrow: "ACTIVITY / PRIVATE LEDGER", title: "What has materially changed.", lead: "A chronological record of evidence, decisions, notices and state transitions.", guidance: "Open a vehicle-scoped event for its authority and source record." },
  profile: { ia: "MEM-210", eyebrow: "RELATIONSHIP / PROFILE", title: "Your record and preferences.", lead: "Identity reference, communication preferences and controlled personal updates.", guidance: "Profile preferences never change ownership or the Partner register." },
};

const records: Record<MemberView, readonly RecordRow[]> = {
  home: [
    ["Active interests", "02", "Relationship record", "Current"],
    ["Open notice", "Project update", "Communications", "Read"],
    ["Next decision", "Reserve basis", "Board record", "12 Aug 2026"],
    ["Identity evidence", "Verified", "IRIS", "Current"],
  ],
  portfolio: [
    ["SlowSpace Coastal LLP", "18.50% interest", "Delivery", "Open vehicle"],
    ["Kyoto House Vehicle", "12.00% interest", "Live + Time", "Open vehicle"],
    ["Relationship total", "2 interests", "Canonical register", "Current"],
  ],
  vehicle: [
    ["Lifecycle", "07 / Space + Progress", "Vehicle record", "Controlled"],
    ["Ownership", "18.50%", "Partner register", "Settled"],
    ["Next gate", "Delivery evidence", "Project baseline", "Due"],
    ["Material exception", "01", "Risk record", "Owned"],
  ],
  space: [
    ["Property", "Coastal land + residence", "Title record", "Verified"],
    ["Title basis", "Registered LLP ownership", "Legal evidence", "Current"],
    ["Protection", "Policy in force", "Protection register", "Current"],
    ["Last inspection", "18 Jul 2026", "Project evidence", "Accepted"],
  ],
  capital: [
    ["Recorded contribution", "INR 50,00,000", "Capital ledger", "Reconciled"],
    ["Ownership interest", "18.50%", "Partner register", "Settled"],
    ["Distributions to date", "INR 2,40,000", "Distribution ledger", "Executed"],
    ["Latest value reference", "30 Jun 2026", "Valuation record", "Published"],
  ],
  time: [
    ["Annual pool", "120 nights", "Time policy 2026", "Approved"],
    ["Derived entitlement", "22 nights", "Ownership × pool", "Published"],
    ["Allocated", "14 nights", "External platform", "Confirmed"],
    ["Available balance", "8 nights", "Allocation record", "Current"],
  ],
  project: [
    ["Overall progress", "68%", "Certified baseline", "Current"],
    ["Completed milestone", "Envelope sealed", "Project evidence", "Accepted"],
    ["Current work", "Interior fit-out", "Workstream record", "In progress"],
    ["Next decision", "Landscape variation", "Decision record", "Due"],
  ],
  partners: [
    ["Partners admitted", "08", "Partner register", "Current"],
    ["Interests issued", "100.00%", "Ownership register", "Reconciled"],
    ["Voting basis", "Equity weighted", "LLP agreement", "Effective"],
    ["Register update", "30 Jun 2026", "Legal custody", "Published"],
  ],
  governance: [
    ["Constitution", "LLP Agreement v3", "Legal custody", "Effective"],
    ["Open matter", "Reserve approval", "Board agenda", "12 Aug 2026"],
    ["Voting basis", "Equity weighted", "Governance policy", "Active"],
    ["Last resolution", "Project variation", "Resolution record", "Passed"],
  ],
  documents: [
    ["LLP Agreement", "Version 3", "Legal", "Download"],
    ["Quarterly report", "Q2 2026", "Finance", "Download"],
    ["Project update", "July 2026", "Project", "Download"],
    ["Time policy", "2026", "Board", "Download"],
  ],
  activity: [
    ["Project evidence accepted", "31 Jul 2026", "Project", "Recorded"],
    ["Quarterly report issued", "18 Jul 2026", "Finance", "Read"],
    ["Resolution passed", "04 Jul 2026", "Board", "Recorded"],
    ["Ownership register reconciled", "30 Jun 2026", "Legal", "Recorded"],
  ],
  profile: [
    ["Identity reference", "ID-20481", "IRIS", "Verified"],
    ["Primary address", "n••••@example.com", "Identity record", "Current"],
    ["Document notices", "Email", "Preference", "Enabled"],
    ["Board notices", "Email + message", "Preference", "Enabled"],
  ],
};

function viewFor(path: string, requested: string | null): MemberView {
  if (path === "/member-workspace-preview") {
    const candidate = requested as MemberView | null;
    return candidate && candidate in copy ? candidate : "home";
  }
  if (path === "/home") return "home";
  if (path === "/portfolio") return "portfolio";
  if (path === "/activity") return "activity";
  if (path === "/profile") return "profile";
  if (path === "/portfolio/[vehicle]") return "vehicle";
  const candidate = path.split("/").at(-1) as MemberView;
  return candidate in copy ? candidate : "vehicle";
}

function MemberWorkspace({ path, param }: MemberProps) {
  const search = useSearchParams();
  const [saved, setSaved] = useState(false);
  const preview = path === "/member-workspace-preview";
  const view = viewFor(path, search.get("view"));
  const vehicleMode = view !== "home" && view !== "portfolio" && view !== "profile" && !(view === "activity" && path === "/activity");
  const vehicle = param || "slowspace-coastal";
  const base = `/portfolio/${vehicle}`;
  const route = ROUTES.find((item) => item.path === path);
  const page = copy[view];
  const navigation = vehicleMode ? vehicleViews : generalViews;

  const hrefFor = (target: MemberView) => {
    if (preview) return `/member-workspace-preview?view=${target}`;
    if (target === "home") return "/home";
    if (target === "portfolio") return "/portfolio";
    if (target === "profile") return "/profile";
    if (target === "activity" && !vehicleMode) return "/activity";
    return target === "vehicle" ? base : `${base}/${target}`;
  };

  return (
    <main className="member-workspace p-hero-own">
      <header className="member-topbar">
        <Link href="/" className="sysmark">GETAWAY COLLECTIVE</Link>
        <div><span>{preview ? "DESIGN PREVIEW / PLACEHOLDER MATERIAL" : "MEMBER-RESTRICTED"}</span><b>RECORD CURRENT</b></div>
      </header>

      <div className="member-grid">
        <aside className="member-rail">
          <div className="member-brand"><b>{vehicleMode ? "VEHICLE" : "RELATIONSHIP"}</b><span>MEMBER MODULE</span></div>
          {vehicleMode ? <div className="member-context"><span>INVESTMENT VEHICLE</span><b>SlowSpace Coastal LLP</b><small>Interest · 18.50%</small></div> : null}
          <nav aria-label={vehicleMode ? "Member vehicle" : "Member relationship"}>
            {navigation.map((item) => <Link key={item} className={view === item ? "active" : ""} href={hrefFor(item)}><span>{item === "vehicle" ? "overview" : item}</span><i>→</i></Link>)}
          </nav>
          {vehicleMode
            ? <Link className="member-module-link" href={preview ? "/member-workspace-preview?view=portfolio" : "/portfolio"}>← Back to relationship</Link>
            : <Link className="member-module-link" href={preview ? "/member-workspace-preview?view=vehicle" : base}>Enter vehicle module →</Link>}
        </aside>

        <section className="member-main">
          <header className="member-hero">
            <div><span className="eyebrow">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.lead}</p></div>
            <dl>
              <div><dt>IA RECORD</dt><dd>{route?.ia || page.ia}</dd></div>
              <div><dt>MODULE</dt><dd>{vehicleMode ? "MEMBER / VEHICLE" : "MEMBER / GENERAL"}</dd></div>
              <div><dt>VISIBILITY</dt><dd>{preview ? "PLACEHOLDER" : "RECORDED RELATIONSHIP"}</dd></div>
            </dl>
          </header>

          <div className="member-kpis">
            {records[view].slice(0, 4).map(([label, value, source, state]) => <article key={label}><span>{label}</span><b>{value}</b><small>{source}</small><em>{state}</em></article>)}
          </div>

          <div className="member-section-head"><div><span className="eyebrow">CANONICAL RECORD</span><h2>{view === "activity" ? "Material change" : "Facts and current state"}</h2></div><p>{page.guidance}</p></div>
          <div className="member-table">
            <header><span>RECORD</span><span>VALUE</span><span>SOURCE</span><span>STATE / ACTION</span></header>
            {records[view].map(([label, value, source, state]) => <article key={label}><b>{label}</b><span>{value}</span><span>{source}</span><button type="button">{state} →</button></article>)}
          </div>

          <div className="member-evidence">
            <article><span>01 / PROVENANCE</span><b>Every fact retains its governed source.</b><p>Source, version, effective date and accountable owner travel with the record.</p></article>
            <article><span>02 / DISCLOSURE</span><b>Only the recorded relationship is visible.</b><p>Other Partners’ private evidence and Office-only controls remain outside this aperture.</p></article>
            <article><span>03 / GUIDANCE</span><b>IRIS explains; authority decides.</b><p>Guidance can find and explain a record but cannot create a right or approve a write.</p></article>
          </div>

          {view === "profile" ? <div className="member-preferences"><div><span className="eyebrow">COMMUNICATION PREFERENCES</span><p>Choose how governed notices reach you. Formal delivery rules still apply.</p></div><label><input type="checkbox" defaultChecked /> Document notices</label><label><input type="checkbox" defaultChecked /> Board notices</label><button type="button" className="btn primary" onClick={() => setSaved(true)}>{saved ? "Preferences saved" : "Save preferences"}</button></div> : null}
        </section>
      </div>
    </main>
  );
}

export function MemberSurface(props: MemberProps) {
  return <Suspense fallback={<main className="member-workspace p-hero-own" aria-busy="true" />}><MemberWorkspace {...props} /></Suspense>;
}
