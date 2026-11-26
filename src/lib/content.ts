export const cases = [
  { id: "indofast", company: "Indofast Energy", bg: "var(--yel)", before: "Now ", brand: "Indofast", after: " can see who is on shift at 96.4% of its stations.",
    stats: [{ n: "96.4%", l: "of stations monitored in real time" }, { n: "800+", l: "battery swap stations" }] },
  { id: "vlcc", company: "VLCC Healthcare", bg: "var(--peach)", before: "Daily sales roughly tripled in the stores that tested ", brand: "VLCC's", after: " skin analyser.",
    stats: [{ n: "~3x", l: "daily sales in the stores tested" }, { n: "0 staff", l: "needed to run it" }] },
  { id: "zeroharm", company: "Zeroharm", bg: "var(--tile)", before: "A page built from ", brand: "Zeroharm's", after: " own order data now earns more from its ads.",
    stats: [{ n: "3.7", l: "ROAS on the bundle page" }, { n: "+18%", l: "above the single-product pages" }] },
];

export const logos = [
  { src: "/logos/indofast.png", alt: "Indofast Energy" },
  { src: "/logos/vlcc.png", alt: "VLCC" },
  { src: "/logos/zeroharm.png", alt: "Zeroharm" },
  { src: "/logos/navoma.png", alt: "Navoma" },
  { src: "/logos/fellafeeds.png", alt: "FellaFeeds" },
  { src: "/logos/ethnicandaz.png", alt: "Ethnic Andaz" },
];

export const services = [
  { n: "01", t: "Design systems", d: "Every screen faster, every release consistent." },
  { n: "02", t: "Landing pages", d: "Built to turn visits into sign-ups." },
  { n: "03", t: "Growth copywriting", d: "Words that sell, written with the design." },
  { n: "04", t: "Onboarding flows", d: "First sessions that bring users back." },
  { n: "05", t: "Dashboards", d: "Data your team can read and act on." },
  { n: "06", t: "Features, every state", d: "Empty, loading and error states included." },
  { n: "07", t: "UX audits and research", d: "Where users get stuck, and what rivals do better." },
];

export const problems = [
  { t: "Users get stuck", p: "Your users keep getting stuck, and nobody has the time to figure it out and fix it.", f: "We find where users get stuck and ship the fix." },
  { t: "The seat is empty", p: "Your designer just left, and the role is still open.", f: "Two designers start once you pay. When you hire, we work beside them." },
  { t: "Calls eat the week", p: "Briefing and review calls are eating up your week.", f: "One kickoff call. After that, recorded walkthroughs you watch when it suits you." },
  { t: "Scope keeps growing", p: "External agencies usually mean scope creep and ballooning costs.", f: "One flat monthly price and no cap on requests, however much the work grows." },
  { t: "Nobody can maintain it", p: "Your team can't maintain what someone else designed and built.", f: "Every decision written down, every component in your repo." },
  { t: "Rebuilt from Figma", p: "External design teams still hand off Figma your developers have to rebuild.", f: "Nothing to rebuild. The work arrives as code your developers review and merge." },
];

export const testimonials = {
  indofast: { quote: "Flint designed our operator app around how people actually work at a station: one question per screen, big buttons, and a selfie only once per shift. They tested with us regularly, and it showed in the final app.",
    name: "Ravi Bilochi", role: "Vice President of Technology, Indofast Energy", logo: "/logos/indofast.png", alt: "Indofast Energy", stat: "96.4%", statLabel: "of stations monitored in real time" },
  vlcc: { quote: "Flint went into our stores to understand why sales had stalled, then designed a skin analyser customers could use on their own. Daily sales in the stores we tested roughly tripled.",
    name: "Harsh Yadav", role: "Senior Product Lead, VLCC", logo: "/logos/vlcc.png", alt: "VLCC", stat: "~3x", statLabel: "daily sales in the stores tested" },
};

export const faq = [
  {
    "q": "Why not just hire a designer?",
    "a": "If you have a designer in the pipeline you're excited about, hire them. We lean towards in-house teams ourselves. We're for the gap: you need design capacity now, and you don't have the time to build it. If you already have a designer, we work beside them."
  },
  {
    "q": "What does it cost? Is there a catch?",
    "a": "Billed monthly and upfront, at one flat rate. There's no cap on requests. We work through them one at a time, in the order you set."
  },
  {
    "q": "What's included?",
    "a": "Two designers, working through as many requests as you like, one at a time. Each ships in code, with a live preview and a video walkthrough. A design system grows alongside the work. You own everything once it's paid for. Backend, deployment and scale aren't included."
  },
  {
    "q": "What counts as one request?",
    "a": "One piece of work with a clear scope: a page, a flow, a screen, an audit. You don't have to work that out. Tell us the outcome you want, and we'll split it into requests, each with a delivery date. Each revision counts as a request."
  },
  {
    "q": "How fast do we get things back?",
    "a": "Each request takes 2 to 7 working days on average, and we'll tell you if one will run past that. Bigger work is split into requests, so it lands in steps."
  },
  {
    "q": "Will your code fit our repo?",
    "a": "By default we work in React, Next.js, Tailwind and TypeScript. We build with AI coding tools and review the work ourselves before it reaches you. Then your team reviews the pull request and decides what merges. Using something else? Tell us on the call, and we'll say plainly whether we can do it well."
  },
  {
    "q": "Can you deliver Figma files?",
    "a": "Yes. Figma is still where a lot of teams work, so you'll always have a Figma file to refer to."
  },
  {
    "q": "Can you also do the backend?",
    "a": "No. We're designers, not engineers. Backend, deployment and scale stay with your team. If you don't have engineers yet, have a senior engineer look over the work before you merge it."
  },
  {
    "q": "Do we need meetings?",
    "a": "Very little. One kickoff call, then async: recorded walkthroughs of the decisions, explorations and deliverables. We meet when you ask to."
  },
  {
    "q": "Can we change priorities halfway?",
    "a": "Yes, at any time. The current request stops with a closing note, so we can pick it up later. If later work depends on it, we'll talk it through first."
  },
  {
    "q": "What if it doesn't work out?",
    "a": "Cancel in the first 7 days and you get a full refund. After that, we keep that month's fee."
  },
  {
    "q": "Can we pause or cancel?",
    "a": "Cancel any time. Pause any time, for at least 10 days. Unused days are credited, and you can use them within 6 months."
  },
  {
    "q": "Can our team keep going without you?",
    "a": "Yes. From the first deliverables, we build the design system alongside the work: decisions documented, components in your repo, and guidelines for your people and their agents."
  },
  {
    "q": "Is there a lower price for Indian companies?",
    "a": "Yes. We offer parity pricing for Indian companies. Book a call and we'll work it out."
  }
];
