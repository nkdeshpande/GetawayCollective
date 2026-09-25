/**
 * THE TEXT PAGES — about, how it works, contact, signal, team, build, press, answers, glossary
 *
 * Ported 24 Sep 2026 from the site prototype (_DESIGN/gc/GC-Site.html), which
 * stays the visual reference and is not edited from here. Hand-maintained
 * from now on: this is content, not generated output.
 *
 * Colours are FILM.ink keys, written {ink:key}. Links are routes. Every fact
 * the vehicle register owns is a {{TOKEN}} the renderer fills from
 * constants/vehicles.ts, so a figure is never typed twice.
 */

import type { SitePage } from "@/app/_assemblies/site/types";

export const PAGES: Record<string, SitePage> =  {
 "about": {
  "key": "about",
  "eyebrow": "About",
  "title": "Somewhere worth returning to, <span>owned in a way you can check.</span>",
  "film": [
   "coast",
   18.4
  ],
  "lead": "Getaway Collective builds remarkable places in India and puts each one inside its own company, owned by its partners and governed in the open.",
  "blocks": [
   {
    "h": "What we are, and what we are not"
   },
   {
    "p": "An investment platform that happens to govern extraordinary places. Not a hospitality company, not a booking platform, not a property manager. We do not sell holidays."
   },
   {
    "h": "Why it exists"
   },
   {
    "p": "A second home is bought on one number and held on several nobody discusses. The fix is structural rather than commercial: one property, one company that owns it, and a record anyone holding it can read."
   },
   {
    "src": "about.tsx 104–123"
   },
   {
    "h": "Four refusals"
   },
   {
    "list": [
     "No pooling of capital between estates.",
     "No promised return.",
     "No selling of time.",
     "No share of what a property earns, for Getaway Collective."
    ]
   },
   {
    "src": "about.tsx 70–76"
   },
   {
    "src": "L1-02 21–25 · public.ts 149"
   },
   {
    "q": "Modern luxury is defined not by excess, but by the absence of noise."
   },
   {
    "src": "L1-01 125–128, the axiom of the Architecture of Silence"
   },
   {
    "h": "Three parties, never one"
   },
   {
    "da": "entities"
   },
   {
    "src": "L1-01 84–119 · legal.ts 132–154, 937"
   },
   {
    "p": "No single party may control investment governance, operations and demand at once. That separation is the design, not a policy on top of it."
   },
   {
    "h": "Vision"
   },
   {
    "p": "To create the world's most trusted collective ownership platform for extraordinary places, where architecture, stewardship, and technology transform real estate into a lifelong source of restoration, belonging, and enduring value."
   },
   {
    "src": "L1-01 156, verbatim"
   },
   {
    "h": "Who is behind it"
   },
   {
    "rows": [
     [
      "The team",
      "<a href=\"/team\" class=\"tx-u\">The founder, the architect, and the structural, building-systems and modelling practices</a>"
     ],
     [
      "Registered details",
      "Published here once the platform's own registration is complete. Each estate's partnership, with its LLP identification number where one has been issued, is named on that estate's page.",
      1
     ]
    ]
   },
   {
    "links": [
     [
      "See the estates",
      "/collection",
      "lead"
     ],
     [
      "How it works",
      "/how-it-works"
     ]
    ]
   }
  ],
  "path": "/about"
 },
 "how": {
  "key": "how",
  "eyebrow": "How it works",
  "title": "One estate. <span>One LLP.</span> Its partners decide.",
  "film": [
   "cff",
   12,
   0,
   1
  ],
  "lead": "Every estate is held by its own Limited Liability Partnership. You hold units in that partnership; the partnership holds the land and the buildings.",
  "blocks": [
   {
    "q": "Modern luxury is the absence of noise."
   },
   {
    "p": "The doctrine first, then the arithmetic that has to survive it."
   },
   {
    "src": "public.ts 252–258"
   },
   {
    "figs": [
     [
      "5%",
      "one unit of an estate's LLP"
     ],
     [
      "20",
      "units make the whole equity layer"
     ],
     [
      "1–10",
      "units a partner may hold"
     ],
     [
      "0%",
      "equity held by Getaway Collective"
     ]
    ]
   },
   {
    "src": "public.ts 285, 306 · legal.ts 132"
   },
   {
    "h": "The path to becoming a partner"
   },
   {
    "da": "path"
   },
   {
    "da": "lockin"
   },
   {
    "src": "public.ts 310–322 · content/member.ts"
   },
   {
    "h": "Where the money goes"
   },
   {
    "p": "Revenue flows through six stages, in order, each a share of the estate's gross revenue, and the six always add up to exactly 100%: nothing leaves outside them. There is no preferred return, no catch-up and no carried interest, so no class of investor is paid ahead of the others and no one takes a performance fee on top."
   },
   {
    "da": "waterfall",
    "money": true
   },
   {
    "src": "L1-16 28–57"
   },
   {
    "h": "Deciding, together"
   },
   {
    "p": "Votes are weighted by equity, never one partner, one vote. Resolutions are recorded in a register that is append-only: a correction is a new entry, never an edit."
   },
   {
    "da": "vote"
   },
   {
    "src": "public.ts 932–938"
   },
   {
    "src": "AGENTS.md 115 · Rule 11"
   },
   {
    "h": "Time at the estate"
   },
   {
    "p": "Nights follow your position; they are an incident of ownership, never the product. The exact allocation rule is not yet decided and each offering letter will state it."
   },
   {
    "da": "position"
   },
   {
    "src": "public.ts 184 · DECISIONS.md D-08"
   },
   {
    "h": "Leaving"
   },
   {
    "p": "There is no public market for units. After the lock-in, partners can post units on a noticeboard that other partners see first; it is not a market, and nothing guarantees a buyer."
   },
   {
    "src": "public.ts 330–333"
   },
   {
    "h": "Common questions"
   },
   {
    "faq": "all"
   },
   {
    "links": [
     [
      "How to qualify",
      "/how-to-qualify",
      "lead"
     ],
     [
      "Read the risk disclosure",
      "/legal/risk-disclosure"
     ],
     [
      "The operating partner",
      "/operating-partner"
     ]
    ]
   }
  ],
  "path": "/how-it-works"
 },
 "enquire": {
  "key": "contact",
  "light": 1,
  "eyebrow": "Enquire",
  "title": "Ask anything <span>about the structure.</span>",
  "lead": "Investor Relations replies on working days, in writing. Anything about committing capital continues by email or in the portal, so there is a record.",
  "blocks": [
   {
    "rows": [
     [
      "This creates",
      "A conversation, in writing"
     ],
     [
      "It does not create",
      "An allocation"
     ],
     [
      "It costs",
      "Nothing"
     ],
     [
      "What governs",
      "The executed instrument"
     ]
    ]
   },
   {
    "src": "propertychapter.ts 140–161"
   },
   {
    "form": {
     "id": "enq",
     "steps": true,
     "addr": "ir@getawaycollective.co",
     "chipsLabel": "I'm asking about",
     "chips": [
      "The structure",
      "A specific estate",
      "Accreditation",
      "The offering pack",
      "Press"
     ],
     "fields": [
      [
       "Name",
       "text",
       "name"
      ],
      [
       "Email",
       "email",
       "email"
      ],
      [
       "Estate",
       "select",
       [
        "Any estate",
        "Solace",
        "Seaside Confluence",
        "SlowSpace Creek",
        "Coffee Fields Forever"
       ]
      ],
      [
       "Your question",
       "area"
      ]
     ],
     "submit": "Send to Investor Relations",
     "ok": "Received. Investor Relations will write to you on the next working day. Nothing about capital is decided by email alone.",
     "note": "Capital is at risk; read the Terms, Part L, before committing."
    }
   }
  ],
  "path": "/contact"
 },
 "signal": {
  "key": "signal",
  "eyebrow": "The Signal",
  "title": "One note <span>a week.</span>",
  "film": [
   "nine",
   9
  ],
  "lead": "Weekly intelligence on solitude and assets. One transmission, no more.",
  "blocks": [
   {
    "rows": [
     [
      "What changed",
      "In the estates, and in their records"
     ],
     [
      "What was decided",
      "Resolutions, with their outcome"
     ],
     [
      "What was written",
      "The week's Journal entry"
     ]
    ]
   },
   {
    "rows": [
     [
      "Not sold",
      "Including in an acquisition"
     ],
     [
      "Not tracked",
      "No pixel"
     ],
     [
      "One list",
      "Nothing else is sent"
     ],
     [
      "One click out",
      "From any issue"
     ]
    ]
   },
   {
    "form": {
     "to": "signal",
     "id": "sig",
     "addr": "hello@getawaycollective.co",
     "fields": [
      [
       "Email",
       "email",
       "email"
      ]
     ],
     "submit": "Subscribe",
     "ok": "Subscribed. The next Signal arrives on its usual day.",
     "note": "Unsubscribe from any issue in one step."
    }
   },
   {
    "src": "public.ts 241–242"
   }
  ],
  "path": "/signal"
 },
 "nine": {
  "key": "nine",
  "eyebrow": "Pipeline · not yet offered",
  "title": "Nine <span>Hills.</span>",
  "film": [
   "nine",
   8.5
  ],
  "lead": "Sleep at the trailhead. The key is not the destination; it is where you return from the hill.",
  "blocks": [
   {
    "rows": [
     [
      "Place",
      "The Sakleshpur hills, Hassan"
     ],
     [
      "Keys",
      "12 to 20 · the estate plans 20: trail cabins, ridge cabins and expedition lofts"
     ],
     [
      "Land",
      "About 5 acres, 2 buildable"
     ],
     [
      "From Bengaluru",
      "About 220 km, 4.5 to 5 hours"
     ],
     [
      "House brand",
      "Not yet decided",
      1
     ],
     [
      "Title and permissions",
      "Open: title, survey, forest status and trek permissions",
      1
     ],
     [
      "Figures",
      "Withheld until counsel advises",
      1
     ]
    ]
   },
   {
    "src": "NIN CLAUDE.md · NIN-00-CN-001 · properties.yaml 147–165"
   },
   {
    "p": "Nothing about Nine Hills is offered. It is shown so its place in the collection is visible, and it will arrive with its own offering letter."
   },
   {
    "links": [
     [
      "Back to the collection",
      "/collection",
      "lead"
     ],
     [
      "Join The Signal",
      "/signal"
     ]
    ]
   }
  ],
  "path": "/collection/nine-hills"
 },
 "wild": {
  "key": "wild",
  "eyebrow": "Pipeline · forming",
  "title": "Wild<span>wood.</span>",
  "film": [
   "wild",
   19
  ],
  "lead": "Not a resort that happens to sit in a forest. The land is already the reason to come.",
  "blocks": [
   {
    "rows": [
     [
      "Vehicle",
      "PV01 Aranthodu Water Estate LLP · in the pipeline, not yet open for subscription"
     ],
     [
      "Place",
      "Aranthodu, Dakshina Kannada"
     ],
     [
      "Keys",
      "12: six on water, six in the grove"
     ],
     [
      "Land",
      "12 acres, the largest holding in the collection · lease and title pending",
      1
     ],
     [
      "From Mangaluru airport",
      "About 90 km"
     ],
     [
      "Figures",
      "Withheld: the vehicle cannot publish while its model reads \"do not close equity\"",
      1
     ]
    ]
   },
   {
    "src": "vehicles.ts 585–851 · WLD-01-CN-001 · properties.yaml 167–195"
   },
   {
    "p": "Abundance into value. Dependency out. Nothing about Wildwood is offered until its six open conflicts are cleared and counsel has reviewed it."
   },
   {
    "links": [
     [
      "Back to the collection",
      "/collection",
      "lead"
     ],
     [
      "Join The Signal",
      "/signal"
     ]
    ]
   }
  ],
  "path": "/collection/wildwood"
 },
 "tidal": {
  "key": "tidal",
  "eyebrow": "Pipeline · not yet offered",
  "title": "Tidal <span>Club.</span>",
  "film": [
   "coast",
   7
  ],
  "lead": "Sixteen villas and a club on the backwater at Yermal, on the Udupi coast. An ESKAPE estate, still assembling its land. Until September 2026 it was called Seascape.",
  "blocks": [
   {
    "rows": [
     [
      "Place",
      "Thenka, Yermal · Kaup taluk, Udupi district, on the backwater edge"
     ],
     [
      "House brand",
      "ESKAPE"
     ],
     [
      "Keys",
      "40: sixteen villas (12 Courtyard, 2 Tidal, 2 Signature) and 24 rooms in the Club, above a café and a pool"
     ],
     [
      "How it is held",
      "Unlike the rest of the collection: the villas are to be sold to their owners outright, and the Club and the common areas held by the estate's own LLP"
     ],
     [
      "Land",
      "0.35 acre held; the rest of the site is still being assembled"
     ],
     [
      "Nearest airport",
      "Mangaluru International, about 40 km"
     ],
     [
      "Coastal regulation",
      "Open: the high tide line and the site's classification under the Coastal Regulation Zone rules are not yet drawn",
      1
     ],
     [
      "Title and survey",
      "Open: the remaining land, and a survey of the whole site",
      1
     ],
     [
      "Figures",
      "Withheld until counsel advises",
      1
     ]
    ]
   },
   {
    "src": "6.0 ESKAPE Tidal Club CLAUDE.md · TDL-00-CN-001 · _CANON properties.yaml TDL"
   },
   {
    "p": "Nothing at Tidal Club is offered. No villa is for sale, the LLP has not been formed, and the structure is with counsel; nothing about it will be marketed until counsel has advised. It is shown so its place in the collection is visible."
   },
   {
    "links": [
     [
      "Back to the collection",
      "/collection",
      "lead"
     ],
     [
      "Join The Signal",
      "/signal"
     ]
    ]
   }
  ],
  "path": "/collection/tidal-club"
 },
 "team": {
  "key": "team",
  "eyebrow": "The team",
  "title": "The people who <span>draw, build and govern it.</span>",
  "film": [
   "solace",
   12,
   0,
   1
  ],
  "lead": "Every estate is designed, engineered and modelled by named people, and governed by a founder whose decisions are written down. This page records who they are; where a registration or a name is still to be published, it says so rather than leaving it out.",
  "blocks": [
   {
    "people": [
     {
      "lead": 1,
      "initials": "ND",
      "role": "Founder",
      "name": "Nikhil Deshpande",
      "line": "Founder of Getaway Collective. Sets the standard every estate is designed, built and governed to, and signs the decisions that make it binding.",
      "does": [
       "The enterprise and brand constitutions",
       "Design and capital decisions at each estate, each written down and dated, such as the steel structure at Seaside Confluence",
       "The separation between the platform, the operating partner and each vehicle"
      ],
      "rows": [
       [
        "Contact",
        "hello@getawaycollective.co"
       ]
      ]
     },
     {
      "initials": "KS",
      "role": "Architect",
      "name": "Karthik Shanbhogue",
      "line": "Architecture for the collection: the design of each estate and the drawings it is built from.",
      "does": [
       "Estate plans and building design",
       "Design through to construction sets",
       "Materials, light and the way each building meets its land"
      ],
      "rows": [
       [
        "Council of Architecture registration",
        "To be added",
        1
       ],
       [
        "Practice",
        "To be named",
        1
       ]
      ]
     },
     {
      "initials": "M&amp;",
      "role": "Structural design",
      "name": "Manjunath &amp; Co.",
      "line": "Structural design for the estates: frames, foundations and the ground each building stands on.",
      "does": [
       "The steel frame on driven piles at Seaside Confluence, chosen to leave the coastal ground barely touched",
       "The pier fields that carry the Creek clusters above the forest floor",
       "Load paths, spans and the structural checks on every drawing set"
      ],
      "rows": [
       [
        "Lead engineer",
        "To be named",
        1
       ],
       [
        "Registration",
        "To be added",
        1
       ]
      ]
     },
     {
      "initials": "AD",
      "role": "Building systems (MEP)",
      "name": "Addya",
      "line": "Mechanical, electrical and plumbing design: water, power, drainage and air, planned from first principles for each estate's climate.",
      "does": [
       "Water and power, including off-grid where the estate needs it",
       "Drainage for monsoon sites that take thousands of millimetres of rain a year",
       "Ventilation and plant that run quietly, so silence is designed, not hoped for"
      ],
      "rows": [
       [
        "Lead engineer",
        "To be named",
        1
       ]
      ]
     },
     {
      "initials": "BIM",
      "role": "Building information modelling",
      "name": "Building information modellers",
      "line": "One coordinated model per estate, in which architecture, structure and services are checked against each other before anything is built.",
      "does": [
       "A single shared model for each estate",
       "Clash detection between structure, services and architecture",
       "Quantities that feed the bill of quantities, so cost follows the drawing"
      ],
      "rows": [
       [
        "Firm",
        "To be named",
        1
       ]
      ]
     }
    ]
   },
   {
    "h": "Alongside them"
   },
   {
    "rows": [
     [
      "Sensory Getaways",
      "The operating partner for every estate, under a Commercial Services Agreement"
     ],
     [
      "Investor Relations",
      "ir@getawaycollective.co"
     ],
     [
      "Governance counsel",
      "Not yet appointed",
      1
     ]
    ]
   },
   {
    "src": "L1-01 56 · public.ts 454"
   },
   {
    "links": [
     [
      "How we build",
      "/how-we-build",
      "lead"
     ],
     [
      "Press kit",
      "/press"
     ]
    ]
   }
  ],
  "path": "/team"
 },
 "build": {
  "key": "build",
  "eyebrow": "How we build",
  "title": "Drawn to be checked, <span>not to be believed.</span>",
  "film": [
   "creek",
   12,
   0,
   1
  ],
  "lead": "Specification is a claim that can be checked against a drawing. Adjectives are not. Every estate is carried from a confirmed site record to a coordinated model, and every question still open is written down with what will close it.",
  "blocks": [
   {
    "figs": [
     [
      "4",
      "estates in design or delivery"
     ],
     [
      "49",
      "A1 sheets in the Creek construction basis set"
     ],
     [
      "32",
      "A1 sheets in the Confluence set"
     ],
     [
      "250",
      "pages in Creek's specification catalogue"
     ]
    ]
   },
   {
    "src": "CRK CLAUDE.md · SSC CLAUDE.md"
   },
   {
    "da": "stages"
   },
   {
    "h": "Six steps, in order"
   },
   {
    "stepsAs": "gates",
    "steps": [
     [
      "A confirmed site",
      "Each estate starts from an owner-confirmed site record: coordinates, land and title, read from the instrument itself rather than a summary."
     ],
     [
      "A design brief",
      "The architect sets the design: how the building meets the land, what it is made of, and which of the three chassis it uses."
     ],
     [
      "Structure and services",
      "Manjunath & Co. design the structure; Addya design water, power, drainage and air from first principles for the estate's climate."
     ],
     [
      "One coordinated model",
      "Building information modellers bring the disciplines into one model, so clashes are found on a screen rather than on site."
     ],
     [
      "A basis set of drawings",
      "A numbered set of A1 sheets, marked as design until it is issued for construction."
     ],
     [
      "A list of open questions",
      "Every open question is named with what closes it, who owns it and when. Seaside Confluence carries fifteen; Creek's basis set lists twenty-two."
     ]
    ]
   },
   {
    "src": "SSC-00-CN-003 §16 · CRK GFC R1 A-605"
   },
   {
    "h": "The vehicle, formed in eight steps"
   },
   {
    "da": "formation"
   },
   {
    "h": "Three chassis, every estate"
   },
   {
    "da": "chassis"
   },
   {
    "h": "Why we publish the holds"
   },
   {
    "p": "A drawing set with no open questions is either finished or hiding something. Ours say plainly what is not yet known: a coastal line not yet read, a flood line not yet surveyed. That is how a partner can tell a design from a brochure."
   },
   {
    "assert": "Nothing is cleared or built until the line that governs it is drawn."
   },
   {
    "src": "SSC-00-CN-003 §14.1"
   },
   {
    "links": [
     [
      "Meet the team",
      "/team",
      "lead"
     ],
     [
      "See Seaside Confluence",
      "/collection/slowspace-coastal"
     ],
     [
      "See SlowSpace Creek",
      "/collection/coorg-coffee-creek"
     ]
    ]
   }
  ],
  "path": "/how-we-build"
 },
 "press": {
  "key": "press",
  "light": 1,
  "eyebrow": "Press kit · 24 Sep 2026",
  "title": "Press <span>kit.</span>",
  "lead": "Everything a writer, editor or researcher needs to describe Getaway Collective accurately: boilerplates, facts, names, and the few words we never use. Every figure here comes from a named source.",
  "blocks": [
   {
    "h": "Boilerplate"
   },
   {
    "copy": [
     "Short",
     "Getaway Collective is an investment platform for collective ownership of exceptional retreats in India. Each estate is held by its own Limited Liability Partnership and owned by its partners; Getaway Collective governs the vehicles and holds no equity in them."
    ]
   },
   {
    "copy": [
     "Long",
     "Getaway Collective is an investment platform for collective ownership of exceptional retreats in India, founded by Nikhil Deshpande. Each estate is held by its own Limited Liability Partnership, divided into units and owned by its partners, who decide with votes weighted by equity. Getaway Collective structures and governs the vehicles, holds no equity in any of them, and is paid from one disclosed stage of each vehicle's waterfall. The estates are operated by Sensory Getaways under a Commercial Services Agreement. The collection includes Solace in the Nandi Hills corridor, Seaside Confluence on the Udupi coast, and SlowSpace Creek and Coffee Fields Forever in Kodagu. Capital is at risk."
    ]
   },
   {
    "h": "Fact sheet"
   },
   {
    "rows": [
     [
      "Name",
      "Getaway Collective"
     ],
     [
      "Founder",
      "Nikhil Deshpande"
     ],
     [
      "What it is",
      "An investment platform for collective ownership of exceptional retreats"
     ],
     [
      "Structure",
      "One LLP per estate; Getaway Collective holds no equity"
     ],
     [
      "Operator",
      "Sensory Getaways"
     ],
     [
      "Estates",
      "Solace · Seaside Confluence · SlowSpace Creek · Coffee Fields Forever"
     ],
     [
      "Keys across the four",
      "58: 6, 12, 20 and 20"
     ],
     [
      "Regions",
      "Nandi Hills corridor · Udupi coast · Kodagu, Karnataka"
     ],
     [
      "Architect",
      "Karthik Shanbhogue"
     ],
     [
      "Structural design",
      "Manjunath &amp; Co."
     ],
     [
      "Mechanical, electrical and plumbing",
      "Addya"
     ],
     [
      "Website",
      "getawaycollective.co"
     ],
     [
      "Press contact",
      "hello@getawaycollective.co"
     ],
     [
      "Registered office",
      "Published once the platform's own registration is complete",
      1
     ]
    ]
   },
   {
    "src": "properties.yaml · legal.ts 132 · founder, 24 Sep 2026"
   },
   {
    "h": "The estates, one line each"
   },
   {
    "rows": [
     [
      "Solace",
      "Six keys on a granite ridge two hours north of Bengaluru; the reference estate, in delivery."
     ],
     [
      "Seaside Confluence",
      "Twelve keys over the river where it meets the sea, on steel piles; fully subscribed."
     ],
     [
      "SlowSpace Creek",
      "Twenty keys in a river-forest in Kodagu, reached on foot across one bridge; raising."
     ],
     [
      "Coffee Fields Forever",
      "Twenty keys inside a working coffee plantation at Suntikoppa; raising."
     ]
    ]
   },
   {
    "h": "Lines attributable to Getaway Collective"
   },
   {
    "rows": [
     [
      "On the model",
      "\"You own. We steward. You decide.\"" // vocab-lint-ignore — ratified brand line, L1-02 §514
     ],
     [
      "On luxury",
      "\"Modern luxury is defined not by excess, but by the absence of noise.\""
     ],
     [
      "On what it is not",
      "\"We do not sell holidays.\""
     ],
     [
      "On design",
      "\"Specification is a claim that can be checked against a drawing. Adjectives are not.\""
     ]
    ]
   },
   {
    "src": "L1-02 514 · L1-01 125 · public.ts 149, 711"
   },
   {
    "p": "Please attribute these to Getaway Collective. Quotes attributed to a named person need that person's approval; ask hello@getawaycollective.co."
   },
   {
    "h": "Please write"
   },
   {
    "list": [
     "Getaway Collective, in full, at first mention.",
     "Collective ownership, not fractional ownership.",
     "Partners or members, not customers or users.",
     "Estate or property, and keys; the estates are not hotels or resorts.",
     "Any figure with its source, and the words: capital is at risk."
    ]
   },
   {
    "h": "Please avoid"
   },
   {
    "list": [
     "Timeshare, except to say it is not one.",
     "Returns, yields or income, unless quoted from an offering letter with its confidence class.",
     "Exclusive, limited, luxury resort, or any word that implies scarcity.",
     "Naming a partner or investor who has not agreed to be named."
    ]
   },
   {
    "h": "Brand assets"
   },
   {
    "rows": [
     [
      "Mark and lockups",
      "Below, ready to download: the mark in four versions, the lockup in four, and the share image"
     ],
     [
      "Colours",
      "Void #0A0A0A · Paper #F2F2F2 · Copper #C79F6B (value and the mark only) · Forest #0C3024 · Steel #6B6B6B"
     ],
     [
      "Type",
      "Inter Tight · Satoshi · Space Mono"
     ],
     [
      "Photography",
      "Not yet commissioned. Drawings and the drawn landscapes may be used, captioned as illustration.",
      1
     ],
     [
      "Clear space",
      "One module of the mark, 11% of its height, on every side"
     ]
    ]
   },
   {
    "assets": [
     ["Mark", "/images/press/gc-mark.svg", "Ink and copper, for light grounds · vector", "332"],
     ["Mark, reversed", "/images/press/gc-mark-reversed.svg", "Paper and copper, for dark grounds · vector", "332"],
     ["Mark, one colour black", "/images/press/gc-mark-black.svg", "Single-colour print and embossing · vector", "277"],
     ["Mark, one colour white", "/images/press/gc-mark-white.svg", "Single-colour on photographs or dark stock · vector", "277"],
     ["Mark, raster", "/images/press/gc-mark.png", "1024 px square, transparent", "11520"],
     ["Lockup", "/images/press/gc-lockup.png", "Mark and wordmark, for light grounds · 1040 px wide", "24208"],
     ["Lockup, reversed", "/images/press/gc-lockup-reversed.png", "For dark grounds · 1040 px wide", "24086"],
     ["Lockup with line", "/images/press/gc-lockup-tagline.png", "With the brand line, for light grounds", "33505"],
     ["Lockup with line, reversed", "/images/press/gc-lockup-tagline-reversed.png", "With the brand line, for dark grounds", "33317"],
     ["Share image", "/images/press/og-default.png", "1200 × 630, the card a shared link shows", "26331"]
    ]
   },
   {
    "p": "The lockups are supplied as images because the wordmark is set in Inter Tight; the marks are supplied as vectors. The brand line is Sensory Retreat, Capital Meets Curation."
   },
   {
    "links": [
     [
      "Meet the team",
      "/team",
      "dark"
     ],
     [
      "Answers",
      "/answers"
     ]
    ]
   }
  ],
  "path": "/press"
 },
 "answers": {
  "key": "answers",
  "light": 1,
  "eyebrow": "Answers",
  "title": "Answers, <span>in plain words.</span>",
  "lead": "The questions people ask most about owning a share of a retreat through Getaway Collective, each answered in full. Where a figure differs from one estate to the next, the estate's own page and its offering letter give it.",
  "blocks": [
   {
    "da": "search"
   },
   {
    "rows": [
     [
      "<b class=\"tx-strong\">What is Getaway Collective?</b>",
      "Getaway Collective is an Indian platform through which people own retreats together. Each estate is held by its own limited liability partnership (LLP); investors buy units in that LLP and become its partners, with a share of its distributions, a vote on its decisions and nights at the estate once it is built. Getaway Collective governs each partnership but holds no equity in any of them, and Sensory Getaways operates the estates."
     ],
     [
      "<b class=\"tx-strong\">Who founded Getaway Collective?</b>",
      "Nikhil Deshpande. As founder he sets the standard every estate is designed, built and governed to, and signs the decisions that make it binding, each one written down and dated, such as the choice of a steel structure at Seaside Confluence. He also holds the separation at the centre of the platform: Getaway Collective governs each estate's partnership, Sensory Getaways operates the estates, and neither is the owner. The partners are."
     ],
     [
      "<b class=\"tx-strong\">Does Getaway Collective own the properties?</b>",
      "No. Each estate is held by its own LLP, and the LLP is owned by its partners. Getaway Collective governs the partnership, keeps its records and runs its votes, but it holds no equity and no economic interest in any estate. That separation is entrenched in the terms: it can change only by a unanimous vote of the partners, so the party setting the rules can never profit from bending them."
     ],
     [
      "<b class=\"tx-strong\">What do investors own?</b>",
      "Units in one estate's LLP. Each unit is a fixed share of that partnership, priced in the estate's offering letter, and each estate sets the least and the most one partner may hold. Your units carry three things, in proportion to their number: a share of distributions when there are any, voting weight on resolutions, and nights at the estate from handover. Units are not shares in Getaway Collective, and not in any other estate."
     ],
     [
      "<b class=\"tx-strong\">Is it a timeshare?</b>",
      "No. A timeshare sells weeks of use and nothing more. A unit is equity in the partnership that holds the estate: you share in its distributions, vote on its decisions, and can sell your units after the lock-in. Nights come with that ownership, in proportion to what you hold; they are a benefit of owning, not a separate product, and they are not priced or sold on their own."
     ],
     [
      "<b class=\"tx-strong\">How do I begin?</b>",
      "Sign in with an email address: no password, no documents, and nothing to pass. Every estate, its drawings and its figures are open to you from there. When you find an estate you want, hold your units online with a holding deposit, refundable in full until you sign. KYC runs alongside at your own pace and is complete before you sign the LLP agreement and settle your units. <a class=\"tx-u\" href=\"/how-to-qualify\">The three steps, in full</a>."
     ],
     [
      "<b class=\"tx-strong\">What is the holding deposit?</b>",
      "₹1,00,000, the same at every estate whatever the number of units you intend to take. It is paid online, to the estate's own LLP rather than to Getaway Collective, and holds your units while the rest is completed with Investor Relations: the identity checks, the balance of the unit price and the Vehicle Agreement. It is refundable in full until that agreement is signed. It buys nothing on its own and makes nobody a partner."
     ],
     [
      "<b class=\"tx-strong\">Where are the estates?</b>",
      "All in Karnataka. Solace is at Chikkaballapur, in the Nandi Hills corridor, about two hours from Bengaluru. Seaside Confluence is at Padubidri on the Udupi coast, between the Arabian Sea and a river estuary. SlowSpace Creek and Coffee Fields Forever lie about 1.8 km apart in Kodagu, among coffee. Three more are in the pipeline: Nine Hills in the Sakleshpur hills, Wildwood at Aranthodu in Dakshina Kannada, and Tidal Club at Yermal on the Udupi coast."
     ],
     [
      "<b class=\"tx-strong\">Who runs the estates?</b>",
      "Sensory Getaways, the operating partner. It runs each estate day to day under a Commercial Services Agreement with that estate's LLP, is measured against agreed Service Levels, and is paid from the first stage of the waterfall. Its duties run to the partnership, so the partners, through their votes, hold it to the agreement. At Seaside Confluence a separate food partner is being chosen by tender."
     ],
     [
      "<b class=\"tx-strong\">Who designs the estates?</b>",
      "The architect is Karthik Shanbhogue. Manjunath & Co. design the structures, and Addya designs the building systems, mechanical, electrical and plumbing: water, power, drainage and air, planned for each estate's climate. Building information modellers bring every discipline into one coordinated model per estate, so clashes are found on a screen rather than on site. The estates share three architectural systems, called Ridge, Expanse and Voyager."
     ],
     [
      "<b class=\"tx-strong\">How are decisions made?</b>",
      "By the partners, voting in proportion to what each holds, never one vote per head. An ordinary resolution needs more than 50% of the holdings present and voting; a special resolution needs at least 76% of all holdings; entrenched principles, such as Getaway Collective holding no equity, need every partner. A tie fails. Partners holding 20% or more can call a meeting, which must be held within 21 days."
     ],
     [
      "<b class=\"tx-strong\">How long does accreditation take?</b>",
      "Signing in takes one email and no documents, and you can read every estate straight away. The checks that follow run alongside your reading rather than in front of it: a short suitability questionnaire opens the full offering documents, with a decision within 15 working days of a complete submission, and KYC (identity, address, tax residency, source of funds, documents and screening) can be done at your own pace. Every stage saves as you go, and all of it is complete before you sign."
     ],
     [
      "<b class=\"tx-strong\">Can units be sold?</b>",
      "Yes, after the lock-in, which is typically 36 months from financial close. There is no public market: you post units on a noticeboard that existing partners see first, and nothing guarantees a buyer or a price. A buyer from outside the partnership needs the consent of partners holding a majority, and must complete the same identity checks. During the lock-in, units move only on a partner's death or with every partner's consent."
     ],
     [
      "<b class=\"tx-strong\">Is capital at risk?</b>",
      "Yes. Capital is at risk, and no return is guaranteed by any party, including Getaway Collective, the operating partner and the sponsor. Estates carry construction and delivery risk, bank debt is repaid before partners, income depends on occupancy that has not yet been observed, and units cannot be sold quickly. The <a href=\"/legal/risk-disclosure\" class=\"tx-u\">Risk Factors</a> set it out in full."
     ]
    ]
   },
   {
    "links": [
     [
      "Glossary",
      "/glossary",
      "dark"
     ],
     [
      "How it works",
      "/how-it-works"
     ]
    ]
   }
  ],
  "path": "/answers"
 },
 "glossary": {
  "key": "glossary",
  "light": 1,
  "eyebrow": "Glossary",
  "title": "The words, <span>defined once.</span>",
  "lead": "Every term used on this site, defined once and in plain words.",
  "blocks": [
   {
    "rows": [
     [
      "<b class=\"tx-strong\">Accreditation</b>",
      "The checks that establish who you are, where you are tax-resident, where your funds come from, and whether the commitment suits your circumstances. On this site they run alongside your reading, never before it, and are complete before you sign an LLP agreement. Passing them confirms eligibility; it is not advice that the investment is right for you."
     ],
     [
      "<b class=\"tx-strong\">Admin reserve</b>",
      "The third stage of the waterfall: 2.5% of an estate's revenue, set aside to pay for governing the partnership: keeping its records, running its votes and meeting its legal obligations. It is paid before debt service and before anything reaches partners."
     ],
     [
      "<b class=\"tx-strong\">Basis point</b>",
      "One hundredth of one per cent: 100 basis points make 1%, and 10,000 make 100%. The waterfall's six stages are set in basis points so that together they always account for exactly the whole of revenue."
     ],
     [
      "<b class=\"tx-strong\">Chassis</b>",
      "One of three architectural systems the estates are built from, each a repeatable dwelling adapted to its site: Ridge (38 m² with a courtyard, on the ground), Expanse (36 m² with a deck, lifted 3.8 m) and Voyager (52 m² with a porch, opened into volume)."
     ],
     [
      "<b class=\"tx-strong\">Confidence class</b>",
      "The label every forward-looking figure carries, saying how it was arrived at: observed (counted or measured), verified (checked against a source document), modelled (computed from stated assumptions), estimated (a judgement on incomplete information), forecast (about a period that has not happened) or pending (expected, and shown as absent rather than as zero)."
     ],
     [
      "<b class=\"tx-strong\">Covenant (land)</b>",
      "The standing promise that at least 65% of every estate's land is kept as it is: not built on, paved or cleared. Each estate page states its own share."
     ],
     [
      "<b class=\"tx-strong\">Covenant (loan)</b>",
      "A condition a lender sets on its loan. The estates' bank facilities carry a minimum debt service coverage ratio; see DSCR."
     ],
     [
      "<b class=\"tx-strong\">Designated partner</b>",
      "A partner named in an LLP agreement to carry the partnership's legal duties: its filings, records and compliance. Where the agreement names Getaway Collective, it carries those duties without holding any equity."
     ],
     [
      "<b class=\"tx-strong\">Distribution</b>",
      "A payment to partners from the last stage of the waterfall, after the operating partner, brand and platform, the two reserves and any loan repayments have been paid. It is shared in proportion to units held, and nothing guarantees one in any year."
     ],
     [
      "<b class=\"tx-strong\">DSCR</b>",
      "Debt service coverage ratio: the income an estate has available for its loan, divided by the repayments due. A covenant of 1.50x minimum means income must be at least one and a half times the repayments."
     ],
     [
      "<b class=\"tx-strong\">Entrenched principle</b>",
      "A rule that can change only by a unanimous vote of the partners, 100% of holdings. That Getaway Collective holds no equity in any estate is one of them."
     ],
     [
      "<b class=\"tx-strong\">Financial close</b>",
      "The date an estate's funding is complete: the equity raised and the bank facility in place. The lock-in on units runs from it."
     ],
     [
      "<b class=\"tx-strong\">Handover</b>",
      "The day an estate is complete and handed to the operating partner to open. Partners' nights begin at handover; before it there is nothing to draw on."
     ],
     [
      "<b class=\"tx-strong\">Holding deposit</b>",
      "₹1,00,000, paid online to the estate's own LLP to hold your units while the rest is completed. It is the same at every estate, whatever the number of units, and refundable in full until the Vehicle Agreement is signed. It makes nobody a partner."
     ],
     [
      "<b class=\"tx-strong\">Key</b>",
      "One self-contained dwelling at an estate, counted the way a hotel counts its keys, whatever its size. Each estate page states how many it has."
     ],
     [
      "<b class=\"tx-strong\">KYC</b>",
      "The identity checks Indian law requires before anyone becomes a partner: identity, address, tax residency, source of funds, supporting documents and screening. They run alongside your reading, at your own pace, and are complete before you sign."
     ],
     [
      "<b class=\"tx-strong\">Lock-in</b>",
      "The period after financial close during which units cannot be sold or transferred, except on a partner's death or with every partner's consent. Typically 36 months; each estate's LLP agreement states its own."
     ],
     [
      "<b class=\"tx-strong\">LLP</b>",
      "A limited liability partnership under India's LLP Act 2008: a body that holds property in its own name, whose partners' liability is limited to what they contribute. Each estate has its own LLP, and investors become its partners."
     ],
     [
      "<b class=\"tx-strong\">LLPIN</b>",
      "The LLP identification number the Registrar of Companies issues when a partnership is incorporated. An estate whose LLP is still being formed has none yet, and its page says so."
     ],
     [
      "<b class=\"tx-strong\">Member</b>",
      "An investor whose funds have settled: a partner in the estate's LLP, with a vote, a share of distributions and, from handover, nights. Before settlement an investor has an obligation and no rights."
     ],
     [
      "<b class=\"tx-strong\">Moratorium</b>",
      "A period at the start of a bank loan when only interest is paid and no principal. At the estates offered so far it covers the first 18 months."
     ],
     [
      "<b class=\"tx-strong\">Offering letter</b>",
      "The document that sets an estate's unit price, number of units, lock-in, fees, risks and figures. Where it and any web page differ, the offering letter governs; nothing on a page is a term of investment."
     ],
     [
      "<b class=\"tx-strong\">Operating partner</b>",
      "Sensory Getaways, which runs every estate day to day under a Commercial Services Agreement with that estate's LLP. It is measured against agreed Service Levels, paid from the first stage of the waterfall, and owes its duties to the partnership."
     ],
     [
      "<b class=\"tx-strong\">Quorum</b>",
      "The share of total holdings that must take part for a partners' vote to count. Where an estate's agreement states it, it is 60%."
     ],
     [
      "<b class=\"tx-strong\">Register</b>",
      "The partnership's permanent record of who holds which units, every resolution and every document. Entries are added, never edited or removed. It also carries a noticeboard where partners can post units after the lock-in; that is not a market, and it guarantees no buyer."
     ],
     [
      "<b class=\"tx-strong\">Reserved matter</b>",
      "A decision the LLP agreement keeps for the partners alone, such as selling the land or borrowing beyond the agreed limit."
     ],
     [
      "<b class=\"tx-strong\">Resolution</b>",
      "A decision of the partners, weighted by holding: ordinary (more than 50% of the holdings present and voting), special (at least 76% of all holdings) or entrenched (100%). A tie fails."
     ],
     [
      "<b class=\"tx-strong\">Revenue base</b>",
      "An estate's gross revenue, before any costs. Every stage of the waterfall is a share of it, so the six stages always account for all of it."
     ],
     [
      "<b class=\"tx-strong\">Settlement</b>",
      "The moment an investor's cleared funds reach the estate's LLP. From then the investor is a partner. It cannot be undone; the way out is a transfer after the lock-in. Funds must settle within 15 working days of committing."
     ],
     [
      "<b class=\"tx-strong\">Sinking fund</b>",
      "The fourth stage of the waterfall: 2.5% of an estate's revenue set aside every year for long-term renewal, so the estate is kept up as it ages."
     ],
     [
      "<b class=\"tx-strong\">Sponsor</b>",
      "The founding party that puts its own money into an estate's equity alongside the partners. Each estate's offering shows how much of the equity the sponsor holds."
     ],
     [
      "<b class=\"tx-strong\">Unit</b>",
      "A fixed share of one estate's LLP, priced in its offering letter. Each estate sets its own unit size, price and the most one partner may hold, and its page shows how many remain. Your units decide your share of distributions, your voting weight and your nights."
     ],
     [
      "<b class=\"tx-strong\">Waitlist</b>",
      "For an estate whose units are all held: a list, in the order it was joined, of people who hear first if a partner offers units after the lock-in. Joining commits you to nothing."
     ],
     [
      "<b class=\"tx-strong\">Waterfall</b>",
      "The six stages, in fixed order, through which an estate's revenue is paid: the operating partner, brand and platform, the admin reserve, the sinking fund, debt service, and then partners. Each stage is paid in full before the next receives anything, and the six always add up to the whole of revenue."
     ]
    ]
   },
   {
    "src": "vocabulary.ts · L1-16 · public.ts · legal.ts"
   },
   {
    "links": [
     [
      "Answers",
      "/answers",
      "dark"
     ]
    ]
   }
  ],
  "path": "/glossary"
 }
};
