/**
 * THE INVESTOR RECORD — the Office's write path, and what it reads back
 *
 * SERVER ONLY. 25 Sep 2026.
 *
 * Until today nothing wrote the institutional tables: the command layer
 * emitted events, and /api/office/property stored those, but no investor,
 * vehicle or position row had ever been written by the platform. This is
 * the first path that does, for the six acts the investor record needs:
 *
 *   RegisterOrganization   Getaway Collective itself, once — every vehicle
 *                          row must name its governing organization
 *   FormInvestmentVehicle  an estate on the register gets its vehicle row,
 *                          linked by register_key (UFR-0028)
 *   RegisterInvestor       a person, under the address they sign in with
 *   RecordKyc              the six checks, and the PAN encrypted
 *   RecordBankAccount      the distribution account, encrypted
 *   RecordRegisterEntry    a settled holding, from the LLP's own register
 *
 * ── ONE TRANSACTION, EVENT AND ROW TOGETHER ─────────────────────────
 * `execute()` runs the constitutional envelope (authority, reason,
 * conflict) and collects the events. Then the events and the row they
 * describe are written in ONE database transaction. Written separately,
 * a failure between the two leaves either a row no event explains (E-01)
 * or an event claiming a change that never happened. Neither is possible
 * here: both land or neither does.
 *
 * ── RULES CHECKED TWICE, ON PURPOSE ─────────────────────────────────
 * The checks that depend on other rows (one record per address, units
 * recorded never above units issued, one vehicle per estate) are made
 * before the envelope, so the Office gets a plain refusal early, and made
 * again inside the transaction under a lock, so two people pressing save
 * at once cannot both pass. The first check is courtesy; the second is
 * the control.
 *
 * ── WHAT NEVER LEAVES THIS FILE ─────────────────────────────────────
 * A PAN or an account number in the clear. Each is encrypted (lib/pii.ts)
 * before anything else happens, the ciphertext goes only to its column,
 * and no event payload, response or log line carries either.
 */

import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { and, desc, eq, sql } from "drizzle-orm";
import { auth } from "../auth";
import { grantsFor, rightsFrom } from "./auth/grants";
import { execute, type CommandName } from "./commands";
import { EventLog, validateEvent, type EventEnvelope, type EventType } from "./events";
import { SessionAudit, type Grant, type Right } from "./authority";
import { eventLog } from "./events/schema";
import { encryptPii, last4, piiReady } from "./pii";
import { profileOf, type InvestorProfile } from "./investors";
import { investor, investment_vehicle, organization, ownership_position } from "../generated/db-schema";
import { VEHICLES, type Vehicle } from "../constants/vehicles";
import {
  FormVehicleBody, RecordBankBody, RecordKycBody, RecordPositionBody, RegisterInvestorBody, RegisterOrganizationBody,
  aboveVotingCap, conservationRefusal, isUuid, kycRefusal, votingPercent,
} from "./office-rules";

const byKey = (k: string): Vehicle | undefined => VEHICLES.find((x) => x.key === k);

const g = globalThis as unknown as { __gcRecSql?: ReturnType<typeof postgres>; __gcRecDb?: ReturnType<typeof drizzle> };
function db() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!g.__gcRecDb) {
    g.__gcRecSql ??= postgres(url, { max: 3, prepare: false });
    g.__gcRecDb = drizzle(g.__gcRecSql);
  }
  return g.__gcRecDb;
}
type Db = NonNullable<ReturnType<typeof db>>;
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

/** A refusal written for the person reading it. Never a status word alone. */
export class Refusal extends Error {
  constructor(message: string, readonly status = 409) { super(message); }
}

export type ActResult = { ok: true; objectId: string; events: readonly { eventId: string; type: EventType }[] } | { ok: false; status: number; error: string };

/* ── Who is acting ───────────────────────────────────────────────────── */

export interface Actor { readonly identityId: string; readonly grants: readonly Grant[]; readonly rights: readonly Right[] }

export async function currentActor(): Promise<Actor | null> {
  const session = await auth().catch(() => null);
  const identityId = session?.user?.id ?? null; // vocab-lint-ignore — Auth.js field name
  if (!identityId) return null;
  const grants = await grantsFor(identityId).catch(() => [] as Grant[]);
  return { identityId, grants, rights: rightsFrom(grants) };
}

/* ── The envelope, then the transaction ──────────────────────────────── */

