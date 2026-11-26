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
      const n = Math.min(6, 2 + Math.floor(sp / 14));
      for (let i = 0; i < n && ps.length < 160; i++) {
        const a = Math.atan2(dy, dx) + Math.PI + (Math.random() - 0.5) * 2.6, v = 1.6 + Math.random() * 4.2 + sp * 0.06, r = Math.random();
        ps.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: r < 0.14 ? 650 + Math.random() * 450 : 280 + Math.random() * 380, len: r < 0.14 ? 6 + Math.random() * 8 : 10 + Math.random() * 24, kind: r < 0.14 ? 1 : r < 0.3 ? 2 : 0, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.05 });
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
        const k = dt / 16;
        const t = p.life / p.max, al = Math.pow(1 - t, 0.9), sp = Math.hypot(p.vx, p.vy) || 1;
        p.vy += 0.02 * k; p.rot += p.vr * k;
        // a hair-thin tapered line: bright at the head, tapering to nothing, with a faint dark edge so it reads on light grounds
        const tap = (x1: number, y1: number, x2: number, y2: number, w: number, hot: string, tail: string) => {
          const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, nx = -dy / d * w / 2, ny = dx / d * w / 2;
          g.globalAlpha = al * 0.4; g.fillStyle = "#202329";
          g.beginPath(); g.moveTo((x1 + nx * 1.9) * dpr, (y1 + ny * 1.9) * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.lineTo((x1 - nx * 1.9) * dpr, (y1 - ny * 1.9) * dpr); g.closePath(); g.fill();
          const gr = g.createLinearGradient(x1 * dpr, y1 * dpr, x2 * dpr, y2 * dpr); gr.addColorStop(0, hot); gr.addColorStop(1, tail);
          g.globalAlpha = al; g.fillStyle = gr;
          g.beginPath(); g.moveTo((x1 + nx) * dpr, (y1 + ny) * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.lineTo((x1 - nx) * dpr, (y1 - ny) * dpr); g.closePath(); g.fill();
        };
        const hot = t < 0.3 ? "#FFFFFF" : "#FFF1A6", tail = "#F1FF63";
        if (p.kind !== 1) {
          const L = p.len * (1 - t * 0.6), ux = p.vx / sp, uy = p.vy / sp;
          tap(p.x, p.y, p.x - ux * L, p.y - uy * L, p.kind === 2 ? 1.4 : 2.6, hot, tail);
        } else { // a four-point sparkle with long thin rays that twinkles as it fades
          const tw = 0.65 + 0.35 * Math.sin(p.life * 0.03), u = p.len * tw * (1 - t * 0.5), c0 = Math.cos(p.rot), s0 = Math.sin(p.rot);
          for (let q = 0; q < 4; q++) {
            const a = q * Math.PI / 2, ca = Math.cos(a), sa = Math.sin(a), L = q % 2 ? u * 0.62 : u;
            tap(p.x, p.y, p.x + (ca * c0 - sa * s0) * L, p.y + (ca * s0 + sa * c0) * L, 2.2, "#FFFFFF", tail);
          }
          g.globalAlpha = al; g.fillStyle = "#FFFFFF"; g.beginPath(); g.arc(p.x * dpr, p.y * dpr, 1.6 * dpr, 0, Math.PI * 2); g.fill();
        }
        p.x += p.vx * k; p.y += p.vy * k; p.vx *= Math.pow(0.9, k); p.vy *= Math.pow(0.9, k);
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
