"use client";
import { useEffect, useRef } from "react";
import { Mark } from "./Mark";
import { cases } from "@/lib/content";

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
  const prev = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const w = wrap.current!, st = stage.current!, b = box.current!, pv = prev.current!, lg = logo.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { w.classList.add("sx-off"); return; }
    w.classList.add("sx-on");
    const q = (s: string) => st.querySelector(s) as HTMLElement;
    const lnT = q(".sx-lt"), lnB = q(".sx-lb"), lnL = q(".sx-ll"), lnR = q(".sx-lr"), cH = q(".sx-ch"), cV = q(".sx-cv");
    const bL = q(".sx-bl"), bR = q(".sx-br");
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
      // head = the leading end of a bar; L ends heading up (head = top end), R heading down (head = bottom end)
      const tL = bl ? { x: bl.left - sr.left + 3, y: bl.top - sr.top } : { x: s3.x, y: s3.y + 265 };
      const tR = br ? { x: br.left - sr.left + 3, y: br.bottom - sr.top } : { x: s3.x + s3.w, y: s3.y + s3.h - 45 };
      const nl = rr(q(".nav .logo svg"));
      const T = nl ? { x: nl.left - sr.left, y: nl.top - sr.top } : { x: vw / 2 - MW / 2, y: 14 };

      const a = ease(seg(p, 0, 0.45)), c = ease(seg(p, 0.5, 0.9));
      const first = p < 0.475;
      const r = first ? lr(s1, s2, a) : lr(s2, s3, c);
      b.style.transform = `translate(${r.x}px,${r.y}px)`;
      b.style.width = r.w + "px";
      b.style.height = r.h + "px";
      b.style.background = mix(INK, BG, a);
      b.style.setProperty("--sxt", mix(BG, INK, a));
      b.style.setProperty("--sxs", mix(GREY, MUT, a));
      const fs1 = mob ? 30 : 42 * k, fs2 = mob ? 24 : 32 * k, fs3 = mob ? 30 : Math.min(42, Math.max(28, vw * 0.033));
      b.style.setProperty("--sxf", (first ? lerp(fs1, fs2, a) : lerp(fs2, fs3, c)) + "px");

      lnT.style.transform = `translateY(${r.y}px)`;
      lnB.style.transform = `translateY(${r.y + r.h}px)`;
      lnL.style.transform = `translateX(${r.x}px)`;
      lnR.style.transform = `translateX(${r.x + r.w}px)`;
      const cs = Math.min(131 * (mob ? 0.6 : k), s2.h * 0.3);
      const cellOn = seg(p, 0.25, 0.45) * (1 - seg(p, 0.5, 0.62));
      cH.style.cssText = `transform:translate(${r.x}px,${r.y + cs}px);width:${r.w}px;opacity:${cellOn}`;
      cV.style.cssText = `transform:translate(${r.x + cs}px,${r.y}px);height:${cs}px;opacity:${cellOn}`;

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

      // builder bars: along the line they sit on -> corner -> turn -> along the crossing line -> hero bar
      const s1Lx = mob ? r.x + 70 : r.x - (299 - 273) * k, s1Rx = mob ? r.x + r.w - 70 : r.x + r.w + (1099 - 981) * k;
      const s2Ly = mob ? s2.y - 60 : Y(58), s2Ry = mob ? s2.y + s2.h + 60 : Y(774);
      let L = { x: 0, y: 0, g: 0 }, Rr = { x: 0, y: 0, g: 180 };
      if (first) {
        const u = ease(seg(a, 0, 0.4)), t = ease(seg(a, 0.4, 0.55)), v = ease(seg(a, 0.55, 1));
        L = { x: lerp(s1Lx, r.x, u), y: lerp(r.y + r.h, s2Ly, v), g: mob ? lerp(180, 270, t) : lerp(0, -90, t) };
        Rr = { x: lerp(s1Rx, r.x + r.w, u), y: lerp(r.y, s2Ry, v), g: mob ? lerp(0, 90, t) : lerp(180, 90, t) };
        if (u < 1 || t === 0) { L.y = r.y + r.h; Rr.y = r.y; }
        if (u >= 1) { L.x = r.x; Rr.x = r.x + r.w; }
      } else {
        L = { x: r.x, y: lerp(s2Ly, tL.y, c), g: -90 };
        Rr = { x: r.x + r.w, y: lerp(s2Ry, tR.y, c), g: 90 };
      }
      bL.style.transform = `translate(${L.x}px,${L.y}px) rotate(${L.g}deg)`;
      bR.style.transform = `translate(${Rr.x}px,${Rr.y}px) rotate(${Rr.g}deg)`;

      // opening loader (ld 0 -> 1): bars run down/up the vertical lines drawing them, turn the corner onto
      // the horizontal lines, then colour wipes into the box and the text comes in. Ends exactly on the p=0 state.
      if (ld < 1) {
        const f1 = ease(seg(ld, 0, 0.55)), t = ease(seg(ld, 0.55, 0.7)), u = ease(seg(ld, 0.7, 0.95));
        const cLy = r.y + r.h, cRy = r.y, rx = r.x + r.w;
        const restL = mob ? r.x + 116 : r.x - 72 * k, restR = mob ? rx - 116 : rx + 164 * k;
        const hl = lerp(-60, cLy, f1), hr = lerp(vh + 60, cRy, f1);
        L = { x: lerp(r.x, restL, u), y: lerp(hl, cLy, 0), g: lerp(90, mob ? 0 : 180, t) };
        Rr = { x: lerp(rx, restR, u), y: hr, g: lerp(-90, mob ? -180 : 0, t) };
        L.y = hl; Rr.y = hr;
        const settle = ease(seg(ld, 0.55, 0.85));
        const fl = Math.max(hl / vh, settle), fr = Math.min(hr / vh, 1 - settle);
        lnL.style.clipPath = `inset(0 0 ${clampN((1 - fl) * 100)}% 0)`;
        lnR.style.clipPath = `inset(${clampN(fr * 100)}% 0 0 0)`;
        const hw = ease(seg(ld, 0.6, 0.95)) * vw;
        lnT.style.clipPath = `inset(0 ${clampN(100 - ((rx + hw) / vw) * 100)}% 0 ${clampN(((rx - hw) / vw) * 100)}%)`;
        lnB.style.clipPath = `inset(0 ${clampN(100 - ((r.x + hw) / vw) * 100)}% 0 ${clampN(((r.x - hw) / vw) * 100)}%)`;
        const rv = ease(seg(ld, 0.55, 0.85)), tx = ease(seg(ld, 0.8, 1));
        b.style.clipPath = `inset(${clampN((1 - rv) * 100)}% 0 0 0)`;
        b.style.setProperty("--sxtx", String(tx));
        lg.style.opacity = String(tx);
        bL.style.transform = `translate(${L.x}px,${L.y}px) rotate(${L.g}deg)`;
        bR.style.transform = `translate(${Rr.x}px,${Rr.y}px) rotate(${Rr.g}deg)`;
      } else {
        for (const el of [lnL, lnR, lnT, lnB, b]) el.style.clipPath = "";
        b.style.setProperty("--sxtx", "1");
        lg.style.opacity = "1";
      }

      pv.style.top = vh - pv.offsetHeight - vh * 0.06 + "px";
      const pin = ease(seg(p, 0.22, 0.45)), pout = seg(p, 0.55, 0.72);
      pv.style.opacity = String(pin * (1 - pout));
      pv.style.transform = `translate(${(1 - pin) * 40}px,${(1 - pin) * 60 + pout * -20}px)`;

      st.style.setProperty("--sxr", String(seg(p, 0.86, 0.98)));
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
          <span className="sx-cl sx-ch" /><span className="sx-cl sx-cv" />
          <div className="sx-box" ref={box}>
            <p>Design Bandwidth<br />for startups and scale-ups.<br /><span>Shipped in code.</span></p>
          </div>
          <span className="sx-bar sx-bl" /><span className="sx-bar sx-br" />
          <div className="sx-prev" ref={prev}>
            <div className="t" style={{ background: cases[0].bg }}><p className="co">{cases[0].company}</p><p className="s">{cases[0].before}<b>{cases[0].brand}</b>{cases[0].after}</p></div>
            <div className="ph" />
          </div>
        </div>
        <span className="sx-logo" ref={logo} aria-hidden="true"><Mark width={MW} height={MH} /></span>
      </div>
      <div className="sx-sp" aria-hidden="true" />
    </div>
  );
}
