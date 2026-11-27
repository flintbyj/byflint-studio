import { Mark, Row } from "./Mark";
import { FooterArt } from "./FooterArt";
import { CopyEmail } from "./CopyEmail";

export function Footer() {
  return (
    <footer className="ft">
      <Row>
        <div className="fx rv">
          <div className="fl">
            <Mark width={64} height={78} />
            <p className="fbig">For teams who operate in possibilities, <span>not bandwidth.</span></p>
            <p className="fcp">© 2026 Flint Studio · Delhi, India</p>
          </div>
          <div className="fr">
            <div className="fem"><a href="mailto:hello@byflint.studio">hello@byflint.studio</a><CopyEmail email="hello@byflint.studio" /></div>
            <FooterArt />
          </div>
        </div>
      </Row>
    </footer>
  );
}
