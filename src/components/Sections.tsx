import { Arrow, Row } from "./Mark";
import { logos } from "@/lib/content";

export function Logos() {
  return (
    <Row>
      <span className="bar v" style={{ left: -3, top: 60 }} />
      <div className="logos">
        <div className="rv" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <h2 className="h2" style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}>Join 25+ brands<br /><span>and their success stories</span></h2>
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
