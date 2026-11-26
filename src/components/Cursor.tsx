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
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number; kind: number; rot: number; vr: number };
    const ps: P[] = []; let sraf = 0, lx = -1, ly = -1, dpr = 1;
    const fit = () => { dpr = Math.min(2, window.devicePixelRatio || 1); c.width = innerWidth * dpr; c.height = innerHeight * dpr; };
    fit();
    const spark = (px: number, py: number, dx: number, dy: number) => {
      const sp = Math.hypot(dx, dy); if (sp < 2 || reduce || document.documentElement.classList.contains("cur-text")) return;
      const n = Math.min(5, 2 + Math.floor(sp / 16));
      for (let i = 0; i < n && ps.length < 140; i++) {
        const a = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 2.2, v = 0.6 + Math.random() * 2.4 + sp * 0.04;
        ps.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 520 + Math.random() * 480, len: 9 + Math.random() * 12, kind: Math.random() < 0.18 ? 2 : Math.random() < 0.3 ? 1 : 0, rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.12 });
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
        const t = p.life / p.max, al = Math.pow(1 - t, 1.3), sp = Math.hypot(p.vx, p.vy) || 1, sc = 1 - t * 0.55;
        p.rot += p.vr * k;
        const col = t < 0.2 ? "#FFFFFF" : "#F1FF63";
        const bar = (x1: number, y1: number, x2: number, y2: number, w: number) => {
          g.lineCap = "round"; g.lineJoin = "round";
          g.globalAlpha = al * 0.55; g.strokeStyle = "#202329"; g.lineWidth = (w + 2.6) * dpr; // dark edge so it reads on light grounds
          g.beginPath(); g.moveTo(x1 * dpr, y1 * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.stroke();
          g.globalAlpha = al; g.strokeStyle = col; g.lineWidth = w * dpr;
          g.beginPath(); g.moveTo(x1 * dpr, y1 * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.stroke();
        };
        if (p.kind === 0) { // a thick rounded streak, like one bar of the mark
          const L = p.len * sc, ux = p.vx / sp, uy = p.vy / sp;
          bar(p.x, p.y, p.x - ux * L, p.y - uy * L, 4.2 * sc + 0.8);
        } else if (p.kind === 1) { // a round ember
          bar(p.x, p.y, p.x + 0.01, p.y, (4.5 + p.len * 0.25) * sc);
        } else { // a glint drawn like the Flint mark: bars on a cross, one short diagonal, a dot at the centre
          const u = p.len * 1.15 * sc, c0 = Math.cos(p.rot), s0 = Math.sin(p.rot);
          const pt = (a: number, b: number) => [p.x + a * c0 - b * s0, p.y + a * s0 + b * c0];
          const seg = (a1: number, b1: number, a2: number, b2: number) => { const A = pt(a1, b1), B = pt(a2, b2); bar(A[0], A[1], B[0], B[1], 3.2 * sc + 0.6); };
          seg(0, -u * 0.95, 0, -u * 0.45); seg(-u * 0.95, 0, -u * 0.45, 0); seg(u * 0.45, 0, u * 0.95, 0); seg(0, u * 0.45, 0, u * 1.0);
          seg(u * 0.3, u * 0.3, u * 0.55, u * 0.55); bar(p.x, p.y, p.x + 0.01, p.y, 3.4 * sc);
        }
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
