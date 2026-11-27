import Link from "next/link";
import { Arrow, Mark, Row } from "./Mark";
import { Reveal } from "./Reveal";
import { Cursor } from "./Cursor";
import { Footer } from "./Footer";
import type { CaseStudy } from "@/lib/cases";

export function CaseStudyPage({ c, next }: { c: CaseStudy; next: CaseStudy }) {
  return (
    <div className="v3 cs">
      <Reveal />
      <Cursor />
      <header className="nav">
        <div className="l"><Link href="/#about">about flint</Link><Link href="/#work">work</Link></div>
        <Link className="logo" href="/" aria-label="Flint Studio home"><Mark /></Link>
        <a href="https://cal.com/byflint">Book a call</a>
      </header>

      <Row>
        <section className="cs-hero" style={{ background: c.bg }}>
          <Link className="cs-back" href="/#work">All work</Link>
          <p className="cs-tag">{c.company} <span>{c.tag}</span></p>
          <h1 className="cs-h1">{c.headline}</h1>
          <p className="cs-sub">{c.sub}</p>
          <div className="cs-nums">{c.stats.map((s) => (<div key={s.n}><p className="n">{s.n}</p><p className="nl">{s.l}</p></div>))}</div>
        </section>
      </Row>

      <Row>
        <dl className="cs-facts rv">
          {c.facts.map((f) => (<div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>))}
        </dl>
      </Row>

      <Row>
        <div className="cs-pgi rv">
          <div><p className="cs-k">Problem</p><p>{c.pgi.problem}</p></div>
          <div><p className="cs-k">Solution</p><p>{c.pgi.solution}</p></div>
          <div><p className="cs-k">Impact</p><p>{c.pgi.impact}</p></div>
        </div>
      </Row>

      <Row>
        <div className="cs-ch rv">
          <p className="cs-k">The tension</p>
          <div><h2 className="h2">{c.tension.h}</h2><p className="cs-p">{c.tension.p}</p></div>
        </div>
      </Row>
      <Row>
        <div className="cs-ch rv">
          <p className="cs-k">The insight</p>
          <div><h2 className="h2">{c.insight.h}</h2><p className="cs-p">{c.insight.p}</p></div>
        </div>
      </Row>

      <Row>
        <div className="cs-dec">
          <div className="cs-dh rv"><p className="cs-k">Key decisions</p><p className="cs-lead">{c.decisionsLead}</p></div>
          <ol>
            {c.decisions.map((d, i) => (
              <li key={d.t} className="rv">
                <span className="ix">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                  {d.trade && <p className="cs-trade"><b>Trade-off</b> {d.trade}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Row>

      <Row>
        <div className="cs-out rv">
          <p className="cs-k">Outcome</p>
          <div>
            <h2 className="h2">{c.outcome.h}</h2>
            <p className="cs-p">{c.outcome.p}</p>
            {c.quote && (
              <blockquote className="cs-q">
                <p>{c.quote.quote}</p>
                <footer><b>{c.quote.name}</b>, {c.quote.role}</footer>
              </blockquote>
            )}
            <p className="cs-honest"><b>Honestly</b> {c.honest}</p>
          </div>
        </div>
      </Row>

      <Row>
        <Link className="cs-next" href={`/work/${next.slug}`} style={{ background: next.bg }}>
          <span className="cs-k">Next case study</span>
          <span className="cs-nt">{next.company}</span>
          <span className="cs-ns">{next.headline}</span>
          <span className="btn sm">Read the story <Arrow /></span>
        </Link>
      </Row>

      <Row>
        <div className="cs-cta rv">
          <h2 className="h2">Have a product that needs this?<br /><span>Tell us what is stuck.</span></h2>
          <a className="btn cit" href="https://cal.com/byflint">Ask us on a call <Arrow /></a>
        </div>
      </Row>
      <Footer />
    </div>
  );
}