async function act(actor: Actor, spec: {
  name: CommandName; vehicleId?: string; reason?: string; objectId: string;
  emit: (emit: (type: EventType, objectId: string, payload: Record<string, unknown>) => void) => void;
  write: (tx: Tx) => Promise<void>;
}): Promise<ActResult> {
  /* created_by is a uuid column. Auth.js mints uuids, but an id that is
     not one would fail at the insert with a message nobody could act on. */
  if (!isUuid(actor.identityId)) return { ok: false, status: 500, error: "This sign-in has an identity the record cannot attribute an act to." };
  const d = db();
  if (!d) return { ok: false, status: 503, error: "No database is configured for this deployment, so nothing can be recorded." };

  const now = new Date().toISOString();
  const correlationId = `${spec.name}-${randomUUID()}`;
  const audit = new SessionAudit();
  audit.open(correlationId, actor.identityId, now);
  const result = execute(spec.name, {
    identityId: actor.identityId, sessionId: correlationId, now, correlationId,
    vehicleId: spec.vehicleId, reason: spec.reason, grants: actor.grants,
  }, new EventLog(), audit, (emit) => spec.emit(emit));
  /* The envelope's refusal names the law it rests on; it is passed on as written. */
  if (!result.ok) return { ok: false, status: 403, error: result.error ?? "Refused." };

  try {
    await d.transaction(async (tx) => {
      await spec.write(tx);
      for (const e of result.events) await insertEvent(tx, e);
    });
  } catch (e) {
    if (e instanceof Refusal) return { ok: false, status: e.status, error: e.message };
    console.error(`[office-records] ${spec.name} failed`, (e as Error).message);
    return { ok: false, status: 500, error: "The record could not be written. Nothing was changed." };
  }
  return { ok: true, objectId: spec.objectId, events: result.events.map((e) => ({ eventId: e.eventId, type: e.type })) };
}

async function insertEvent(tx: Tx, e: EventEnvelope) {
  validateEvent(e);
  await tx.insert(eventLog).values({
    eventId: e.eventId, type: e.type, occurredAt: e.occurredAt, actorId: e.actorId,
    objectType: e.objectType, objectId: e.objectId, causedByCommand: e.causedByCommand,
    correlationId: e.correlationId, reason: e.reason ?? null, payload: e.payload as Record<string, unknown>,
  });
}

/** Serialise two saves of the same key inside one transaction. */
const lock = (tx: Tx, key: string) => tx.execute(sql`select pg_advisory_xact_lock(hashtext(${key}))`);

const parseOr = <T>(schema: { safeParse: (x: unknown) => { success: true; data: T } | { success: false; error: { issues: { message: string }[] } } }, body: unknown): T => {
  const r = schema.safeParse(body);
  if (!r.success) throw new Refusal(r.error.issues[0]?.message ?? "That form is incomplete.", 400);
  return r.data;
};

const refuse = (e: unknown): ActResult => {
  if (e instanceof Refusal) return { ok: false, status: e.status, error: e.message };
  throw e;
};

/* ── Reads ───────────────────────────────────────────────────────────── */

/** The asset platform — Getaway Collective — if it is on the record. */
export async function platformOrganization() {
  const d = db();
  if (!d) return null;
  const rows = await d.select().from(organization).where(eq(organization.role_in_enterprise, "asset_platform")).limit(2);
  return rows[0] ?? null;
}

export interface EstateOnRecord {
  readonly v: Vehicle;
  readonly row: { id: string; totalUnits: number; lifecycle: string; reserveFloor: string; reserveBalance: string } | null;
  readonly unitsRecorded: string;
  readonly positions: number;
}

export async function estatesOnRecord(): Promise<readonly EstateOnRecord[]> {
  const d = db();
  const rows = d ? await d.select().from(investment_vehicle) : [];
  const sums = d ? await d.select({
    vehicle: ownership_position.vehicle_id,
    units: sql<string>`coalesce(sum(${ownership_position.units_held}), 0)::text`,
    n: sql<number>`count(*)::int`,
  }).from(ownership_position).groupBy(ownership_position.vehicle_id) : [];
  return VEHICLES.map((v) => {
    const r = rows.find((x) => x.register_key === v.key);
    const s = r ? sums.find((x) => x.vehicle === r.id) : undefined;
    return {
      v,
      row: r ? { id: r.id, totalUnits: r.total_units_issued, lifecycle: r.lifecycle_state, reserveFloor: String(r.reserve_floor_amount), reserveBalance: String(r.reserve_balance) } : null,
      unitsRecorded: s ? String(Number(s.units)) : "0",
      positions: s?.n ?? 0,
    };
  });
}

