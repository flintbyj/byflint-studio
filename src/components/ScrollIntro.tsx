"use client";
import { useEffect, useRef } from "react";
import { Mark } from "./Mark";

function Shapes({ outline }: { outline?: boolean }) {
  const o = outline ? ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 } as const) : {};
  return (
    <>
      <rect x="64.0972" width="16.335" height="50.4254" rx="8.1675" {...o} />
      <rect x="0" y="64.2747" width="50.4254" height="16.335" rx="8.1675" {...o} />
      <rect x="94.4589" y="64.2747" width="73.1524" height="16.335" rx="8.1675" {...o} />
      <rect x="64.0972" y="94.459" width="16.335" height="109.373" rx="8.1675" {...o} />
      <circle cx="72.2647" cy="72.4422" r="8.1675" {...o} />
      <rect x="147.022" y="135.639" width="16.335" height="50.7086" rx="8.1675" transform="rotate(135 147.022 135.639)" {...o} />
    </>
  );
}

type R = { x: number; y: number; w: number; h: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lr = (a: R, b: R, t: number): R => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });
const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mix = (c1: number[], c2: number[], t: number) => `rgb(${c1.map((v, i) => Math.round(lerp(v, c2[i], t))).join(",")})`;
const MW = 35.37, MH = 43.02; // mark size in Figma frames 2 and 3
const INK = [32, 35, 41], BG = [251, 250, 249], CIT = [241, 255, 99], SLATE = [83, 98, 122], GREY = [153, 155, 147], MUT = [137, 137, 136];

