/**
 * AS-PROP · THE PROPERTY PAGE
 *
 * Authority: the GC property page wireframe · constants/property-page.ts
 *
 * ── ONE COMPONENT, THREE PLACES ──────────────────────────────────────
 * Solace, Confluence and The Creek render through this. Everything that
 * differs between them is a row in the registry; everything that is the
 * same is here. Three hand-built pages would have diverged by the second
 * edit, and the divergence would have been invisible until somebody
 * compared them side by side.
 *
 * ── EVERY FIGURE IS READ, NONE IS TYPED ──────────────────────────────
 * The vehicle strip, the ownership basis, the entitlement, the unit
 * price — all of it comes from constants/vehicles.ts at render. That is
 * the same rule the Journal follows, and for the same reason: a page
 * that types its own numbers can describe a vehicle that does not exist.
 *
 * ── THE PAGE STATES WHAT IT CANNOT SHOW ──────────────────────────────
 * Two things are missing and both are declared rather than hidden.
 *
 * Media: every frame is a declared slot with a subject and a kind. An
 * unproduced one renders nothing (PUBLIC.08) and the page footer counts
 * them, so "we need photography" is a numbered brief rather than an
 * intention.
 *
 * Publication: two of the three vehicles carry blocking conflicts, and a
 * page for one of those does not show a yield, a unit price or a
 * subscription state. It shows what is settled and says the rest is being
 * reconciled. That is `publishable()` reaching the surface, which is the
 * only place a gate of that kind is worth anything.
 *
 * ── REBUILT 21 SEP 2026: THE PICTURE LEADS ───────────────────────────
 * Founder instruction: rebuild this page on the pattern of a NOT A HOTEL
 * property page. Measured, that pattern is: a full-viewport opening that
 * carries a NAME and one line; then a run of chapters, each a short
 * heading, one enormous untreated picture, a few sentences and a
 * horizontal gallery; then the inspection material, bounded.
 *
 * GC canon already has a lawful home for every part of it (Addendum A,
 * § E): FB-01 the full-bleed hero, FB-02 the edge-to-edge gallery scroll,
 * FB-1 "full-bleed only where no figure is being read" and FB-2 "never
 * more than three viewport-heights before a bounded layout returns". So
 * this is that structure in GC's own voice — Outfit at weight 200, zero
 * radius, hairlines, low and left — and not an imitation of theirs.
 *
 * Three things changed, and one deliberately did not:
 *
 *   1. GROUND. The whole page was paper. It is now void for the
 *      narrative and paper for the financial assertion, which is what the
 *      token file has always said the two grounds are for. The ground is
 *      set with .on-paper rather than by hand, so .dim, .label, .btn and
 *      .money resolve for the ground they are actually on. (They did
 *      not: .dim on the hand-set paper ground was 2.5:1.)
 *
 *   2. THE NAME IS THE TITLE. The h1 was the nine-word headline. On a
 *      picture that is too many words, and the registry's own note says
 *      six. The h1 is now the property's registered name, read from
 *      constants/vehicles.ts; the headline follows it on the ground,
 *      unchanged, as the first thing the page says.
 *
 *   3. NOTHING RIDES ON A PICTURE but that name and its one line. The
 *      actions moved under the hero. The kind-and-date caption moved from
 *      over each frame to beneath it: still attached to every frame, as
 *      the wireframe requires, and no longer printed across it.
 *
 *   NOT CHANGED: a word of the authored copy, a figure, a link, a gate,
 *   the order of the argument, or PUBLIC.08. With no frame produced yet
 *   the page is typographic, and takes no space for what it cannot show.
 *   Each frame that is registered drops into a full-bleed slot that is
 *   already built for it.
 *
 * ── SECOND PASS, SAME DAY: SOMETHING TO LOOK AT ──────────────────────
 * With no photograph the rebuilt page was eleven screens of words.
 * Founder: add visual blocks as the page scrolls, and no more than five
 * tabs.
 *
 * There is still nothing to photograph, so the blocks are DRAWINGS, and
 * they follow the rule unitplate.tsx set: geometry computed from the
 * number, never chosen to look good. A drawing that is not derived from a
 * registry value is decoration, and none was added. Five blocks:
 *
 *   the numerals      Place         keys · land · coordinates, at figure size
 *   the footprint     Architecture  lodging · working · hardscape, to scale
 *   the keys          Spaces        the existing UnitSet, drawn to scale
 *   three figures     Vehicle       the ladder · the night pool · the threshold
 *   the index         every space   01, 02 … at title size
 *
 * Every value drawn is one a public chapter already publishes, in the same
 * words (PUBLIC.10), and none is forward-looking. The construction
 * programme is NOT drawn, though the registry has it: the evidence ladder
 * on this very page lists "the projected programme" as private material.
 *
 * The tabs: the chapter nav shows five parts and the spine shows five
 * sections (constants/property-chapters.ts · SPINE_TABS). Both still reach
 * everything they reached before, and this page gained the onward control
 * every other chapter already had, because tab one now points here.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterSurface } from "./propertychapters";
import {
  PROPERTY_PAGES, SPINE, SPINE_TABS, EVIDENCE_TIERS, mediaGap,
  type MediaSlot, type PropertyPage, type SectionId,
} from "@/constants/property-page";
import { chapterHref, nextChapter } from "@/constants/property-chapters";
import {
  vehicleByKey, vehicleBySlug, publishable, waterfallState, BUILD_LABEL, TENURE_LABEL,
} from "@/constants/vehicles";
import { estateOf, ARCHITECTURAL_LANGUAGE, type KeyType } from "@/constants/spatial";
import { UnitPlate, UnitSet, scaleFor } from "./unitplate";
import { IrisPanel } from "./iris";
import { Footer } from "./atoms";
import { GatedLink } from "./gatedlink";

/** What a frame is, and when. The wireframe's instruction: on every frame. */
const provenance = (m: MediaSlot) => `${m.kind}${m.taken ? ` · ${m.taken}` : ""}`;

