"use client";
import { useEffect, useState } from "react";

const items = [["summary", "Summary"], ["story", "Story"], ["screens", "Screens"], ["outcome", "Proof"]] as const;

/* Sticky in-page index: shows where you are on a long page and lets you jump. */
export function CaseNav() {
  const [on, setOn] = useState<string>("summary");
  useEffect(() => {
    const els = items.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setOn(e.target.id); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return (
    <nav className="cs-nav" aria-label="On this page">
      {items.map(([id, l]) => (<a key={id} href={`#${id}`} className={on === id ? "on" : ""}>{l}</a>))}
    </nav>
  );
}
