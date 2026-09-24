"use client";

/**
 * THE OFFICE — redesigned 24 Sep 2026 in the site's language
 *
 * What changed, and why:
 *
 *  - The frame is the workspace bar (./workspace/frame), not the rail's
 *    "GC." strip plus a second header with "SYSTEM NOMINAL" and "IA RECORD".
 *    Filing words are for the route table, not the screen.
 *  - Every vehicle and every figure is the register's (constants/vehicles).
 *    The previous version listed four vehicles, two of which do not exist
 *    ("Kyoto House Vehicle", "Nordic Collection Vehicle"), and four health
 *    scores nobody computed. An Office that invents its own collection is
 *    the one place that must never do it.
 *  - The overview opens on the aperture: every estate, seen as the public,
 *    an investor, a partner or the Office sees it.
 *  - Controls that are designed but not yet wired to records say exactly
 *    that, instead of showing states ("RECONCILED", "APPROVED") that no
 *    record behind them supports.
 */

import Link from "next/link";
import { AtlasFindings } from "./atlasfindings";
import { ChangeEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { VEHICLES, LIFECYCLE_LABEL, BUILD_LABEL, stanceFor, vehicleBySlug } from "@/constants/vehicles";
import { VEHICLE_STAGES, type VehicleStageId } from "@/constants/workspace-modules";
import { WsFrame, OFFICE_TABS, OFFICE_PREVIEW_TABS } from "./workspace/frame";
import { ApertureCard, ApertureStrip, openItems } from "./workspace/aperture";
import { DeskView, EXAMPLE_PEOPLE } from "./workspace/desk";

type OfficeProps = { path: string; params?: Record<string, string> };

const vehicleViews = ["vehicle", "space", "capital", "time", "project", "partners", "governance", "documents", "gallery", "activity"] as const;
const VIEW_LABEL: Record<string, string> = {
  vehicle: "Lifecycle", space: "Space", capital: "Capital", time: "Time", project: "Project", partners: "Partners",
  governance: "Governance", documents: "Documents", gallery: "Gallery", activity: "Activity",
};

const generalAreas = [
  ["Lifecycle", "Every estate at its current stage, with the next thing it needs and who owns it."],
  ["Money", "Reconciliations, controlled payments, period close and approved distributions."],
  ["Time", "Policies and night pools, handed to the operating partner for allocation."],
  ["Evidence", "Uploads, versions, custody and who may see each document."],
  ["Access and signing", "Identity evidence, rights, expiries and signature requests."],
  ["Operations", "Integrations, notices, exceptions and the health of the platform."],
] as const;

const viewCopy: Record<string, { title: string; lead: string }> = {
  lifecycle: { title: "The collection, <span>on one page.</span>", lead: "Every estate, what it is doing now, and what each person who looks at it is shown." },
  collection: { title: "Every estate, <span>at its current gate.</span>", lead: "Stage, offering, open items and the next thing each one needs — read from the register." },
  vehicle: { title: "One estate, <span>from setup to continuity.</span>", lead: "Ten stages connect formation, offer, ownership, delivery, value and the board." },
  space: { title: "The asset, <span>and what protects it.</span>", lead: "Property, land, buildings, improvements and their protection." },
  capital: { title: "Money, <span>with its basis visible.</span>", lead: "Structure, contributions, debt, income, expenses, reserves, distributions and value." },
  time: { title: "Nights, <span>allocated by policy.</span>", lead: "The annual pool, each partner's entitlement and the exceptions." },
  project: { title: "Delivery, <span>against the baseline.</span>", lead: "Timeline, milestones, budget, commitments, consultants, risks and decisions." },
  partners: { title: "Who owns it, <span>on record.</span>", lead: "Partner identity, interest, capital, nights, distributions and votes." },
  governance: { title: "Rules, authority <span>and resolutions.</span>", lead: "Entity, constitution, authority, resolutions, agreements, compliance and audit." },
  documents: { title: "Evidence, <span>with custody.</span>", lead: "Every material record with its source, date, owner and who may see it." },
  gallery: { title: "Pictures, <span>before they are published.</span>", lead: "Photographs, renderings and drawings, captioned and classified first." },
  activity: { title: "What happened, <span>in order.</span>", lead: "Every material event with who did it, on what authority, and what it changed." },
  network: { title: "How it all <span>connects.</span>", lead: "Estates, partners, authorities, documents and counterparties." },
  settings: { title: "How the platform <span>is set up.</span>", lead: "People and access, integrations, notices, evidence rules and defaults." },
  contacts: { title: "Everyone who has <span>reached us.</span>", lead: "" },
};

const designed: Record<string, readonly string[]> = {
  space: ["Property register", "Document upload", "Protection alerts", "Versioned evidence", "Visual evidence"],
  capital: ["Payment acceptance", "Ledger reconciliation", "Cashflow controls", "Invoice upload", "Distribution notice"],
  time: ["Policy publication", "Annual pool", "Allocation handoff", "Exception notice", "Entitlement export"],
  project: ["Baseline control", "Milestone evidence", "Budget variance", "Decision escalation", "Progress update"],
  partners: ["Self-serve intake", "KYC evidence", "Interest record", "Entitlement setup", "Admission notice"],
  governance: ["Agenda", "Equity-weighted voting", "Resolution execution", "Conflict record", "Minutes approval"],
  documents: ["Upload and classify", "Version and custody", "Controlled download", "Expiry alert", "Signature request"],
  activity: ["Append-only events", "Authority linkage", "Notices", "Evidence export", "Event filtering"],
  network: ["Relationship graph", "Counterparty register", "Dependency alerts", "Vehicle comparison"],
  settings: ["Rights grants", "Integration health", "Email templates", "Retention policy", "Signing controls", "Alert routing"],
};

function deriveView(path: string, requested: string | null) {
  if (path === "/office-workspace-preview") return requested || "lifecycle";
  if (requested === "gallery") return "gallery";
  if (path === "/office") return "lifecycle";
  if (path === "/office/collection") return "collection";
  if (path.startsWith("/office/network")) return "network";
  if (path.startsWith("/office/settings")) return "settings";
  return path.split("/").filter(Boolean)[3] || "vehicle";
}

function Head({ k, extra }: { k: string; extra?: React.ReactNode }) {
  const c = viewCopy[k] ?? viewCopy.vehicle;
  return (
    <header className="ws-head">
      <div><span className="eb">Office</span><h1 className="ws-h1" dangerouslySetInnerHTML={{ __html: c.title }} />{c.lead ? <p>{c.lead}</p> : null}</div>
      {extra}
    </header>
  );
}

function Figures() {
  const open = VEHICLES.filter((v) => stanceFor(v).kind === "open");
  const available = open.reduce((n, v) => n + v.offering.available, 0);
  const items = VEHICLES.reduce((n, v) => n + openItems(v).length, 0);
  return (
    <div className="ws-figs">
      <div><b>{VEHICLES.length}</b><span>Estates on the register</span></div>
      <div><b>{open.length}</b><span>Taking deposits</span></div>
      <div><b>{available}</b><span>Units available</span></div>
      <div className={items ? "warn" : ""}><b>{items}</b><span>Open items on the record</span></div>
    </div>
  );
}

function Designed({ k }: { k: string }) {
  const list = designed[k] ?? [];
  if (!list.length) return null;
  return (
    <section className="ws-section">
      <div className="ws-sec-head"><span className="eb">Designed, not yet connected</span><h2 className="ws-h2">What this place <span>will do.</span></h2>
        <p>These controls are drawn and agreed. None of them reads or writes a record yet, so none of them shows a state.</p></div>
      <div className="ws-designed">{list.map((x, i) => <div key={x} className="ws-card"><b>{String(i + 1).padStart(2, "0")}</b><span>{x}</span></div>)}</div>
    </section>
  );
}

function OfficeWorkspace({ path, params }: OfficeProps) {
  const search = useSearchParams();
  const [uploads, setUploads] = useState<File[]>([]);
  const preview = path === "/office-workspace-preview";
  const key = deriveView(path, search.get("view"));
  const slug = params?.vehicle || VEHICLES[0].slug;
  const v = vehicleBySlug(slug) ?? VEHICLES[0];
  const officeHref = (s: string) => (preview ? "/office-workspace-preview?view=vehicle" : `/office/collection/${s}`);
  const viewHref = (target: string) => {
    if (preview) return `/office-workspace-preview?view=${target}`;
    if (target === "vehicle") return `/office/collection/${v.slug}`;
    if (target === "gallery") return `/office/collection/${v.slug}?view=gallery`;
    return `/office/collection/${v.slug}/${target}`;
  };
  const uploadUrls = useMemo(() => uploads.map((file) => ({ file, url: URL.createObjectURL(file) })), [uploads]);
  const chooseFiles = (event: ChangeEvent<HTMLInputElement>) => setUploads(Array.from(event.target.files || []));
  const inVehicle = (vehicleViews as readonly string[]).includes(key);
  const current = preview ? ({ lifecycle: "Overview", collection: "Estates", contacts: "Contacts" } as Record<string, string>)[key] ?? "One estate" : undefined;

  return (
    <main className="p-hero-own">
      <WsFrame opening="office" tabs={preview ? OFFICE_PREVIEW_TABS : OFFICE_TABS} current={current} preview={preview}>
        {key === "contacts" && preview ? <DeskView people={EXAMPLE_PEOPLE} arrivals={9} preview /> : null}

        {key === "lifecycle" ? <>
          <Head k="lifecycle" extra={<Figures />} />
          <ApertureStrip hrefFor={(x) => officeHref(x.slug)} />
          <section className="ws-section">
            <div className="ws-sec-head"><span className="eb">Across the collection</span><h2 className="ws-h2">Six areas <span>the Office keeps.</span></h2>
              <p>Work happens against one estate&rsquo;s record. These areas watch, coordinate and escalate across all of them.</p></div>
            <div className="ws-areas">{generalAreas.map(([t, d], i) => <article key={t} className="ws-card"><span className="mono">{String(i + 1).padStart(2, "0")}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
          </section>
        </> : null}

        {key === "collection" ? <>
          <Head k="collection" extra={<Figures />} />
          <div className="ws-table">
            <div className="hd"><span>Estate</span><span>Stage</span><span>Offering</span><span>Open items</span><span>Next</span></div>
            {VEHICLES.map((x) => {
              const st = stanceFor(x), items = openItems(x);
              return (
                <Link key={x.key} href={officeHref(x.slug)} className="row">
                  <span><b>{x.propertyName}</b><small>{x.registeredName}</small></span>
                  <span>{LIFECYCLE_LABEL[x.lifecycle]}<small>{BUILD_LABEL[x.buildStage]}</small></span>
                  <span>{x.offering.subscribed} of {x.offering.units} subscribed<small>{st.kind === "open" ? `${st.unitsAvailable} available` : x.lifecycle === "forming" ? "Pipeline" : "Waitlist open"}</small></span>
                  <span className={items.length ? "warn" : ""}>{items.length ? `${items.length} open` : "None"}<small>{items.filter((c) => c.severity === "blocking").length} blocking</small></span>
                  <span className="next">{x.lifecycle === "forming" ? "Pipeline · not yet open" : st.kind === "open" ? "Taking deposits" : "Keep the waitlist"} →</span>
                </Link>
              );
            })}
          </div>
        </> : null}

        {inVehicle ? <>
          <Head k={key} extra={<ApertureCard v={v} opening="office" />} />
          <nav className="ws-subnav" aria-label="This estate">
            <label className="ws-pick"><span className="eb">Estate</span>
              <select value={v.slug} onChange={(e) => { if (!preview) window.location.href = `/office/collection/${e.target.value}`; }}>
                {VEHICLES.map((x) => <option key={x.key} value={x.slug}>{x.propertyName}</option>)}
              </select>
            </label>
            <div>{vehicleViews.map((x) => <Link key={x} href={viewHref(x)} aria-current={key === x ? "page" : undefined}>{VIEW_LABEL[x]}</Link>)}</div>
          </nav>

          {key === "vehicle" && !preview ? <AtlasFindings vehicle={v.slug} /> : null}

          {key === "vehicle" ? (
            <section className="ws-section">
              <div className="ws-sec-head"><span className="eb">Lifecycle</span><h2 className="ws-h2">Ten stages, <span>each with its gate.</span></h2></div>
              <ol className="ws-stages">{VEHICLE_STAGES.map((s) => (
                <li key={s.id} className="ws-card"><b className="mono">{s.id}</b><div><h3>{s.label}</h3><p>{s.purpose}</p></div><span className="gate">{s.gate}</span><em>{s.owner}</em><Link href={viewHref(stageView(s.id))}>Open →</Link></li>
              ))}</ol>
            </section>
          ) : null}

          {key === "gallery" ? (
            <section className="ws-section">
              <label className="ws-upload ws-card"><input type="file" accept="image/*" multiple onChange={chooseFiles} /><b>Add photographs, renderings or drawings</b><span>Each needs a caption and its source before it can be published.</span></label>
              <div className="ws-gallery">{uploadUrls.length
                ? uploadUrls.map(({ file, url }) => <figure key={file.name} className="ws-card"><img src={url} alt="" /><figcaption><b>{file.name}</b><span>Needs a classification</span></figcaption></figure>)
                : ["Approach", "Inside", "Landscape"].map((l) => <figure key={l} className="ws-card empty"><span>No picture yet</span><figcaption><b>{l}</b></figcaption></figure>)}</div>
              <p className="ws-note">Files chosen here remain in this browser. Publishing needs storage, a caption, a source, a visibility rule and someone with the authority to release it.</p>
            </section>
          ) : null}

          {key !== "vehicle" && key !== "gallery" ? <Designed k={key} /> : null}
        </> : null}

        {(key === "network" || key === "settings") ? <><Head k={key} /><Designed k={key} /></> : null}
      </WsFrame>
    </main>
  );
}

function stageView(id: VehicleStageId): string {
  const m: Record<VehicleStageId, string> = { "01": "governance", "02": "capital", "03": "partners", "04": "capital", "05": "partners", "06": "governance", "07": "project", "08": "time", "09": "capital", "10": "governance" };
  return m[id];
}

export function OfficeSurface(props: OfficeProps) {
  return <Suspense fallback={<main className="p-hero-own" aria-busy="true" />}><OfficeWorkspace {...props} /></Suspense>;
}