export interface InvestorLine {
  readonly id: string; readonly legalName: string; readonly email: string | null;
  readonly memberState: string; readonly kycState: string | null; readonly bankLast4: string | null;
  readonly holdings: readonly { key: string; units: string }[];
}

export async function investorLines(): Promise<readonly InvestorLine[]> {
  const d = db();
  if (!d) return [];
  const people = await d.select().from(investor).orderBy(investor.legal_name);
  const held = await d.select({ investor: ownership_position.investor_id, key: investment_vehicle.register_key, units: ownership_position.units_held })
    .from(ownership_position).innerJoin(investment_vehicle, eq(ownership_position.vehicle_id, investment_vehicle.id));
  return people.map((p) => ({
    id: p.id, legalName: p.legal_name, email: p.email, memberState: p.member_state, kycState: p.kyc_state, bankLast4: p.bank_account_last4,
    holdings: held.filter((h) => h.investor === p.id && h.key).map((h) => ({ key: h.key!, units: String(Number(h.units)) })),
  }));
}

export interface InvestorDetail {
  readonly id: string; readonly email: string | null; readonly profile: InvestorProfile;
  readonly holdings: readonly { key: string; units: string; votingPercent: string; ownershipClass: string; recordedOn: string }[];
  readonly history: readonly { type: string; at: string; reason: string | null }[];
}

export async function investorDetail(id: string): Promise<InvestorDetail | null> {
  const d = db();
  if (!d || !isUuid(id)) return null;
  const [p] = await d.select().from(investor).where(eq(investor.id, id)).limit(1);
  if (!p) return null;
  const held = await d.select({
    key: investment_vehicle.register_key, units: ownership_position.units_held, voting: ownership_position.voting_rights_percent,
    cls: ownership_position.ownership_class, at: ownership_position.created_at,
  }).from(ownership_position).innerJoin(investment_vehicle, eq(ownership_position.vehicle_id, investment_vehicle.id))
    .where(eq(ownership_position.investor_id, id));
  /* The acts on this person: registration, KYC, bank, and any position
     opened for them. Types, dates and reasons only — the payloads are not
     read here, and never carry a number in the clear anyway. */
  const history = await d.select({ type: eventLog.type, at: eventLog.occurredAt, reason: eventLog.reason }).from(eventLog)
    .where(sql`${eventLog.objectId} = ${id} or ${eventLog.payload}->>'investorId' = ${id}`)
    .orderBy(desc(eventLog.occurredAt)).limit(50);
  return {
    id: p.id, email: p.email, profile: profileOf(p),
    holdings: held.filter((h) => h.key).map((h) => ({
      key: h.key!, units: String(Number(h.units)), votingPercent: String(Number(h.voting)), ownershipClass: h.cls,
      recordedOn: h.at.toISOString(),
    })),
    history: history.map((h) => ({ type: h.type, at: h.at, reason: h.reason })),
  };
}

export const encryptionReady = piiReady;

/* ── The six acts ────────────────────────────────────────────────────── */

export async function registerOrganization(actor: Actor, body: unknown): Promise<ActResult> {
  try {
    const b = parseOr(RegisterOrganizationBody, body);
    if (await platformOrganization()) throw new Refusal("Getaway Collective is already on the record. It is registered once.");
    const id = randomUUID();
    return await act(actor, {
      name: "RegisterOrganization", objectId: id,
      emit: (emit) => emit("OrganizationRegistered", id, { legalName: b.legalName, entityType: b.entityType, jurisdiction: b.jurisdiction, role: "asset_platform" }),
      write: async (tx) => {
        await lock(tx, "organization:asset_platform");
        const again = await tx.select({ id: organization.id }).from(organization).where(eq(organization.role_in_enterprise, "asset_platform")).limit(1);
        if (again.length) throw new Refusal("Getaway Collective is already on the record. It is registered once.");
        await tx.insert(organization).values({
          id, created_by: actor.identityId, legal_name: b.legalName, entity_type: b.entityType, jurisdiction: b.jurisdiction,
          registration_number: b.registrationNumber, incorporated_on: b.incorporatedOn, role_in_enterprise: "asset_platform",
        });
      },
    });
  } catch (e) { return refuse(e); }
}

