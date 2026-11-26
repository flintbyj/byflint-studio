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
const INK = [32, 35, 41], BG = [251, 250, 249], CIT = [241, 255, 99], SLATE = [83, 98, 122], GREY = [153, 155, 147], MUT = [137, 137, 136];

/*
  Scroll-scrubbed intro (Figma "Exploration - Hardcore", intro frames 1, 2, 3).
  Grid lines run along every edge of the box. The two black bars are the builders:
  they only travel along those lines (along the line they sit on to the corner, then
  onto the crossing line) and land exactly on the hero's own bars.
  Scroll sets a target; the drawing eases toward it every frame so it never jumps.
*/
export function ScrollIntro({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current!, st = stage.current!, b = box.current!, pv = prev.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { w.classList.add("sx-off"); return; }
    w.classList.add("sx-on");
    const q = (s: string) => st.querySelector(s) as HTMLElement;
    const lnT = q(".sx-lt"), lnB = q(".sx-lb"), lnL = q(".sx-ll"), lnR = q(".sx-lr"), cH = q(".sx-ch"), cV = q(".sx-cv");
    const bL = q(".sx-bl"), bR = q(".sx-br");
    let cur = 0, raf = 0;

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
      const rel = (el?: Element) => { const rr = el?.getBoundingClientRect(); return rr ? { x: rr.left - sr.left + 3, y: rr.top - sr.top } : null; };
      const tL = rel(rb[0]) ?? { x: s3.x, y: s3.y + 265 }, tR = rel(rb[1]) ?? { x: s3.x + s3.w, y: s3.y + s3.h - 91 };

      const a = ease(seg(p, 0, 0.45)), c = ease(seg(p, 0.5, 0.9));
      const first = p < 0.475;
      const r = first ? lr(s1, s2, a) : lr(s2, s3, c);
      b.style.transform = `translate(${r.x}px,${r.y}px)`;
      b.style.width = r.w + "px";
      b.style.height = r.h + "px";
      b.style.background = mix(INK, BG, a);
      b.style.setProperty("--sxm", mix(CIT, SLATE, a));
      b.style.setProperty("--sxt", mix(BG, INK, a));
      b.style.setProperty("--sxs", mix(GREY, MUT, a));
      const fs1 = mob ? 30 : 42 * k, fs2 = mob ? 24 : 32 * k, fs3 = mob ? 30 : Math.min(42, Math.max(28, vw * 0.033));
      b.style.setProperty("--sxf", (first ? lerp(fs1, fs2, a) : lerp(fs2, fs3, c)) + "px");

      lnT.style.transform = `translateY(${r.y}px)`;
      lnB.style.transform = `translateY(${r.y + r.h}px)`;
      lnL.style.transform = `translateX(${r.x}px)`;
      lnR.style.transform = `translateX(${r.x + r.w}px)`;
      const cs = Math.min(131 * (mob ? 0.6 : k), r.h * 0.3);
      const cellOn = seg(p, 0.25, 0.45) * (1 - seg(p, 0.5, 0.62));
      cH.style.cssText = `transform:translate(${r.x}px,${r.y + cs}px);width:${r.w}px;opacity:${cellOn}`;
      cV.style.cssText = `transform:translate(${r.x + cs}px,${r.y}px);height:${cs}px;opacity:${cellOn}`;

      const s1Lx = mob ? 40 : X(230), s2Ly = mob ? s2.y - 60 : Y(58);
      const s1Rx = mob ? vw - 40 : X(1102), s2Ry = mob ? s2.y + s2.h + 24 : Y(728);
      let L: { x: number; y: number }, Rr: { x: number; y: number };
      if (first) {
        const u = ease(seg(a, 0, 0.5)), v = ease(seg(a, 0.5, 1));
        L = a < 0.5 ? { x: lerp(s1Lx, r.x, u), y: r.y + r.h - 3 } : { x: r.x, y: lerp(r.y + r.h - 3, s2Ly, v) };
        Rr = a < 0.5 ? { x: lerp(s1Rx, r.x + r.w, u), y: r.y - 3 } : { x: r.x + r.w, y: lerp(r.y - 3, s2Ry, v) };
      } else {
        L = { x: r.x, y: lerp(s2Ly, tL.y, c) };
        Rr = { x: r.x + r.w, y: lerp(s2Ry, tR.y, c) };
      }
      bL.style.transform = `translate(${L.x - 3}px,${L.y}px)`;
      bR.style.transform = `translate(${Rr.x - 3}px,${Rr.y}px)`;

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
    draw(cur);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => { window.removeEventListener("scroll", kick); window.removeEventListener("resize", kick); cancelAnimationFrame(raf); };
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
            <span className="sx-m"><Mark width={40} height={48} /></span>
            <p>Design Bandwidth<br />for startups and scale-ups.<br /><span>Shipped in code.</span></p>
          </div>
          <span className="sx-bar sx-bl" /><span className="sx-bar sx-br" />
          <div className="sx-prev" ref={prev}>
            <div className="t" style={{ background: cases[0].bg }}><p className="co">{cases[0].company}</p><p className="s">{cases[0].before}<b>{cases[0].brand}</b>{cases[0].after}</p></div>
            <div className="ph" />
          </div>
        </div>
      </div>
      <div className="sx-sp" aria-hidden="true" />
    </div>
  );
}
