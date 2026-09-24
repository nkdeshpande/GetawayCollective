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

export const PAGES: Record<string, SitePage> = {
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
    "steps": [
     [
      "Getaway Collective governs",
      "Structures each estate as its own LLP and governs it for the partners. Paid from one disclosed stage of the waterfall, and from nothing else."
     ],
     [
      "Sensory Getaways operates",
      "Appointed to run every estate under a Commercial Services Agreement, measured on service levels."
     ],
     [
      "Brand & Digital generates demand",
      "Paid inside each vehicle, at stage two of the waterfall."
     ]
    ]
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
      "<a href=\"/team\" class=\"tx-u\">The founder, the architect, and the structural, MEP and modelling practices</a>"
     ],
     [
      "Registered details",
      "[legal form] · LLPIN [000-0000] · [registered office]",
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
    "steps": [
     [
      "Qualify",
      "Sixteen stages, from Discover to Issued. About fifteen working days from a complete file. Rights attach to ownership, not to accreditation."
     ],
     [
      "Reserve",
      "A flat deposit of ₹1,00,000, the same at every size, holds your place in an offering. It buys nothing, makes nobody a partner, and is refundable until the Vehicle Agreement is signed."
     ],
     [
      "Read",
      "The offering letter, the LLP agreement and the risk disclosure. The executed instrument governs; nothing on a page does."
     ],
     [
      "Commit",
      "By holding, never by clicking. Capital actions take three seconds on purpose."
     ],
     [
      "Settle",
      "On settlement you become a member of the LLP. That step is irreversible."
     ]
    ]
   },
   {
    "src": "public.ts 310–322 · content/member.ts"
   },
   {
    "h": "Where the money goes"
   },
   {
    "p": "Revenue flows through six stages, in order, on the vehicle's gross revenue base, and closes to 10,000 basis points. There is no preferred return, no catch-up and no carried interest."
   },
   {
    "rows": [
     [
      "01 · Operating company",
      "Sensory Getaways, on service levels"
     ],
     [
      "02 · Brand & Digital",
      "Per the offering letter"
     ],
     [
      "03 · Enterprise admin reserve",
      "2.5%"
     ],
     [
      "04 · Property sinking fund",
      "2.5%"
     ],
     [
      "05 · Debt service",
      "Per the offering letter"
     ],
     [
      "06 · LLP partner distributions",
      "The remainder, pro rata"
     ]
    ]
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
    "rows": [
     [
      "Ordinary resolution",
      "More than 50% of equity"
     ],
     [
      "Special resolution",
      "76% of equity"
     ],
     [
      "Entrenched clause",
      "100%: unanimity"
     ],
     [
      "A tie",
      "Is not approval"
     ]
    ]
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
    "src": "public.ts 184 · DECISIONS.md D-08"
   },
   {
    "h": "Leaving"
   },
   {
    "p": "There is no public market for units. The internal register is a noticeboard where partners can post interest; nothing guarantees a buyer."
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
      "Start qualification",
      "/contact",
      "lead"
     ],
     [
      "Read the risk disclosure",
      "/legal/risk-disclosure"
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
      "On the register and in the estates"
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
  "lead": "Every estate is designed, engineered and modelled by named people, and governed by a founder whose decisions are written down. This page records who they are, and leaves a slot wherever something has not yet been supplied.",
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
       ],
       [
        "Profile and background",
        "To be supplied",
        1
       ],
       [
        "Photograph",
        "Not yet commissioned",
        1
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
       ],
       [
        "Profile",
        "To be supplied",
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
       ],
       [
        "Profile",
        "To be supplied",
        1
       ]
      ]
     },
     {
      "initials": "AD",
      "role": "MEP design",
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
       ],
       [
        "Profile",
        "To be supplied",
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
       ],
       [
        "Profile",
        "To be supplied",
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
    "h": "Six steps, in order"
   },
   {
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
      "MEP design",
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
      "Founded",
      "Year to be supplied",
      1
     ],
     [
      "Registered office",
      "To be supplied",
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
      "The digital kit: gc-mark.svg, gc-lockup.svg and their reversed versions"
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
    "links": [
     [
      "Brand blueprint",
      "https://claude.ai/artifact/SQdkMD2ppyE9XKEHrsrQZh",
      "dark"
     ],
     [
      "Digital kit",
      "https://claude.ai/artifact/4zmj6cc2BHB28MT5Xd8aCa"
     ],
     [
      "Meet the team",
      "/team"
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
  "title": "Short answers, <span>with sources.</span>",
  "lead": "The questions people ask most often, answered in one or two sentences each, with the source every answer comes from.",
  "blocks": [
   {
    "rows": [
     [
      "<b class=\"tx-strong\">What is Getaway Collective?</b>",
      "An investment platform for collective ownership of exceptional retreats in India. Each estate is held by its own LLP and owned by its partners."
     ],
     [
      "<b class=\"tx-strong\">Who founded Getaway Collective?</b>",
      "Nikhil Deshpande."
     ],
     [
      "<b class=\"tx-strong\">Does Getaway Collective own the properties?</b>",
      "No. It governs each vehicle and holds no equity in any of them; the LLP owns the estate."
     ],
     [
      "<b class=\"tx-strong\">What do investors own?</b>",
      "Units in the estate's LLP. A unit is 5% of the equity, and a partner holds from one to ten."
     ],
     [
      "<b class=\"tx-strong\">Is it a timeshare?</b>",
      "No. A timeshare sells time; a unit is equity in the partnership that owns the estate, and time follows the position."
     ],
     [
      "<b class=\"tx-strong\">Where are the estates?</b>",
      "In Karnataka: Solace in the Nandi Hills corridor, Seaside Confluence at Padubidri on the Udupi coast, and SlowSpace Creek and Coffee Fields Forever in Kodagu."
     ],
     [
      "<b class=\"tx-strong\">Who runs the estates?</b>",
      "Sensory Getaways, the operating partner, under a Commercial Services Agreement measured on service levels."
     ],
     [
      "<b class=\"tx-strong\">Who designs the estates?</b>",
      "Architect Karthik Shanbhogue, with structural design by Manjunath & Co., MEP design by Addya, and a building information model for each estate."
     ],
     [
      "<b class=\"tx-strong\">How are decisions made?</b>",
      "By the partners, with votes weighted by equity: more than 50% for an ordinary resolution, 76% for a special one."
     ],
     [
      "<b class=\"tx-strong\">How long does accreditation take?</b>",
      "About fifteen working days from a complete file."
     ],
     [
      "<b class=\"tx-strong\">Can units be sold?</b>",
      "There is no public market. Partners can post interest on an internal register; nothing guarantees a buyer."
     ],
     [
      "<b class=\"tx-strong\">Is capital at risk?</b>",
      "Yes. Capital is at risk, and no return is guaranteed by any party. The <a href=\"/legal/risk-disclosure\" class=\"tx-u\">Risk Factors</a> set it out in full."
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
  "lead": "Every term used on this site, in one place.",
  "blocks": [
   {
    "rows": [
     [
      "<b class=\"tx-strong\">Accreditation</b>",
      "The sixteen-stage check a person completes before they can see an offering in full."
     ],
     [
      "<b class=\"tx-strong\">Admin reserve</b>",
      "Stage three of the waterfall: 2.5% of the revenue base, for governing the vehicle."
     ],
     [
      "<b class=\"tx-strong\">Chassis</b>",
      "One of three architectural systems every estate is built from: Ridge, Expanse and Voyager."
     ],
     [
      "<b class=\"tx-strong\">Confidence class</b>",
      "The label every forward-looking figure carries, saying how it was arrived at."
     ],
     [
      "<b class=\"tx-strong\">Covenant</b>",
      "The rule that at least 65% of every estate is kept as it is."
     ],
     [
      "<b class=\"tx-strong\">Key</b>",
      "One dwelling at an estate."
     ],
     [
      "<b class=\"tx-strong\">LLP</b>",
      "Limited Liability Partnership: the company that owns each estate."
     ],
     [
      "<b class=\"tx-strong\">Member</b>",
      "An investor after settlement: a partner in the LLP."
     ],
     [
      "<b class=\"tx-strong\">Offering letter</b>",
      "The document that states an estate's price, terms and figures. It governs; nothing on a page does."
     ],
     [
      "<b class=\"tx-strong\">Operating partner</b>",
      "Sensory Getaways, which runs every estate under a Commercial Services Agreement."
     ],
     [
      "<b class=\"tx-strong\">Register</b>",
      "The append-only record of positions, resolutions and documents; also the noticeboard where partners post units."
     ],
     [
      "<b class=\"tx-strong\">Resolution</b>",
      "A decision of the partners: ordinary above 50%, special at 76%, entrenched at 100%."
     ],
     [
      "<b class=\"tx-strong\">Revenue base</b>",
      "The vehicle's gross revenue, on which the waterfall is calculated."
     ],
     [
      "<b class=\"tx-strong\">Settlement</b>",
      "The moment cleared funds reach the vehicle and an investor becomes a member. It cannot be undone."
     ],
     [
      "<b class=\"tx-strong\">Sinking fund</b>",
      "Stage four of the waterfall: 2.5% of the revenue base, for renewal over the long term."
     ],
     [
      "<b class=\"tx-strong\">Unit</b>",
      "5% of an estate's LLP. Twenty units make the whole equity layer."
     ],
     [
      "<b class=\"tx-strong\">Waterfall</b>",
      "The six stages, in fixed order, through which an estate's revenue is paid."
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
