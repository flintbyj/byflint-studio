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
  Frame 1: dark box, citron mark, light headline.
  Frame 2: box shrinks and turns light, a small case preview peeks in at the bottom right.
  Frame 3: box grows into the hero, the real page fades in underneath and takes over.
  Progress comes from scroll position, so it plays forward and backward with the scroll.
*/
export function ScrollIntro({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const prev = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current!, st = stage.current!, b = box.current!, pv = prev.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { w.classList.add("sx-off"); return; }
    w.classList.add("sx-on");
    let raf = 0;
    const draw = () => {
      raf = 0;
      const vw = window.innerWidth, vh = window.innerHeight, mob = vw < 760;
      const len = vh * 1.2;
      const p = Math.min(1, Math.max(0, -w.getBoundingClientRect().top / len));
      w.style.setProperty("--sxlen", len + "px");
      const k = Math.min(vw / 1280, vh / 832), ox = (vw - 1280 * k) / 2, oy = (vh - 832 * k) / 2;
      const s1: R = mob ? { x: 16, y: 16, w: vw - 32, h: vh - 32 } : { x: ox + 299 * k, y: oy + 78 * k, w: 682 * k, h: 676 * k };
      const s2: R = mob ? { x: 32, y: vh * 0.22, w: vw - 64, h: vh * 0.42 } : { x: ox + 380 * k, y: oy + 287 * k, w: 525 * k, h: 389 * k };
      const mid = st.querySelector(".hero .mid") as HTMLElement | null;
      const sr = st.getBoundingClientRect();
      const m = mid?.getBoundingClientRect();
      const s3: R = m ? { x: m.left - sr.left, y: m.top - sr.top, w: m.width, h: m.height } : s2;

      const a = ease(seg(p, 0, 0.42)), c = ease(seg(p, 0.48, 0.86));
      const r = p < 0.45 ? lr(s1, s2, a) : lr(s2, s3, c);
      b.style.transform = `translate(${r.x}px,${r.y}px)`;
      b.style.width = r.w + "px";
      b.style.height = r.h + "px";
      b.style.background = mix(INK, BG, a);
      b.style.boxShadow = `inset 0 0 0 1px rgba(226,226,226,${a})`;
      b.style.setProperty("--sxm", mix(CIT, SLATE, a));
      b.style.setProperty("--sxt", mix(BG, INK, a));
      b.style.setProperty("--sxs", mix(GREY, MUT, a));
      const fs1 = mob ? 30 : 42 * k, fs2 = mob ? 24 : 32 * k, fs3 = mob ? 30 : Math.min(42, Math.max(28, vw * 0.033));
      b.style.setProperty("--sxf", (p < 0.45 ? lerp(fs1, fs2, a) : lerp(fs2, fs3, c)) + "px");

      const pin = ease(seg(p, 0.2, 0.42)), pout = seg(p, 0.55, 0.75);
      pv.style.top = vh - pv.offsetHeight - vh * 0.06 + "px";
      pv.style.opacity = String(pin * (1 - pout));
      pv.style.transform = `translate(${(1 - pin) * 40}px,${(1 - pin) * 60 + pout * -20}px)`;

      const reveal = seg(p, 0.84, 0.98);
      st.style.setProperty("--sxr", String(reveal));
      b.style.opacity = String(1 - seg(p, 0.9, 1));
      w.classList.toggle("sx-done", p >= 1);
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => { window.removeEventListener("scroll", req); window.removeEventListener("resize", req); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div className="sx" ref={wrap}>
      <div className="sx-stage" ref={stage}>
        <div className="sx-page">{children}</div>
        <div className="sx-box" ref={box} aria-hidden="true">
          <span className="sx-m"><Mark width={40} height={48} /></span>
          <p>Design Bandwidth<br />for startups and scale-ups.<br /><span>Shipped in code.</span></p>
        </div>
        <div className="sx-prev" ref={prev} aria-hidden="true">
          <div className="t" style={{ background: cases[0].bg }}><p className="co">{cases[0].company}</p><p className="s">{cases[0].before}<b>{cases[0].brand}</b>{cases[0].after}</p></div>
          <div className="ph" />
        </div>
      </div>
      <div className="sx-sp" aria-hidden="true" />
    </div>
  );
}
