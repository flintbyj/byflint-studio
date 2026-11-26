"use client";
import { useEffect, useRef } from "react";

/* A solid square at the pointer. It grows over anything clickable and shrinks on press. Fine pointers only. */
export function Cursor() {
  const sq = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement, el = sq.current!;
    let x = -100, y = -100, raf = 0, shown = false, hot = false, down = false;
    const draw = () => {
      raf = 0;
      el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${down ? 0.7 : hot ? 1.5 : 1})`;
    };
    const show = (on: boolean) => { if (on !== shown) { shown = on; root.classList.toggle("cur-on", on); } };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY; show(true);
      const t = e.target as Element | null;
      hot = !!t?.closest("a,button,summary,label,[role=button],[data-cursor]");
      root.classList.toggle("cur-text", !!t?.closest("input,textarea,select,[contenteditable=true]"));
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const dn = () => { down = true; draw(); }, up = () => { down = false; draw(); };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) show(false); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn); window.addEventListener("pointerup", up);
    document.addEventListener("mouseout", out);
    return () => { cancelAnimationFrame(raf); root.classList.remove("cur-on", "cur-text"); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", dn); window.removeEventListener("pointerup", up); document.removeEventListener("mouseout", out); };
  }, []);
  return <div className="cur-dot" ref={sq} aria-hidden="true" />;
}
