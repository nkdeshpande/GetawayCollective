"use client";

import Link from "next/link";
import { ChangeEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { VEHICLE_STAGES, stagesForOfficeRoute, workspaceModuleOf, type VehicleStageId } from "@/constants/workspace-modules";

type OfficeProps = { path: string; params?: Record<string, string> };
type WorkRow = readonly [string, string, string, string];

const generalNavigation = ["lifecycle", "collection", "network", "settings"] as const;
const vehicleNavigation = ["vehicle", "space", "capital", "time", "project", "partners", "governance", "documents", "gallery", "activity"] as const;

const generalAreas = [
  ["A1", "Portfolio lifecycle board", "See every investment vehicle at its current stage, gate and owned exception.", "OFF-090 / OFF-100"],
  ["A2", "Financial execution", "Coordinate reconciliations, controlled payments, period close and approved distributions.", "CAPITAL COMMANDS"],
  ["A3", "Time operations", "Publish policies and entitlement pools, then hand allocations to the separate platform.", "TIME COMMANDS"],
  ["A4", "Evidence & records", "Control uploads, versions, custody, downloads, retention and visibility across vehicles.", "DOCUMENT COMMANDS"],
  ["A5", "Identity, access & signing", "Manage identity evidence, rights grants, expiries and controlled signature requests.", "SYS-110"],
  ["A6", "Operating control centre", "Monitor integrations, event delivery, notices, exceptions and operational health.", "SYS-100 / SYS-120"],
] as const;

const collectionRows: readonly WorkRow[] = [
  ["SlowSpace Coastal LLP", "07 / Space + Progress", "Delivery controlled", "Budget certification due"],
  ["Kyoto House Vehicle", "08 / Live + Time", "Time pool published", "Allocation handoff due"],
  ["Nordic Collection Vehicle", "01 / Setup", "Constitution prepared", "Authority record required"],
  ["Coastal Collection SPV I", "04 / Settlement", "Funds verified", "Closing evidence open"],
];

const stageFields: Record<VehicleStageId, readonly string[]> = {
  "01": ["LLP identity", "Constitution", "Registered office", "Authority grants", "Formation evidence"],
  "02": ["Offer thesis", "Capacity", "Unit basis", "Risk evidence", "Approval record"],
  "03": ["Prospect identity", "Accreditation", "KYC evidence", "Commitment", "Exception record"],
  "04": ["Payment instruction", "Funds receipt", "Reconciliation", "Closing documents", "Settlement notice"],
  "05": ["Admission approval", "Partner register", "Interest issuance", "Capital account", "Entitlement setup"],
  "06": ["Policies", "Authority matrix", "Compliance calendar", "Conflicts", "Resolution record"],
  "07": ["Property evidence", "Baseline", "Budget", "Milestones", "Change and risk records"],
  "08": ["Annual pool", "Entitlement calculation", "Allocation handoff", "Exceptions", "Member notice"],
  "09": ["Income and expense", "Period close", "Reserves", "Valuation", "Distribution execution"],
  "10": ["Agenda", "Board pack", "Voting", "Minutes", "Email and notice archive"],
};

const stageCapabilities: Record<VehicleStageId, readonly string[]> = {
  "01": ["Data capture", "Document upload", "Evidence validation", "Authority setup"],
  "02": ["Offer publication", "Qualified access", "Document download", "Capacity reduction"],
  "03": ["Self KYC", "Commitment capture", "Evidence upload", "Email status notices"],
  "04": ["Payment acceptance", "Receipt upload", "Reconciliation", "Settlement confirmation"],
  "05": ["Admission workflow", "Register update", "Interest record", "Entitlement creation"],
  "06": ["Rights control", "Equity-weighted ballot", "Resolution workflow", "Compliance alerts"],
  "07": ["Progress updates", "Visual evidence", "Budget variance", "Decision escalation"],
  "08": ["Pool calculation", "Allocation export", "Platform handoff", "Member notifications"],
  "09": ["Cashflow ledger", "Invoice evidence", "Close controls", "Distribution notices"],
  "10": ["Meeting workflow", "Board pack download", "Minutes approval", "Communication archive"],
};

const moduleCopy: Record<string, { eyebrow: string; title: string; lead: string; scope: string }> = {
  lifecycle: { eyebrow: "ADMIN GENERAL / CONTROL", title: "The collection, under control.", lead: "Six cross-vehicle control areas coordinate governed execution without duplicating each vehicle’s canonical record.", scope: "Admin / General" },
  collection: { eyebrow: "ADMIN GENERAL / COLLECTION", title: "Every vehicle at its current gate.", lead: "Lifecycle position, control health, exception ownership and the next required action across the collection.", scope: "Admin / General" },
  vehicle: { eyebrow: "ADMIN VEHICLE / INTAKE + CONTROL", title: "One vehicle, from setup to continuity.", lead: "Ten lifecycle stages connect formation, offer, ownership, delivery, value and board communication.", scope: "Admin / Vehicle" },
  space: { eyebrow: "ADMIN VEHICLE / SPACE", title: "Asset record and protection basis.", lead: "Property, land, buildings, fixed assets, improvements and protection controls.", scope: "Vehicle / Space" },
  capital: { eyebrow: "ADMIN VEHICLE / CAPITAL", title: "Financial truth and controlled action.", lead: "Structure, accounts, contributions, debt, income, expenses, reserves, distributions and valuation.", scope: "Vehicle / Capital" },
  time: { eyebrow: "ADMIN VEHICLE / TIME", title: "Allocation governed by policy.", lead: "Annual pool, Partner entitlement, allocation controls and governed exceptions.", scope: "Vehicle / Time" },
  project: { eyebrow: "ADMIN VEHICLE / PROJECT", title: "Delivery against the agreed baseline.", lead: "Timeline, milestones, workstreams, budget, commitments, consultants, risks and decisions.", scope: "Vehicle / Project" },
  partners: { eyebrow: "ADMIN VEHICLE / PARTNERS", title: "Ownership and participation, on record.", lead: "Partner identity, interest, capital position, time allocation, distributions and governance rights.", scope: "Vehicle / Partners" },
  governance: { eyebrow: "ADMIN VEHICLE / GOVERNANCE", title: "Constitution, authority and resolution control.", lead: "Entity, constitution, authority, resolutions, agreements, compliance, tax, conflicts and audit.", scope: "Vehicle / Governance" },
  documents: { eyebrow: "ADMIN VEHICLE / DOCUMENTS", title: "Evidence with custody and version.", lead: "Every material record carries source, effective date, accountable owner and visibility.", scope: "Vehicle / Evidence" },
  gallery: { eyebrow: "ADMIN VEHICLE / GALLERY", title: "Visual evidence, prepared for publication.", lead: "Upload, classify and caption photography, renderings and drawings before release.", scope: "Vehicle / Media" },
  activity: { eyebrow: "ADMIN VEHICLE / ACTIVITY", title: "The immutable operating ledger.", lead: "Material events connect actor, authority, source record and the state they changed.", scope: "Vehicle / Audit" },
  network: { eyebrow: "ADMIN GENERAL / NETWORK", title: "Relationships across the collection.", lead: "Vehicles, Partners, authorities, documents and counterparties in one scoped relationship graph.", scope: "Admin / General" },
  settings: { eyebrow: "ADMIN GENERAL / SETTINGS", title: "Controlled platform configuration.", lead: "People and access, integrations, notifications, evidence policy and operating defaults.", scope: "Admin / General" },
};

const capabilities: Record<string, readonly string[]> = {
  space: ["Property register", "Document upload", "Protection alerts", "Versioned evidence", "Visual evidence", "Controlled download"],
  capital: ["Payment acceptance", "Ledger reconciliation", "Cashflow controls", "Invoice upload", "Statement download", "Distribution email"],
  time: ["Policy publication", "Annual pool calculation", "Allocation handoff", "Exception notice", "Entitlement export", "Platform status"],
  project: ["Baseline control", "Milestone evidence", "Budget variance", "Decision escalation", "Progress email", "Gallery update"],
  partners: ["Self-serve intake", "KYC evidence", "Interest record", "Entitlement setup", "Admission notice", "Register download"],
  governance: ["Agenda preparation", "Equity-weighted voting", "Resolution execution", "Conflict record", "Minutes approval", "Notice archive"],
  documents: ["Upload and classify", "Version and custody", "Controlled download", "Expiry alert", "Signature request", "Visibility policy"],
  activity: ["Append-only events", "Authority linkage", "Email notices", "Evidence export", "Event filtering", "Supersession trail"],
  network: ["Relationship graph", "Counterparty register", "Dependency alerts", "Scoped drill-down", "Edge evidence", "Vehicle comparison"],
  settings: ["Rights grants", "Integration health", "Email templates", "Retention policy", "Evidence defaults", "Signing controls", "Alert routing", "Audit export"],
};

const tasks: Record<string, readonly WorkRow[]> = {
  vehicle: [["Formation record", "CURRENT", "Legal", "Open evidence"], ["Offer controls", "CURRENT", "Compliance", "Review approval"], ["Delivery gate", "ATTENTION", "Project", "Resolve evidence"], ["Board calendar", "CURRENT", "Governance", "Open schedule"]],
  space: [["Title and boundary", "VERIFIED", "Legal", "Open evidence"], ["Building register", "CURRENT", "Project", "Review record"], ["Protection cover", "DUE", "Operations", "Resolve alert"], ["Visual evidence", "CURRENT", "Project", "Open gallery"]],
  capital: [["Contribution ledger", "RECONCILED", "Finance", "Open ledger"], ["Operating cashflow", "CURRENT", "Finance", "Review period"], ["Reserve proposal", "PENDING", "Board", "Prepare approval"], ["Distribution notice", "DRAFT", "Communications", "Review email"]],
  time: [["Annual policy", "APPROVED", "Board", "Download policy"], ["Entitlement pool", "CALCULATED", "Time Office", "Review basis"], ["Allocation handoff", "PENDING", "Operations", "Send to platform"], ["Member notice", "READY", "Communications", "Review notice"]],
  project: [["Approved baseline", "CURRENT", "Project", "Open timeline"], ["Budget variance", "ATTENTION", "Finance", "Review variance"], ["Blocked decision", "PENDING", "COO", "Prepare decision"], ["Progress evidence", "DUE", "Project", "Request upload"]],
  partners: [["Partner register", "CURRENT", "Legal", "Open register"], ["KYC refresh", "DUE", "Compliance", "Request evidence"], ["Entitlements", "CONFIGURED", "Time Office", "Review allocation"], ["Admission notice", "SENT", "Communications", "Open archive"]],
  governance: [["Authority matrix", "CURRENT", "Control Office", "Open grants"], ["Board pack", "DRAFT", "Governance", "Prepare meeting"], ["Compliance calendar", "ATTENTION", "Compliance", "Resolve filing"], ["Resolution notice", "READY", "Communications", "Review notice"]],
  documents: [["Formation instrument", "EXECUTED", "Legal", "Download"], ["Title report", "VERIFIED", "Acquisition", "Download"], ["Quarterly report", "DRAFT", "Finance", "Review version"], ["Signing request", "PENDING", "Legal", "Open request"]],
  activity: [["Project baseline approved", "RECORDED", "COO", "Open event"], ["Document version issued", "RECORDED", "Legal", "Open event"], ["Authority grant expires", "ATTENTION", "Control Office", "Review grant"], ["Email notice delivered", "RECORDED", "Communications", "Open receipt"]],
  network: [["Investment vehicles", "CONNECTED", "Control Office", "Open graph"], ["Operating counterparties", "CURRENT", "Operations", "Review links"], ["Missing evidence edge", "ATTENTION", "Compliance", "Resolve edge"], ["Partner relationships", "CURRENT", "Legal", "Review scope"]],
  settings: [["People and access", "CURRENT", "Control Office", "Manage grants"], ["Connected platforms", "PARTIAL", "Technology", "Review health"], ["Notification rules", "DRAFT", "Communications", "Edit rules"], ["Evidence policy", "CURRENT", "Compliance", "Review defaults"], ["Signing controls", "CURRENT", "Legal", "Review authority"], ["Retention schedule", "DUE", "Compliance", "Prepare review"]],
};

const viewStages: Record<string, readonly VehicleStageId[]> = {
  vehicle: VEHICLE_STAGES.map((stage) => stage.id),
  space: ["07"], capital: ["02", "04", "05", "09"], time: ["08"], project: ["07"],
  partners: ["03", "04", "05"], governance: ["01", "06", "10"], documents: VEHICLE_STAGES.map((stage) => stage.id),
  gallery: ["07"], activity: VEHICLE_STAGES.map((stage) => stage.id),
};

function deriveView(path: string, requested: string | null) {
  if (path === "/office-workspace-preview") return requested || "lifecycle";
  if (requested === "gallery") return "gallery";
  if (path === "/office") return "lifecycle";
  if (path === "/office/collection") return "collection";
  if (path.startsWith("/office/network")) return "network";
  if (path.startsWith("/office/settings")) return "settings";
  const pieces = path.split("/").filter(Boolean);
  return pieces[3] || "vehicle";
}

function OfficeWorkspace({ path, params }: OfficeProps) {
  const search = useSearchParams();
  const [uploads, setUploads] = useState<File[]>([]);
  const preview = path === "/office-workspace-preview";
  const key = deriveView(path, search.get("view"));
  const route = ROUTES.find((item) => item.path === path);
  const adminGeneral = preview
    ? (generalNavigation as readonly string[]).includes(key)
    : route ? workspaceModuleOf(route) === "admin-general" : true;
  const copy = moduleCopy[key] || moduleCopy.vehicle;
  const vehicle = params?.vehicle || "slowspace-coastal";
  const base = `/office/collection/${vehicle}`;
  const detail = !preview && path.split("/").filter(Boolean).length > 4 ? route?.name : undefined;
  const navigation = adminGeneral ? generalNavigation : vehicleNavigation;
  const activeCapabilities = capabilities[key] || capabilities.vehicle;
  const activeTasks = tasks[key] || tasks.vehicle;
  const activeStageIds = route ? stagesForOfficeRoute(route) : viewStages[key] || [];
  const uploadUrls = useMemo(() => uploads.map((file) => ({ file, url: URL.createObjectURL(file) })), [uploads]);

  const go = (target: string) => {
    if (preview) return `/office-workspace-preview?view=${target}`;
    if (target === "lifecycle") return "/office";
    if (target === "collection") return "/office/collection";
    if (target === "network") return "/office/network";
    if (target === "settings") return "/office/settings";
    if (target === "vehicle") return base;
    if (target === "gallery") return `${base}?view=gallery`;
    return `${base}/${target}`;
  };

  const stageTarget = (stage: VehicleStageId) => {
    const target: Record<VehicleStageId, string> = { "01": "governance", "02": "capital", "03": "partners", "04": "capital", "05": "partners", "06": "governance", "07": "project", "08": "time", "09": "capital", "10": "governance" };
    return go(target[stage]);
  };

  const chooseFiles = (event: ChangeEvent<HTMLInputElement>) => setUploads(Array.from(event.target.files || []));

  return (
    <main className="atlas p-hero-own">
      <header className="atlas-topbar">
        <Link href="/" className="sysmark">GETAWAY COLLECTIVE</Link>
        <div><span>{preview ? "ATLAS / DESIGN PREVIEW" : `ATLAS / ${adminGeneral ? "ADMIN GENERAL" : "ADMIN VEHICLE"}`}</span><b>● SYSTEM NOMINAL</b></div>
      </header>

      <div className="atlas-grid">
        <aside className="atlas-rail">
          <div className="atlas-brand"><b>ATLAS</b><span>{adminGeneral ? "COLLECTION CONTROL" : "BY INVESTMENT VEHICLE"}</span></div>
          {adminGeneral
            ? <div className="atlas-scope"><span>OPERATING SCOPE</span><b>All investment vehicles</b><small>Cross-vehicle control</small></div>
            : <label className="atlas-selector"><span>ACTIVE VEHICLE</span><select defaultValue={vehicle}><option value={vehicle}>SlowSpace Coastal LLP</option><option value="kyoto-house">Kyoto House Vehicle</option><option value="nordic-collection">Nordic Collection Vehicle</option></select></label>}
          <nav aria-label={adminGeneral ? "Admin general" : "Admin vehicle"}>{navigation.map((item) => <Link key={item} className={key === item ? "active" : ""} href={go(item)}><span>{item === "vehicle" ? "10-stage control" : item}</span><i>→</i></Link>)}</nav>
          {adminGeneral
            ? <Link className="atlas-module-link" href={preview ? "/office-workspace-preview?view=vehicle" : base}>Enter vehicle control →</Link>
            : <Link className="atlas-module-link" href={preview ? "/office-workspace-preview?view=lifecycle" : "/office"}>← Back to admin general</Link>}
        </aside>

        <section className="atlas-main">
          <header className="atlas-hero">
            <div><span className="eyebrow">{copy.eyebrow}{detail ? ` / ${detail.toUpperCase()}` : ""}</span><h1>{detail || copy.title}</h1><p>{detail ? route?.notes || copy.lead : copy.lead}</p></div>
            <dl>
              <div><dt>IA RECORD</dt><dd>{route ? [route.ia, ...(route.coLocatedIa || [])].join(" + ") : "PROTOTYPE"}</dd></div>
              <div><dt>MODULE</dt><dd>{adminGeneral ? "ADMIN / GENERAL" : "ADMIN / VEHICLE"}</dd></div>
              <div><dt>SCOPE</dt><dd>{adminGeneral ? "ALL VEHICLES" : vehicle.toUpperCase()}</dd></div>
            </dl>
          </header>

          <div className="atlas-kpis">
            <article><span>CONTROL HEALTH</span><b>92</b><em>2 checks due</em></article>
            <article><span>EVIDENCE</span><b>84%</b><em>8 updates pending</em></article>
            <article><span>MATERIAL EXCEPTIONS</span><b>01</b><em>Owned and visible</em></article>
            <article><span>{adminGeneral ? "VEHICLES" : "CURRENT STAGE"}</span><b>{adminGeneral ? "04" : "07"}</b><em>{adminGeneral ? "Across collection" : "Space + Progress"}</em></article>
          </div>

          {activeStageIds.length && key !== "vehicle" ? <div className="atlas-stage-context"><span>RELATED VEHICLE STAGES</span><div>{VEHICLE_STAGES.filter((stage) => activeStageIds.includes(stage.id)).map((stage) => <Link key={stage.id} href={stageTarget(stage.id)}><b>{stage.id}</b>{stage.label}</Link>)}</div></div> : null}

          {key === "lifecycle" ? <>
            <div className="atlas-section-head"><div><span className="eyebrow">ADMIN GENERAL</span><h2>Six cross-vehicle control areas</h2></div><p>Execution takes place against a vehicle record. This module coordinates, monitors and escalates across the collection.</p></div>
            <div className="atlas-general-grid">{generalAreas.map(([id, title, body, ia]) => <article key={id}><span>{id}</span><h3>{title}</h3><p>{body}</p><b>{ia}</b></article>)}</div>
            <div className="atlas-collection atlas-general-table"><header><span>INVESTMENT VEHICLE</span><span>CURRENT STAGE</span><span>CONTROL STATE</span><span>NEXT REQUIRED</span></header>{collectionRows.map(([name, phase, control, next]) => <article key={name}><div><b>{name}</b><small>Canonical vehicle record</small></div><span>{phase}</span><span>{control}</span><Link href={base}>{next} →</Link></article>)}</div>
          </> : null}

          {key === "collection" ? <div className="atlas-collection"><header><span>INVESTMENT VEHICLE</span><span>CURRENT STAGE</span><span>CURRENT CONTROL</span><span>NEXT REQUIRED</span></header>{collectionRows.map(([name, phase, control, next]) => <article key={name}><div><b>{name}</b><small>Vehicle record current</small></div><span>{phase}</span><span>{control}</span><Link href={base}>{next} →</Link></article>)}</div> : null}

          {key === "vehicle" ? <>
            <div className="atlas-section-head"><div><span className="eyebrow">ADMIN VEHICLE</span><h2>Ten lifecycle stages</h2></div><p>Draft capture supports work in progress. Evidence and governed execution remain separate and traceable.</p></div>
            <div className="atlas-lifecycle"><header><span>STAGE</span><span>PURPOSE + CORE RECORDS</span><span>GATE</span><span>OWNER</span><span>OPERATE</span></header>{VEHICLE_STAGES.map((stage) => <article key={stage.id} className={stage.id === "07" ? "attention" : ""}><b>{stage.id}</b><div><h2>{stage.label}</h2><p>{stage.purpose}</p><ul>{stageFields[stage.id].map((field) => <li key={field}>{field}</li>)}</ul></div><span>{stage.gate}</span><em>{stage.owner}</em><Link href={stageTarget(stage.id)}>Open control →</Link></article>)}</div>
            <div className="atlas-stage-capabilities">{VEHICLE_STAGES.map((stage) => <article key={stage.id}><header><b>{stage.id}</b><span>{stage.label}</span></header>{stageCapabilities[stage.id].map((capability) => <label key={capability}><input type="checkbox" defaultChecked={capability !== stageCapabilities[stage.id].at(-1)} />{capability}</label>)}</article>)}</div>
          </> : null}

          {key === "gallery" ? <div className="atlas-gallery"><label className="atlas-upload"><input type="file" accept="image/*" multiple onChange={chooseFiles} /><b>UPLOAD VISUAL EVIDENCE</b><span>Photography, rendering or drawing · caption and provenance required</span></label><div className="atlas-gallery-grid">{uploadUrls.length ? uploadUrls.map(({ file, url }) => <figure key={file.name}><img src={url} alt="" /><figcaption><b>{file.name}</b><span>CLASSIFICATION REQUIRED</span></figcaption></figure>) : ["Exterior / approach", "Interior / living", "Landscape / context"].map((label) => <figure key={label} className="placeholder"><span>IMAGE SLOT</span><figcaption><b>{label}</b><span>Awaiting governed file</span></figcaption></figure>)}</div><p className="atlas-disclosure">Files selected here remain a browser preview. Publication requires storage, provenance, caption, visibility and authority records.</p></div> : null}

          {key !== "lifecycle" && key !== "collection" && key !== "vehicle" && key !== "gallery" ? <>
            <div className="atlas-capabilities"><header><span>OPERABLE CAPABILITIES</span><b>{activeCapabilities.length} / {activeCapabilities.length} DESIGNED</b></header><div>{activeCapabilities.map((capability, index) => <article key={capability}><b>{String(index + 1).padStart(2, "0")}</b><span>{capability}</span><em>{index === activeCapabilities.length - 1 ? "CONFIGURE" : "READY"}</em></article>)}</div></div>
            <div className="atlas-table"><header><span>CONTROL / RECORD</span><span>STATE</span><span>OWNER</span><span>OPERATE</span></header>{activeTasks.map(([record, state, owner, action]) => <article key={record}><b>{record}</b><span className={state === "ATTENTION" || state === "DUE" ? "attention" : ""}>{state}</span><span>{owner}</span><button type="button">{action} →</button></article>)}</div>
            <div className="atlas-actions"><div><span className="eyebrow">CONTROLLED ACTION</span><p>Every write records actor, authority, source, version, time and the resulting state transition.</p></div><button className="btn primary">Prepare controlled action</button><button className="btn">Export current view</button></div>
          </> : null}
        </section>
      </div>
    </main>
  );
}

export function OfficeSurface(props: OfficeProps) {
  return <Suspense fallback={<main className="atlas p-hero-own" aria-busy="true" />}><OfficeWorkspace {...props} /></Suspense>;
}