/* ── A declared frame ─────────────────────────────────────────────── */
function Frame({ m, className = "" }: { m: MediaSlot; className?: string }) {
  /*
   * PUBLIC.08. An unproduced frame renders NOTHING.
   *
   * This used to draw a labelled placeholder per slot, which was honest
   * and — at twenty-five of them on a page whose entire proposition is an
   * extraordinary physical place — read as an unfinished product rather
   * than a candid one. Absence acquired the visual authority of the thing
   * that was absent, which inverts the intent exactly.
   *
   * The shot list is not lost: it is still declared in
   * constants/property-page.ts, still counted by mediaGap(), and still
   * the commission brief. It simply belongs to the office rather than to
   * a stranger deciding whether they want the place. The page states the
   * gap ONCE, at the end, where it reads as candour instead of scaffolding.
   */
  if (!m.asset) return null;
  return (
    <figure className={`pf ${className}`} data-aspect={m.aspect}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m.asset} alt={m.subject} />
      {/* Kind and date on every frame — under it, never across it. */}
      <figcaption className="t-micro dim">{provenance(m)}</figcaption>
    </figure>
  );
}

/* ── FB-02 · the gallery scroll ───────────────────────────────────── */
/**
 * Horizontal, edge to edge, no gutters, and only ever pictures — canon
 * forbids it for a list of financial objects. It renders the frames that
 * exist and nothing for the ones that do not, so an empty reel is no reel.
 *
 * It is a labelled, focusable region: a scrolling strip that cannot take
 * focus is unreachable from a keyboard.
 */
function Reel({ frames, label }: { frames: readonly MediaSlot[]; label: string }) {
  const made = frames.filter((m) => m.asset);
  if (made.length === 0) return null;
  return (
    <div className="prop-reel prop-bleed" role="group" aria-label={label} tabIndex={0}>
      {made.map((m) => <Frame key={m.id} m={m} />)}
    </div>
  );
}

