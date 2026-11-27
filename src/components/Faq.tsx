"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow, Mark, Row } from "./Mark";
import { faq } from "@/lib/content";

const SHOWN = [5, 9, 99]; // questions visible after each "read more" on mobile

export function Faq() {
  const [sel, setSel] = useState(0);
  const [typing, setTyping] = useState(false);
  const [parts, setParts] = useState(1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const pick = (i: number) => {
    if (timer.current) clearTimeout(timer.current);
    setSel(i); setTyping(true);
    timer.current = setTimeout(() => setTyping(false), 750);
  };
  const cur = faq[sel < 0 ? 0 : sel];
  return (
    <Row>
      <div className="faq" id="faq">
        <div className="rv">
          <h2 className="h2">You might be<br /><span>wondering</span></h2>
          <div className="acc">
            {faq.map((f, i) => i < SHOWN[parts - 1] && (
              <div key={f.q} className={i === sel ? "ai on" : "ai"}>
                <button type="button" className="aq" aria-expanded={i === sel} onClick={() => setSel(i === sel ? -1 : i)}>
                  <span>{f.q}</span><i aria-hidden="true" />
                </button>
                <div className="aa"><div><p>{f.a}</p></div></div>
              </div>
            ))}
            {parts < 3 && (
              <button type="button" className="amore" onClick={() => setParts(parts + 1)}>
                Read more questions <span>{Math.min(SHOWN[parts], faq.length) - SHOWN[parts - 1]}</span>
              </button>
            )}
            <div className="aend"><span>Something else on your mind?</span><a className="btn sm cit" href="https://cal.com/byflint">Ask us on a call <Arrow /></a></div>
          </div>
          <div className="chips">
            {faq.map((f, i) => (
              <button type="button" key={f.q} className={i === sel ? "chip on" : "chip"} onClick={() => pick(i)}>{f.q}</button>
            ))}
          </div>
        </div>
        <div className="chat rv whole" aria-live="polite">
          <div className="top"><span className="av"><Mark width={16} height={20} /></span><span><b style={{ color: "var(--ink)" }}>Flint Studio</b> <span className="live" /> usually replies within 24 hours</span></div>
          <p className="me" key={"q" + sel}>{cur.q}</p>
          {typing ? <div className="typing"><i /><i /><i /></div> : <p className="them" key={"a" + sel}>{cur.a}</p>}
          <div className="end"><span>Something else on your mind?</span><a className="btn sm cit" href="https://cal.com/byflint">Ask us on a call <Arrow /></a></div>
        </div>
      </div>
    </Row>
  );
}
