/**
 * THE SITE — shapes of the content the public site renders
 *
 * L1-01 §29-0b · 24 Sep 2026. The content itself is content/site/*.ts; the
 * facts a vehicle register owns are not in it, only {{TOKENS}} naming them.
 */

/** [palette, hour, rain?, blueprint?] — a drawn film, relit by the hour. */
export type FilmRef = readonly [string, number, (number | boolean)?, (number | boolean)?];

export interface Card { readonly film?: FilmRef; readonly b?: string; readonly s?: string; readonly k?: string; readonly v?: string }

export interface Volume {
  readonly t?: string; readonly x: number; readonly y: number; readonly z?: number;
  readonly dx: number; readonly dy: number; readonly dz?: number; readonly rz?: number;
}
export interface Zone { readonly k: string; readonly name: string; readonly sub: string; readonly text: string; readonly c: string; readonly vols: readonly Volume[] }
export interface Ground { readonly c: string; readonly w?: number; readonly dash?: string; readonly pts: readonly (readonly number[])[] }
export interface Concept {
  readonly title: string; readonly lead?: string; readonly zones: readonly Zone[];
  readonly ground?: readonly Ground[]; readonly labels?: readonly (readonly [number, number, string])[];
}
export interface Chapter { readonly id: string; readonly title: string; readonly film: FilmRef; readonly para: string; readonly meta: readonly string[]; readonly cards: readonly Card[] }
export interface MapSpec {
  readonly bounds: readonly number[];
  readonly pts: readonly (readonly (string | number | boolean)[])[];
  readonly route?: readonly number[];
  readonly tag?: readonly (string | number)[];
}
export interface PlanTab { readonly tab: string; readonly t: string; readonly rows: readonly (readonly (string | number)[])[]; readonly svg: string }

export interface Waitlist { readonly chip: string; readonly title: string; readonly text: string; readonly chips: readonly string[]; readonly ok: string; readonly note: string }

export interface SiteEstate {
  readonly key: string;
  readonly slug: string;
  /** The register's key, or null for an estate that is not yet a vehicle. */
  readonly vehicleKey: string | null;
  readonly name: string;
  readonly vehicle: string;
  readonly pal: string;
  readonly hour: number;
  readonly heroRain?: number | boolean;
  readonly enquireHour?: number;
  readonly heroLabel: string;
  readonly eyebrow: string;
  readonly credit: string;
  readonly spec: string;
  readonly intro: string;
  readonly place: { readonly film: FilmRef; readonly title: string; readonly text: string; readonly coords: string };
  readonly concept: Concept;
  readonly chapters: readonly Chapter[];
  readonly materials: readonly (readonly string[])[];
  readonly day: { readonly eyebrow: string; readonly title: string; readonly items: readonly (readonly string[])[]; readonly note: string };
  readonly getting: { readonly title: string; readonly sub: string; readonly cards: readonly (readonly string[])[]; readonly map: MapSpec };
  readonly plan: { readonly title: string; readonly tabs: readonly PlanTab[]; readonly note: string };
  readonly details: readonly (readonly (string | number)[])[];
  readonly detailsNote?: string;
  readonly waitlist?: Waitlist;
}

export interface FormSpec {
  readonly id: string; readonly addr: string; readonly chipsLabel?: string; readonly chips?: readonly string[];
  readonly fields: readonly (readonly (string | readonly string[])[])[];
  readonly submit: string; readonly ok: string; readonly note: string;
  /** Which endpoint receives it. Absent means the enquiry desk. */
  readonly to?: "signal" | "dossier";
  readonly vehicle?: string;
}

/* A block is one of these shapes; the renderer reads whichever key is set. */
export interface Block {
  readonly h?: string; readonly p?: string; readonly q?: string; readonly src?: string;
  readonly list?: readonly string[];
  readonly figs?: readonly (readonly string[])[];
  readonly steps?: readonly (readonly string[])[];
  /** The number the first step shows, where one sequence runs across several blocks. */
  readonly stepsFrom?: number;
  readonly rows?: readonly (readonly (string | number)[])[];
  readonly legal?: string;
  /** A legal clause that states what the platform will always do — set on its own ground. */
  readonly assertion?: boolean;
  readonly anchor?: string;
  readonly links?: readonly (readonly string[])[];
  /** Files a visitor may download, from public/: [label, href, what it is for, bytes]. tests/press-assets.test.ts holds the bytes to the file. */
  readonly assets?: readonly (readonly string[])[];
  readonly cards?: readonly { readonly href: string; readonly film: FilmRef; readonly eb: string; readonly t: string; readonly p: string }[];
  readonly form?: FormSpec;
  readonly assert?: string;
  readonly people?: readonly {
    readonly lead?: number; readonly initials: string; readonly role: string; readonly name: string; readonly line: string;
    readonly does?: readonly string[]; readonly rows: readonly (readonly (string | number)[])[];
  }[];
  readonly copy?: readonly string[];
  readonly jcards?: readonly JournalCard[];
  readonly kinds?: Readonly<Record<string, string>>;
  readonly faq?: string;
  /** A digital assembly (app/_assemblies/da): its kind, and the vehicle it draws. */
  readonly da?: string;
  readonly vehicle?: string;
  readonly money?: boolean;
  /** A heading's anchor, so a contents strip can point at it. */
  readonly id?: string;
  /** Markup built from tokens by the site itself (the Journal's drawings). */
  readonly html?: string;
  readonly toc?: readonly (readonly [string, string])[];
  readonly lede?: string;
  readonly pull?: string;
  readonly inspire?: { readonly text: string; readonly who: string; readonly where: string };
  /** The holding deposit, for an offering that is open. Figures are the register's. */
  readonly deposit?: {
    readonly vehicle: string; readonly payee: string; readonly amount: string;
    readonly available: number; readonly unitPrice: string;
  };
}

export interface JournalCard { readonly id: string; readonly key: string; readonly kind: string; readonly title: string; readonly standfirst: string; readonly date: string; readonly dateLabel: string; readonly minutes: number }

/** One card at the foot of a text page: where the reader goes next, and which stage of the path that is. */
export interface NextStep { readonly stage: string; readonly title: string; readonly text: string; readonly href: string }

export interface SitePage {
  readonly key: string;
  readonly path: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
  readonly meta?: string;
  readonly light?: number | boolean;
  readonly film?: FilmRef;
  readonly blocks: readonly Block[];
  /** Overrides content/site/next.ts for this page. `null` means none. */
  readonly next?: NextStep | null;
}
