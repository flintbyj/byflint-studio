import Link from "next/link";
import { Mark, Arrow, Row } from "./Mark";
import { cases } from "@/lib/content";

export function Hero() {
  return (
    <section aria-label="Intro">
      <Row className="hero">
        <span className="bar v" style={{ left: -3, top: 265 }} />
        <span className="bar v" style={{ right: -3, bottom: 45 }} />
        <div className="copy hin">
          <h1 className="h2">Design Bandwidth<br />for startups and scale-ups.<br /><span>Shipped in code.</span></h1>
        </div>
        <div className="cta hin d2"><a className="btn" href="https://cal.com/byflint">Available for Q1 2027 <Arrow /></a></div>
      </Row>
      <div className="work" id="work">
        <div className="track">
          {cases.map((c, i) => (
            <article className={"card" + (i < 2 ? " hin d" + (i + 3) : "")} key={c.id}>
              <div className="t" style={{ background: c.bg }}>
                <p className="co">{c.company}</p>
                <p className="s">{c.before}<b>{c.brand}</b>{c.after}</p>
                <div className="nums">{c.stats.map((s) => (<div key={s.n}><p className="n">{s.n}</p><p className="nl">{s.l}</p></div>))}</div>
                <Link className="btn sm" href={`/work/${c.id}`}>Read the story <Arrow /></Link>
              </div>
              <div className="ph"><div className="phone">Drop screen</div></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