export async function formVehicle(actor: Actor, body: unknown): Promise<ActResult> {
  try {
    const b = parseOr(FormVehicleBody, body);
    const v = byKey(b.estate);
    if (!v) throw new Refusal("That estate is not on the register.", 400);
    const org = await platformOrganization();
    if (!org) throw new Refusal("Put Getaway Collective on the record first. Every vehicle names the organization that governs it (UFR-0022).");
    const id = randomUUID();
    return await act(actor, {
      name: "FormInvestmentVehicle", reason: b.reason, objectId: id,
      emit: (emit) => emit("InvestmentVehicleFormed", id, {
        estate: v.key, registeredName: v.registeredName, llpin: v.llpin, totalUnitsIssued: b.totalUnitsIssued, lifecycleState: b.lifecycleState,
      }),
      write: async (tx) => {
        await lock(tx, `vehicle:${v.key}`);
        const again = await tx.select({ id: investment_vehicle.id }).from(investment_vehicle).where(eq(investment_vehicle.register_key, v.key)).limit(1);
        if (again.length) throw new Refusal(`${v.registeredName} already has its vehicle record.`);
        await tx.insert(investment_vehicle).values({
          id, created_by: actor.identityId, vehicle_name: v.registeredName, vehicle_form: "llp", governing_organization_id: org.id,
          total_units_issued: b.totalUnitsIssued, reserve_floor_amount: b.reserveFloor, reserve_balance: b.reserveBalance,
          approved_leverage_limit: null, lifecycle_state: b.lifecycleState, register_key: v.key,
        });
      },
    });
  } catch (e) { return refuse(e); }
}

const emailTaken = async (t: Pick<Db, "select">, email: string) =>
  (await t.select({ id: investor.id }).from(investor).where(sql`lower(${investor.email}) = ${email}`).limit(1)).length > 0;

export async function registerInvestor(actor: Actor, body: unknown): Promise<ActResult> {
  try {
    const b = parseOr(RegisterInvestorBody, body);
    const d = db();
    /* One record per address. Two would lock the person out: the sign-in
       link fails closed on an ambiguous address (lib/investors.ts). */
    if (d && await emailTaken(d, b.email)) throw new Refusal("An investor is already registered under that address.");
    const id = randomUUID();
    return await act(actor, {
      name: "RegisterInvestor", objectId: id,
      emit: (emit) => emit("InvestorRegistered", id, { taxJurisdiction: b.taxJurisdiction }),
      write: async (tx) => {
        await lock(tx, `investor-email:${b.email}`);
        if (await emailTaken(tx, b.email)) throw new Refusal("An investor is already registered under that address.");
        await tx.insert(investor).values({
          id, created_by: actor.identityId, legal_name: b.legalName, email: b.email, tax_jurisdiction: b.taxJurisdiction,
          member_state: "investor", accreditation_state: "none",
        });
      },
    });
  } catch (e) { return refuse(e); }
}

async function mustExist(investorId: string) {
  const d = db();
  if (!d || !isUuid(investorId)) throw new Refusal("No such investor.", 404);
  const [p] = await d.select().from(investor).where(eq(investor.id, investorId)).limit(1);
  if (!p) throw new Refusal("No such investor.", 404);
  return p;
}

const bump = { updated_at: sql`now()`, version: sql`${investor.version} + 1` };

export async function recordKyc(actor: Actor, investorId: string, body: unknown): Promise<ActResult> {
  try {
    const b = parseOr(RecordKycBody, body);
    await mustExist(investorId);
    const why = kycRefusal({ kycState: b.kycState, stages: b.stages, verifiedOn: b.verifiedOn || undefined });
    if (why) throw new Refusal(why, 400);
    if (b.pan && !piiReady()) throw new Refusal("The PAN cannot be stored: this deployment has no encryption key (PII_ENCRYPTION_KEY). Save without it, or ask for the key to be set.", 503);
    /* Encrypted before the envelope runs, so the clear value exists for as
       short a time as possible and never reaches an event. */
    const pan = b.pan ? { pan_ciphertext: encryptPii(b.pan), pan_last4: last4(b.pan) } : {};
    return await act(actor, {
      name: "RecordKyc", reason: b.reason, objectId: investorId,
      emit: (emit) => emit("KycRecorded", investorId, {
        state: b.kycState, stages: b.stages, verifiedOn: b.verifiedOn || null, reviewDueOn: b.reviewDueOn || null, panChanged: Boolean(b.pan),
      }),
      write: async (tx) => {
        await tx.update(investor).set({
          kyc_state: b.kycState, kyc_stages: b.stages,
          kyc_verified_on: b.verifiedOn ? new Date(b.verifiedOn) : null,
          kyc_review_due_on: b.reviewDueOn ? new Date(b.reviewDueOn) : null,
          ...pan, ...bump,
        }).where(eq(investor.id, investorId));
      },
    });
  } catch (e) { return refuse(e); }
}

