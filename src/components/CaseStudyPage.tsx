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

/* First sentence large, the rest quiet: gives each paragraph an entry point. */
function Lead({ t }: { t: string }) {
  const i = t.search(/\.\s/);
  const lead = i > 0 ? t.slice(0, i + 1) : t, rest = i > 0 ? t.slice(i + 2) : "";
  return (<><p className="cs-lead">{lead}</p>{rest && <p className="cs-p">{rest}</p>}</>);
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
          </div>
          <Vis v={c.heroVisual} tone="rgba(255,255,255,.55)" />
        </section>
      </Row>

      <Row>
        <div className="cs-chap" id="story">
          <div className="cs-ch rv">
            <div className="cs-tx"><p className="cs-k"><span>01</span>About the company</p><Lead t={c.about} /></div>
            <div className="cs-pn cs-pn-n">{c.stats.map((s) => (<div key={s.n}><p className="n">{s.n}</p><p className="nl">{s.l}</p></div>))}</div>
          </div>
          <div className="cs-ch flip rv">
            <div className="cs-tx"><p className="cs-k"><span>02</span>The challenge</p><Lead t={c.challenge} /></div>
            <ul className="cs-pn cs-pn-p">{c.pains.map((x) => (<li key={x}>{x}</li>))}</ul>
          </div>
          <div className="cs-ch rv">
            <div className="cs-tx"><p className="cs-k"><span>03</span>Our solution and its impact</p><Lead t={c.solution} /></div>
            <dl className="cs-pn cs-pn-f">{c.facts.map((f) => (<div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>))}</dl>
          </div>
        </div>
      </Row>

      <Row>
        <div className="cs-screens" id="screens">
          <div className="cs-sh"><p className="cs-k">Screens</p><h2 className="cs-h3">How it works, step by step</h2></div>
          <div className="cs-gal">
            {c.shots.map((x, i) => (
              <div key={x.t} className={"cs-shot rv " + (x.visual.kind === "phone" ? "por" : "lan")}>
                <p className="cs-st"><span>{String(i + 1).padStart(2, "0")}</span><b>{x.t}</b></p>
                <Vis v={x.visual} />
                <p className="cs-cap">{x.cap}</p>
              </div>
            ))}
          </div>
        </div>
      </Row>

      <Row>
        <div className="cs-out" id="outcome">
          <div className="cs-dh rv"><p className="cs-k">Proof</p><h2 className="cs-h3">What changed</h2></div>
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
