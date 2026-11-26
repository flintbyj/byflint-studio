"use client";
import { useEffect, useRef } from "react";

/* A square at the pointer with a red hairline running across the page in each direction through it, like a crosshair.
   The square grows over anything clickable and inverts against what is under it. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const lh = useRef<HTMLDivElement>(null);
  const lv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement, d = dot.current!, h = lh.current!, v = lv.current!;
    let x = -100, y = -100, raf = 0, shown = false, hot = false, down = false;
    const apply = () => {
      d.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${down ? 0.7 : hot ? 1.6 : 1})`;
      h.style.transform = `translate3d(0,${y}px,0)`; v.style.transform = `translate3d(${x}px,0,0)`;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; apply(); }); };
    const show = (on: boolean) => { if (on !== shown) { shown = on; root.classList.toggle("cur-on", on); } };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; if (!shown) show(true);
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
      <div className="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
