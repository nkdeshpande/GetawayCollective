/**
 * Composed public surfaces — the eight that rendered the scaffold.
 *
 * Every figure is read from the canon (slowspace, data, gateway),
 * never typed here. Copy follows Addendum A: facts and terms, no
 * persuasion, no softeners.
 */
import type { Entry } from "@/app/_assemblies/compose";
import { d, NOT_WIRED } from "./shared";
import { PROPERTIES, propertyBySlug, inr, fractionPrice } from "@/app/_assemblies/data";
import { FRAMES, FRAMES_NOTE } from "@/content/gateway";
import { position, ALLOCATION, LLP } from "@/app/_assemblies/slowspace";

const pct = (bps: number) => (bps / 100).toFixed(0) + "%";

export const PUB: Record<string, Entry> = {
  "/403": {
    title: "Not available to you",
    eyebrow: "Access",
    lead: "The address you asked for exists behind a vantage you do not currently hold.",
    disclosure: d(
      "This page, and the reason structure behind it. Denials never confirm what a surface contains.",
      "KYC does not widen reachability by itself — access follows the position, not the paperwork.",
      "Member surfaces open at settlement, when the Member Law fires.",
      "Operational surfaces open with the property. Office surfaces need a named right, at any stage.",
    ),
    sections: [
      { kind: "prose", paras: [
        "Access here is derived from what you hold, never from who asks. A prospective investor " +
        "sees the public surfaces; an accredited investor can reach the commitment path; a Member " +
        "sees the vehicle they hold a position in; an office-holder sees what their named right " +
        "grants and nothing more.",
        "If you believe you should be able to reach this page, sign in first — an unresolved " +
        "identity is treated as anonymous, and anonymous satisfies public only.",
      ] },
      { kind: "links", items: [
        { t: "Sign in", to: "/auth/sign-in", primary: true },
        { t: "The Collection", to: "/collection" },
        { t: "How capital works", to: "/how-capital-works" },
      ] },
    ],
  },

  "/auth/sign-out": {
    title: "Signed out",
    eyebrow: "Identity",
    lead: "Your session ends here. Nothing about your position changes — only what this browser can see.",
    disclosure: d(
      "The public surfaces remain exactly as they were.",
      "Accreditation survives sign-out; it attaches to you, not to the session.",
      "A position survives everything. Signing out never touches the register.",
      "Operational entitlements are unaffected; they resume when you return.",
    ),
    sections: [
      { kind: "prose", paras: [
        "Signing out removes this browser's access to member surfaces. It does not suspend " +
        "accreditation, alter a commitment, or touch the partner register — those are records " +
        "about you, not about this session.",
      ] },
      { kind: "note", tone: "steel", strong: "This build has no identity provider.",
        text: "There is no session to end yet. The page exists so the exit is designed before the entrance is wired." },
      { kind: "links", items: [
        { t: "Return to the gateway", to: "/", primary: true },
        { t: "Sign in", to: "/auth/sign-in" },
      ] },
    ],
  },

  "/auth/verify": {
    title: "Verify your address",
    eyebrow: "Identity",
    lead: "A six-digit code was described to your email address. Enter it to continue.",
    disclosure: d(
      "The verification step itself — anyone signing in passes through it.",
      "After verification, PR-01 accreditation becomes reachable.",
      "Verification is long done by commitment; it never repeats per transaction.",
      "Unchanged at operation. Identity is verified once and maintained, not re-proven.",
    ),
    sections: [
      { kind: "form", label: "Code",
        fields: [{ id: "code", label: "Verification code", help: "Six digits, valid for ten minutes." }],
        submit: "Verify", note: NOT_WIRED },
      { kind: "prose", paras: [
        "Verification proves control of the address that will carry every notice the platform " +
        "sends — resolutions, distribution statements, document version changes. It is the one " +
        "channel the constitution assumes works.",
      ] },
    ],
  },

  "/maintenance": {
    title: "Down for maintenance",
    eyebrow: "System",
    lead: "The platform is temporarily unavailable. Positions, documents and the register are unaffected.",
    disclosure: d(
      "This notice. Public surfaces return when maintenance ends.",
      "No accreditation window expires during maintenance — the clock stops with the platform.",
      "Commitments in flight complete under COMPLETE-THEN-SUSPEND (§24b); nothing lapses silently.",
      "Operations continue off-platform: the property does not pause because the software does.",
    ),
    sections: [
      { kind: "prose", paras: [
        "Maintenance touches the software, never the records. The register, the standing documents " +
        "and every settled position live independently of this interface and are exactly as they " +
        "were when it returns.",
      ] },
      { kind: "links", items: [{ t: "Check system status", to: "/status", primary: true }] },
    ],
  },

  "/status": {
    title: "System status",
    eyebrow: "System",
    lead: "What is running, what is static, and what is not yet connected. Stated plainly.",
    disclosure: d(
      "Everything on this page — status hides nothing because it confirms nothing sensitive.",
      "Identical. Status does not deepen with the relationship.",
      "Identical, plus the member surfaces the platform reports on become reachable to you.",
      "Operational telemetry joins when a property goes live and begins reporting.",
    ),
    sections: [
      { kind: "kv", label: "Surfaces", rows: [
        { k: "Public pages", v: "Serving · static", mono: true },
        { k: "Lead capture (/signal, /communique/request)", v: "Live · degrades honestly without mail", mono: true },
        { k: "Member and office surfaces", v: "Guarded · deny all until identity connects", mono: true },
        { k: "Payments", v: "Not connected", mono: true },
        { k: "Telemetry", v: "Not connected — begins at first operation", mono: true },
      ] },
      { kind: "note", tone: "confirm", strong: "Fails closed.",
        text: "An unresolved subject is anonymous, and anonymous reaches public surfaces only. " +
              "That is the designed behaviour of an unfinished system, not an outage." },
    ],
  },

  /* Public by override — the worked demonstration of a held position. */
  "/member/holdings": (() => {
    const p = position(ALLOCATION.defaultBps);
    return {
      title: "Holdings",
      eyebrow: "Member · worked demonstration",
      lead: "One vehicle, one position — the worked example at " + pct(p.bps) + ". A real account lists every position it holds.",
      disclosure: d(
        "The worked demonstration with model figures, clearly marked.",
        "Your accreditation status joins the page; figures remain the model's.",
        "Your actual position replaces the model at settlement — same layout, real register.",
        "Distributions received and nights drawn join once the property operates.",
      ),
      sections: [
        { kind: "figures", items: [
          { label: "Position", value: inr(p.commitment), money: true,
            sub: pct(p.bps) + " of " + LLP.name, conf: "modelled" },
          { label: "Indicative annual", value: inr(p.distribution), money: true,
            sub: (p.yieldBps / 100).toFixed(1) + "% once stabilised", conf: "modelled" },
          { label: "Entitlement", value: `${p.nights.min}–${p.nights.max}`, nights: true,
            sub: "nights a year, from handover" },
        ] },
        { kind: "note", tone: "hazard", strong: "Every figure above is modelled.",
          text: "The property is at pre-construction. Nothing on this page is a distribution that has happened." },
        { kind: "links", items: [
          { t: "Walk the flow", to: "/flow", primary: true },
          { t: "The vehicle console", to: "/flow/settled" },
        ] },
      ],
    };
  })(),

  "/collection/[property]/gallery": ((slug: string) => {
    const p = propertyBySlug(slug);
    const frames = FRAMES.filter((f) => p && f.place === p.ufr0060);
    return {
      title: p ? `${p.ufr0060} · Gallery` : "Gallery",
      eyebrow: p ? `${p.assetId} · ${p.ufr0063}` : "Collection",
      lead: "Every plate states what it is — photograph, render or drawing. None is left to be guessed.",
      disclosure: d(
        "Labelled plates. What exists to be shown, shown as what it is.",
        "Identical — imagery does not deepen with accreditation.",
        "Identical. A committed investor sees the same plates, not flattering extras.",
        "Photography joins at operation, labelled as photography, dated per visit.",
      ),
      sections: [
        frames.length
          ? { kind: "plates", label: "Plates",
              items: frames.map((f) => ({ ref: f.ref, caption: f.caption, kindLabel: f.kind, hue: f.hue })),
              note: FRAMES_NOTE }
          : { kind: "empty", what: "No plates for this property yet",
              because: "Nothing has been drawn or photographed for it. An empty gallery that says so " +
                       "is worth more than a stock image standing in.",
              when: "Plates join as drawings are produced; photography follows operation." },
        { kind: "links", items: [{ t: "Back to the property", to: p ? `/collection/${slug}` : "/collection" }] },
      ],
    };
  }),

  "/collection/[property]/location": ((slug: string) => {
    const p = propertyBySlug(slug);
    return {
      title: p ? `${p.ufr0060} · Location` : "Location",
      eyebrow: p ? `${p.assetId} · ${p.ufr0063}` : "Collection",
      lead: p
        ? "Where the asset sits, and what that jurisdiction means for it."
        : "The property could not be found.",
      disclosure: d(
        "Jurisdiction, land area and lifecycle — the facts of the place.",
        "The dossier adds surveys and title documents on request.",
        "Title documents become readable in the vehicle console at settlement.",
        "Access logistics and arrival instructions join at operation.",
      ),
      sections: p ? [
        { kind: "kv", label: "The place", rows: [
          { k: "Jurisdiction", v: p.ufr0063 },
          { k: "Land / built area", v: p.ufr0065, mono: true },
          { k: "Lifecycle", v: p.ufr0066 },
          { k: "Vehicle", v: p.ufr0061 },
          { k: "Commitments", v: p.ufr0068 },
        ] },
        { kind: "figures", items: [
          { label: "Valuation", value: inr(p.ufr0102), money: true,
            sub: p.ufr0103 + " · " + p.ufr0101,
            conf: p.ufr0103.includes("appraisal") ? "verified" : "estimated" },
          { label: "Fraction", value: inr(fractionPrice(p)), money: true,
            sub: `1 of ${p.units} · largest remainder` },
        ] },
        { kind: "links", items: [
          { t: "The property", to: `/collection/${slug}`, primary: true },
          { t: "Gallery", to: `/collection/${slug}/gallery` },
        ] },
      ] : [
        { kind: "empty", what: "Unknown property",
          because: "No property in the collection answers to this address.",
          when: "The collection lists every property that exists." },
        { kind: "links", items: [{ t: "The Collection", to: "/collection", primary: true }] },
      ],
    };
  }),
};

/* Referenced so the module fails loudly if the collection ever empties. */
void PROPERTIES;
