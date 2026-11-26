"use client";
import { useEffect, useRef } from "react";

/* The cursor is a small four-point glint, the shape a flint throws. It leaves a few tiny glints behind as it moves,
   grows over anything clickable and throws a short burst of rays on click. It inverts against whatever is under it,
   so it reads on light and dark. Fine pointers only. */
const star = (g: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) => {
  g.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = rot + (i * Math.PI) / 2, b = a + Math.PI / 4, na = a + Math.PI / 2;
    const tx = x + Math.cos(a) * r, ty = y + Math.sin(a) * r, cx = x + Math.cos(b) * r * 0.16, cy = y + Math.sin(b) * r * 0.16;
    if (i === 0) g.moveTo(tx, ty);
    g.quadraticCurveTo(cx, cy, x + Math.cos(na) * r, y + Math.sin(na) * r);
  }
  g.closePath(); g.fill();
};

export function Cursor() {
  const dot = useRef<HTMLCanvasElement>(null);
  const st = useRef<HTMLCanvasElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement, d = dot.current!, s = st.current!, c = cv.current!;
    const dg = d.getContext("2d")!, sg = s.getContext("2d")!, g = c.getContext("2d")!;
    const DOT = 40; // canvas box for the cursor glint
    let dpr = 1, x = -100, y = -100, cx = x, cy = y, shown = false, hot = false, down = false, scale = 1, rot = 0, spin = 0;
    // trail glints (inverting) and click rays (coloured)
    type G = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number; life: number; max: number };
    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; len: number; kind: number; rot: number; vr: number };
    const gs: G[] = [], ps: P[] = []; let last = 0, raf = 0, acc = 0, lx = -1, ly = -1;
    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      s.width = c.width = Math.round(innerWidth * dpr); s.height = c.height = Math.round(innerHeight * dpr);
      d.width = d.height = Math.round(DOT * dpr);
    };
    fit();
    const run = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const frame = (now: number) => {
      const dt = Math.min(48, now - last); last = now; const k = dt / 16;
      // the cursor glint follows exactly; its size and turn ease toward the hover state
      cx += (x - cx) * (reduce ? 1 : 0.5); cy += (y - cy) * (reduce ? 1 : 0.5);
      const ts = down ? 0.75 : hot ? 1.9 : 1; scale += (ts - scale) * 0.18; spin += ((hot ? Math.PI / 4 : 0) - spin) * 0.14; rot = spin;
      dg.clearRect(0, 0, d.width, d.height); dg.fillStyle = "#fff"; star(dg, d.width / 2, d.height / 2, 7 * scale * dpr, rot);
      d.style.transform = `translate3d(${cx - DOT / 2}px,${cy - DOT / 2}px,0)`;
      // trail glints
      sg.clearRect(0, 0, s.width, s.height); sg.fillStyle = "#fff";
      for (let i = gs.length - 1; i >= 0; i--) {
        const p = gs[i]; p.life += dt; if (p.life >= p.max) { gs.splice(i, 1); continue; }
        const t = p.life / p.max; p.x += p.vx * k; p.y += p.vy * k; p.rot += p.vr * k;
        sg.globalAlpha = Math.pow(1 - t, 1.2); star(sg, p.x * dpr, p.y * dpr, p.r * (1 - t * 0.6) * dpr, p.rot);
      }
      sg.globalAlpha = 1;
      // click rays
      g.clearRect(0, 0, c.width, c.height);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]; p.life += dt; if (p.life >= p.max) { ps.splice(i, 1); continue; }
        const t = p.life / p.max, al = Math.pow(1 - t, 0.9), sp = Math.hypot(p.vx, p.vy) || 1;
        p.vy += 0.02 * k;
        const L = p.len * (1 - t * 0.6), x1 = p.x, y1 = p.y, x2 = p.x - (p.vx / sp) * L, y2 = p.y - (p.vy / sp) * L;
        const w = p.kind === 2 ? 1.4 : 2.6, dx = x2 - x1, dy = y2 - y1, dd = Math.hypot(dx, dy) || 1, nx = (-dy / dd) * w / 2, ny = (dx / dd) * w / 2;
        g.globalAlpha = al * 0.4; g.fillStyle = "#202329";
        g.beginPath(); g.moveTo((x1 + nx * 1.9) * dpr, (y1 + ny * 1.9) * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.lineTo((x1 - nx * 1.9) * dpr, (y1 - ny * 1.9) * dpr); g.closePath(); g.fill();
        const gr = g.createLinearGradient(x1 * dpr, y1 * dpr, x2 * dpr, y2 * dpr); gr.addColorStop(0, t < 0.3 ? "#FFFFFF" : "#FFF1A6"); gr.addColorStop(1, "#F1FF63");
        g.globalAlpha = al; g.fillStyle = gr;
        g.beginPath(); g.moveTo((x1 + nx) * dpr, (y1 + ny) * dpr); g.lineTo(x2 * dpr, y2 * dpr); g.lineTo((x1 - nx) * dpr, (y1 - ny) * dpr); g.closePath(); g.fill();
        p.x += p.vx * k; p.y += p.vy * k; p.vx *= Math.pow(0.9, k); p.vy *= Math.pow(0.9, k);
      }
      g.globalAlpha = 1;
      const moving = Math.abs(x - cx) + Math.abs(y - cy) > 0.2 || Math.abs(ts - scale) > 0.01 || Math.abs((hot ? Math.PI / 4 : 0) - spin) > 0.01;
      raf = gs.length || ps.length || moving ? requestAnimationFrame(frame) : 0;
    };
    const strike = (px: number, py: number) => {
      if (reduce || root.classList.contains("cur-text")) return;
      for (let i = 0; i < 18 && ps.length < 120; i++) {
        const a = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.5, v = 2.2 + Math.random() * 5.2, r = Math.random();
        ps.push({ x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 320 + Math.random() * 380, len: 12 + Math.random() * 22, kind: r < 0.3 ? 2 : 0, rot: 0, vr: 0 });
      }
      run();
    };
    const drop = (px: number, py: number) => {
      if (reduce || gs.length > 22) return;
      gs.push({ x: px + (Math.random() - 0.5) * 6, y: py + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 0.5, vy: 0.1 + Math.random() * 0.25, r: 3 + Math.random() * 5, rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.04, life: 0, max: 650 + Math.random() * 450 });
    };
    const show = (v: boolean) => { if (v !== shown) { shown = v; root.classList.toggle("cur-on", v); } };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { cx = x; cy = y; show(true); lx = x; ly = y; }
      acc += Math.hypot(x - lx, y - ly); lx = x; ly = y;
      if (acc > 46) { acc = 0; drop(x, y); }
      const t = e.target as Element | null;
      hot = !!t?.closest("a,button,summary,label,[role=button],[data-cursor]");
      root.classList.toggle("cur-text", !!t?.closest("input,textarea,select,[contenteditable=true]"));
      run();
    };
    const dn = (e: PointerEvent) => { strike(e.clientX, e.clientY); down = true; run(); };
    const up = () => { down = false; run(); };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) show(false); };
    window.addEventListener("pointermove", move, { passive: true }); window.addEventListener("resize", fit);
    window.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(raf); root.classList.remove("cur-on", "cur-text"); window.removeEventListener("pointermove", move); window.removeEventListener("resize", fit); window.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); document.removeEventListener("mouseout", out); };
  }, []);
  return (
    <>
      <canvas className="cur-sp cur-st" ref={st} aria-hidden="true" />
      <canvas className="cur-sp" ref={cv} aria-hidden="true" />
      <canvas className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
