"use client";
import { useEffect, useRef } from "react";

/* A quiet cursor: a small dot that follows exactly and a thin ring that trails it.
   The ring opens over anything clickable, closes a little on press, and can carry a word via data-cursor="View".
   It inverts against whatever is under it, so it reads on light and dark. Fine pointers only. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const lab = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement, d = dot.current!, r = ring.current!, l = lab.current!;
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
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(raf); root.classList.remove("cur-on", "cur-text"); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); document.removeEventListener("mouseout", out); };
  }, []);
  return (
    <>
      <div className="cur-dot" ref={dot} aria-hidden="true" />
      <div className="cur-ring" ref={ring} aria-hidden="true"><span ref={lab} /></div>
    </>
  );
}
