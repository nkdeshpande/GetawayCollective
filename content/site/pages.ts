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
  "lead": "Getaway Collective creates remarkable places in India and holds each one in its own LLP, owned by its partners and governed in the open.",
  "blocks": [
   {
    "h": "What we are"
   },
   {
    "p": "An ownership platform for places worth returning to. Each place is a single asset in its own LLP. Its partners own it, and we govern it for them."
   },
   {
    "h": "Why it exists"
   },
   {
    "p": "A second home is bought on one number and held on many. We built a structure that answers all of them: one place, one LLP that owns it, and records every partner can read."
   },
   {
    "src": "about.tsx 104–123 · copy GC-19-CT-001 R4"
   },
   {
    "h": "Four commitments"
   },
   {
    "list": [
     "Each estate's capital stays in that estate.",
     "Every figure is shown with its basis.",
     "Nights come with ownership.",
     "What reaches the partners is theirs alone."
    ]
   },
   {
    "q": "Modern luxury is defined not by excess, but by the absence of noise."
   },
   {
    "src": "L1-01 125–128, the axiom of the Architecture of Silence"
   },
   {
    "h": "Three parties, each with one role"
   },
   {
    "da": "entities"
   },
   {
    "p": "Governance, operations and demand sit with three different parties, so each holds the others to account. That separation is the design."
   },
   {
    "h": "Vision"
   },
   {
    "p": "Places in India worth coming back to, owned by the people who come back, on records anyone who holds them can read."
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
      "NAVINA Structures Pvt Ltd",
      "Getaway Collective is a brand of NAVINA Structures Pvt Ltd, which forms each estate's LLP and governs it for its partners."
     ],
     [
      "The promoters",
      "Nikhil Deshpande, the founder, and Shirisha Avanchi: the directors and shareholders of NAVINA, and partners in each estate in their own names, on the same terms as every other partner."
     ],
     [
      "The team",
      "<a href=\"/team\" class=\"tx-u\">The architect, and the structural, building-systems and modelling practices</a>"
     ],
     [
      "Registered details",
      "Each estate's LLP is named on that estate's page, with its identification number once it is issued. The <a href=\"/legal/disclosures\" class=\"tx-u\">Disclosures</a> set out how the parties are connected.",
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
  "title": "One estate. <span>One LLP.</span>",
  "film": [
   "cff",
   12,
   0,
   1
  ],
  "lead": "Every estate is a single asset held in its own special purpose vehicle (SPV), in the form of a limited liability partnership (LLP). The LLP owns the land and the buildings. Its partners own the LLP, in proportion to their units.",
  "blocks": [
   {
    "q": "Modern luxury is the absence of noise."
   },
   {
    "h": "Why an LLP"
   },
   {
    "steps": [
     ["A legal entity of its own", "It owns the land and the buildings, signs contracts and keeps accounts in its own name."],
     ["Limited liability", "Each partner's liability is limited to what they agreed to contribute."],
     ["It continues as partners change", "Units can pass from one partner to another without the estate changing hands."],
     ["Ring-fenced", "One estate per LLP, so each estate's money and obligations remain with that estate."]
    ]
   },
   {
    "h": "Who is behind it"
   },
   {
    "rows": [
     [
      "NAVINA Structures Pvt Ltd, as Getaway Collective",
      "Getaway Collective is NAVINA's brand. NAVINA forms each estate's LLP, holds your deposit as a fiduciary until you are admitted, then keeps the register and the records, runs the votes and reports to partners. It holds no equity, and is paid from one disclosed stage of revenue."
     ],
     [
      "The promoters",
      "Nikhil Deshpande and Shirisha Avanchi, NAVINA's directors and shareholders, invest in each estate in their own names: the same units, on the same terms, paid at the same stage as you."
     ],
     [
      "Sensory Getaways",
      "Runs each estate for its partners: the guests, the staff and the upkeep, measured on agreed service levels."
     ]
    ]
   },
   {
    "h": "Where your money goes"
   },
   {
    "steps": [
     ["The deposit", "₹1,00,000 holds your units. It is paid to NAVINA Structures Pvt Ltd, the company forming the estate's LLP, which holds it as a fiduciary. It is refundable in full until you sign."],
     ["Identity checks", "They run alongside, at your pace, and complete before you sign."],
     ["Signing", "You sign the LLP agreement and pay the balance. Your units are allotted at signing."],
     ["Building", "The LLP builds the estate to its drawings and cost plan."],
     ["Running", "Sensory Getaways opens it to guests."],
     ["Distributions", "Revenue pays six stages in order, and partners share the last, in proportion to their units."]
    ]
   },
   {
    "src": "public.ts 252–258 · copy GC-19-CT-001 R4"
   },
   {
    "toc": [
     [
      "own",
      "What you own"
     ],
     [
      "become",
      "Becoming a partner"
     ],
     [
      "money",
      "Where the money goes"
     ],
     [
      "decide",
      "Deciding, using and leaving"
     ]
    ],
    "tocLabel": "Four chapters"
   },
   {
    "h": "<span class=\"tx-ch\">Chapter 1</span>What you own",
    "id": "own"
   },
   {
    "p": "A unit is a fixed share of one estate's LLP. Each estate sets how large a share a unit is, what it costs and how many one partner may hold. Your units give you three things, in proportion to their number: a share of distributions, a vote, and nights at the estate."
   },
   {
    "units": true
   },
   {
    "p": "The equity belongs to the partners. What Getaway Collective does at each estate, and what it is paid, are stated in that estate's own terms."
   },
   {
    "src": "constants/vehicles.ts offering, ladder · legal.ts 132"
   },
   {
    "h": "<span class=\"tx-ch\">Chapter 2</span>Becoming a partner",
    "id": "become"
   },
   {
    "p": "Sign in with one email and read everything. Identity checks run alongside your reading, and each stage resumes where you left it."
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
    "h": "<span class=\"tx-ch\">Chapter 3</span>Where the money goes",
    "id": "money"
   },
   {
    "p": "Revenue flows through six stages, in order. Each is a share of gross revenue, and together they make exactly 100%. There is one class of unit, so every partner is paid the same way, with no preferred return, catch-up or performance fee."
   },
   {
    "da": "wftable"
   },
   {
    "p": "Streamside Creek sets out its own order of payment, with the bank first; <a class=\"tx-u\" href=\"/collection/coorg-coffee-creek#capital\">its page shows the order</a>."
   },
   {
    "p": "The same shares, drawn and applied to each estate's modelled revenue, as an illustration."
   },
   {
    "da": "waterfall",
    "money": true
   },
   {
    "src": "L1-16 28–57"
   },
   {
    "h": "Who is paid, and in what order",
    "id": "fees"
   },
   {
    "steps": [
     ["Sensory Getaways", "For running the estate day to day, under its Commercial Services Agreement."],
     ["The house brand and Getaway Collective", "SlowSpace or ESKAPE, for the name and the demand it brings; Getaway Collective, for the register, the records and the votes."],
     ["The administration reserve", "Kept by the LLP in its own name."],
     ["The sinking fund", "Kept by the LLP for repairs and renewal."],
     ["The bank", "Where the estate has a loan."],
     ["The partners", "Everything that remains, in proportion to their units."]
    ]
   },
   {
    "p": "The shares are set estate by estate. At Seaside Confluence and Solace the brand and platform stage takes 15% of revenue, and at Wildwood 5%; the operating partner takes between 35% and 50%. Streamside Creek states its own order. Each estate's investment page gives its shares."
   },
   {
    "p": "Getaway Collective holds no equity in any estate and takes nothing from what reaches the partners. Its owner, NAVINA Structures Pvt Ltd, is owned and run by the promoters, and the <a class=\"tx-u\" href=\"/legal/disclosures\">Disclosures</a> set out every connection between the parties. Every charge appears in the offering letter before you commit."
   },
   {
    "h": "<span class=\"tx-ch\">Chapter 4</span>Deciding, using and leaving",
    "id": "decide"
   },
   {
    "p": "<b class=\"tx-strong\">Deciding.</b> Votes are weighted by holding. Every resolution is recorded in a register that only grows: a correction is a new entry."
   },
   {
    "da": "vote"
   },
   {
    "src": "public.ts 932–938 · AGENTS.md 115 · Rule 11"
   },
   {
    "p": "<b class=\"tx-strong\">Using the estate.</b> Nights come with ownership: one night a year for each 1% of the estate you hold, from handover. A 10% holding brings ten nights. Each offering letter confirms it."
   },
   {
    "da": "position"
   },
   {
    "src": "public.ts 184 · founder ruling, 6 Oct 2026"
   },
   {
    "p": "<b class=\"tx-strong\">Leaving.</b> After the lock-in, you offer your units on a private noticeboard, which fellow partners see first. A sale is agreed between partners, at a price they settle."
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
      "How to join",
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
        "Solace by SLOWSPACE",
        "Seaside Confluence",
        "Streamside Creek",
        "Coffee Fields Forever",
        "Nine Hills",
        "Wildwood",
        "Tidal Club"
       ]
      ],
      [
       "Your question",
       "area"
      ]
     ],
     "submit": "Send to Investor Relations",
     "ok": "Received. Investor Relations will reply to you in writing. Nothing about capital is decided by email alone.",
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
  "lead": "Twelve studios on twelve acres at Aranthodu, Dakshina Kannada. Forming. Opens to partners after counsel's review.",
  "blocks": [
   {
    "rows": [
     [
      "Vehicle",
      "Aranthodu Water Estate LLP, in formation"
     ],
     [
      "Place",
      "Aranthodu, Dakshina Kannada"
     ],
     [
      "Studios",
      "12: six on the water, six in the grove"
     ],
     [
      "Land",
      "12 acres, the largest holding in the collection · the lease and title documents are being completed",
      1
     ],
     [
      "From Mangaluru airport",
      "About 90 km"
     ],
     [
      "Figures",
      "Capital, units and the payment order are published when the estate opens to partners, after the close of its financial model and counsel's review",
      1
     ]
    ]
   },
   {
    "src": "vehicles.ts 585–851 · WLD-01-CN-001 · properties.yaml 167–195"
   },
   {
    "p": "The land is the reason to come. Wildwood is twelve studios: six on the water and six in the grove. Its 12 acres make it the largest holding in the collection. Each estate is a single asset in its own limited liability partnership (LLP), owned exclusively by its partners. Join The Signal to hear when Wildwood opens."
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
  "title": "The people who <span>form, design, build and govern each estate.</span>",
  "film": [
   "solace",
   12,
   0,
   1
  ],
  "lead": "Every estate is designed, engineered and modelled by named people. NAVINA Structures Pvt Ltd forms and governs each estate's limited liability partnership (LLP), as Getaway Collective, its brand. Its directors are the promoters, who invest in each estate in their own names.",
  "blocks": [
   {
    "people": [
     {
      "lead": 1,
      "initials": "ND",
      "role": "Founder",
      "name": "Nikhil Deshpande",
      "line": "Founder of Getaway Collective, and a director and shareholder of NAVINA Structures Pvt Ltd. A promoter of each estate, investing in his own name on the same terms as other partners. He sets the standard every estate is designed, built and governed to, and signs the decisions that make it binding.",
      "does": [
       "The enterprise and brand constitutions",
       "Design and capital decisions at each estate, each written and dated, such as the steel structure at Seaside Confluence",
       "The separation between NAVINA, the operating partner and each LLP"
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
      "line": "The design of each estate and the drawings it is built from.",
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
      "line": "Frames, foundations and the ground each building stands on.",
      "does": [
       "At Seaside Confluence, a steel frame on driven piles",
       "At Streamside Creek, pier fields that lift the clusters above the forest floor",
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
      "role": "Building systems",
      "name": "Addya",
      "line": "Water, power, drainage and air, planned for each estate's climate.",
      "does": [
       "Off-grid power where an estate needs it",
       "Drainage for heavy monsoon rain",
       "Plant that runs quietly"
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
      "line": "One coordinated model per estate, where architecture, structure and services are checked against each other before building. Its quantities feed the bill of quantities, so cost follows the drawing.",
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
      "Named on appointment",
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
  "title": "One standard, <span>drawn to be checked.</span>",
  "film": [
   "creek",
   12,
   0,
   1
  ],
  "lead": "Every estate is built to the same standard, from drawings a partner can check. Each starts from a confirmed site record and ends in one model. Every open question is written down with what will close it. For a partner, the price, the programme and the standard are fixed on paper before building starts.",
  "blocks": [
   {
    "figs": [
     [
      "4",
      "estates in design or delivery"
     ],
     [
      "49",
      "A1 sheets in the Streamside Creek construction set"
     ],
     [
      "32",
      "A1 sheets in the Seaside Confluence set"
     ],
     [
      "250",
      "pages in Streamside Creek's specification catalogue"
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
      "Coordinates, land and title, read from the instrument itself."
     ],
     [
      "A design brief",
      "The architect sets how the building meets the land, what it is made of, and which of the three chassis it uses."
     ],
     [
      "Structure and services",
      "Manjunath & Co. design the structure. Addya design water, power, drainage and air for the estate's climate."
     ],
     [
      "One coordinated model",
      "Building information modellers bring every discipline into one model, so clashes are resolved on screen."
     ],
     [
      "A set of drawings",
      "A numbered set of A1 sheets, marked as design until issued for construction."
     ],
     [
      "A list of open questions",
      "Each is named with what closes it, who owns it and when. Seaside Confluence carries fifteen; Streamside Creek's set lists twenty-two."
     ]
    ]
   },
   {
    "src": "SSC-00-CN-003 §16 · CRK GFC R1 A-605"
   },
   {
    "h": "How each LLP is formed"
   },
   {
    "da": "formation"
   },
   {
    "h": "Three chassis, used at every estate"
   },
   {
    "da": "chassis"
   },
   {
    "h": "Why we publish the open questions"
   },
   {
    "p": "A partner can tell a design from a brochure by its open questions. Ours are named. At the coast, it is the CRZ line read from the survey. At Streamside Creek, it is the flood line."
   },
   {
    "assert": "Each building is cleared once the line that governs it is drawn."
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
      "See Streamside Creek",
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
  "lead": "Everything a writer needs to describe Getaway Collective accurately.",
  "blocks": [
   {
    "h": "Boilerplate"
   },
   {
    "copy": [
     "Short",
     "Getaway Collective is an ownership platform for retreats in India, and a brand of NAVINA Structures Pvt Ltd. Each estate is a single asset held in its own limited liability partnership (LLP), owned exclusively by its partners. NAVINA forms and governs each LLP and holds no equity in it."
    ]
   },
   {
    "copy": [
     "Long",
     "Getaway Collective is an ownership platform for retreats in India, founded by Nikhil Deshpande. It is a brand of NAVINA Structures Pvt Ltd. Each estate is held in its own limited liability partnership (LLP), divided into units. Its partners own it, and vote in proportion to their holding. NAVINA forms and governs each LLP, holds no equity in any of them, and is paid from one disclosed stage of revenue. Its directors, Nikhil Deshpande and Shirisha Avanchi, invest in each estate in their own names, on the same terms as other partners. Sensory Getaways runs the estates under a Commercial Services Agreement. The collection includes Solace in the Nandi Hills corridor, Seaside Confluence on the Udupi coast, and Streamside Creek and Coffee Fields Forever in Kodagu."
    ]
   },
   {
    "h": "Fact sheet"
   },
   {
    "rows": [
     [
      "Name",
      "Getaway Collective, a brand of NAVINA Structures Pvt Ltd"
     ],
     [
      "Founder",
      "Nikhil Deshpande"
     ],
     [
      "Promoters",
      "Nikhil Deshpande and Shirisha Avanchi"
     ],
     [
      "What it is",
      "An ownership platform for retreats in India"
     ],
     [
      "Structure",
      "One LLP per estate; NAVINA holds no equity"
     ],
     [
      "Operator",
      "Sensory Getaways"
     ],
     [
      "House brands",
      "SlowSpace · ESKAPE"
     ],
     [
      "Estates",
      "Solace by SLOWSPACE · Seaside Confluence · Streamside Creek · Coffee Fields Forever"
     ],
     [
      "Studios across the four",
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
      "Building systems",
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
      "Solace by SLOWSPACE",
      "Six studios on a granite ridge two hours north of Bengaluru; the reference estate."
     ],
     [
      "Seaside Confluence",
      "Twelve studios over the river where it meets the sea, on steel piles."
     ],
     [
      "Streamside Creek",
      "Twenty studios in five clusters, over a stream at Cherala in Kodagu."
     ],
     [
      "Coffee Fields Forever",
      "Twenty studios inside a working coffee plantation at Suntikoppa."
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
      "\"Specification is a claim that can be checked against a drawing.\""
     ]
    ]
   },
   {
    "src": "L1-02 514 · L1-01 125 · public.ts 149, 711"
   },
   {
    "p": "Please attribute these to Getaway Collective. A quote attributed to a named person needs that person's approval: ask hello@getawaycollective.co."
   },
   {
    "h": "Please write"
   },
   {
    "list": [
     "Getaway Collective, in full, at first mention, and NAVINA Structures Pvt Ltd as the company behind it.",
     "Collective ownership, rather than fractional ownership.",
     "Partners, rather than customers or users.",
     "Estate or property, and studios; the estates are retreats, rather than hotels or resorts.",
     "Units for shares of ownership; studios for where guests sleep.",
     "Any figure with its source, and the words \"capital is at risk\"."
    ]
   },
   {
    "h": "Please avoid"
   },
   {
    "list": [
     "Timeshare, except to say what it differs from.",
     "Returns or yields, except as quoted from an offering letter, marked modelled or base case.",
     "Exclusive, except of ownership: \"owned exclusively by its partners\".",
     "A partner or investor's name, without their agreement."
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
      "Images",
      "Drawings and drawn landscapes, captioned as illustration. Photography follows as each estate is built."
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
  "lead": "The questions investors ask most, answered in plain words. Where a figure differs by estate, the estate's own page and its offering letter give it.",
  "blocks": [
   {
    "da": "search"
   },
   {
    "rows": [
     [
      "<b class=\"tx-strong\">What is Getaway Collective?</b>",
      "Getaway Collective is a platform through which people own retreats in India together. It is a brand of NAVINA Structures Pvt Ltd. Each estate is a single asset in its own limited liability partnership (LLP), owned exclusively by its partners. You buy units in that LLP and become a partner. Your units carry a share of distributions, a vote and nights at the estate from handover. NAVINA forms and governs each LLP and holds no equity in any of them. Sensory Getaways runs the estates."
     ],
     [
      "<b class=\"tx-strong\">Who founded Getaway Collective?</b>",
      "Nikhil Deshpande. He sets the standard every estate is designed, built and governed to. He signs the decisions that make it binding, each written and dated, such as the steel structure at Seaside Confluence. He and Shirisha Avanchi are the promoters: the directors and shareholders of NAVINA Structures Pvt Ltd. Both invest in each estate in their own names, on the same terms as every partner."
     ],
     [
      "<b class=\"tx-strong\">Does Getaway Collective own the properties?</b>",
      "The partners do. Each estate is owned by its own LLP, and the LLP is owned by its partners. NAVINA Structures Pvt Ltd, as Getaway Collective, governs the partnership: it keeps the records and runs the votes. It holds no equity in any estate. It is paid a platform fee from stage 2 of the payment order, at the rate each estate's terms state, and from nothing else. Changing that rule takes a unanimous vote of the partners."
     ],
     [
      "<b class=\"tx-strong\">What do investors own?</b>",
      "Units in one estate's LLP. A unit is a fixed share of that partnership, priced in the estate's offering letter. Each estate sets the least and the most one partner may hold. Your units carry three things, in proportion to their number: a share of distributions, a vote on resolutions, and nights at the estate from handover. They are units in that one estate alone."
     ],
     [
      "<b class=\"tx-strong\">Is it a timeshare?</b>",
      "It is ownership. A timeshare sells weeks of use. A unit is equity in the partnership that holds the estate. You share in its distributions, vote on its decisions and can sell your units after the lock-in. Nights come with that ownership: one night a year for each 1% you hold, from handover. They are a benefit of owning and carry no separate price."
     ],
     [
      "<b class=\"tx-strong\">How do I begin?</b>",
      "Sign in with an email address. You upload nothing at this stage. Every estate, its drawings and its figures are open to you from there. When you find an estate you want, hold your units online with a holding deposit, refundable in full until you sign. KYC (the identity checks) runs alongside, at your own pace. It is complete before you sign the LLP agreement and your units are allotted. <a class=\"tx-u\" href=\"/how-to-qualify\">The three steps, in full</a>."
     ],
     [
      "<b class=\"tx-strong\">What is the holding deposit?</b>",
      "₹1,00,000, the same at every estate, whatever the number of units you intend to take. You pay it online to NAVINA Structures Pvt Ltd, the company that forms the estate's LLP. NAVINA holds it as a fiduciary until the partnership admits its partners. It holds your units while you complete the rest with Investor Relations: the identity checks, the balance of the unit price and the Vehicle Agreement. It is refundable in full until that agreement is signed. You become a partner at settlement."
     ],
     [
      "<b class=\"tx-strong\">Where are the estates?</b>",
      "All in Karnataka. Solace is at Chikkaballapur, in the Nandi Hills corridor, about two hours from Bengaluru. Seaside Confluence is at Padubidri on the Udupi coast, between the Arabian Sea and a river estuary. Streamside Creek and Coffee Fields Forever lie about 1.8 km apart in Kodagu, among coffee. Three more are in the pipeline. Nine Hills is in the Sakleshpur hills, Wildwood at Aranthodu in Dakshina Kannada, and Tidal Club at Yermal on the Udupi coast."
     ],
     [
      "<b class=\"tx-strong\">Who runs the estates?</b>",
      "Sensory Getaways, the operating partner. It runs each estate day to day under a Commercial Services Agreement with that estate's LLP. It is measured against agreed Service Levels and paid from stage 1 of the payment order. Its duties run to the partnership, so the partners hold it to the agreement through their votes. At Seaside Confluence, a food partner is being appointed by tender."
     ],
     [
      "<b class=\"tx-strong\">Who designs the estates?</b>",
      "The architect is Karthik Shanbhogue. Manjunath & Co. design the structures. Addya designs the building systems: water, power, drainage and air, planned for each estate's climate. Building information modellers bring every discipline into one coordinated model per estate, so clashes are resolved on screen before building. The estates share three building types, called chassis: Ridge, Expanse and Voyager."
     ],
     [
      "<b class=\"tx-strong\">How are decisions made?</b>",
      "By the partners, with votes weighted by holding. An ordinary resolution needs more than 50% of the holdings present and voting. A special resolution needs at least 76% of all holdings. Entrenched principles, such as NAVINA holding no equity, need every partner. A tied vote fails. Partners holding 20% or more can call a meeting, held within 21 days."
     ],
     [
      "<b class=\"tx-strong\">How long does accreditation take?</b>",
      "Signing in takes one email, and you can read every estate straight away. The checks run alongside your reading. A short suitability questionnaire opens the full offering documents, with a decision within 15 working days of a complete submission. KYC covers identity, address, tax residency, source of funds, documents and screening, at your own pace. Every stage saves as you go, and all of it is complete before you sign."
     ],
     [
      "<b class=\"tx-strong\">Can units be sold?</b>",
      "Yes, after the lock-in. Each estate's LLP agreement sets its length; at Streamside Creek, counsel sets it in the agreement. You offer units on a private noticeboard, which fellow partners see first. Buyer and seller agree the price. A buyer from outside the partnership needs the consent of partners holding a majority, and completes the same identity checks. During the lock-in, units move on a partner's death or with every partner's consent."
     ],
     [
      "<b class=\"tx-strong\">How is this different from a REIT?</b>",
      "A real estate investment trust (REIT) is a fund that holds many properties. A unit here is a share of one partnership that holds one estate. Partners vote on that estate's decisions in proportion to their holding, share in its distributions and have nights there from handover. After the lock-in, units are offered on a private noticeboard, which fellow partners see first."
     ],
     [
      "<b class=\"tx-strong\">How is it different from buying a holiday home with friends?</b>",
      "The estate is held by its own LLP, a legal entity, rather than by the people who use it. So what happens when a partner dies, wants out or disagrees is written into the LLP agreement before it arises. An operating partner runs the estate against agreed Service Levels. Decisions are recorded votes, weighted by holding. Every partner's nights come from what they hold. The Journal sets out <a href=\"/journal/why-a-body-corporate\" class=\"tx-u\">why each estate is its own LLP</a> and <a href=\"/journal/the-real-cost-of-thirty-days\" class=\"tx-u\">what a house used thirty days a year really costs</a>."
     ],
     [
      "<b class=\"tx-strong\">What if the operating partner falls short?</b>",
      "It is measured against Service Levels under its Commercial Services Agreement with the estate's LLP. Its duties run to the partnership, so the partners, by vote, hold it to that agreement, and they can replace it. A replacement takes time, and partners bear the cost of that period."
     ],
     [
      "<b class=\"tx-strong\">Who is paid before the partners?</b>",
      "Revenue pays six stages in a fixed order, each in full before the next. At most estates, the operating partner is paid first, then the house brand and the platform. The administration reserve and the sinking fund come next. Then the bank, where there is a loan, and last the partners. Streamside Creek sets its own order. Each estate's investment page gives its shares. Every charge appears in the offering letter before you commit. <a href=\"/how-it-works#fees\" class=\"tx-u\">Who is paid, and for what</a>."
     ],
     [
      "<b class=\"tx-strong\">Can someone living outside India invest?</b>",
      "Each estate is held by an Indian LLP, and the platform is run from India. If you live, are domiciled or hold citizenship elsewhere, the law that applies to you decides whether you may commit. That question is yours to answer, with your own adviser. Commitments are accepted where the offer can lawfully be made without a further registration. The <a href=\"/legal/terms\" class=\"tx-u\">Terms</a> state this at B.3."
     ],
     [
      "<b class=\"tx-strong\">Is capital at risk?</b>",
      "Yes. Capital is at risk, and any distribution depends on how the estate performs. Building carries cost and time risk. The bank is repaid before partners. Income depends on occupancy once the estate opens, and units take time to sell. The <a href=\"/legal/risk-disclosure\" class=\"tx-u\">Risk Factors</a> set out each one in full."
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
  "lead": "Every term used on this site, defined once, in plain words.",
  "blocks": [
   {
    "rows": [
     [
      "<b class=\"tx-strong\">Accreditation</b>",
      "The checks that confirm who you are, your tax residency, the source of your funds and your suitability. They run alongside your reading and are complete before you sign an LLP agreement. Passing them confirms eligibility only."
     ],
     [
      "<b class=\"tx-strong\">Admin reserve</b>",
      "The third stage of the payment order at most estates. It is a share of revenue (2.5% where it is fixed) that pays for governing the partnership: its records, votes and legal filings."
     ],
     [
      "<b class=\"tx-strong\">Basis point</b>",
      "One hundredth of one per cent: 100 basis points make 1%, and 10,000 make 100%. The payment order's stages are set in basis points, so together they always total exactly 100% of revenue."
     ],
     [
      "<b class=\"tx-strong\">Chassis</b>",
      "One of three building types the estates use, each adapted to its site. Ridge is 38 m² with a courtyard, on the ground. Expanse is 36 m² with a deck, lifted 3.8 m. Voyager is 52 m² with a porch, under a tall roof."
     ],
     [
      "<b class=\"tx-strong\">Confidence class</b>",
      "The label every forward-looking figure carries, saying how it was reached. Observed is counted; verified is checked against a document; modelled is computed from stated assumptions. Estimated is a judgement; forecast is about a future period; pending is expected, and shown as absent rather than as zero."
     ],
     [
      "<b class=\"tx-strong\">Covenant (land)</b>",
      "The standing promise that at least 65% of every estate's land stays as it is: unbuilt, unpaved and uncleared. Each estate page states its own share."
     ],
     [
      "<b class=\"tx-strong\">Covenant (loan)</b>",
      "A condition a lender sets on its loan. The estates' bank facilities carry a minimum debt service coverage ratio; see DSCR."
     ],
     [
      "<b class=\"tx-strong\">Designated partner</b>",
      "A partner named in the LLP agreement to carry the partnership's legal duties: its filings, records and compliance. Where the agreement names NAVINA Structures Pvt Ltd, as Getaway Collective, it carries those duties and holds no equity."
     ],
     [
      "<b class=\"tx-strong\">Distribution</b>",
      "A payment to partners from the last stage of the payment order, shared in proportion to units held. It comes from what remains after the stages ahead of it."
     ],
     [
      "<b class=\"tx-strong\">DSCR</b>",
      "Debt service coverage ratio: the income available for the loan, divided by the repayments due. A minimum of 1.50x means income must be at least one and a half times the repayments."
     ],
     [
      "<b class=\"tx-strong\">Entrenched principle</b>",
      "A rule that changes only by a unanimous vote of the partners (100% of holdings). That NAVINA holds no equity in any estate is one of them."
     ],
     [
      "<b class=\"tx-strong\">Financial close</b>",
      "The date an estate's funding is complete: the equity raised and the bank facility in place. The lock-in on units runs from it."
     ],
     [
      "<b class=\"tx-strong\">Handover</b>",
      "The day an estate is complete and passes to the operating partner to open. Partners' nights begin at handover."
     ],
     [
      "<b class=\"tx-strong\">Holding deposit</b>",
      "₹1,00,000, paid online to NAVINA Structures Pvt Ltd, the company that forms the estate's LLP. NAVINA holds it as a fiduciary until partners are admitted. It holds your units, is the same at every estate and is refundable in full until the Vehicle Agreement is signed."
     ],
     [
      "<b class=\"tx-strong\">Key</b>",
      "A hotel's word for one self-contained dwelling. On this site, keys are called studios: the places where guests sleep. Each estate page states how many it has."
     ],
     [
      "<b class=\"tx-strong\">KYC</b>",
      "The identity checks Indian law requires before anyone becomes a partner: identity, address, tax residency, source of funds, documents and screening. They run at your own pace and are complete before you sign."
     ],
     [
      "<b class=\"tx-strong\">Lock-in</b>",
      "The period after financial close when units remain with their holder, except on a partner's death or with every partner's consent. Each estate's LLP agreement sets it; 36 months is typical."
     ],
     [
      "<b class=\"tx-strong\">LLP</b>",
      "A limited liability partnership under India's LLP Act 2008. It is a legal entity that holds property in its own name, and each partner's liability is limited to what they contribute. Each estate has its own LLP, and investors become its partners."
     ],
     [
      "<b class=\"tx-strong\">LLPIN</b>",
      "The LLP identification number the Registrar of Companies issues on incorporation. An estate's page shows it once its LLP is registered."
     ],
     [
      "<b class=\"tx-strong\">Member</b>",
      "An investor whose funds have settled: a partner in the estate's LLP, with a vote, a share of distributions and nights from handover. Rights begin at settlement."
     ],
     [
      "<b class=\"tx-strong\">Moratorium</b>",
      "A period at the start of a bank loan when only interest is paid. At the estates offered so far it covers the first 18 months."
     ],
     [
      "<b class=\"tx-strong\">Offering letter</b>",
      "The document that sets an estate's unit price, number of units, lock-in, fees, risks and figures. Where it and a web page differ, the offering letter governs."
     ],
     [
      "<b class=\"tx-strong\">Operating partner</b>",
      "Sensory Getaways, which runs every estate day to day under a Commercial Services Agreement with that estate's LLP. It is measured against agreed Service Levels, paid from stage 1 of the payment order and owes its duties to the partnership."
     ],
     [
      "<b class=\"tx-strong\">Quorum</b>",
      "The share of total holdings that must take part for a partners' vote to count: 60%, where an estate's agreement states it."
     ],
     [
      "<b class=\"tx-strong\">Register</b>",
      "The partnership's permanent record of who holds which units, every resolution and every document. Entries are added and kept. It carries a private noticeboard where partners can offer units after the lock-in."
     ],
     [
      "<b class=\"tx-strong\">Reserved matter</b>",
      "A decision the LLP agreement keeps for the partners alone, such as selling the land or borrowing beyond the agreed limit."
     ],
     [
      "<b class=\"tx-strong\">Resolution</b>",
      "A decision of the partners, weighted by holding. Ordinary needs more than 50% of the holdings present and voting; special, at least 76% of all holdings; entrenched, 100%. A tie fails."
     ],
     [
      "<b class=\"tx-strong\">Revenue base</b>",
      "An estate's gross revenue, before any costs. Every stage of the payment order is a share of it, so together the stages account for all of it."
     ],
     [
      "<b class=\"tx-strong\">Settlement</b>",
      "The moment your cleared funds reach the estate's LLP, which makes you a partner. It is final; a partner leaves by transfer after the lock-in. Funds settle within 15 working days of committing."
     ],
     [
      "<b class=\"tx-strong\">Sinking fund</b>",
      "The fourth stage of the payment order at most estates. It is a share of revenue (2.5% where it is fixed), set aside each year to renew the estate as it ages. Each estate's agreement sets its own."
     ],
     [
      "<b class=\"tx-strong\">Sponsor</b>",
      "An older word for the promoters, Nikhil Deshpande and Shirisha Avanchi. They invest in each estate's equity in their own names, on the same terms as every partner, and each offering shows how much they hold."
     ],
     [
      "<b class=\"tx-strong\">Unit</b>",
      "A fixed share of one estate's LLP, priced in its offering letter. Each estate sets its unit size, price and the most one partner may hold. Your units set your share of distributions, your vote and your nights: one night a year for each 1% held, from handover."
     ],
     [
      "<b class=\"tx-strong\">Waitlist</b>",
      "A list for an estate whose units are all held. Those on it hear first, in the order they joined, if a partner offers units after the lock-in. Joining commits you to nothing."
     ],
     [
      "<b class=\"tx-strong\">Waterfall</b>",
      "The payment order: the fixed sequence in which revenue is paid, each stage in full before the next. At most estates it has six stages, ending with the partners; Streamside Creek sets its own order."
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
