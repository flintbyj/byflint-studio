import { testimonials } from "./content";

/* Case study format (agreed): three short paragraphs, about 165 words in total, then visuals carry the detail.
   To add a screen: put the image in /public and set `src` on that visual. */
export type Visual = { label: string; kind?: "phone" | "wide"; src?: string };
export type Shot = { t: string; cap: string; visual: Visual };
export type Result = { k: string; v: string; sub?: string; bar?: number };
export type CaseStudy = {
  slug: string; company: string; tag: string; bg: string;
  headline: string; sub: string;
  stats: { n: string; l: string }[];
  facts: { k: string; v: string }[];
  heroVisual: Visual;
  about: string; challenge: string; solution: string;
  pains: string[];
  colImgs?: (string | undefined)[];
  shots: Shot[];
  results: Result[];
  resultsNote?: string;
  honest: string;
  quote?: { quote: string; name: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "indofast", company: "Indofast Energy", tag: "Enterprise · Field operations", bg: "var(--yel)",
    headline: "Real-time visibility over 96.4% of Indofast's stations.",
    sub: "The operator app that replaced paper checklists, self-reported attendance and phone calls.",
    stats: [{ n: "96.4%", l: "of stations monitored in real time" }, { n: "800+", l: "battery swap stations" }, { n: "~1,000", l: "operators on one live system" }],
    facts: [
      { k: "Scope", v: "Operator app and its web dashboard" },
      { k: "Timeline", v: "4 weeks" },
      { k: "Platform", v: "Android app, synced to web" },
    ],
    heroVisual: { label: "Operator app: home, location check and checklist", kind: "wide", src: "/indofast/hero-fan.webp" },
    colImgs: ["/indofast/about.webp", undefined, "/indofast/col3.webp"],
    pains: ["No live view of who is on site", "Self-reported attendance", "Checklists on paper", "Access removed by hand, over email"],
    about: "Indofast Energy is a battery-swapping network, a joint venture of Indian Oil and Sun Mobility. More than 800 swap stations across the country are run by nearly 1,000 operators, hired through partner agencies.",
    challenge: "Nobody could see whether a station was staffed right now. Attendance was self-reported, checklists lived on paper and coordination happened over phone calls. Removing a departed operator's access was a manual, email-based process, so former employees could keep physical access to equipment at swap stations.",
    solution: "We designed the operator app, synced live to the web platform. Every check-in, presence check and exit carries location and time, and a checklist opens only at the site. It took 4 weeks. 96.4% of stations are now monitored in real time, attendance is GPS-verified, and 300 inactive operators were flagged and their access revoked.",
    shots: [
      { t: "Start shift", cap: "Today's shift and the sites assigned.", visual: { label: "Operator home", kind: "phone", src: "/indofast/s1.webp" } },
      { t: "Check in", cap: "Location verified at every site, selfie once per shift.", visual: { label: "Location verified", kind: "phone", src: "/indofast/s2.webp" } },
      { t: "Verify", cap: "If location cannot be verified, a selfie at the site goes for review.", visual: { label: "Photo fallback", kind: "phone", src: "/indofast/s3.webp" } },
      { t: "Checklist", cap: "One question per screen.", visual: { label: "Checklist", kind: "phone", src: "/indofast/s4.webp" } },
      { t: "Leave", cap: "Every exit needs a reason.", visual: { label: "Leaving a station", kind: "phone", src: "/indofast/s5.webp" } },
      { t: "Tickets", cap: "Open issues by status and urgency.", visual: { label: "Tickets", kind: "phone", src: "/indofast/s6.webp" } },
    ],
    results: [
      { k: "Station coverage", v: "96.4%", sub: "of 800+ stations monitored in real time" },
      { k: "Attendance", v: "GPS-verified", sub: "every check-in carries location and time" },
      { k: "Inactive operators", v: "300 flagged", sub: "and their access revoked" },
    ],
    honest: "Results are measured by Indofast across the whole platform. We designed both the app and the dashboard.",
    quote: testimonials.indofast,
  },
  {
    slug: "vlcc", company: "VLCC Healthcare", tag: "Retail · Zero to one", bg: "var(--peach)",
    headline: "A skin analyser customers run on their own, and daily sales roughly tripled.",
    sub: "VLCC's store sales had plateaued. We designed an analyser that needs no staff to run.",
    stats: [{ n: "~3x", l: "daily sales in the stores tested" }, { n: "0 staff", l: "needed to run it" }],
    facts: [
      { k: "Scope", v: "Field research, concept, UX and UI, QA" },
      { k: "Type", v: "New product, zero to one" },
      { k: "Test", v: "In-store, after launch" },
    ],
    heroVisual: { label: "A customer using the analyser in store, with the result screen", kind: "wide" },
    pains: ["Offline sales had plateaued", "Less time with beauty professionals", "Analysers needed staff beside the customer"],
    about: "VLCC Healthcare runs wellness and beauty stores across India, where customers talk to beauty professionals before they buy.",
    challenge: "Offline sales had plateaued and customers were engaging less with the store's beauty professionals. Other brands already used skin analysers in store, but staff had to run them, so none worked without someone standing beside the customer.",
    solution: "We visited stores, gathered feedback from customers and staff, and designed a skin analyser a customer can use alone from start to finish. After final QA with engineering, it was tested in stores. Daily sales per store rose from ₹2,500 to ₹3,600 up to ₹7,500 to ₹12,000, roughly 3x, with no staff needed to run it.",
    shots: [
      { t: "Research", cap: "Store visits with customers and staff.", visual: { label: "Store visits: customers and staff on the floor", kind: "wide" } },
      { t: "Design", cap: "Built so a customer can use it alone.", visual: { label: "Analyser: start and result screens", kind: "phone" } },
      { t: "Test", cap: "Tested in stores after launch.", visual: { label: "In-store test setup", kind: "wide" } },
    ],
    results: [
      { k: "Daily sales per store, before", v: "₹2,500 to ₹3,600", bar: 30 },
      { k: "Daily sales per store, after", v: "₹7,500 to ₹12,000", sub: "roughly 3x", bar: 100 },
      { k: "Estimated gain per store, per year", v: "₹15L to ₹25L", sub: "on 300 trading days" },
    ],
    honest: "The daily figures are as shared by VLCC for the stores that tested the analyser. The annual figure is our estimate, assuming 300 trading days.",
    quote: testimonials.vlcc,
  },
  {
    slug: "zeroharm", company: "Zeroharm", tag: "D2C wellness · Conversion", bg: "var(--tile)",
    headline: "Three products, one bundle page, and a ROAS of 3.7.",
    sub: "Customers were already buying the three together, one at a time. We built the page they were assembling by hand.",
    stats: [{ n: "3.7", l: "ROAS on the bundle page" }, { n: "+18%", l: "above the single-product pages" }],
    facts: [
      { k: "Scope", v: "Analytics review, bundle page, navigation UX" },
      { k: "Timeline", v: "2.5 weeks" },
      { k: "Platform", v: "Shopify, web and mobile" },
    ],
    heroVisual: { label: "Bundle page on mobile, beside the three single-product pages", kind: "phone" },
    pains: ["Three separate product pages", "Added one at a time, at full price", "Hundreds of products in the menu"],
    about: "Zeroharm is a D2C wellness brand selling supplements online on Shopify. Three of its products cover gut health, fat burning and sleep.",
    challenge: "Most customers bought the three together, but each product had its own page, so they added them one at a time at full price, through a menu crowded with hundreds of products. The demand for a bundle already existed. The site made shoppers assemble it by hand.",
    solution: "In 2.5 weeks we built a bundle page priced 18% below buying the three separately, with a clear pack comparison and trust details beside the button. We also merged three overlapping menus into one, cutting top-level items from 8 to 5. The bundle page reached a ROAS of 3.7, about 18% above the single-product pages.",
    shots: [
      { t: "See", cap: "The set customers were already buying.", visual: { label: "Bundle page: opening and pricing", kind: "phone" } },
      { t: "Choose", cap: "Pack selector with the saving shown.", visual: { label: "Pack selector: Trial Pack, Best Results, Money Saver", kind: "phone" } },
      { t: "Trust", cap: "Rating, press and guarantee by the button.", visual: { label: "Trust block: rating, press, guarantee, FAQ", kind: "phone" } },
      { t: "Navigate", cap: "Three menus became one, 8 items down to 5.", visual: { label: "Old menus, first sketch, live Shop menu", kind: "wide" } },
    ],
    results: [
      { k: "Bundle page", v: "3.7", sub: "ROAS", bar: 100 },
      { k: "Fat Burner page", v: "3.6", bar: 97 },
      { k: "Gut Army page", v: "3.2", bar: 86 },
      { k: "Sleep Ease page", v: "2.6", bar: 70 },
    ],
    honest: "This compares the bundle page with the single-product pages over the same period. It was not a controlled A/B test.",
  },
];

export const bySlug = (s: string) => caseStudies.find((c) => c.slug === s);
