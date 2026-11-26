"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Row } from "./Mark";
import { testimonials } from "@/lib/content";
import { armSound, play } from "@/lib/sound";

/* ---------- Testimonial (layout from the preview: quote left with the mark above it, person right) ---------- */
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2);

export function Testimonial({ which }: { which: keyof typeof testimonials }) {
  const t = testimonials[which];
  return (
    <section className="row tq2" aria-label="What clients say">
      <div className="side" />
      <div className="mid">
        <figure className="tq2-in">
          <div className="tq2-q">
            <svg className="tq2-mark" width="38" height="28" viewBox="0 0 38 28" fill="none" aria-hidden="true">
              <path d="M0 16.4C0 7.9 4.8 2.1 13.4 0L15.1 4.4C10.4 5.9 8.2 8.7 8 12.6H15.2V28H0V16.4ZM21.6 16.4C21.6 7.9 26.4 2.1 35 0L36.7 4.4C32 5.9 29.8 8.7 29.6 12.6H36.8V28H21.6V16.4Z" fill="currentColor" />
            </svg>
            <blockquote className="rv whole">{t.quote}</blockquote>
          </div>
          <figcaption className="tq2-by rv">
            <div className="tq2-av">
              <span className="tq2-ini" aria-hidden="true">{initials(t.name)}</span>
              <span className="tq2-bolt" aria-hidden="true"><svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6.8 1.2L2.6 6.7H5.7L5.1 10.8L9.4 5.3H6.3L6.8 1.2Z" fill="currentColor" /></svg></span>
            </div>
            <div className="tq2-who"><p>{t.name}</p><p>{t.role}</p></div>
          </figcaption>
        </figure>
      </div>
      <div className="side" />
    </section>
  );
}

/* ---------- 24 things running in parallel: sticky heading + cards that stack and recede ---------- */
const cards = [
  { i: "01", b: "Users get stuck, and no one has time to fix it", a: "Fixes where users get stuck", d: "We find where users get stuck and ship the fix." },
  { i: "02", b: "Your designer left, and the role is still open", a: "Design help while you hire", d: "Two designers start once you pay. When you hire, we work beside them." },
  { i: "03", b: "Briefing and review calls eat up your week", a: "Reviews on your schedule", d: "One kickoff call. After that, recorded walkthroughs you watch when it suits you." },
  { i: "04", b: "Agency scope creep keeps raising the bill", a: "One flat monthly price", d: "One flat monthly price and no cap on requests, however much the work grows." },
  { i: "05", b: "Your team can’t maintain what they inherited", a: "A design system your team can maintain", d: "Your team can keep going without us: every decision written down, every component in your repo." },
  { i: "06", b: "Your developers rebuild every Figma handoff", a: "Code your team can merge", d: "Nothing to rebuild. The work arrives as code your developers review and merge." },
];

