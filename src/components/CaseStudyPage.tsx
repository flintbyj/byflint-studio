import Link from "next/link";
import { Arrow, Mark, Row } from "./Mark";
import { Reveal } from "./Reveal";
import { Cursor } from "./Cursor";
import { Footer } from "./Footer";
import { CaseNav } from "./CaseNav";
import type { CaseStudy, Visual } from "@/lib/cases";

/* Visual slot. Drop an image path into `src` in cases.ts and it replaces the placeholder. */
function Vis({ v, tone }: { v: Visual; tone?: string }) {
  const k = v.kind === "phone" ? "por" : "lan";
  return (
    <figure className={"cs-vis " + k} style={tone ? { background: tone } : undefined}>
      {v.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${v.src}`} alt={v.label} />
      ) : (
        <div className="slot"><Mark width={18} height={22} /><span>Visual to add</span></div>
      )}
      <figcaption>{v.label}</figcaption>
    </figure>
  );
}

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
      <CaseNav />

      <Row>
        <section className="cs-hero" style={{ background: c.bg }} id="summary">
          <div className="cs-ht">
            <Link className="cs-back" href="/#work">All work</Link>
            <p className="cs-tag">{c.company} <span>{c.tag}</span></p>
            <h1 className="cs-h1">{c.headline}</h1>
            <p className="cs-sub">{c.sub}</p>
            <div className="cs-nums">{c.stats.map((s) => (<div key={s.n}><p className="n">{s.n}</p><p className="nl">{s.l}</p></div>))}</div>
          </div>
          <Vis v={c.heroVisual} tone="rgba(255,255,255,.55)" />
        </section>
      </Row>

      <Row>
        <div className="cs-sum">
          <div className="cs-ps">
            <div><p className="cs-k">The problem</p><p>{c.pgi.problem}</p></div>
            <div><p className="cs-k">What we did</p><p>{c.pgi.solution}</p></div>
          </div>
          <dl className="cs-facts">
            {c.facts.map((f) => (<div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>))}
          </dl>
        </div>
      </Row>

      <Row>
        <div className="cs-story" id="story">
          <div className="rv">
            <p className="cs-k">The tension</p>
            <h2 className="cs-h3">{c.tension.h}</h2>
            <p className="cs-p">{c.tension.p}</p>
          </div>
          <div className="rv">
            <p className="cs-k">The insight</p>
            <h2 className="cs-h3">{c.insight.h}</h2>
            <p className="cs-p">{c.insight.p}</p>
          </div>
        </div>
      </Row>

      <Row>
        <div className="cs-dec" id="decisions">
          <div className="cs-dh rv"><p className="cs-k">Key decisions</p><h2 className="cs-h3">{c.decisionsLead}</h2></div>
          <ol>
            {c.decisions.map((d, i) => (
              <li key={d.t} className="rv">
                <div className="cs-dt">
                  <span className="ix">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{d.t}</h3>
                  <p>{d.d}</p>
                  {d.trade && <p className="cs-trade"><b>Trade-off</b> {d.trade}</p>}
                </div>
                <Vis v={d.visual} />
              </li>
            ))}
          </ol>
        </div>
      </Row>

      <Row>
        <div className="cs-out" id="outcome">
          <div className="cs-dh rv"><p className="cs-k">Outcome</p><h2 className="cs-h3">What changed</h2></div>
          <div className="rv">
            <ul className="cs-res">
              {c.results.map((r) => (
                <li key={r.k}>
                  <span className="rk">{r.k}</span>
                  {r.bar !== undefined && <span className="rb"><i style={{ width: r.bar + "%" }} /></span>}
                  <span className="rv2"><b>{r.v}</b>{r.sub && <em>{r.sub}</em>}</span>
                </li>
              ))}
            </ul>
            {c.resultsNote && <p className="cs-honest">{c.resultsNote}</p>}
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
