import { Arrow, Row } from "./Mark";
import { logos, services, problems, testimonials } from "@/lib/content";

export function Logos() {
  return (
    <Row>
      <span className="bar v" style={{ left: -3, top: 60 }} />
      <div className="logos">
        <div className="rv" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h2 className="h2" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>Join 25+ brands&apos;<br /><span>success stories</span></h2>
          <a className="btn sm" href="#work" style={{ alignSelf: "flex-start" }}>View case studies <Arrow /></a>
        </div>
        <div className="tiles rv">
          <div className="tile sp" />
          {logos.map((l) => (<div className="tile" key={l.alt}><img src={l.src} alt={l.alt} /></div>))}
          <div className="tile more">+19 more</div>
        </div>
      </div>
    </Row>
  );
}

export function Marquee() {
  const line = (
    <p>
      {[0, 1].map((k) => (<span key={k}>Inspiration is perishable, act on it immediately <em>~ Naval Ravikant</em> <i>✦</i> </span>))}
    </p>
  );
  return (
    <div className="mq" aria-label="Inspiration is perishable, act on it immediately, Naval Ravikant">
      <div className="tr" aria-hidden="true">{line}{line}</div>
    </div>
  );
}

function Cell({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="cell" tabIndex={0}>
      <span className="ix">{n}</span>
      <div><p className="nm">{t}</p><p className="ds">{d}</p></div>
      <span className="ct" aria-hidden="true" />
    </div>
  );
}

export function Services() {
  return (
    <Row>
      <div className="g rv">
        {services.slice(0, 4).map((s) => <Cell key={s.n} {...s} />)}
        <div className="cell wide"><p className="h2">Find what you need.<br /><span>We&apos;ll ship it.</span></p></div>
        {services.slice(4).map((s) => <Cell key={s.n} {...s} />)}
      </div>
    </Row>
  );
}

export function Problems() {
  return (
    <Row>
      <div className="prob">
        <div className="rv" style={{ display: "flex", flexDirection: "column" }}>
          <h2 className="h2">Your Launch date<br />can&apos;t move.</h2>
          <div style={{ marginTop: "auto" }}>
            <p className="big">24</p>
            <p style={{ marginTop: 10, fontSize: 24, lineHeight: 1.35, color: "var(--mut)" }}>Things running in parallel,<br />and no one has the time.</p>
          </div>
        </div>
        <div className="ptrack rv">
          {problems.map((p, i) => (
            <article className="pcard" key={p.t}>
              <span className="ix">0{i + 1}</span>
              <div className="pb"><h3>{p.t}</h3><p className="pr">{p.p}</p><p className="fx"><b>With us</b><span>{p.f}</span></p></div>
            </article>
          ))}
        </div>
      </div>
    </Row>
  );
}

export function Testimonial({ which }: { which: keyof typeof testimonials }) {
  const t = testimonials[which];
  return (
    <section className="row tq" aria-label="What clients say">
      <div className="side" />
      <div className="mid">
        <div className="tqin">
          <div className="tql">
            <span className="tbar" aria-hidden="true" />
            <blockquote className="rv whole">{t.quote}</blockquote>
            <p className="tw"><b>{t.name}</b>{t.role}</p>
          </div>
          <div className="tqr rv">
            <div className="tlogo"><img src={t.logo} alt={t.alt} /></div>
            <div className="tstat"><p className="n">{t.stat}</p><p className="nl">{t.statLabel}</p></div>
          </div>
        </div>
      </div>
      <div className="side" />
    </section>
  );
}
