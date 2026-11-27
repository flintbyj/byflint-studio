import { Mark, Row } from "./Mark";

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
        </div>
      </Row>
      <Row>
        <div className="bot"><span style={{ display: "flex", alignItems: "center", gap: 10 }}><Mark width={16} height={20} /> © 2026 Flint Studio · Delhi, India</span><span>Available for Q1 2027</span></div>
      </Row>
    </footer>
  );
}
