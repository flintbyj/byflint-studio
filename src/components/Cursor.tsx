"use client";
import { useEffect, useRef } from "react";

/* A solid square at the pointer. Behind it, each time the pointer leaves a cell of an invisible grid, a hollow square of a random size is left in that cell and fades away on the spot.
   The hollow squares invert against what is under them, so they read on light and dark. Fine pointers only. */
const N = 10, CELL = 26;
export function Cursor() {
  const head = useRef<HTMLDivElement>(null);
  const pool = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement, hd = head.current!;
    let x = -100, y = -100, raf = 0, shown = false, hot = false, down = false, cx = NaN, cy = NaN, k = 0;
    const draw = () => {
      raf = 0;
      hd.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${down ? 0.7 : hot ? 1.5 : 1})`;
    };
    const drop = (gx: number, gy: number) => {
      const el = pool.current[k++ % N]; if (!el || reduce) return;
      const sz = [12, 16, 20, 24][Math.floor(Math.random() * 4)];
      el.style.width = el.style.height = sz + "px";
      el.style.transform = `translate3d(${gx * CELL + CELL / 2}px,${gy * CELL + CELL / 2}px,0) translate(-50%,-50%)`;
      el.getAnimations().forEach((a) => a.cancel());
      el.animate([{ opacity: 0.35 + Math.random() * 0.55 }, { opacity: 0 }], { duration: 700 + Math.random() * 300, easing: "ease-out", fill: "forwards" });
    };
    const show = (on: boolean) => { if (on !== shown) { shown = on; root.classList.toggle("cur-on", on); } };
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL);
      if (!shown) { show(true); cx = gx; cy = gy; }
      if (gx !== cx || gy !== cy) { drop(cx, cy); cx = gx; cy = gy; }
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
  return (
    <>
      {Array.from({ length: N }, (_, i) => (
        <div className="cur-t" key={i} ref={(el) => { pool.current[i] = el; }} aria-hidden="true" />
      ))}
      <div className="cur-dot" ref={head} aria-hidden="true" />
    </>
  );
}
