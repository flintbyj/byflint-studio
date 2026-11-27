"use client";
import { useEffect, useRef } from "react";

/*
  The statue in the footer starts facing right and turns to face left as the footer scrolls into view.
  It is a flat image, so the turn is a flip about the vertical axis, scrubbed by scroll position
  (and smoothed), reversible if you scroll back up. Reduced motion keeps it still.
*/
export function FooterArt() {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = box.current, im = img.current;
    const foot = el?.closest("footer");
    if (!el || !im || !foot || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cur = 0, target = 0, raf = 0;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const apply = () => { im.style.transform = `rotateY(${(ease(cur) * 180).toFixed(2)}deg)`; };
    const tick = () => {
      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      apply();
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const r = foot.getBoundingClientRect();
      target = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height * 0.9)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="fart" ref={box} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={img} src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/footer-art.png`} alt="" width={1012} height={799} draggable={false} />
    </div>
  );
}
