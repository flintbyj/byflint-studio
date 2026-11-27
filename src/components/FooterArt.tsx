"use client";
import { useEffect, useRef } from "react";

const N = 13; // frames in /public/bust, ordered facing right to facing left
const W = 768, H = 790;

/* Scroll-scrubbed head turn: frames are drawn to a canvas and cross-faded by scroll position. */
export function FooterArt() {
  const cv = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = cv.current, foot = c?.closest("footer");
    const ctx = c?.getContext("2d");
    if (!c || !ctx || !foot) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const imgs: HTMLImageElement[] = Array.from({ length: N }, (_, i) => {
      const im = new Image(); im.src = `${base}/bust/f${String(i).padStart(2, "0")}.webp`; im.onload = () => draw(cur); return im;
    });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = 0, target = 0, raf = 0;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    function draw(p: number) {
      const pos = ease(p) * (N - 1), i = Math.floor(pos), f = pos - i;
      ctx!.clearRect(0, 0, W, H);
      const a = imgs[i], b = imgs[Math.min(N - 1, i + 1)];
      if (a?.complete && a.naturalWidth) ctx!.drawImage(a, 0, 0, W, H);
      if (f > 0.001 && b?.complete && b.naturalWidth) { ctx!.globalAlpha = f; ctx!.drawImage(b, 0, 0, W, H); ctx!.globalAlpha = 1; }
    }
    const tick = () => {
      cur += (target - cur) * 0.14;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      draw(cur);
      raf = cur === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const r = c!.getBoundingClientRect();
      target = reduce ? 0 : Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height * 0.7)));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="fart" aria-hidden="true">
      <canvas ref={cv} width={W} height={H} />
    </div>
  );
}
