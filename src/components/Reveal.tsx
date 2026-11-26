"use client";
import { useEffect } from "react";

/*
  Scroll reveals for everything below the first screen. Each .rv block, once it enters the viewport,
  plays its children in one after another: they slide up a long way on an expo ease-out while a clip
  wipe draws the card in, instead of a flat opacity fade. Runs once per block.
*/
export function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
    blocks.forEach((b) => {
      if (b.classList.contains("whole")) return;
      Array.from(b.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(Math.min(i, 9))));
    });
    root.classList.add("rv-on");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    blocks.forEach((b) => io.observe(b));
    return () => { io.disconnect(); root.classList.remove("rv-on"); };
  }, []);
  return null;
}
