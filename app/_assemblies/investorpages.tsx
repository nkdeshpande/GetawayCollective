"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type InvestorSurfaceProps = { path: string; vehicle?: string; param?: string };

const tabs = [
  ["Overview", ""], ["Asset", "/asset"], ["Financials", "/financials"], ["Structure", "/structure"], ["Risks", "/risks"], ["Dataroom", "/dataroom"], ["Commit", "/commit"],
] as const;

const content: Record<string, { eyebrow: string; title: string; lead: string; evidence: string[]; action: string; note: string }> = {
  overview: { eyebrow: "PRIVATE DOSSIER / INVESTOR-CONFIDENTIAL", title: "Examine the whole position.", lead: "A private view of the vehicle, its asset, economics, legal basis and evidence. Read each layer before deciding whether to proceed.", evidence: ["Vehicle formation record", "Asset and delivery basis", "Capital and capacity position"], action: "Review the asset", note: "This is qualified disclosure, not an offer or a promise of outcome." },
  asset: { eyebrow: "DILIGENCE / SPACE", title: "The asset has to hold.", lead: "Read the asset brief alongside title, survey, approved drawings and the professional evidence that describes its current condition.", evidence: ["Title and boundary record", "Survey and approved drawing", "Asset register and certifications"], action: "Review financials", note: "Source material is versioned. A visual is never a substitute for the record." },
  financials: { eyebrow: "DILIGENCE / CAPITAL", title: "Economics, with their basis visible.", lead: "Contribution, reserve, debt, model assumptions and distribution logic are distinct layers. Each figure should lead back to its evidence.", evidence: ["Approved financial model", "Authoritative ledger and bank basis", "Valuation evidence and date"], action: "Review structure", note: "Modelled figures are illustrations, not forecasts or guarantees." },
  structure: { eyebrow: "DILIGENCE / GOVERNANCE", title: "Know what you are joining.", lead: "The vehicle constitution records the interest, authority, decision thresholds and relationship between ownership and governance.", evidence: ["Executed LLP instrument", "Formation and statutory record", "Authority and resolution record"], action: "Review risks", note: "Rights attach to the recorded ownership position and the governing instrument." },
  risks: { eyebrow: "DILIGENCE / RISK", title: "Start with how this can fail.", lead: "Asset, delivery, liquidity, regulatory and governance risks must be read before any commitment can be prepared.", evidence: ["Current risk register", "Material-event record", "Risk acknowledgement version"], action: "Open the dataroom", note: "Acknowledgement is recorded against identity, version and time when this workflow is connected." },
  dataroom: { eyebrow: "EVIDENCE REGISTER / PROVENANCE", title: "Read the evidence itself.", lead: "Documents are organised as an evidence record: source, custody, version, effective date and the question each item can answer.", evidence: ["Legal and formation", "Asset and technical", "Finance, risk and governance"], action: "Prepare a commitment", note: "Downloads and access events are recorded when the document capability is connected." },
  commit: { eyebrow: "PRIVATE TRANSACTION RECORD", title: "A commitment is prepared, never improvised.", lead: "Eligibility, offering status, capacity, subscription evidence and funding verification must all be true before admission can be prepared.", evidence: ["Accreditation valid", "Offering open and capacity available", "Subscription and funding evidence"], action: "Speak with Investor Relations", note: "Nothing on this page creates a commitment. The executed instrument and verified funds govern." },
  speak: { eyebrow: "INVESTOR RELATIONS / HANDOFF", title: "Continue with context intact.", lead: "Request a conversation without repeating your diligence path. Investor Relations receives the vehicle and the material you have reviewed.", evidence: ["Vehicle context retained", "Diligence path retained", "Meeting request recorded"], action: "Request a conversation", note: "A conversation does not create eligibility, a commitment or a capacity hold." },
};

function keyFor(path: string) { if (path === "/invest/qualify") return "qualify"; if (path.endsWith("/speak")) return "speak"; return path.split("/").at(-1) === "invest" ? "overview" : path.split("/").at(-1) ?? "overview"; }

function InvestorWorkspace({ path, vehicle, param }: InvestorSurfaceProps) {
  const search = useSearchParams();
  const preview = path === "/investor-workspace-preview";
  const requested = search.get("view");
  const key = preview && requested && content[requested] ? requested : keyFor(path);
  if (key === "qualify") return <main className="investor-surface qualification"><header><Link href="/" className="sysmark">GETAWAY COLLECTIVE</Link><span>QUALIFICATION / 01 OF 16</span></header><section><span className="eyebrow">INVESTOR QUALIFICATION</span><h1>Establish the basis to examine an offering.</h1><p>This resumable qualification record establishes identity, eligibility and the disclosures appropriate to you. It is not a commitment.</p><ol><li>Identity and contact basis</li><li>Qualification and suitability</li><li>Risk, tax and source-of-funds record</li><li>Compliance review and decision</li></ol><button className="btn primary">Begin qualification</button><p className="investor-note">A decision is recorded with its evidence. Where human review is required, the case remains visible rather than silently progressing.</p></section></main>;
  const actualVehicle = preview ? "preview-vehicle" : vehicle ?? param ?? "vehicle";
  const item = content[key] ?? content.overview;
  const base = `/invest/${actualVehicle}`;
  const href = (suffix: string) => preview ? `/investor-workspace-preview?view=${suffix.replace(/^\//, "") || "overview"}` : base + suffix;
  return <main className="investor-surface"><header><Link href="/" className="sysmark">GETAWAY COLLECTIVE</Link><span>{preview ? "DESIGN PREVIEW / PLACEHOLDER MATERIAL" : `INVESTOR-CONFIDENTIAL / ${actualVehicle.toUpperCase()}`}</span></header><div className="investor-shell"><aside><span className="eyebrow">PRIVATE REVIEW</span><h2>One vehicle.<br />One record.</h2><nav>{tabs.map(([label, suffix]) => <Link key={label} className={key === (suffix ? suffix.slice(1) : "overview") ? "active" : ""} href={href(suffix)}>{label}</Link>)}</nav><Link className="investor-speak" href={href("/speak")}>Speak with IR →</Link></aside><section className="investor-main"><span className="eyebrow">{item.eyebrow}</span><h1>{item.title}</h1><p className="investor-lead">{item.lead}</p><div className="investor-proof"><span>WHAT SUPPORTS THIS VIEW</span>{item.evidence.map((e, i) => <article key={e}><b>0{i + 1}</b><p>{e}</p><em>Verified record →</em></article>)}</div><div className="investor-action"><p>{item.note}</p><Link className="btn primary" href={href(key === "overview" ? "/asset" : key === "asset" ? "/financials" : key === "financials" ? "/structure" : key === "structure" ? "/risks" : key === "risks" ? "/dataroom" : key === "dataroom" ? "/commit" : "/speak")}>{item.action}</Link></div></section></div></main>;
}

export function InvestorSurface(props: InvestorSurfaceProps) {
  return <Suspense fallback={<main className="investor-surface" aria-busy="true" />}><InvestorWorkspace {...props} /></Suspense>;
}