export async function recordBank(actor: Actor, investorId: string, body: unknown): Promise<ActResult> {
  try {
    const b = parseOr(RecordBankBody, body);
    await mustExist(investorId);
    if (!piiReady()) throw new Refusal("The account cannot be stored: this deployment has no encryption key (PII_ENCRYPTION_KEY), and an account number is never stored in the clear.", 503);
    const cipher = encryptPii(b.account);
    return await act(actor, {
      name: "RecordBankAccount", reason: b.reason, objectId: investorId,
      /* Method and date only. Not the holder, not the bank, not the last four. */
      emit: (emit) => emit("BankAccountRecorded", investorId, { method: b.method, verifiedOn: b.verifiedOn || null }),
      write: async (tx) => {
        await tx.update(investor).set({
          bank_account_holder: b.holder, bank_name: b.bankName, bank_ifsc: b.ifsc,
          bank_account_last4: last4(b.account), bank_account_ciphertext: cipher,
          bank_verification_method: b.method, bank_verified_on: b.verifiedOn ? new Date(b.verifiedOn) : null,
          ...bump,
        }).where(eq(investor.id, investorId));
      },
    });
  } catch (e) { return refuse(e); }
}

async function unitsIn(t: Pick<Db, "select">, vehicleId: string) {
  return (await t.select({ units: ownership_position.units_held }).from(ownership_position).where(eq(ownership_position.vehicle_id, vehicleId)))
    .map((r) => String(r.units));
}

export async function recordPosition(actor: Actor, investorId: string, body: unknown): Promise<ActResult> {
  try {
    const b = parseOr(RecordPositionBody, body);
    const person = await mustExist(investorId);
    const v = byKey(b.estate);
    const d = db()!;
    const [row] = v ? await d.select().from(investment_vehicle).where(eq(investment_vehicle.register_key, v.key)).limit(1) : [];
    if (!v || !row) throw new Refusal("That estate has no vehicle record yet. Put it on the record first.", 400);
    const dup = await d.select({ id: ownership_position.id }).from(ownership_position)
      .where(and(eq(ownership_position.investor_id, investorId), eq(ownership_position.vehicle_id, row.id))).limit(1);
    if (dup.length) throw new Refusal(`A position in ${v.registeredName} is already recorded for this investor. A change to it is a transfer, which is a separate act.`);
    const over = conservationRefusal(await unitsIn(d, row.id), b.units, row.total_units_issued);
    if (over) throw new Refusal(over);

    const voting = votingPercent(b.units, row.total_units_issued);
    const promote = person.member_state === "investor";
    const settled = new Date(b.settledOn);
    const id = randomUUID();
    return await act(actor, {
      name: "RecordRegisterEntry", vehicleId: v.slug, reason: b.reason, objectId: id,
      emit: (emit) => {
        /* The shape lib/projections.ts projectCapitalTable() already folds. */
        emit("OwnershipPositionOpened", id, {
          vehicleId: row.id, estate: v.key, investorId, units: b.units, ownershipClass: b.ownershipClass,
          votingPercent: voting, aboveVotingCap: aboveVotingCap(voting), settledOn: b.settledOn,
        });
        if (promote) emit("MemberStatePromoted", investorId, { investorId, on: b.settledOn, via: "RecordRegisterEntry" });
      },
      write: async (tx) => {
        await tx.execute(sql`select 1 from ${investment_vehicle} where ${investment_vehicle.id} = ${row.id} for update`);
        const again = conservationRefusal(await unitsIn(tx, row.id), b.units, row.total_units_issued);
        if (again) throw new Refusal(again);
        await tx.insert(ownership_position).values({
          id, created_by: actor.identityId, investor_id: investorId, vehicle_id: row.id,
          units_held: b.units, voting_rights_percent: voting, ownership_class: b.ownershipClass,
        });
        /* The Member Law: once, never reversed, dated by settlement. */
        if (promote) {
          await tx.update(investor).set({ member_state: "member", became_member_on: settled, ...bump })
            .where(and(eq(investor.id, investorId), eq(investor.member_state, "investor")));
        }
      },
    });
  } catch (e) { return refuse(e); }
}
