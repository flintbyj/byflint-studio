import { Arrow, Mark, Row } from "./Mark";

export function Footer() {
  return (
    <footer className="ft">
      <Row>
        <div className="fg rv">
          <div className="fh">
            <p className="fbig">For teams who operate in possibilities, <span>not bandwidth.</span></p>
          </div>
          <div className="fcell"><p>Contact</p><a href="mailto:hello@byflint.studio">hello@byflint.studio</a><a href="tel:+917303415009">+91 73034 15009</a></div>
          <div className="fcell"><p>Follow</p><a href="#">LinkedIn</a><a href="#">Instagram</a></div>
          <div className="fcell"><p>Studio</p><a href="#work">Work</a><a href="#services">Services</a><a href="#about">About</a><a href="#faq">FAQ</a></div>
          <div className="fcell"><p>Availability</p><span>Three projects at a time.</span><span>Replies within 24 hours.</span></div>
        </div>
      </Row>
      <Row>
        <div className="fask rv">
          <p>Bring the goal, not a brief. We&apos;ll tell you what we&apos;d ship first.</p>
          <form className="box" aria-label="Book a call"><label htmlFor="fm" style={{ position: "absolute", left: -9999 }}>Work email</label><input id="fm" type="email" placeholder="you@company.com" /><a className="btn cit" href="https://cal.com/byflint">Book a call <Arrow /></a></form>
        </div>
      </Row>
      <Row>
        <div className="bot"><span style={{ display: "flex", alignItems: "center", gap: 10 }}><Mark width={16} height={20} /> © 2026 Flint Studio · Delhi, India</span><span>Available for Q1 2027</span></div>
      </Row>
    </footer>
  );
}
