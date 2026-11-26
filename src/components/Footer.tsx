import { Arrow, Mark, Row } from "./Mark";

// Deterministic random so the server and the browser draw the same grid.
function rng(seed: number) { return () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

function inMark(x: number, y: number) {
  const rect = (x0: number, y0: number, w: number, h: number) => x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h;
  if (rect(64, 0, 16.3, 50.4) || rect(0, 64.3, 50.4, 16.3) || rect(94.5, 64.3, 73.2, 16.3) || rect(64, 94.5, 16.3, 109.4)) return true;
  if ((x - 72.3) ** 2 + (y - 72.4) ** 2 <= 8.2 ** 2) return true;
  const dx = x - 147, dy = y - 135.6, a = (-135 * Math.PI) / 180;
  const rx = dx * Math.cos(a) - dy * Math.sin(a), ry = dx * Math.sin(a) + dy * Math.cos(a);
  return rx >= 0 && rx <= 16.3 && ry >= 0 && ry <= 50.7;
}

const COLS = 40;
const lit = new Set<string>();
for (let r = 0; r < 14; r++) for (let c = 0; c < 12; c++) {
  let hits = 0; const x = (c + 0.5) * 14, y = (r + 0.5) * 14.6;
  for (const dx of [-4, 0, 4]) for (const dy of [-4, 0, 4]) if (inMark(x + dx, y + dy)) hits++;
  if (hits >= 4) lit.add(`${r + 1}-${c + 24}`);
}
const rand = rng(9);
const dark = Array.from({ length: 16 * COLS }, (_, i) => {
  const r = Math.floor(i / COLS), c = i % COLS;
  const cls = lit.has(`${r}-${c}`) ? "p on" : rand() < 0.06 ? "p m" : "p";
  return { cls, d: ((Math.abs(c - 30) + r) * 0.035).toFixed(2) + "s" };
});
const light = Array.from({ length: 9 * COLS }, (_, i) => {
  const r = Math.floor(i / COLS), keep = Math.max(0, 0.8 - r * 0.1), u = rand();
  return u < keep * 0.55 ? "q" : u < keep ? "q t" : "q x";
});

export function Footer() {
  return (
    <footer>
      <div className="gd" aria-hidden="true">{dark.map((p, i) => <i key={i} className={p.cls} style={{ ["--d" as string]: p.d }} />)}</div>
      <div className="gl" aria-hidden="true">{light.map((c, i) => <i key={i} className={c} />)}</div>
      <Row style={{ borderTop: "1px solid var(--line)" }}>
        <div className="fin rv">
          <div>
            <p className="h2">For teams who operate in possibilities, <span>not bandwidth.</span></p>
            <p style={{ marginTop: 14, fontSize: 17, color: "#5A5A55" }}>Bring the goal, not a brief. We&apos;ll tell you what we&apos;d ship first.</p>
            <form className="box" aria-label="Book a call"><label htmlFor="fm" style={{ position: "absolute", left: -9999 }}>Work email</label><input id="fm" type="email" placeholder="you@company.com" /><a className="btn cit" href="https://cal.com/byflint">Book a call <Arrow /></a></form>
          </div>
          <div className="lk"><p>Studio</p><a href="#work">Work</a><a href="#services">Services</a><a href="#about">About</a><a href="#faq">FAQ</a></div>
          <div className="lk"><p>Contact</p><a href="mailto:hello@byflint.studio">hello@byflint.studio</a><a href="tel:+917303415009">+91 73034 15009</a><a href="#">LinkedIn</a><a href="#">Instagram</a></div>
        </div>
        <div className="bot"><span style={{ display: "flex", alignItems: "center", gap: 10 }}><Mark width={16} height={20} /> © 2026 Flint Studio · Delhi, India</span><span>Available for Q1 2027</span></div>
      </Row>
    </footer>
  );
}