/*
  Scroll-scrubbed intro (Figma "Exploration - Hardcore", intro frames 1, 2, 3).
  The grid is a pinwheel: every line leaves a different corner of the box (frames 1 and 2), and frame 2 adds the
  cell lines in the side areas. Every line segment is drawn by its own black bar: the bar runs along the line, the
  line shows only where the bar has been, and the bar leaves the screen. On the way to the hero the side cells are
  taken back the same way (bars run in and erase them) and the pinwheel arms grow into the full page lines.
  Two longer-lived bars (V1, V2) come in along the box edges and land on the hero's own bars. The Flint mark and the
  headline travel with the box and land on the real nav logo and h1 without any fade.
  Scroll sets a target; the drawing eases toward it every frame so it never jumps.
*/
export function ScrollIntro({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLSpanElement>(null);
  const txtR = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const w = wrap.current!, st = stage.current!, b = box.current!, lg = logo.current!, tx = txtR.current!;
    const lf = lg.querySelector<SVGGElement>(".sx-lf")!, lo = lg.querySelector<SVGGElement>(".sx-lo")!;
    const los = Array.from(lo.children) as SVGElement[];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { w.classList.add("sx-off"); return; }
    w.classList.add("sx-on");
    const q = (s: string) => st.querySelector(s) as HTMLElement;
    const sgL = Array.from(st.querySelectorAll<HTMLElement>(".sx-sg")), sgB = Array.from(st.querySelectorAll<HTMLElement>(".sx-sb"));
    const navA = Array.from(st.querySelectorAll<HTMLElement>(".nav .l a, .nav > a:last-child"));
    const ctaEl = st.querySelector<HTMLElement>(".hero .cta");
    const cardEls = Array.from(st.querySelectorAll<HTMLElement>(".work .card"));
    const bV1 = q(".sx-v1"), bV2 = q(".sx-v2");
    let cur = 0, raf = 0, ld = 1, lraf = 0;
    // lines are time-based, not scrubbed: scrolling past a mark makes a bar run its whole line by itself, so nothing hangs mid-screen
    const dS: number[] = [], eS: number[] = [];
    let lt = performance.now(), anim = false;
    const LDUR = 1.1;
    const toward = (v: number, want: number, dt: number) => (v < want ? Math.min(want, v + dt) : Math.max(want, v - dt));
    const root = document.documentElement;
    const clampN = (v: number) => Math.min(100, Math.max(0, v));

    const target = () => {
      const len = window.innerHeight * 1.2;
      w.style.setProperty("--sxlen", len + "px");
      return Math.min(1, Math.max(0, -w.getBoundingClientRect().top / len));
    };

    const draw = (p: number) => {
      const vw = st.clientWidth, vh = window.innerHeight, mob = vw < 760;
      const k = Math.min(vw / 1280, vh / 832), ox = (vw - 1280 * k) / 2, oy = (vh - 832 * k) / 2;
      const X = (v: number) => ox + v * k, Y = (v: number) => oy + v * k;
      const s1: R = mob ? { x: 16, y: 56, w: vw - 32, h: vh - 112 } : { x: X(299), y: Y(78), w: 682 * k, h: 676 * k };
      const s2: R = mob ? { x: 32, y: vh * 0.2, w: vw - 64, h: vh * 0.5 } : { x: X(380), y: Y(156), w: 525 * k, h: 520 * k };
      const sr = st.getBoundingClientRect();
      const m = q(".hero .mid")?.getBoundingClientRect();
      const s3: R = m ? { x: m.left - sr.left, y: m.top - sr.top, w: m.width, h: m.height } : s2;
      const rb = st.querySelectorAll(".hero .bar.v");
      const rr = (el?: Element) => el?.getBoundingClientRect();
      const bl = rr(rb[0]), br = rr(rb[1]);
      // every bar keeps one axis: H bars slide only left/right on a horizontal line, V bars only up/down on a vertical line
      const tL = bl ? { x: bl.left - sr.left + 3, y: bl.top - sr.top } : { x: s3.x, y: s3.y + 265 };
      const tR = br ? { x: br.left - sr.left + 3, y: br.top - sr.top } : { x: s3.x + s3.w, y: s3.y + s3.h - 91 };
      const nl = rr(q(".nav .logo svg"));
      const T = nl ? { x: nl.left - sr.left, y: nl.top - sr.top } : { x: vw / 2 - MW / 2, y: 14 };

      const a = ease(seg(p, 0, 0.45)), c = ease(seg(p, 0.5, 0.9));
      const first = p < 0.475;
      const r = first ? lr(s1, s2, a) : lr(s2, s3, c);
      b.style.visibility = first ? "" : "hidden"; // past the shrink the box is page-coloured; hiding it lets the hero button and cards show as they build in
      b.style.transform = `translate(${r.x}px,${r.y}px)`;
      b.style.width = r.w + "px";
      b.style.height = r.h + "px";
      { const pc = (clampN(a * 100)).toFixed(2) + "%"; // hard-edged sweep (dark -> light), no grey blend
        b.style.background = a <= 0.001 ? "rgb(32,35,41)" : a >= 0.999 ? "rgb(251,250,249)" : `linear-gradient(180deg,rgb(251,250,249) ${pc},rgb(32,35,41) ${pc})`; }
      // one headline for the whole intro: rides in the box, then lands exactly on the hero's own h1 (which stays hidden until then)
      const hh = q(".hero h1"), hr = hh?.getBoundingClientRect();
      const hFs = hh ? parseFloat(getComputedStyle(hh).fontSize) : 42;
      const H = hr ? { x: hr.left - sr.left, b: hr.bottom - sr.top, w: hr.width } : { x: s3.x + 42, b: s3.y + s3.h - 42, w: 570 };
      const pad = mob ? 20 : 42 * k;
      const fs1 = mob ? 30 : 42 * k, fs2 = mob ? 24 : 32 * k;
      let tX: number, tB: number, tW: number, tF: number;
      if (first) { tX = r.x + pad; tB = r.y + r.h - pad; tW = r.w - 2 * pad; tF = lerp(fs1, fs2, a); }
      else { tX = lerp(s2.x + pad, H.x, c); tB = lerp(s2.y + s2.h - pad, H.b, c); tW = lerp(s2.w - 2 * pad, H.w, c); tF = lerp(fs2, hFs, c); }
      tx.style.fontSize = tF + "px";
      tx.style.width = tW + "px";
      tx.style.whiteSpace = mob ? "normal" : "nowrap";
      const tl = a >= 0.999;
      tx.style.color = tl ? `rgb(${INK})` : `rgb(${BG})`;
      tx.style.setProperty("--sxs", tl ? `rgb(${MUT})` : `rgb(${GREY})`);
      tx.style.left = tX + "px";
      tx.style.top = tB - tx.getBoundingClientRect().height + "px";
      { // the colour change rides the same hard sweep as the box: each line flips exactly where the edge crosses it
        const sweepY = r.y + a * r.h, sp = tx.querySelector("span") as HTMLElement;
        const paint = (el: HTMLElement, c1: number[], c2: number[]) => {
          if (a <= 0.001 || a >= 0.999) { el.style.backgroundImage = ""; el.style.webkitTextFillColor = ""; (el.style as CSSStyleDeclaration).backgroundClip = ""; return; }
          const rc = el.getBoundingClientRect(), pp = (sweepY - rc.top).toFixed(1) + "px";
          el.style.backgroundImage = `linear-gradient(180deg,rgb(${c1}) ${pp},rgb(${c2}) ${pp})`;
          el.style.backgroundClip = "text"; el.style.webkitTextFillColor = "transparent";
        };
        paint(tx, INK, BG);
        if (sp) paint(sp, MUT, GREY);
      }

      const cs = Math.min(131 * (mob ? 0.6 : k), s2.h * 0.3); // logo cell size, used only to centre the mark

      // the Flint mark: inside the box (frame 1) -> centred in the logo cell (frame 2) -> nav (frame 3)
      const f1 = mob ? 1.2 : (56.45 * k) / MW, f2 = mob ? 0.8 : k;
      const o1 = mob ? { x: 28, y: 26 } : { x: 41.6 * k, y: 35.2 * k };
      const o2 = { x: (cs - MW * f2) / 2, y: (cs - MH * f2) / 2 };
      let lx: number, ly: number, ls: number;
      if (first) {
        lx = r.x + lerp(o1.x, o2.x, a); ly = r.y + lerp(o1.y, o2.y, a); ls = lerp(f1, f2, a);
      } else {
        const g = ease(seg(p, 0.5, 0.88));
        lx = lerp(s2.x + o2.x, T.x, g); ly = lerp(s2.y + o2.y, T.y, g); ls = lerp(f2, 1, g);
      }
      lg.style.transform = `translate(${lx}px,${ly}px) scale(${ls})`;
      lg.style.color = a > 0.14 ? `rgb(${SLATE})` : `rgb(${CIT})`;

      const rx = r.x + r.w, by = r.y + r.h;
      const v1Rest = mob ? s2.y - 60 : Y(58), v2Rest = mob ? s2.y + s2.h + 14 : Y(728);
      const OFF = 60;
      // V1 / V2: come in along the left and right box edges on scroll 1 and land on the hero's own bars
      let v1y = -OFF, v2y = vh + 10;
      if (first) {
        const en = ease(seg(a, 0.3, 1));
        v1y = lerp(-OFF, v1Rest, en); v2y = lerp(vh + 10, v2Rest, en);
      } else {
        v1y = lerp(v1Rest, tL.y, c); v2y = lerp(v2Rest, tR.y, c);
      }
      bV1.style.transform = `translate(${r.x - 3}px,${v1y}px)`;
      bV2.style.transform = `translate(${rx - 3}px,${v2y}px)`;

      // master time m: 0..1 opening loader, 1..2 scroll 1 (shrink), 2..3 scroll to the hero
      const mt = ld < 1 ? ld : p < 0.5 ? 1 + seg(p, 0, 0.45) : 2 + seg(p, 0.5, 0.9);
      type Sg = { h: boolean; c: number; f: number; t: number; w: number[]; rv?: number[] };
      const S = (v: number) => v * k;
      const segs: Sg[] = [
        // pinwheel arms, drawn by the loader (each leaves a different corner, along the whole box edge and out to the screen edge)
        { h: false, c: r.x - 1, f: by, t: 0, w: [0, 0.6] },
        { h: true, c: r.y - 1, f: r.x, t: vw, w: [0.05, 0.65] },
        { h: false, c: rx, f: r.y, t: vh, w: [0.02, 0.62] },
        { h: true, c: by, f: rx, t: 0, w: [0.07, 0.67] },
        // growth into the full page lines while the box becomes the hero
        { h: false, c: r.x - 1, f: by, t: vh, w: [2.3, 2.8] },
        { h: true, c: r.y - 1, f: r.x, t: 0, w: [2.3, 2.8] },
        { h: false, c: rx, f: r.y, t: 0, w: [2.35, 2.85] },
        { h: true, c: by, f: rx, t: vw, w: [2.35, 2.85] },
      ];
      if (!mob) {
        // exact cell borders from the Figma frames (1280x832). Each line starts at a screen edge, a bar runs it, and a bar takes it back.
        // frame 1 (the opening state): left cell and the cells under the box
        segs.push(
          { h: true, c: Y(287), f: 0, t: X(149.5), w: [0.15, 0.7], rv: [1.2, 1.5] },
          { h: true, c: Y(574), f: 0, t: X(149.5), w: [0.2, 0.75], rv: [1.22, 1.52] },
          { h: false, c: X(149.5), f: Y(287), t: Y(574), w: [0.3, 0.85], rv: [1.26, 1.56] },
          { h: false, c: X(233.5), f: vh, t: by, w: [0.25, 0.8], rv: [1.24, 1.54] },
          { h: false, c: X(532.5), f: vh, t: by, w: [0.3, 0.85], rv: [1.28, 1.58] },
        );
        // frame 2 (after the first scroll): cells around the block
        segs.push(
          { h: true, c: Y(287), f: 0, t: X(202), w: [1.3, 1.7], rv: [2.0, 2.25] },
          { h: true, c: Y(574), f: 0, t: X(202), w: [1.34, 1.74], rv: [2.02, 2.27] },
          { h: false, c: X(202), f: Y(287), t: Y(574), w: [1.4, 1.8], rv: [2.04, 2.29] },
          { h: true, c: Y(676), f: 0, t: r.x, w: [1.36, 1.76], rv: [2.06, 2.31] },
          { h: false, c: X(380), f: vh, t: Y(676), w: [1.42, 1.82], rv: [2.08, 2.33] },
          { h: false, c: X(380), f: 0, t: Y(156), w: [1.3, 1.7], rv: [2.1, 2.35] },
          { h: true, c: Y(357), f: vw, t: rx, w: [1.34, 1.74], rv: [2.02, 2.27] },
          { h: true, c: Y(545), f: vw, t: rx, w: [1.38, 1.78], rv: [2.06, 2.31] },
          { h: false, c: X(1102), f: vh, t: Y(545), w: [1.44, 1.84], rv: [2.1, 2.35] },
        );
      }
      const nowT = performance.now(), dts = Math.min(0.064, (nowT - lt) / 1000); lt = nowT; anim = false;
      segs.forEach((g, i) => {
        const le = sgL[i], be = sgB[i];
        if (!le || !be) return;
        // every line starts at a fixed place (the screen edge or the box corner), a bar runs it to the far end and carries on out;
        // taking a line back works the same way: the bar runs the same direction again and eats the line from its start
        const wantD = mt >= g.w[0] ? 1 : 0, wantE = g.rv && mt >= g.rv[0] ? 1 : 0;
        dS[i] = toward(dS[i] ?? 0, wantD, dts / LDUR);
        eS[i] = toward(eS[i] ?? 0, wantD ? wantE : 0, dts / LDUR);
        if (dS[i] !== wantD || eS[i] !== (wantD ? wantE : 0)) anim = true;
        let u = ease(dS[i]);
        const er = ease(eS[i]);
        const dir = Math.sign(g.t - g.f) || 1, len = Math.abs(g.t - g.f);
        const at = (q: number) => g.f + dir * (len + OFF) * q;
        const tip = er > 0 ? at(er) : at(u);
        const endV = dir > 0 ? Math.min(at(u), g.t) : Math.max(at(u), g.t);
        const startV = er > 0 ? (dir > 0 ? Math.min(at(er), g.t) : Math.max(at(er), g.t)) : g.f;
        const vl = Math.abs(endV - startV), ve = endV;
        u = er >= 0.9995 ? 0 : u;
        const on = u > 0.0005 && vl > 0.5;
        le.style.display = on ? "block" : "none";
        if (on) {
          le.style.width = (g.h ? vl : 1) + "px"; le.style.height = (g.h ? 1 : vl) + "px";
          le.style.transform = g.h ? `translate(${Math.min(startV, ve)}px,${g.c}px)` : `translate(${g.c}px,${Math.min(startV, ve)}px)`;
        }
        const BL = 44, tail = tip - dir * BL, shown = u > 0.0005 && dir * (tail - g.t) < 0;
        be.style.display = shown ? "block" : "none";
        if (shown) {
          be.style.width = (g.h ? BL : 4) + "px"; be.style.height = (g.h ? 4 : BL) + "px";
          const lo = Math.min(tip, tail);
          be.style.transform = g.h ? `translate(${lo}px,${g.c - 1.5}px)` : `translate(${g.c - 1.5}px,${lo}px)`;
        }
      });

      // opening loader (ld 0 -> 1): the arms draw first; then the colour wipes into the box, then the text comes in
      if (ld < 1) {
        const rv = ease(seg(ld, 0.58, 0.88)), tf = ease(seg(ld, 0.82, 1));
        b.style.clipPath = `inset(${clampN((1 - rv) * 100)}% 0 0 0)`;
        tx.style.opacity = String(tf);
        // Dropbox-style formation: outline strokes draw in over the lines, then the fill comes in
        const dr = ease(seg(ld, 0.62, 0.9)), fl = ease(seg(ld, 0.86, 1));
        lg.style.opacity = "1";
        lf.style.opacity = String(fl);
        lo.style.opacity = String(1 - fl);
        los.forEach((e, i) => { const d = ease(seg(dr, i * 0.07, 0.55 + i * 0.07)); e.style.strokeDashoffset = String(1 - d); });
      } else {
        b.style.clipPath = "";
        tx.style.opacity = "1";
        lg.style.opacity = "1";
        lf.style.opacity = "1";
        lo.style.opacity = "0";
      }

      // the rest of the first screen builds in while the box lands: nav links drop in, the button and the cards
      // rise on staggered starts (slide + wipe, not a page fade). Cleared at the end so the real styles take over.
      const stag = (el: HTMLElement | null | undefined, i: number, fn: (e: number) => void) => {
        if (!el) return;
        const st0 = 0.8 + i * 0.03;
        fn(ease(seg(p, st0, Math.min(1, st0 + 0.17))));
      };
      const done = p >= 0.999;
      navA.forEach((el, i) => stag(el, i, (e) => {
        el.style.opacity = done ? "" : String(Math.min(1, e * 2));
        el.style.transform = done ? "" : `translateY(${(1 - e) * -22}px)`;
      }));
      stag(ctaEl, 2, (e) => {
        ctaEl!.style.opacity = done ? "" : String(Math.min(1, e * 2));
        ctaEl!.style.transform = done ? "" : `translateY(${(1 - e) * 48}px)`;
      });
      cardEls.forEach((el, i) => stag(el, 3 + Math.min(i, 3), (e) => {
        el.style.opacity = done ? "" : String(Math.min(1, e * 2.5));
        el.style.transform = done ? "" : `translateY(${(1 - e) * 96}px)`;
        el.style.clipPath = done ? "" : `inset(0 0 ${(1 - e) * 100}% 0)`;
      }));
      w.classList.toggle("sx-done", p >= 0.999);
    };

    const tick = () => {
      const t = target();
      cur += (t - cur) * 0.12;
      if (Math.abs(t - cur) < 0.0008) cur = t;
      draw(cur);
      raf = cur === t && !anim ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    cur = target();
    if (window.scrollY < 8) {
      ld = 0;
      root.style.overflow = "hidden";
      const t0 = performance.now(), D = 2900;
      const run = (now: number) => {
        ld = Math.min(1, (now - t0) / D);
        draw(cur);
        if (ld < 1) lraf = requestAnimationFrame(run);
        else { root.style.overflow = ""; kick(); }
      };
      lraf = requestAnimationFrame(run);
    }
    draw(cur);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => { window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); cancelAnimationFrame(raf); cancelAnimationFrame(lraf); root.style.overflow = ""; };
  }, []);

  return (
    <div className="sx" ref={wrap}>
      <div className="sx-stage" ref={stage}>
        <div className="sx-page">{children}</div>
        <div className="sx-fx" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => <span key={"l" + i} className="sx-sg" />)}
          <div className="sx-box" ref={box}>
          </div>
          {Array.from({ length: 24 }, (_, i) => <span key={"b" + i} className="sx-sb" />)}
          <span className="sx-bar sx-bv sx-v1" /><span className="sx-bar sx-bv sx-v2" />
        </div>
        <h1 className="sx-txt" ref={txtR} aria-hidden="true">Design Bandwidth<br />for startups and scale-ups.<br /><span>Shipped in code.</span></h1>
        <span className="sx-logo" ref={logo} aria-hidden="true">
          <svg width={MW} height={MH} viewBox="0 0 168 204" style={{ overflow: "visible" }}>
            <g className="sx-lf" fill="currentColor"><Shapes /></g>
            <g className="sx-lo" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round"><Shapes outline /></g>
          </svg>
        </span>
      </div>
      <div className="sx-sp" aria-hidden="true" />
    </div>
  );
}
