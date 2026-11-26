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

      // builder bars, one axis each. H1 sits on the bottom line, H2 on the top line, V1 on the left line, V2 on the right line.
      const rx = r.x + r.w, by = r.y + r.h;
      const h1Rest = mob ? r.x + 70 : X(227), h2Rest = mob ? rx - 116 : X(1099);
      const v1Rest = mob ? s2.y - 60 : Y(58), v2Rest = mob ? s2.y + s2.h + 14 : Y(728);
      const OFF = 60;
      let h1x = h1Rest, h2x = h2Rest, v1y = -OFF, v2y = vh + 10;
      if (first) {
        const ex = ease(seg(a, 0, 0.6)), en = ease(seg(a, 0.3, 1));
        h1x = lerp(h1Rest, -OFF, ex); h2x = lerp(h2Rest, vw + 10, ex);
        v1y = lerp(-OFF, v1Rest, en); v2y = lerp(vh + 10, v2Rest, en);
      } else {
        h1x = -OFF; h2x = vw + 10;
        v1y = lerp(v1Rest, tL.y, c); v2y = lerp(v2Rest, tR.y, c);
      }

      // opening loader (ld 0 -> 1): V1 runs down the left line and V2 up the right line, drawing them; H1 runs right to left
      // along the bottom line and H2 left to right along the top line, drawing those. Then colour wipes in, then the text.
      if (ld < 1) {
        const f = ease(seg(ld, 0, 0.6)), settle = ease(seg(ld, 0.5, 0.85));
        v1y = lerp(-OFF, vh + 10, f); v2y = lerp(vh + 10, -OFF, f);
        h1x = lerp(vw + 10, h1Rest, f); h2x = lerp(-OFF, h2Rest, f);
        lnL.style.clipPath = `inset(0 0 ${clampN((1 - Math.max((v1y + 46) / vh, settle)) * 100)}% 0)`;
        lnR.style.clipPath = `inset(${clampN(Math.min(v2y / vh, 1 - settle) * 100)}% 0 0 0)`;
        lnB.style.clipPath = `inset(0 0 0 ${clampN(((h1x * (1 - settle)) / vw) * 100)}%)`;
        lnT.style.clipPath = `inset(0 ${clampN(100 - ((lerp(h2x + 46, vw, settle)) / vw) * 100)}% 0 0)`;
        const rv = ease(seg(ld, 0.55, 0.85)), tx = ease(seg(ld, 0.8, 1));
        b.style.clipPath = `inset(${clampN((1 - rv) * 100)}% 0 0 0)`;
        b.style.setProperty("--sxtx", String(tx));
        lg.style.opacity = String(tx);
      } else {
        for (const el of [lnL, lnR, lnT, lnB, b]) el.style.clipPath = "";
        b.style.setProperty("--sxtx", "1");
        lg.style.opacity = "1";
      }
      bH1.style.transform = `translate(${h1x}px,${by - 2.5}px)`;
      bH2.style.transform = `translate(${h2x}px,${r.y - 2.5}px)`;
      bV1.style.transform = `translate(${r.x - 2.5}px,${v1y}px)`;
      bV2.style.transform = `translate(${rx - 2.5}px,${v2y}px)`;

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
          <span className="sx-bar sx-bh sx-h1" /><span className="sx-bar sx-bh sx-h2" /><span className="sx-bar sx-bv sx-v1" /><span className="sx-bar sx-bv sx-v2" />
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
