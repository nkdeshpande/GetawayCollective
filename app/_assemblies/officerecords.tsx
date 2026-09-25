/**
 * OFF-096 / OFF-097 · THE INVESTOR RECORD — hand-written, not generated
 *
 * 25 Sep 2026, founder rulings of 24 Sep: the platform holds each
 * investor's KYC and the account distributions are paid to, and a partner
 * sees only the estates they hold. These two pages are where the Office
 * puts those facts on the record:
 *
 *   /office/investors             the register, and which estates are on
 *                                 the platform's record
 *   /office/investors/[investor]  one person: KYC, payment account, holdings
 *
 * Server components, like the Property Register, so rights are read from
 * the database on every render: a withdrawn grant closes a form on the next
 * navigation, not at the next token refresh.
 *
 * Every form says who may use it. A form the viewer has no right to is not
 * shown; in its place is the admin that carries the right, derived from
 * constants/admins.ts so it cannot name the wrong one.
 *
 * Nothing on these pages shows a PAN or an account number in full. They
 * are never read back: only their last four digits leave the database.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ADMINS } from "@/constants/admins";
import { ROLE_RIGHTS, type Right } from "@/lib/authority";
import {
  currentActor, encryptionReady, estatesOnRecord, investorDetail, investorLines, platformOrganization,
  type Actor, type EstateOnRecord,
} from "@/lib/office-records";
import {
  BANK_METHODS, BANK_METHOD_LABEL, KYC_STAGE_KEYS, KYC_STAGE_LABEL, KYC_STATES, VEHICLE_STATES,
  aboveVotingCap, rupeesFromMinor, suggestedVehicleState,
} from "@/lib/office-rules";
import { WsFrame, OFFICE_TABS } from "./workspace/frame";
import { ActForm, Choice, Field, Reason } from "./officeforms";

const day = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;
const words = (s: string) => s.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
const STATE_OPTIONS = KYC_STATES.map((s) => [s, words(s)] as const);

/** Which admin carries a right — derived, so it cannot name the wrong one. */
const adminFor = (right: Right) =>
  ADMINS.find((a) => a.roles.some((r) => (ROLE_RIGHTS[r] as readonly string[]).includes(right)))?.label ?? "No admin";

