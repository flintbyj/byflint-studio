"use client";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setDone(true); setTimeout(() => setDone(false), 1600); } catch { window.location.href = `mailto:${email}`; }
  };
  return (
    <button type="button" className="fcopy" onClick={copy} aria-label={done ? "Email copied" : "Copy email address"}>
      {done ? <span>Copied</span> : (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="3" /><rect x="2" y="2" width="13" height="13" rx="3" opacity=".55" /></svg>
      )}
    </button>
  );
}
