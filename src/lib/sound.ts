// Tiny WebAudio synth for interface sounds (select / toggle / close / success / error). No dependencies.
let ctx: AudioContext | null = null;
let armed = false;
const KEY = "flint-sound";

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch { return null; }
  }
  return ctx;
}
export function soundOn() {
  try { return localStorage.getItem(KEY) !== "off"; } catch { return true; }
}
// browsers only allow audio after a gesture: arm on the first one
export function armSound() {
  if (typeof window === "undefined" || armed) return;
  armed = true;
  const go = () => { ac()?.resume().catch(() => {}); window.removeEventListener("pointerdown", go); window.removeEventListener("keydown", go); };
  window.addEventListener("pointerdown", go, { passive: true });
  window.addEventListener("keydown", go);
}
type Tone = { f: number; to?: number; t?: number; d: number; v: number; w?: OscillatorType };
function tones(list: Tone[]) {
  const c = ac();
  if (!c || c.state !== "running" || !soundOn()) return;
  const out = c.createGain(); out.gain.value = 0.5; out.connect(c.destination);
  const now = c.currentTime;
  for (const n of list) {
    const o = c.createOscillator(), g = c.createGain(), s = now + (n.t ?? 0);
    o.type = n.w ?? "sine";
    o.frequency.setValueAtTime(n.f, s);
    if (n.to) o.frequency.exponentialRampToValueAtTime(n.to, s + n.d * 0.6);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(n.v, s + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, s + n.d);
    o.connect(g).connect(out); o.start(s); o.stop(s + n.d + 0.03);
  }
}
export type Cue = "select" | "on" | "off" | "clear" | "hint" | "success" | "error";
export function play(cue: Cue, rise = 0) {
  const k = 1 + rise * 0.05;
  switch (cue) {
    case "select": tones([{ f: 520 * k, to: 340 * k, d: 0.07, v: 0.16, w: "triangle" }, { f: 1500 * k, d: 0.03, v: 0.05 }]); break;
    case "on": tones([{ f: 660, to: 820, d: 0.09, v: 0.14, w: "triangle" }, { f: 1320, t: 0.012, d: 0.05, v: 0.04 }]); break;
    case "off": tones([{ f: 520, to: 380, d: 0.08, v: 0.12, w: "triangle" }]); break;
    case "clear": tones([{ f: 420, to: 240, d: 0.12, v: 0.1, w: "triangle" }]); break;
    case "hint": tones([{ f: 880, d: 0.06, v: 0.07 }, { f: 1175, t: 0.05, d: 0.08, v: 0.06 }]); break;
    case "success": tones([{ f: 523, d: 0.18, v: 0.12, w: "triangle" }, { f: 659, t: 0.07, d: 0.18, v: 0.11, w: "triangle" }, { f: 784, t: 0.14, d: 0.3, v: 0.11, w: "triangle" }]); break;
    case "error": tones([{ f: 220, to: 150, d: 0.16, v: 0.12, w: "square" }]); break;
  }
}
