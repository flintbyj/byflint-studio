"use client";
import { useEffect, useRef } from "react";
import { Mark } from "./Mark";

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
  Grid lines run along every edge of the box. The two black bars are the builders:
  they start lying on the lines exactly where Figma frame 1 puts them, slide to the
  box corner, turn it and keep travelling along the crossing line, then land on the
  hero's own bars. The Flint mark rides in the box, then flies up to the nav logo
  (no fade) and is swapped for the real one only when it has arrived.
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { w.classList.add("sx-off"); return; }
    w.classList.add("sx-on");
    const q = (s: string) => st.querySelector(s) as HTMLElement;
    const lnT = q(".sx-lt"), lnB = q(".sx-lb"), lnL = q(".sx-ll"), lnR = q(".sx-lr");
    const navA = Array.from(st.querySelectorAll<HTMLElement>(".nav .l a, .nav > a:last-child"));
    const ctaEl = st.querySelector<HTMLElement>(".hero .cta");
    const cardEls = Array.from(st.querySelectorAll<HTMLElement>(".work .card"));
    const bH1 = q(".sx-h1"), bH2 = q(".sx-h2"), bV1 = q(".sx-v1"), bV2 = q(".sx-v2");
    let cur = 0, raf = 0, ld = 1, lraf = 0;
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
      b.style.transform = `translate(${r.x}px,${r.y}px)`;
      b.style.width = r.w + "px";
      b.style.height = r.h + "px";
      b.style.background = mix(INK, BG, a);
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
      tx.style.color = mix(BG, INK, a);
      tx.style.setProperty("--sxs", mix(GREY, MUT, a));
      tx.style.left = tX + "px";
      tx.style.top = tB - tx.getBoundingClientRect().height + "px";

      lnT.style.transform = `translateY(${r.y - 1}px)`;
      lnB.style.transform = `translateY(${r.y + r.h}px)`;
      lnL.style.transform = `translateX(${r.x - 1}px)`;
      lnR.style.transform = `translateX(${r.x + r.w}px)`;
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
      lg.style.color = mix(CIT, SLATE, a);

      // builder bars, one axis each. H1 sits on the bottom line, H2 on the top line, V1 on the left line, V2 on the right line.
      const rx = r.x + r.w, by = r.y + r.h;
      const v1Rest = mob ? s2.y - 60 : Y(58), v2Rest = mob ? s2.y + s2.h + 14 : Y(728);
      const OFF = 60;
      // H bars only exist during the opening loader (they draw the top and bottom lines and leave); V bars come in on scroll 1.
      let h1x = -OFF, h2x = vw + 10, v1y = -OFF, v2y = vh + 10;
      if (first) {
        const en = ease(seg(a, 0.3, 1));
        v1y = lerp(-OFF, v1Rest, en); v2y = lerp(vh + 10, v2Rest, en);
      } else {
        v1y = lerp(v1Rest, tL.y, c); v2y = lerp(v2Rest, tR.y, c);
      }

      // opening loader (ld 0 -> 1): each bar draws its own line, end to end, and leaves the screen. V1 runs down the left line,
      // V2 up the right line, H1 right to left along the bottom line, H2 left to right along the top line. Lines show only
      // where a bar has been. Then the colour wipes into the box, then the text.
      if (ld < 1) {
        const f = ease(seg(ld, 0, 0.62));
        v1y = lerp(-OFF, vh + 10, f); v2y = lerp(vh + 10, -OFF, f);
        h1x = lerp(vw + 10, -OFF, f); h2x = lerp(-OFF, vw + 10, f);
        lnL.style.clipPath = `inset(0 0 ${clampN((1 - (v1y + 46) / vh) * 100)}% 0)`;
        lnR.style.clipPath = `inset(${clampN((v2y / vh) * 100)}% 0 0 0)`;
        lnB.style.clipPath = `inset(0 0 0 ${clampN((h1x / vw) * 100)}%)`;
        lnT.style.clipPath = `inset(0 ${clampN(100 - ((h2x + 46) / vw) * 100)}% 0 0)`;
        const rv = ease(seg(ld, 0.58, 0.88)), tf = ease(seg(ld, 0.82, 1));
        b.style.clipPath = `inset(${clampN((1 - rv) * 100)}% 0 0 0)`;
        tx.style.opacity = String(tf);
        lg.style.opacity = String(tf);
      } else {
        for (const el of [lnL, lnR, lnT, lnB, b]) el.style.clipPath = "";
        tx.style.opacity = "1";
        lg.style.opacity = "1";
      }
      bH1.style.transform = `translate(${h1x}px,${by - 2.5}px)`;
      bH2.style.transform = `translate(${h2x}px,${r.y - 3.5}px)`;
      bV1.style.transform = `translate(${r.x - 3}px,${v1y}px)`;
      bV2.style.transform = `translate(${rx - 3}px,${v2y}px)`;

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
      st.style.setProperty("--sxo", String(1 - seg(p, 0.93, 1)));
      w.classList.toggle("sx-done", p >= 0.999);
    };

    const tick = () => {
      const t = target();
      cur += (t - cur) * 0.12;
      if (Math.abs(t - cur) < 0.0008) cur = t;
      draw(cur);
      raf = cur === t ? 0 : requestAnimationFrame(tick);
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
          <span className="sx-ln sx-h sx-lt" /><span className="sx-ln sx-h sx-lb" />
          <span className="sx-ln sx-v sx-ll" /><span className="sx-ln sx-v sx-lr" />
          <div className="sx-box" ref={box}>
          </div>
          <span className="sx-bar sx-bh sx-h1" /><span className="sx-bar sx-bh sx-h2" /><span className="sx-bar sx-bv sx-v1" /><span className="sx-bar sx-bv sx-v2" />
        </div>
        <h1 className="sx-txt" ref={txtR} aria-hidden="true">Design Bandwidth<br />for startups and scale-ups.<br /><span>Shipped in code.</span></h1>
        <span className="sx-logo" ref={logo} aria-hidden="true"><Mark width={MW} height={MH} /></span>
      </div>
      <div className="sx-sp" aria-hidden="true" />
    </div>
  );
}