export function Problems() {
  const head = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  useEffect(() => {
    armSound();
    const h = head.current, ol = list.current;
    if (!h || !ol) return;
    const items = Array.from(ol.children) as HTMLElement[];
    // every card leaves at the same scroll position and the heading goes with them, so the stack scrolls out as one piece
    const setTop = () => {
      ol.style.setProperty("--stack-top", h.offsetHeight + "px");
      ol.parentElement!.style.setProperty("--stack-top", h.offsetHeight + "px");
      const peek = parseFloat(getComputedStyle(ol).getPropertyValue("--stack-peek")) || 0;
      const K = Math.max(...items.map((li, n) => n * peek + li.offsetHeight));
      items.forEach((li, n) => { li.style.marginBottom = K - n * peek - li.offsetHeight + "px"; });
      ol.parentElement!.style.setProperty("--lp-b", K + "px");
    };
    setTop();
    const ro = new ResizeObserver(setTop); ro.observe(h); items.forEach((li) => ro.observe(li));
    const cardsEl = items.map((li) => li.firstElementChild as HTMLElement);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, visible = false, last = -1;
    const frame = () => {
      raf = 0;
      const rects = items.map((e) => e.getBoundingClientRect());
      const cover = rects.map((r, i) => { const n = rects[i + 1]; return n ? Math.min(1, Math.max(0, (r.bottom - n.top) / r.height)) : 0; });
      const tops = items.map((e) => parseFloat(getComputedStyle(e).top) || 0);
      const stuck = (i: number, tol: number) => rects[i].top <= tops[i] + tol;
      let cur = Math.max(0, last);
      while (cur < items.length - 1 && stuck(cur + 1, 2)) cur++;
      while (cur > 0 && !stuck(cur, 24)) cur--;
      if (last >= 0 && cur > last && cur - last <= 2) play("select", 1); // a card lands on the stack
      last = cur;
      let acc = 0;
      for (let i = items.length - 1; i >= 0; i--) {
        acc = i === items.length - 1 ? 0 : acc + cover[i];
        const d = Math.min(3, acc), c = cardsEl[i];
        c.style.transform = rm.matches ? "" : `scale(${1 - 0.04 * d})`;
        c.style.setProperty("--recede", Math.min(1, d).toFixed(3));
      }
    };
    const kick = () => { if (visible && !raf) raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); else last = -1; });
    io.observe(ol);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick, { passive: true });
    return () => { ro.disconnect(); io.disconnect(); if (raf) cancelAnimationFrame(raf); window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); };
  }, []);
  return (
    <Row className="lp">
      <section id="problems" aria-labelledby="lp-h" className="lp-in">
        <div className="lp-hw"><div className="lp-head" ref={head}>
          <h2 id="lp-h" className="lp-title"><span>24 things are running in parallel,</span> <b>and your launch date can’t move.</b></h2>
        </div></div>
        <ol className="lp-stack" ref={list}>
          {cards.map((c, n) => (
            <li className="lp-item" style={{ ["--i" as string]: n }} key={c.i}>
              <article className="lp-card" aria-labelledby={"lp-" + c.i}>
                <div className="lp-l"><p className="lp-k">Before Flint</p><h3 id={"lp-" + c.i}>{c.b}</h3></div>
                <div className="lp-r">
                  <span className="lp-go" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></span>
                  <p className="lp-k">After Flint</p><p className="lp-a">{c.a}</p><p className="lp-d">{c.d}</p>
                </div>
                <span className="lp-ix" aria-hidden="true">{c.i}</span>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </Row>
  );
}

/* ---------- Find what you need: a word search of services ---------- */
const items = [
  { id: "01", title: "Design system", tag: "Reusable components, tokens and guidelines" },
  { id: "02", title: "Landing page", tag: "Conversion-focused landing pages" },
  { id: "03", title: "Copywriting", tag: "Website and landing page copy" },
  { id: "04", title: "Onboarding", tag: "Signup and first-use flows" },
  { id: "05", title: "Dashboard", tag: "Dashboards and reporting screens" },
  { id: "06", title: "Prototyping", tag: "Working prototypes for new features" },
  { id: "07", title: "UI design", tag: "Product screens, empty states, loading and errors" },
  { id: "08", title: "UX audit", tag: "Usability issues and prioritized fixes" },
  { id: "09", title: "Research", tag: "Competitor research" },
];
const order = ["09", "08", "06", "03", "04", "02", "07", "01", "05"];
type Path = Record<string, { start: [number, number]; end: [number, number] }>;

function layout(rows: string[], paths: Path) {
  const R = rows.length, C = rows[0].length, letters = rows.flatMap((r) => Array.from(r));
  const words = items.map((it) => {
    const { start: [r0, c0], end: [r1, c1] } = paths[it.id];
    const dr = r1 - r0, dc = c1 - c0, n = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
    const cells = Array.from({ length: n }, (_, k) => (r0 + k * Math.sign(dr)) * C + c0 + k * Math.sign(dc));
    const o = order.indexOf(it.id);
    return {
      ...it, cells,
      style: {
        left: ((c0 + c1 + 1) / (2 * C)) * 100 + "%", top: ((r0 + r1 + 1) / (2 * R)) * 100 + "%",
        width: ((Math.hypot(dr, dc) + 0.94) / C) * 100 + "%", ["--hint-delay" as string]: 45 * o + "ms",
        ["--trace-step" as string]: o, ["--word-angle" as string]: Math.atan2(dr, dc) + "rad",
      } as React.CSSProperties,
    };
  });
  return { R, C, letters, words, wordCells: new Set(words.flatMap((w) => w.cells)) };
}
const boards = [
  { key: "phone", cls: "cg-phone", l: layout(["LANDINGPAGEP", "TOXEECUEXGRL", "IGNIPYTOTORP", "DMKBFENPNDVN", "UDRAOBHSADEG", "AIKXXAWVATAI", "XRESEARCHWES", "UNTDPAODVXOE", "METSYSNGISED", "IMONVPBDRNBI", "COPYWRITINGU"],
    { "01": { start: [8, 11], end: [8, 0] }, "02": { start: [0, 0], end: [0, 10] }, "03": { start: [10, 0], end: [10, 10] }, "04": { start: [1, 1], end: [10, 10] }, "05": { start: [4, 9], end: [4, 1] }, "06": { start: [2, 11], end: [2, 1] }, "07": { start: [10, 11], end: [3, 11] }, "08": { start: [7, 0], end: [1, 0] }, "09": { start: [6, 1], end: [6, 8] } }) },
  { key: "wide", cls: "cg-wide", l: layout(["OUOUAOLFCWAKDPFBNIRCFN", "NNLVAOAGTCMRMARSBGPTGV", "BRDESIGNSYSTEMSAYCYIBR", "OAOYMYRFLUBGCLKHWHSAEU", "ADYEYPROTOTYPINGBERSOX", "RPCMMLCWYEADSKDGDOEOWA", "DUBUCOPYWRITINGIWAACCU", "IPVEOTOEDKUTKLUDRLWRKD", "NHYSEIWAGLWARTHCNAAEDI", "GIKEGAPGNIDNALHGTEFEKT"],
    { "01": { start: [2, 2], end: [2, 13] }, "02": { start: [9, 13], end: [9, 3] }, "03": { start: [6, 4], end: [6, 14] }, "04": { start: [0, 0], end: [9, 0] }, "05": { start: [0, 12], end: [8, 20] }, "06": { start: [4, 5], end: [4, 15] }, "07": { start: [7, 14], end: [0, 21] }, "08": { start: [3, 21], end: [9, 21] }, "09": { start: [2, 21], end: [9, 14] } }) },
];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Services() {
  const [sel, setSel] = useState<Set<string>>(() => new Set());
  const [hints, setHints] = useState(false);
  const [view, setView] = useState(false);
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [st, setSt] = useState<"idle" | "submitting" | "success">("idle");
  const [left, setLeft] = useState("62%");
  const wrap = useRef<HTMLDivElement>(null), form = useRef<HTMLFormElement>(null), btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    armSound();
    const e = wrap.current; if (!e) return;
    const io = new IntersectionObserver(([x]) => setView(!!x?.isIntersecting)); io.observe(e);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (st !== "success") return;
    const t = window.setTimeout(() => { setSt("idle"); setEmail(""); setSel(new Set()); }, 3000);
    return () => window.clearTimeout(t);
  }, [st]);
  const n = sel.size, empty = n === 0, ok = EMAIL.test(email.trim());
  const canSend = !empty && ok && st === "idle";
  const state = st === "success" ? "success" : st === "submitting" ? "submitting" : empty ? "gated" : ok ? "ready" : "unlocked";
  const chosen = useMemo(() => items.filter((i) => sel.has(i.id)), [sel]);
  const toggle = (id: string) => { setSel((p) => { const s = new Set(p); if (s.has(id)) { s.delete(id); play("off"); } else { s.add(id); play("on"); } return s; }); };
  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!canSend || trap) return;
    if (form.current && btn.current) setLeft(Math.max(4, Math.round(btn.current.getBoundingClientRect().left - form.current.getBoundingClientRect().left)) + "px");
    setSt("submitting");
    const body = `Services: ${chosen.map((c) => c.title).join(", ")}\nEmail: ${email.trim()}`;
    window.setTimeout(() => {
      setSt("success"); play("success");
      window.location.href = `mailto:hello@byflint.studio?subject=${encodeURIComponent("New request from byflint.studio")}&body=${encodeURIComponent(body)}`;
    }, 450);
  }
  return (
    <Row className="cg">
      <section id="capabilities" aria-labelledby="cg-h" className="cg-in">
        <div className="cg-head">
          <h2 id="cg-h" className="lp-title">Find what you need. <span>We&apos;ll ship it.</span></h2>
          <p id="cg-help">Select the services you need to start a request.</p>
        </div>
        <div className="cg-wrap" ref={wrap}>
          {boards.map(({ key, cls, l }) => {
            const on = new Set(l.words.filter((w) => sel.has(w.id)).flatMap((w) => w.cells));
            return (
              <div key={key} role="group" aria-label="Services word search" aria-describedby="cg-help" className={"cg-board " + cls}
                data-hints={hints} data-in-view={view} data-idle={empty} style={{ ["--columns" as string]: l.C, ["--rows" as string]: l.R, ["--trace-count" as string]: order.length } as React.CSSProperties}>
                <div className="cg-letters" aria-hidden="true">
                  {l.letters.map((ch, i) => <span className="cg-letter" key={i} data-word={l.wordCells.has(i)} data-selected={on.has(i)}>{ch}</span>)}
                </div>
                {l.words.map((w) => (
                  <button key={w.id} type="button" aria-label={`${w.title}. ${w.tag}`} aria-pressed={sel.has(w.id)} disabled={st !== "idle"} onClick={() => toggle(w.id)} className="cg-word" style={w.style}>
                    <svg aria-hidden="true" className="cg-trace"><rect width="100%" height="100%" rx="16" pathLength={100} /></svg>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div className="cg-foot">
          <div className="cg-tools">
            <p role="status" className={"cg-count" + (n ? " on" : "")}>{n === 0 ? "0 selected" : `${n} selected`}</p>
            <button type="button" aria-pressed={hints} className="cg-text" onClick={() => { setHints((h) => !h); play("hint"); }}>Hints</button>
            <button type="button" className="cg-text" disabled={empty || st !== "idle"} onClick={() => { setSel(new Set()); play("clear"); }}>Clear all</button>
          </div>
          <form ref={form} noValidate onSubmit={submit} data-state={state} className="cg-pill" style={{ ["--takeover-left" as string]: left } as React.CSSProperties}>
            <label htmlFor="cg-email" className="sr">Email address</label>
            <input id="cg-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" value={email} disabled={empty || st !== "idle"} onChange={(e) => setEmail(e.target.value)} className="cg-email" />
            <input type="text" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="cg-trap" />
            <button ref={btn} type="submit" disabled={!canSend} className="cg-submit"><span>{st === "submitting" ? "Sending…" : "Submit request"}</span></button>
            <div aria-hidden={st !== "success"} data-active={st === "success"} className="cg-done">
              <span><svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.25 8.5 6.5 11.75 12.75 4.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Request received. We’ll be in touch.</span></span>
            </div>
          </form>
        </div>
      </section>
    </Row>
  );
}

/* ---------- The people behind the work ---------- */
const people = [
  { ini: "JG", name: "Jatin Gupta", bio: "Starts where the product gets used: with Indofast’s station operators, in VLCC’s stores, beside its sales team. The work runs from operator apps to Fellafeeds’ dashboard and Zeroharm’s Body Balance Trio page." },
  { ini: "TG", name: "Taarush Goyal", bio: "Three years at Onething Design, on Royal Enfield, TVS, Ashok Leyland, Jio Institute and Apnamart’s point-of-sale system. Studied psychology." },
];

export function Team() {
  return (
    <Row className="tm">
      <section className="tm-in" aria-labelledby="tm-h">
        <h2 id="tm-h" className="tm-h rv">The people behind the work</h2>
        <p className="tm-s rv">Two designers. Either can take any request, and each reviews the other’s work.</p>
        <ul className="tm-g">
          {people.map((p) => (
            <li key={p.ini} className="tm-c rv">
              <div className="tm-ph" aria-hidden="true">{p.ini}</div>
              <h3>{p.name}</h3>
              <p>{p.bio}</p>
            </li>
          ))}
        </ul>
      </section>
    </Row>
  );
}
