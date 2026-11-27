import { testimonials } from "./content";

export type Visual = { label: string; kind?: "phone" | "wide"; src?: string };
export type Decision = { t: string; d: string; trade?: string; visual: Visual };
export type Result = { k: string; v: string; sub?: string; bar?: number };
export type CaseStudy = {
  slug: string; company: string; tag: string; bg: string;
  headline: string; sub: string;
  stats: { n: string; l: string }[];
  facts: { k: string; v: string }[];
  heroVisual: Visual;
  pgi: { problem: string; solution: string };
  tension: { h: string; p: string };
  insight: { h: string; p: string };
  decisionsLead: string;
  decisions: Decision[];
  results: Result[];
  resultsNote?: string;
  honest: string;
  quote?: { quote: string; name: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "indofast", company: "Indofast Energy", tag: "Enterprise · Field operations", bg: "var(--yel)",
    headline: "Real-time visibility over 96.4% of Indofast's stations.",
    sub: "We designed the operator app that replaced paper checklists, self-reported attendance and phone calls. Every check-in, presence check and exit is now logged as it happens.",
    stats: [{ n: "96.4%", l: "of stations monitored in real time" }, { n: "800+", l: "battery swap stations" }, { n: "~1,000", l: "operators on one live system" }],
    facts: [
      { k: "Client", v: "Indofast Energy, a battery-swapping network (JV of Indian Oil and Sun Mobility)" },
      { k: "Scope", v: "Operator app and the web dashboard it feeds" },
      { k: "Timeline", v: "4 weeks" },
      { k: "Platform", v: "Android app, synced to the web platform" },
    ],
    heroVisual: { label: "Check-in flow: site list, location verified, selfie", kind: "phone" },
    pgi: {
      problem: "No system showed who was working where or whether a station was staffed. Former employees could keep access to equipment at swap stations.",
      solution: "One app that verifies every operator action with location, synced live to the web platform.",
    },
    tension: {
      h: "A security gap hiding inside an attendance problem",
      p: "Indofast's stations are staffed by operators hired through partner agencies across the country. Attendance was self-reported, checklists were on paper and coordination happened over phone calls. Nobody could see whether a station was staffed right now. Removing an operator's access when they left was a manual, email-based process, so former employees could keep physical access to equipment.",
    },
    insight: {
      h: "They needed proof nobody had to chase",
      p: "We spoke with the operations team, OME supervisors, asset executives and the sales team. They all needed the same thing: a self-reported sheet or a phone call proves nothing. Every operator action had to carry its own evidence (location, time and, where needed, a photo) and reach the dashboard on its own. That became the rule behind every screen: prove presence without slowing the operator down.",
    },
    decisionsLead: "Following one operator through a shift.",
    decisions: [
      { t: "Check in: location every time, selfie once", d: "Operators can cover several sites in one shift. Every site check-in verifies location within 20 metres, but the selfie is taken only at the first site.", trade: "Less photo proof per site, in exchange for a check-in that does not repeat itself.", visual: { label: "Check-in flow across several sites", kind: "phone" } },
      { t: "Stay: ask only when the app goes quiet", d: "Presence checks arrive only after 60 minutes with no app activity. Opening a checklist or a ticket resets the timer, so busy operators are never interrupted. If location fails twice, the operator takes a photo at the site and a supervisor reviews it, so a weak GPS signal never blocks work.", trade: "Fewer automatic checks during active use, in exchange for no nagging.", visual: { label: "Presence check and photo fallback", kind: "phone" } },
      { t: "Check: one question per screen, built for the field", d: "Checklists show one question at a time with large Yes and No buttons and a progress bar. Photo and remarks are asked for only when the answer is No. Location is verified before a checklist opens, so it cannot be filled in from home.", visual: { label: "One-question checklist", kind: "phone" } },
      { t: "Leave: exits that are honest, not punitive", d: "Operators choose Temporarily left or Done for the shift, with a reason. The app shows time since leaving instead of asking for an expected return. Leaving before shift end shows a warning and notifies the supervisor automatically.", visual: { label: "Left-station choice and warning", kind: "phone" } },
    ],
    results: [
      { k: "Station coverage", v: "96.4%", sub: "of 800+ stations monitored in real time" },
      { k: "Attendance", v: "GPS-verified", sub: "every check-in carries location and time" },
      { k: "Inactive operators", v: "300 flagged", sub: "and their access revoked" },
    ],
    honest: "Results are measured by Indofast across the whole platform. We designed both the app and the dashboard, and this story leads with the app because that is where operators create every record the dashboard shows.",
    quote: testimonials.indofast,
  },
  {
    slug: "vlcc", company: "VLCC Healthcare", tag: "Retail · Zero to one", bg: "var(--peach)",
    headline: "A skin analyser customers run on their own, and daily sales roughly tripled.",
    sub: "VLCC's store sales had plateaued. We went into the stores, found the gap in how skin analysers are used, and designed one that needs no staff to run.",
    stats: [{ n: "~3x", l: "daily sales in the stores tested" }, { n: "0 staff", l: "needed to run it" }],
    facts: [
      { k: "Client", v: "VLCC Healthcare" },
      { k: "Scope", v: "Field research, concept, UX and UI, QA, in-store test" },
      { k: "Type", v: "New product, zero to one" },
    ],
    heroVisual: { label: "A customer using the analyser in store, with the result screen", kind: "wide" },
    pgi: {
      problem: "Offline sales had plateaued, and customers were engaging less with the store's beauty professionals.",
      solution: "A skin analyser that customers use on their own, designed for self-interaction from the start.",
    },
    tension: {
      h: "Sales had stalled where customers meet the brand",
      p: "Offline sales had plateaued and customers were engaging less with the store's beauty professionals. To understand why, we visited stores and gathered feedback from customers and staff.",
    },
    insight: {
      h: "Analysers existed. None let customers use them alone.",
      p: "Other brands already used skin analysers in store, but staff had to run them. The gap was self-interaction: a customer should be able to start, understand and act on their result without waiting for anyone.",
    },
    decisionsLead: "How we got from the gap to a shipped product.",
    decisions: [
      { t: "Research in the stores", d: "We watched how customers and staff actually used the floor, and gathered feedback from both before designing anything.", visual: { label: "Store visits: customers and staff on the floor", kind: "wide" } },
      { t: "Design for use without staff", d: "The experience was designed from scratch so a customer can use it on their own, start to finish.", visual: { label: "Analyser: start and result screens", kind: "phone" } },
      { t: "Test it where it is used", d: "We ran final QA with engineering, then tested the analyser in stores after launch.", visual: { label: "In-store test setup", kind: "wide" } },
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
    sub: "Most Zeroharm customers were already buying three products together, one at a time. We built the bundle page they were assembling by hand, and fixed the navigation around it.",
    stats: [{ n: "3.7", l: "ROAS on the bundle page" }, { n: "+18%", l: "above the single-product pages" }],
    facts: [
      { k: "Client", v: "Zeroharm, a D2C wellness brand" },
      { k: "Scope", v: "Competitor analysis, analytics review, bundle page, navigation UX" },
      { k: "Timeline", v: "2.5 weeks" },
      { k: "Platform", v: "Shopify, web and mobile" },
    ],
    heroVisual: { label: "Bundle page on mobile, beside the three single-product pages", kind: "phone" },
    pgi: {
      problem: "Most customers bought the three products together, but had to add each one separately, at full price, through cluttered navigation.",
      solution: "A bundle page with a better price for the set customers already bought, plus simpler navigation.",
    },
    tension: {
      h: "Three good products, three separate checkouts",
      p: "Each product had its own page, so shoppers had to find and add each one separately, through a menu crowded with hundreds of products. Yet most of them were doing exactly that: buying the three together, one at a time, at full price.",
    },
    insight: {
      h: "Customers were already building the bundle themselves",
      p: "Analytics and order data showed that most customers added these three products to the cart together. The demand for a bundle already existed. The site just made shoppers assemble it by hand.",
    },
    decisionsLead: "Following the shopper from first look to checkout.",
    decisions: [
      { t: "See: sell the set customers were already buying", d: "The page opens with the line \"A single supplement won't cut it\" and presents gut health, fat burning and sleep as three angles on one goal. One month of the trio is ₹2,299, which is 18% less than adding the three products separately.", trade: "A lower price per product, in exchange for a bigger order and a better return on ad spend.", visual: { label: "Bundle page: opening and pricing", kind: "phone" } },
      { t: "Choose: make the bigger pack the easy choice", d: "Three pack sizes, labelled Trial Pack, Best Results and Money Saver, each show the rupee saving and the price per tablet, which falls from ₹12.77 to ₹9.44 on the largest pack. The comparison does the selling.", visual: { label: "Pack selector: Trial Pack, Best Results, Money Saver", kind: "phone" } },
      { t: "Trust: answer the bundle doubt before it stops the sale", d: "A 4.9 rating from 134 reviews, press logos, certifications and a 90-day guarantee sit next to the button. The FAQ answers \"Can I take all three at the same time?\", the question a shopper has before buying a set.", visual: { label: "Trust block: rating, press, guarantee, FAQ", kind: "phone" } },
      { t: "Navigate: three overlapping menus became one", d: "The old header had 8 top-level items, and three of them did the same job. We merged them into one Shop menu with sub-groups, and top-level items went from 8 to 5. Inside Shop, only the products in the group you point at are shown, instead of about 60 at once.", trade: "Shoppers who browse by ingredient lose the one-hover dropdown. In return, a separate Ingredients page now covers 100+ ingredients, against about 30 in the old menu.", visual: { label: "Old menus, first sketch, live Shop menu", kind: "wide" } },
    ],
    results: [
      { k: "Bundle page", v: "3.7", sub: "ROAS", bar: 100 },
      { k: "Fat Burner page", v: "3.6", bar: 97 },
      { k: "Gut Army page", v: "3.2", bar: 86 },
      { k: "Sleep Ease page", v: "2.6", bar: 70 },
    ],
    resultsNote: "The bundle page is about 18% above the average of the three single-product pages.",
    honest: "This compares the bundle page with the single-product pages over the same period. It was not a controlled A/B test.",
  },
];

export const bySlug = (s: string) => caseStudies.find((c) => c.slug === s);
