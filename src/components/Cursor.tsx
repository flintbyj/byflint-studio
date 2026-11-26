"use client";
import { useEffect, useRef } from "react";

/* A solid square at the pointer, with a short trail of hollow squares that follow it in a chain and fade out.
   The trail squares invert against what is under them, so they read on light and dark. Fine pointers only. */
const N = 6;
export function Cursor() {
  const head = useRef<HTMLDivElement>(null);
  const tr = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tr.current.forEach((t) => t && (t.style.display = "none"));
    }
    const root = document.documentElement, hd = head.current!;
    let x = -100, y = -100, raf = 0, shown = false, hot = false, down = false;
    const p = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
    const draw = () => {
      hd.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${down ? 0.7 : hot ? 1.5 : 1})`;
      p.forEach((q, i) => { const t = tr.current[i]; if (t) t.style.transform = `translate3d(${q.x}px,${q.y}px,0) translate(-50%,-50%) scale(${1 - i * 0.07})`; });
    };
    const tick = () => {
      let moving = false, px = x, py = y;
      p.forEach((q) => {
        const dx = px - q.x, dy = py - q.y;
        q.x += dx * 0.28; q.y += dy * 0.28;
        if (Math.abs(dx) + Math.abs(dy) > 0.3) moving = true;
        px = q.x; py = q.y;
      });
      draw(); raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const show = (on: boolean) => { if (on !== shown) { shown = on; root.classList.toggle("cur-on", on); } };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { p.forEach((q) => { q.x = x; q.y = y; }); show(true); }
      const t = e.target as Element | null;
      hot = !!t?.closest("a,button,summary,label,[role=button],[data-cursor]");
      root.classList.toggle("cur-text", !!t?.closest("input,textarea,select,[contenteditable=true]"));
      draw(); kick();
    };
    const dn = () => { down = true; draw(); }, up = () => { down = false; draw(); };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) show(false); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(raf); root.classList.remove("cur-on", "cur-text"); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); document.removeEventListener("mouseout", out); };
  }, []);
  return (
    <>
      {Array.from({ length: N }, (_, i) => (
        <div className="cur-t" key={i} ref={(el) => { tr.current[i] = el; }} style={{ ["--o" as string]: (0.95 - i * 0.15).toFixed(2) }} aria-hidden="true" />
      ))}
      <div className="cur-dot" ref={head} aria-hidden="true" />
    </>
  );
}
