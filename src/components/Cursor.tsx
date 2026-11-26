"use client";
import { useEffect, useRef } from "react";

/* A quiet cursor: a small dot that follows exactly and a thin ring that trails it.
   The ring opens over anything clickable, closes a little on press, and can carry a word via data-cursor="View".
   It inverts against whatever is under it, so it reads on light and dark. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const lab = useRef<HTMLSpanElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement, d = dot.current!, r = ring.current!, l = lab.current!, c = cv.current!, g = c.getContext("2d")!;
    // sparks: short bright streaks thrown off the pointer as it moves, gone in about half a second
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number };
    const ps: P[] = []; let sraf = 0, lx = -1, ly = -1, dpr = 1;
    const fit = () => { dpr = Math.min(2, window.devicePixelRatio || 1); c.width = innerWidth * dpr; c.height = innerHeight * dpr; };
    fit();
    const spark = (px: number, py: number, dx: number, dy: number) => {
      const sp = Math.hypot(dx, dy); if (sp < 2 || reduce || document.documentElement.classList.contains("cur-text")) return;
      const n = Math.min(5, 2 + Math.floor(sp / 16));
      for (let i = 0; i < n && ps.length < 140; i++) {
        const a = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 2.2, v = 0.6 + Math.random() * 2.4 + sp * 0.04;
        ps.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 450 + Math.random() * 420, len: 7 + Math.random() * 11 });
      }
      if (!sraf) { last = performance.now(); sraf = requestAnimationFrame(frame); }
    };
    let last = 0;
    const frame = (now: number) => {
      const dt = Math.min(48, now - last); last = now;
      g.clearRect(0, 0, c.width, c.height);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]; p.life += dt;
        if (p.life >= p.max) { ps.splice(i, 1); continue; }
        const k = dt / 16; p.x += p.vx * k; p.y += p.vy * k; p.vx *= Math.pow(0.94, k); p.vy *= Math.pow(0.94, k);
        const t = p.life / p.max, al = Math.pow(1 - t, 1.4), sp = Math.hypot(p.vx, p.vy) || 1, L = p.len * (1 - t * 0.7);
        const x2 = p.x - (p.vx / sp) * L, y2 = p.y - (p.vy / sp) * L;
        g.lineCap = "round";
        g.globalAlpha = al * 0.5; g.strokeStyle = "#202329"; g.lineWidth = 3.4 * dpr; // dark edge so it reads on light grounds
        g.beginPath(); g.moveTo(p.x * dpr, p.y * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.stroke();
        g.globalAlpha = al; g.strokeStyle = t < 0.25 ? "#FFFFFF" : "#F1FF63"; g.lineWidth = 1.8 * dpr;
        g.beginPath(); g.moveTo(p.x * dpr, p.y * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.stroke();
      }
      g.globalAlpha = 1;
      sraf = ps.length ? requestAnimationFrame(frame) : 0;
    };
    let x = -100, y = -100, rx = x, ry = y, raf = 0, shown = false, hot = false, down = false, text = "";
    const apply = () => {
      d.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${hot ? 0.5 : down ? 0.8 : 1})`;
      const s = text ? 2.6 : hot ? 1.7 : down ? 0.8 : 1;
      r.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${s})`;
    };
    const tick = () => {
      rx += (x - rx) * (reduce ? 1 : 0.16); ry += (y - ry) * (reduce ? 1 : 0.16);
      apply();
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const show = (v: boolean) => { if (v !== shown) { shown = v; root.classList.toggle("cur-on", v); } };
    const move = (e: PointerEvent) => {
      if (lx >= 0) spark(e.clientX, e.clientY, e.clientX - lx, e.clientY - ly);
      lx = e.clientX; ly = e.clientY;
      x = e.clientX; y = e.clientY; if (!shown) { rx = x; ry = y; show(true); }
      const t = e.target as Element | null;
      const lbl = t?.closest("[data-cursor]")?.getAttribute("data-cursor") || "";
      const isText = !!t?.closest("input,textarea,select,[contenteditable=true]");
      const h = !!t?.closest("a,button,summary,label,[role=button],[data-cursor]");
      if (lbl !== text) { text = lbl; l.textContent = lbl; r.classList.toggle("has-t", !!lbl); }
      if (h !== hot) { hot = h; r.classList.toggle("is-hot", h); }
      root.classList.toggle("cur-text", isText);
      kick();
    };
    const dn = () => { down = true; r.classList.add("is-down"); kick(); };
    const up = () => { down = false; r.classList.remove("is-down"); kick(); };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) show(false); };
    window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("resize", fit);
    window.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(sraf); window.removeEventListener("resize", fit); root.classList.remove("cur-on", "cur-text"); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); document.removeEventListener("mouseout", out); };
  }, []);
  return (
    <>
      <canvas className="cur-sp" ref={cv} aria-hidden="true" />
      <div className="cur-dot" ref={dot} aria-hidden="true" />
      <div className="cur-ring" ref={ring} aria-hidden="true"><span ref={lab} /></div>
    </>
  );
}