/* ── Drawn figures ────────────────────────────────────────────────────
   One rule for all of them, inherited from the unit plate: the geometry is
   computed from the number. Nothing here has a shape that was chosen. */

/**
 * THE FOOTPRINT — what is built, in three areas, drawn to one scale.
 *
 * It reuses the unit plate, so a side is the square root of its area and
 * the three compare by AREA. Lodging and working are kept apart for the
 * reason the ledger keeps them separate: the working half is meant to be
 * invisible, and one "built area" figure would hide whether that held.
 */
function Footprint({ areas }: { areas: readonly { name: string; area: number }[] }) {
  const plates: KeyType[] = areas.map((a) => ({ name: a.name, count: 1, area: a.area, note: "" }));
  const max = scaleFor(plates);
  return (
    <section className="prop-fig-set" aria-label="The footprint">
      <header className="prop-fig-head">
        <p className="t-micro label">The footprint</p>
        <p className="t-body-s dim">Built area in square feet · drawn to scale, not photographed</p>
      </header>
      <div className="prop-fig-row">
        {plates.map((u) => (
          <div key={u.name} className="prop-fig">
            <UnitPlate unit={u} max={max} />
            <span className="t-micro label">{u.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/** THE LADDER — every rung from the minimum to the ceiling, height = share. */
function Ladder({ min, step, ceiling }: { min: number; step: number; ceiling: number }) {
  const rungs: number[] = [];
  for (let b = min; b <= ceiling; b += step) rungs.push(b);
  const w = 100 / rungs.length;
  return (
    <svg className="prop-draw" viewBox="0 0 100 40" preserveAspectRatio="none" role="img"
         aria-label={`Ownership rungs from ${min / 100}% to ${ceiling / 100}% in ${step / 100}% steps`}>
      {rungs.map((b, i) => {
        const h = (b / ceiling) * 38;
        return <rect key={b} className="pd-solid" x={i * w + 0.6} y={39 - h} width={w - 1.2} height={h} />;
      })}
      <line className="pd-rule" x1="0" y1="39.5" x2="100" y2="39.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * THE NIGHT POOL — a year as linear inventory (Rule 10: a tape, never a
 * calendar grid). Solid to the minimum, outlined from there to the maximum:
 * the outline is the part that is a range and not a promise.
 */
function NightPool({ min, max }: { min: number; max: number }) {
  const x = (n: number) => (n / 365) * 100;
  return (
    <svg className="prop-draw" viewBox="0 0 100 40" preserveAspectRatio="none" role="img"
         aria-label={`${min} to ${max} nights of 365`}>
      <rect className="pd-track" x="0.3" y="14" width="99.4" height="12" vectorEffect="non-scaling-stroke" />
      <rect className="pd-solid" x="0" y="14" width={x(min)} height="12" />
      <rect className="pd-range" x={x(min)} y="14" width={x(max) - x(min)} height="12"
            vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** THE THRESHOLD — where an ordinary resolution passes, on a line of 100%. */
function Threshold({ bps }: { bps: number }) {
  const x = bps / 100;
  return (
    <svg className="prop-draw" viewBox="0 0 100 40" preserveAspectRatio="none" role="img"
         aria-label={`An ordinary resolution passes above ${x}%`}>
      <rect className="pd-track" x="0.3" y="14" width="99.4" height="12" vectorEffect="non-scaling-stroke" />
      <rect className="pd-solid" x={x} y="14" width={100 - x} height="12" />
      <line className="pd-mark" x1={x} y1="6" x2={x} y2="34" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** A chapter takes its heading from the spine, so the two cannot disagree. */
const spineLabel = (id: SectionId) => SPINE.find((s) => s.id === id)?.label ?? "";

export function PropertySurface({ slug }: { slug: string }) {
  const page: PropertyPage | undefined = PROPERTY_PAGES.find(
    (p) => vehicleByKey(p.vehicle)?.slug === slug,
  );

  /* A VEHICLE IN THE REGISTER IS NOT A 404 — corrected 21 Sep 2026.
     This returned notFound() whenever constants/property-page.ts held no
     authored page, which was right when the only way here was an authored
     page. Wildwood joined the register without one, so /collection/wildwood
     404'd while /collection/wildwood/place rendered perfectly — and the
     chapter nav on every one of its chapters pointed at the 404.

     The register says the property exists. Refusing to show it because
     nobody has written its long-form copy is the platform contradicting
     its own source of truth, so the opening chapter is rendered from the
     record instead. An authored page still wins where there is one. */
  if (!page) {
    if (vehicleBySlug(slug)) {
      return <ChapterSurface path="/collection/[vehicle]" param={slug} />;
    }
    notFound();
  }

  const v = vehicleByKey(page.vehicle)!;
  const estate = estateOf(page.vehicle);
  const gate = publishable(v);
  const wf = waterfallState(v.operating.waterfall);
  const gap = mediaGap(page);
  const onward = nextChapter("opportunity");
  const built = estate?.footprint
    ? [
        { name: "Lodging", area: estate.footprint.lodgingBuilt },
        { name: "Working", area: estate.footprint.workingBuilt },
        { name: "Hardscape", area: estate.footprint.hardscape },
      ]
    : [];

  const inr = (n: bigint) => `₹${(Number(n) / 10000).toLocaleString("en-IN")}`;

  return (
    /*
     * A div, not a main. The shell already renders <main class="rail-main">
     * around every page, and a nested <main> is invalid and gives a screen
     * reader two document bodies to choose between.
     *
     * `p-hero-own` on the opening section is the seam the shell publishes
     * for a page that titles itself — without it the shell would print
     * "space vantage / Opportunity" above this hero, which is exactly the
     * double-title defect assemblies.css was written to stop.
     */
    <div className="prop">
      {/* ── HERO · FB-01 ────────────────────────────────────────── */}
      <section className="prop-hero p-hero-own" data-sec="AS-PROP.hero">
        {/*
          THE PLATE. Full viewport, and it runs under the header and the
          rail, which the shell keeps transparent while a hero is in view.
          On it: the eyebrow, the name, one line. Nothing else — no
          action, no paragraph, and nothing laid over the picture to make
          the words readable.
        */}
        <div className="prop-plate prop-bleed" data-filled={page.hero.asset ? "1" : "0"}>
          {page.hero.asset ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img className="prop-plate-img" src={page.hero.asset} alt={page.hero.subject} />
          ) : null}
          <div className="prop-plate-in">
            <span className="t-micro">{page.eyebrow}</span>
            <h1 className="prop-titan">{v.propertyName}</h1>
            {/*
              PUBLIC.03. This read "Land acquired" for any vehicle whose
              lifecycle was "acquired" — a word typed beside the record
              rather than derived from it, over land whose title was
              unverified. Both axes are now canonical values with canonical
              labels, and the hero renders them rather than wording them.
            */}
            <p className="t-body-l">
              {v.jurisdiction} · {BUILD_LABEL[v.buildStage]}
              {v.tenure ? ` · ${TENURE_LABEL[v.tenure]}` : ""}
            </p>
          </div>
        </div>

        {/* THE FOOT. What the hero has to say beyond a name, on the ground. */}
        <div className="wrap prop-hero-foot">
          <p className="prop-say">{page.headline}</p>
          <div className="row">
            <Link className="btn" href="#opening">Explore the property ↓</Link>
            <Link className="btn primary" href="/contact">Request materials</Link>
          </div>
          {page.hero.asset ? <p className="t-micro dim">{provenance(page.hero)}</p> : null}
        </div>
      </section>

      {/* TWO TAB BARS STOOD HERE. The chapter nav and the spine below it
          were the same width, the same weight and one above the other, and
          they named the same content differently — "The Place" over
          "Place", "Ownership" over "Vehicle". One navigated and one
          scrolled, which a reader cannot tell by looking.

          The spine wins on this page because this page is the thing it
          indexes. The chapters are reached from the foot of the page and
          from the chapter pages themselves, where the nav is the only bar
          on screen and means one thing. */}

      {/* ── SPINE ──────────────────────────────────────────────────
          THE GROUND CHANGES ONCE, AND IT CHANGES HERE-ish. Measured before
          it was touched: the page ran 11.9 screens and the first thing
          that was not void began 7.8 screens down, so a reader met nearly
          eight unbroken screens of one ground. The system has two and was
          using one of them for three quarters of its longest page.

          Spaces and Materials now take paper with Vehicle and Evidence, so
          the page turns once — out of the place and its architecture, into
          the specification and the vehicle. That is the argument the page
          is already making, and the ground now makes it too. */}
      <nav className="prop-spine" aria-label="This property">
        <div className="wrap">
          <ul>
            {/* Five of the seven. The other two are still sections, still
                headed from SPINE, and still one scroll below Architecture. */}
            {SPINE.filter((s) => SPINE_TABS.includes(s.id)).map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="t-micro">{s.label}</a></li>
            ))}
          </ul>
          <Link className="btn" href="/contact">Request introduction</Link>
        </div>
      </nav>

      {/* ── OPENING NOTE ───────────────────────────────────────── */}
      <section id="opening" className="prop-sec" data-sec="AS-PROP.opening">
        <div className="wrap">
          <h2 className="t-display-xl">
            {page.openingTitle[0]}<br />
            <em>{page.openingTitle[1]}</em>
          </h2>
          <p className="t-body-l measure prop-gap-m">{page.opening}</p>

          <div className="prop-strip">
            <div>
              <span className="t-micro label">Place</span>
              <p className="t-body">{estate?.region ?? v.jurisdiction}</p>
            </div>
            <div>
              <span className="t-micro label">Asset stage</span>
              <p className="t-body">{BUILD_LABEL[v.buildStage]}</p>
              {v.tenure ? <p className="t-body-s dim">{TENURE_LABEL[v.tenure]}</p> : null}
            </div>
            <div>
              <span className="t-micro label">Ownership basis</span>
              <p className="t-body">Contribution-weighted interest in one vehicle</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PEOPLE BEHIND IT ───────────────────────────────── */}
      <section className="prop-sec prop-sec-ruled" data-sec="AS-PROP.authors">
        <div className="wrap">
          <h2 className="t-heading">
            A property is a series of decisions.<br />
            <em>The authors of those decisions should be visible.</em>
          </h2>
          <div className="prop-authors">
            {["Architectural author", "Land and delivery author"].map((role) => (
              <article key={role} className="prop-author">
                <span className="t-micro label">{role}</span>
                {/* Withheld rather than invented. An appointment is a
                    recorded act, and naming somebody before it exists
                    would be the same failure as an unappraised valuation. */}
                <p className="t-body-s dim">Named once the appointment is recorded.</p>
              </article>
            ))}
          </div>
          <p className="t-body dim measure prop-gap-m">
            Authorship is not branding. It is accountability for the brief.
          </p>
        </div>
      </section>

      {/* ── THE SITE ───────────────────────────────────────────── */}
      <section id="site" className="prop-sec prop-ch" data-sec="AS-PROP.site">
        <div className="wrap">
          <h2 className="prop-titan-m">{spineLabel("site")}</h2>
        </div>
        <Frame m={page.siteImage} className="prop-bleed" />
        <div className="wrap">
          <p className="prop-say">The landscape sets the terms.</p>
          <p className="t-body-l measure prop-gap-s">{page.siteNote}</p>

          <div className="prop-strip">
            <div>
              <span className="t-micro label">Access</span>
              <p className="t-body">{page.access}</p>
            </div>
            <div>
              <span className="t-micro label">Ecological context</span>
              <p className="t-body">{estate?.ecology ?? "Not surveyed"}</p>
            </div>
            <div>
              <span className="t-micro label">Protection</span>
              <p className="t-body">{page.protection}</p>
            </div>
          </div>

        </div>

        {/* THE NUMERALS. The same three facts that were three small rows,
            at the size a figure is read from a distance. Mono, because
            a measurable is always mono (Rule 05). */}
        <div className="prop-band prop-bleed">
          <dl className="prop-numerals">
            <div>
              <dt className="t-micro label">Keys</dt>
              <dd className="prop-numeral">{v.keys}</dd>
            </div>
            <div>
              <dt className="t-micro label">Land</dt>
              <dd className="prop-numeral">{v.landArea}</dd>
            </div>
            {v.coordinates ? (
              <div>
                <dt className="t-micro label">Coordinates</dt>
                <dd className="prop-numeral">{v.coordinates}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      {/* ── ARCHITECTURAL INTENT ───────────────────────────────── */}
      <section id="architecture" className="prop-sec prop-ch" data-sec="AS-PROP.architecture">
        <div className="wrap">
          <h2 className="prop-titan-m">{spineLabel("architecture")}</h2>
        </div>
        <Frame m={page.exterior} className="prop-bleed" />
        <div className="wrap">
          <div className="prop-intent">
            <div>
              <span className="t-micro label">Mass</span>
              <p className="t-body-l measure">{page.mass}</p>
            </div>
            <div>
              <span className="t-micro label">Light</span>
              <p className="t-body-l measure">{page.light}</p>
            </div>
          </div>
        </div>
        <Reel frames={page.architectureFrames} label={spineLabel("architecture")} />
        <div className="wrap">
          {built.length > 0 ? <Footprint areas={built} /> : null}
          <p className="t-body-s dim prop-gap-m">
            Image kind and date remain attached to every frame.
          </p>
        </div>
      </section>

      {/* ── THE SPACES ─────────────────────────────────────────────
          One chapter per space: its name, one enormous picture, one
          statement, then the gallery. FB-2 holds because every full-bleed
          picture is followed at once by a bounded block of words. */}
      <section id="spaces" className="prop-sec on-paper" data-sec="AS-PROP.spaces">
        <div className="wrap">
          <h2 className="t-heading">
            Each space has a job.<br />
            <em>Each job has a relationship to the landscape.</em>
          </h2>
        </div>

        {page.chapters.map((c, i) => (
          <article key={c.name} className="prop-chapter prop-ch">
            <div className="wrap prop-chapter-head">
              {/* THE INDEX, at title size. It was an 11px footnote; a run of
                  four chapters reads as a run when the numbers are seen. */}
              <span className="prop-index" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="prop-titan-m">{c.name}</h3>
              <span className="t-mono-s dim">
                {String(i + 1).padStart(2, "0")} / {String(page.chapters.length).padStart(2, "0")}
              </span>
            </div>
            <Frame m={c.dominant} className="prop-bleed" />
            <div className="wrap">
              <p className="prop-note">{c.statement}</p>
            </div>
            <Reel frames={c.supporting} label={c.name} />
          </article>
        ))}

        {/* THE KEYS, DRAWN. The same figure the chapters use, from the same
            registry, so the two cannot disagree (PUBLIC.10). */}
        {estate && estate.keyTypes.length > 0 ? (
          <div className="prop-band prop-bleed prop-gap-xl">
            <div className="prop-band-in"><UnitSet units={estate.keyTypes} /></div>
          </div>
        ) : null}
      </section>

      {/* ── MATERIAL PALETTE ───────────────────────────────────── */}
      <section id="materials" className="prop-sec on-paper prop-ch prop-sec-ruled" data-sec="AS-PROP.materials">
        <div className="wrap">
          <h2 className="prop-titan-m">{spineLabel("materials")}</h2>
          <p className="prop-say">The house is composed, not decorated.</p>
        </div>
        <Reel frames={page.palette.map((m) => m.slot)} label={spineLabel("materials")} />
        <div className="wrap">
          <div className="prop-palette">
            {page.palette.map((m) => (
              <article key={m.material}>
                <span className="t-heading">{m.material}</span>
                <p className="t-body-s dim">{m.role}</p>
              </article>
            ))}
          </div>

          <div className="panel prop-gap-l">
            <span className="t-micro label">One system, three climates</span>
            <ul className="t-body-s prop-list">
              {ARCHITECTURAL_LANGUAGE.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </div>

          <p className="t-body dim prop-gap-m">
            Material specification is released with the private materials.
          </p>
          <Link className="btn prop-gap-s" href="/contact">Request the design materials →</Link>
        </div>
      </section>

      {/* ── THE VEHICLE ────────────────────────────────────────────
          FB-1. A figure is about to be read, so the layout returns to a
          bounded one and the ground turns to paper: void is for the
          narrative, paper is for the financial assertion. */}
      <section id="vehicle" className="prop-sec on-paper" data-sec="AS-PROP.vehicle">
        <div className="wrap">
          <h2 className="prop-titan-m">{spineLabel("vehicle")}</h2>
          <p className="prop-say">
            Beauty is not the whole proposition.<br />
            <em>The property must also have a clear legal and financial home.</em>
          </p>

          <div className="prop-grid prop-gap-m">
            <div>
              <span className="t-micro label">One property</span>
              <p className="t-body">{v.propertyName} · {v.assetCode}</p>
            </div>
            <div>
              <span className="t-micro label">One investment vehicle</span>
              <p className="t-body">{v.registeredName}</p>
              <p className="t-body-s dim">
                {v.llpin ? `LLPIN ${v.llpin}` : "Not yet incorporated"} · {v.registrar}
              </p>
            </div>
            <div>
              <Ladder min={v.ladder.minimumInvestmentBps} step={v.ladder.stepBps} ceiling={v.ladder.ceilingBps} />
              <span className="t-micro label">Ownership interest</span>
              <p className="t-body">
                Contribution-weighted, from {v.ladder.minimumInvestmentBps / 100}% in{" "}
                {v.ladder.stepBps / 100}% steps
              </p>
            </div>
            <div>
              {v.entitlement ? <NightPool min={v.entitlement.nightPoolMin} max={v.entitlement.nightPoolMax} /> : null}
              <span className="t-micro label">Time entitlement</span>
              <p className="t-body">
                {v.entitlement
                  ? `${v.entitlement.nightPoolMin}–${v.entitlement.nightPoolMax} nights a year across the vehicle`
                  : "Not yet set for this vehicle"}
              </p>
            </div>
            <div>
              {v.governance ? <Threshold bps={v.governance.ordinaryBps} /> : null}
              <span className="t-micro label">Decision rights</span>
              <p className="t-body">
                {v.governance
                  ? `An ordinary resolution needs more than ${v.governance.ordinaryBps / 100}%. A tie is not approval.`
                  : "Not yet set for this vehicle"}
              </p>
            </div>
            <div>
              <span className="t-micro label">Evidence</span>
              <p className="t-body">Reports, documents and resolutions, at the vantage you hold</p>
            </div>
          </div>

          {/*
            The figures, and only where the vehicle clears its gate.
            Two of the three do not. Showing a unit price for a vehicle
            whose equity is contested by ₹50 lakh would be the exact
            failure publishable() exists to prevent — so the section
            states what is being reconciled instead.
          */}
          {gate.ok ? (
            <div className="prop-figures">
              <div className="kv">
                <span className="label t-micro">Project total</span>
                <span className="v t-mono-s money">{inr(v.stack.projectTotal)}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Unit</span>
                <span className="v t-mono-s money">{inr(v.offering.unitPrice)}</span>
              </div>
              <div className="kv">
                <span className="label t-micro">Available</span>
                <span className="v t-mono-s">
                  {v.offering.available} of {v.offering.units}
                </span>
              </div>
              {wf.state === "complete" ? (
                <div className="kv">
                  <span className="label t-micro">To partners</span>
                  <span className="v t-mono-s">
                    {(v.operating.waterfall!.toPartners! / 100).toFixed(2)}% of gross revenue · forecast
                  </span>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="panel on-paper prop-hold prop-gap-m">
              <span className="t-micro label">Figures are being reconciled</span>
              <p className="t-body measure prop-gap-2xs">
                This vehicle&rsquo;s source documents disagree on the points below. Nothing
                financial is shown here until they agree, because a figure that renders cleanly
                is the hardest kind to doubt.
              </p>
              <ul className="t-body-s prop-list">
                {gate.because.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          )}

          <Link className="btn prop-gap-m" href="/how-it-works">
            Understand space, time, capital and governance →
          </Link>
        </div>
      </section>

      {/* ── EVIDENCE ───────────────────────────────────────────── */}
      <section id="evidence" className="prop-sec on-paper prop-sec-ruled" data-sec="AS-PROP.evidence">
        <div className="wrap">
          <h2 className="prop-titan-m">{spineLabel("evidence")}</h2>
          <p className="prop-say">What can be read now?</p>
          <div className="prop-tiers prop-gap-m">
            {EVIDENCE_TIERS.map((t) => (
              <div key={t.tier} className="prop-tier">
                <div>
                  <span className="t-micro label">{t.tier}</span>
                  <p className="t-body-l">{t.holds}</p>
                </div>
                {t.to ? (
                  <Link className="btn" href={t.to}>{t.action} →</Link>
                ) : (
                  <span className="t-mono-s dim">You are reading it</span>
                )}
              </div>
            ))}
          </div>

          {/* The brochure. Generated from the same registries as this page,
              so a downloaded document and the page cannot disagree. */}
          <div className="panel on-paper prop-gap-m">
            <span className="t-micro label">Take it with you</span>
            <p className="t-body-s dim prop-gap-3xs">
              A one-page summary, generated from the same records this page reads. It carries the
              same reconciliation notes.
            </p>
            <a className="btn prop-gap-s" href={`/api/brochure/${v.slug}`}>Download the brief</a>
          </div>
        </div>
      </section>

      {/* ── INVITATION ─────────────────────────────────────────── */}
      <section className="prop-sec prop-close" data-sec="AS-PROP.invitation">
        <div className="wrap">
          <h2 className="t-display-xl">
            If the place holds your attention,<br />
            <em>the material should hold up.</em>
          </h2>
          <div className="row prop-gap-m">
            <Link className="btn primary" href="/contact">Request private materials</Link>
            <GatedLink className="btn" href="/invest/qualify">Speak with the Collective</GatedLink>
          </div>
          <p className="t-body-s dim measure prop-gap-m">
            Capital is at risk. Any specific opportunity is governed by its applicable private
            materials, not by this public property page.
          </p>

          {/*
            The gap, stated ONCE and only while it exists.
            Twenty-five placeholders said the same thing twenty-five times
            and made the absence the loudest thing on the page.
          */}
          {/* ONWARD. Every other chapter ends with the way to the next one;
              this one had the tab bar instead. The first tab now points
              here, so the way on is said here. */}
          {onward ? (
            <p className="chapter-onward">
              <Link className="btn" href={chapterHref(v.slug, onward)}>
                {onward.n ? `${onward.n} · ` : ""}{onward.label} &rarr;
              </Link>
            </p>
          ) : null}

          {gap.filled < gap.declared ? (
            <p className="t-body-s dim measure prop-gap-l">
              Photography and drawings for this property are being produced. {gap.declared} frames
              are commissioned and {gap.filled} are finished; the rest will appear here as they
              are made, each carrying what it is and when it was taken.
            </p>
          ) : null}
        </div>
      </section>

      <Footer />
      <IrisPanel vehicleSlug={v.slug} />
    </div>
  );
}
