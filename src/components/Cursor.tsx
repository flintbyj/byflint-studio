"use client";
import { useEffect, useRef } from "react";

/* A dot with a thin ring around it, and one hairline running across the page in each direction through the dot, like a crosshair.
   The ring trails the dot a little and opens over anything clickable. Everything inverts against what is under it, so it reads on light and dark.
   Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const lh = useRef<HTMLDivElement>(null);
  const lv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement, d = dot.current!, r = ring.current!, h = lh.current!, v = lv.current!;
    let x = -100, y = -100, rx = x, ry = y, raf = 0, shown = false, hot = false, down = false;
    const apply = () => {
      d.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${hot ? 0.6 : 1})`;
      r.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) scale(${down ? 0.8 : hot ? 1.6 : 1})`;
      h.style.transform = `translate3d(0,${y}px,0)`; v.style.transform = `translate3d(${x}px,0,0)`;
    };
    const tick = () => {
      rx += (x - rx) * (reduce ? 1 : 0.18); ry += (y - ry) * (reduce ? 1 : 0.18);
      apply(); raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const show = (on: boolean) => { if (on !== shown) { shown = on; root.classList.toggle("cur-on", on); } };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; if (!shown) { rx = x; ry = y; show(true); }
      const t = e.target as Element | null;
      hot = !!t?.closest("a,button,summary,label,[role=button],[data-cursor]");
      root.classList.toggle("cur-text", !!t?.closest("input,textarea,select,[contenteditable=true]"));
      apply(); kick();
    };
    const dn = () => { down = true; kick(); }, up = () => { down = false; kick(); };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) show(false); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(raf); root.classList.remove("cur-on", "cur-text"); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); document.removeEventListener("mouseout", out); };
  }, []);
  return (
    <>
      <div className="cur-l cur-h" ref={lh} aria-hidden="true" />
      <div className="cur-l cur-v" ref={lv} aria-hidden="true" />
      <div className="cur-ring" ref={ring} aria-hidden="true" />
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