function Rows({ rows }: { rows: readonly (readonly [string, React.ReactNode])[] }) {
  return <dl className="iv-rows">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
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

/** A form, folded, when the viewer may use it; otherwise who can. */
function Gate({ actor, right, open, children }: { actor: Actor; right: Right; open: string; children: React.ReactNode }) {
  if (!actor.rights.includes(right)) {
    return <p className="or-locked">Only the <b>{adminFor(right)}</b> admin can do this (<code>{right}</code>).</p>;
  }
  return <details className="or-fold"><summary>{open}</summary>{children}</details>;
}

function Frame({ children }: { children: React.ReactNode }) {
  return <main className="p-hero-own"><WsFrame opening="office" tabs={OFFICE_TABS}>{children}</WsFrame></main>;
}

function SignedOut() {
  return (
    <Frame>
      <div className="ws-card iv-card iv-empty"><b>Sign in to continue.</b><p>The investor record names people and what they hold, so it needs to know who is looking.</p>
        <Link className="btn" href="/sign-in?from=/office/investors">Sign in</Link></div>
    </Frame>
  );
}

/* ── OFF-096 · /office/investors ─────────────────────────────────────── */

function EstateLine({ e, actor, orgReady }: { e: EstateOnRecord; actor: Actor; orgReady: boolean }) {
  const v = e.v;
  const suggested = suggestedVehicleState(v.lifecycle);
  return (
    <div className="row">
      <div><b>{v.propertyName}</b><small>{v.registeredName}{v.llpin ? ` · ${v.llpin}` : ""}</small></div>
      {e.row ? <>
        <div>On the record<small>{words(e.row.lifecycle)}</small></div>
        <div className={Number(e.unitsRecorded) < e.row.totalUnits ? "warn" : ""}>{e.unitsRecorded} of {e.row.totalUnits} units recorded<small>{e.positions} {e.positions === 1 ? "holding" : "holdings"}</small></div>
      </> : <>
        <div>Not on the platform&rsquo;s record<small>Nobody can be recorded as holding it yet</small></div>
        <div>
          {orgReady ? (
            <Gate actor={actor} right="vehicle.form" open="Put it on the record">
              <ActForm act="estate" submit="Record the vehicle" done="The vehicle is on the record.">
                <input type="hidden" name="estate" value={v.key} />
                <Field label="Units issued in total" name="totalUnitsIssued" type="number" min={1} step={1} required
                  hint={`The offering is ${v.offering.units} units. If the promoter also holds units, the total is higher. Every holding must add up to this.`} />
                <Field label="Reserve floor (₹)" name="reserveFloor" inputMode="decimal" required defaultValue={rupeesFromMinor(v.operating.reserveFloor)}
                  hint={v.operating.reserveFloor === null ? "The register states no reserve floor for this estate." : "As the register states it."} />
                <Field label="Reserve balance today (₹)" name="reserveBalance" inputMode="decimal" required hint="The administration reserve and sinking fund together, as the LLP's books show." />
                <Choice label="Lifecycle" name="lifecycleState" defaultValue={suggested ?? ""} required
                  options={[...(suggested ? [] : [["", "Choose"] as const]), ...VEHICLE_STATES.map((s) => [s, words(s)] as const)]}
                  hint={suggested ? "Matches the register." : `The register says “${v.lifecycle}”, which has no exact equivalent here.`} />
                <Reason />
              </ActForm>
            </Gate>
          ) : <span className="or-locked">Record Getaway Collective first</span>}
        </div>
      </>}
    </div>
  );
}

export async function InvestorRegister() {
  const actor = await currentActor();
  if (!actor) return <SignedOut />;
  const [org, estates, people] = await Promise.all([platformOrganization(), estatesOnRecord(), investorLines()]);
  const members = people.filter((p) => p.memberState === "member").length;
  const name = (key: string) => estates.find((e) => e.v.key === key)?.v.propertyName ?? key;

  return (
    <Frame>
      <header className="ws-head">
        <div><span className="eb">Office · Investors</span>
          <h1 className="ws-h1">The investor register, <span>and what each person holds.</span></h1>
          <p>A partner sees only the estates recorded against their name. Nothing reaches their view until it is recorded here, each act by the admin who holds its right, with a reason where the constitution asks for one.</p></div>
        <div className="ws-card iv-card"><Rows rows={[
          ["On the register", String(people.length)], ["Members", String(members)],
          ["Estates on the record", `${estates.filter((e) => e.row).length} of ${estates.length}`],
          ["Encryption for PAN and bank", encryptionReady() ? "Ready" : "Not set: PAN and account numbers cannot be stored"],
        ]} /></div>
      </header>

      <Section eb="The estates" title="Which estates <span>are on the record.</span>"
        note="An estate needs its vehicle record before anyone can be recorded as holding it. The record links to the estate by its register key.">
        {org ? null : (
          <div className="ws-card iv-card">
            <p className="or-lead">Getaway Collective is not on the record yet. Every vehicle names the organization that governs it (UFR-0022), so it comes first, once.</p>
            <Gate actor={actor} right="organization.register" open="Record Getaway Collective">
              <ActForm act="organization" submit="Record the organization" done="Getaway Collective is on the record.">
                <Field label="Legal name" name="legalName" required hint="Exactly as on the certificate of incorporation." />
                <Choice label="Entity type" name="entityType" required defaultValue=""
                  options={[["", "Choose"], ["private_limited", "Private limited"], ["llp", "LLP"], ["partnership", "Partnership"], ["trust", "Trust"], ["sole_proprietor", "Sole proprietor"], ["foreign_entity", "Foreign entity"]]} />
                <Field label="Registration number" name="registrationNumber" required hint="The CIN or LLPIN." />
                <Field label="Incorporated on" name="incorporatedOn" type="date" required />
                <Field label="Jurisdiction" name="jurisdiction" required placeholder="IN-KA" hint="ISO 3166 code." />
              </ActForm>
            </Gate>
          </div>
        )}
        <div className="ws-table or-table or-estates">
          <div className="hd"><span>Estate</span><span>Record</span><span>Units</span></div>
          {estates.map((e) => <EstateLine key={e.v.key} e={e} actor={actor} orgReady={!!org} />)}
        </div>
      </Section>

      <Section eb="The register" title="Everyone <span>on it.</span>">
        {people.length ? (
          <div className="ws-table or-table">
            <div className="hd"><span>Investor</span><span>Standing</span><span>KYC</span><span>Paid to</span><span>Holds</span></div>
            {people.map((p) => (
              <Link key={p.id} className="row" href={`/office/investors/${p.id}`}>
                <div><b>{p.legalName}</b><small>{p.email ?? "No sign-in address"}</small></div>
                <div>{p.memberState === "member" ? "Member" : "Investor"}</div>
                <div className={p.kycState === "verified" ? "" : "warn"}>{p.kycState ? words(p.kycState) : "Not recorded"}</div>
                <div>{p.bankLast4 ? `•••• ${p.bankLast4}` : "Not recorded"}</div>
                <div>{p.holdings.length ? p.holdings.map((h) => `${name(h.key)} · ${h.units}`).join(", ") : "Nothing yet"}</div>
              </Link>
            ))}
          </div>
        ) : <div className="ws-card iv-card iv-empty"><b>Nobody is on the register yet.</b><p>Add the first investor below. Registration confers nothing by itself: no accreditation, no membership, no estate.</p></div>}
      </Section>

      <Section eb="Add an investor" title="Put a person <span>on the register.</span>"
        note="They are recognised on sign-in by this address, so it must be the one they sign in with. One record per address.">
        <Gate actor={actor} right="investor.register" open="Add an investor">
          <ActForm act="investor" submit="Add to the register" done="Added. Open their record to add KYC, a payment account and holdings.">
            <Field label="Legal name" name="legalName" required hint="As on their PAN or passport." />
            <Field label="Sign-in address" name="email" type="email" required />
            <Field label="Tax residence" name="taxJurisdiction" required placeholder="IN" hint="ISO 3166 code, such as IN or IN-KA." />
          </ActForm>
        </Gate>
      </Section>
    </Frame>
  );
}

/* ── OFF-097 · /office/investors/[investor] ──────────────────────────── */

const HISTORY_LABEL: Record<string, string> = {
  InvestorRegistered: "Added to the register", KycRecorded: "KYC recorded", BankAccountRecorded: "Payment account recorded",
  OwnershipPositionOpened: "Holding recorded", MemberStatePromoted: "Became a Member",
};

export async function InvestorRecord({ investor }: { investor: string }) {
  const actor = await currentActor();
  if (!actor) return <SignedOut />;
  const [d, estates] = await Promise.all([investorDetail(investor), estatesOnRecord()]);
  if (!d) notFound();
  const p = d.profile, b = p.bank;
  const name = (key: string) => estates.find((e) => e.v.key === key)?.v.propertyName ?? key;
  const open = estates.filter((e) => e.row && !d.holdings.some((h) => h.key === e.v.key));
  const ready = encryptionReady();

  return (
    <Frame>
      <header className="ws-head">
        <div><span className="eb"><Link href="/office/investors">Investors</Link> · Record</span>
          <h1 className="ws-h1">{p.legalName}<span>.</span></h1>
          <p>What this person&rsquo;s own profile shows them comes from this record, masked. Every change here is an act with its author and date, listed at the foot of the page.</p></div>
        <div className="ws-card iv-card"><Rows rows={[
          ["Sign-in address", d.email ?? "None"], ["Tax residence", p.taxJurisdiction],
          ["Standing", p.memberState === "member" ? `Member since ${day(p.becameMemberOn) ?? "settlement"}` : "Investor, not yet a Member"],
          ["Accreditation", words(p.accreditationState) + (p.accreditationExpiresOn ? ` · until ${day(p.accreditationExpiresOn)}` : "")],
        ]} /></div>
      </header>

      <Section eb="KYC" title="Who they are, <span>checked.</span>"
        note="Verified only when all six checks are, with the date. The PAN is stored encrypted; only its last four characters are ever shown.">
        <div className="ws-card iv-card"><Rows rows={[
          ["Overall", p.kycState ? words(p.kycState) : "Not recorded"],
          ...KYC_STAGE_KEYS.map((k) => [KYC_STAGE_LABEL[k], p.kycStages?.[k] ? words(p.kycStages[k]) : "Not recorded"] as const),
          ["Verified on", day(p.kycVerifiedOn) ?? "Not yet"], ["Review due", day(p.kycReviewDueOn) ?? "Not set"],
          ["PAN", p.panLast4 ? `••••••${p.panLast4}` : "Not on record"],
        ]} /></div>
        <Gate actor={actor} right="kyc.record" open="Record KYC">
          <ActForm act="kyc" investorId={d.id} submit="Record KYC" done="KYC recorded.">
            {KYC_STAGE_KEYS.map((k) => <Choice key={k} label={KYC_STAGE_LABEL[k]} name={`stage.${k}`} options={STATE_OPTIONS} defaultValue={p.kycStages?.[k] ?? "not_started"} />)}
            <Choice label="Overall" name="kycState" options={STATE_OPTIONS} defaultValue={p.kycState ?? "not_started"} />
            <Field label="Verified on" name="verifiedOn" type="date" hint="Required when the overall state is verified." />
            <Field label="Review due" name="reviewDueOn" type="date" />
            <Field label="PAN" name="pan" autoComplete="off" placeholder={p.panLast4 ? "Leave blank to keep it" : "ABCDE1234F"} disabled={!ready}
              hint={ready ? "Optional. Stored encrypted; never shown again in full." : "Unavailable: no encryption key is set for this deployment."} />
            <Reason hint="What the checks rest on: the documents held, or the screening run. Kept with the act." />
          </ActForm>
        </Gate>
      </Section>

      <Section eb="Payment account" title="Where distributions <span>are paid.</span>"
        note="The account number is stored encrypted and never shown again in full. Recorded by the Capital admin, never by the Office admin that makes payments, so no one admin can both redirect a payment and make it.">
        <div className="ws-card iv-card"><Rows rows={[
          ["Account holder", b.holder ?? "Not on record"], ["Bank", b.name ?? "Not on record"],
          ["Account", b.last4 ? `•••• •••• ${b.last4}` : "Not on record"], ["IFSC", b.ifsc ?? "Not on record"],
          ["Verified", b.verifiedOn ? `${b.method ? words(b.method) + ", " : ""}${day(b.verifiedOn)}` : b.method ? `${words(b.method)}, no date` : "Not yet"],
        ]} /></div>
        {ready ? (
          <Gate actor={actor} right="bank.record" open={b.last4 ? "Change the payment account" : "Record a payment account"}>
            <ActForm act="bank" investorId={d.id} submit="Record the account" done="The payment account is recorded.">
              <Field label="Account holder" name="holder" required hint="As the bank holds it." />
              <Field label="Bank" name="bankName" required />
              <Field label="IFSC" name="ifsc" required autoComplete="off" placeholder="HDFC0001234" />
              <Field label="Account number" name="account" required autoComplete="off" inputMode="numeric" />
              <Field label="Account number, again" name="accountAgain" required autoComplete="off" inputMode="numeric" hint="Typed twice; the two must match." />
              <Choice label="Verified by" name="method" required options={BANK_METHODS.map((m) => [m, BANK_METHOD_LABEL[m]] as const)} />
              <Field label="Verified on" name="verifiedOn" type="date" />
              <Reason hint="Why the account is being recorded or changed, and on whose instruction." />
            </ActForm>
          </Gate>
        ) : <p className="or-locked">An account cannot be recorded until an encryption key (<code>PII_ENCRYPTION_KEY</code>) is set for this deployment. An account number is never stored in the clear.</p>}
      </Section>

      <Section eb="Holdings" title="What they hold, <span>estate by estate.</span>"
        note="Transcribed from each LLP's own register of partners, which governs. The voting share is worked out from units, never typed. The first holding recorded makes the person a Member, and that cannot be undone.">
        {d.holdings.length ? (
          <div className="ws-table or-table">
            <div className="hd"><span>Estate</span><span>Units</span><span>Votes</span><span>Class</span><span>Recorded</span></div>
            {d.holdings.map((h) => (
              <div className="row" key={h.key}>
                <div><b>{name(h.key)}</b></div><div>{h.units}</div>
                <div className={aboveVotingCap(h.votingPercent) ? "warn" : ""}>{h.votingPercent}%{aboveVotingCap(h.votingPercent) ? <small>Above the 10% cap; needs Board approval (UFR-0243)</small> : null}</div>
                <div>{h.ownershipClass}</div><div>{day(h.recordedOn)}</div>
              </div>
            ))}
          </div>
        ) : <div className="ws-card iv-card iv-empty"><b>No holding is recorded.</b><p>Until one is, this person&rsquo;s partner view shows no estate.</p></div>}
        {open.length ? (
          <Gate actor={actor} right="position.record" open="Record a holding">
            <ActForm act="position" investorId={d.id} submit="Record the holding" done="The holding is recorded.">
              <Choice label="Estate" name="estate" required options={open.map((e) => [e.v.key, `${e.v.propertyName} · ${e.unitsRecorded} of ${e.row!.totalUnits} recorded`] as const)} />
              <Field label="Units" name="units" required inputMode="decimal" />
              <Field label="Class" name="ownershipClass" defaultValue="A" required />
              <Field label="Settled on" name="settledOn" type="date" required hint="The date the commitment settled, from the LLP's register." />
              <Reason hint="Cite the LLP register entry this transcribes." />
            </ActForm>
          </Gate>
        ) : <p className="or-locked">{estates.some((e) => e.row) ? "Every estate on the record already has a holding for this person." : "No estate is on the record yet. Put one on the record from the Investors page first."}</p>}
      </Section>

      <Section eb="History" title="Every act <span>on this record.</span>">
        {d.history.length ? (
          <ol className="or-history">{d.history.map((h, i) => (
            <li key={i}><b>{HISTORY_LABEL[h.type] ?? words(h.type)}</b><span>{day(h.at)}</span>{h.reason ? <em>{h.reason}</em> : null}</li>
          ))}</ol>
        ) : <p className="ws-note">Nothing recorded yet.</p>}
      </Section>
    </Frame>
  );
}
