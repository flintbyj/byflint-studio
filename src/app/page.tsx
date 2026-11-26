import { Mark } from "@/components/Mark";
import { Hero } from "@/components/Hero";
import { ScrollIntro } from "@/components/ScrollIntro";
import { Logos, Marquee } from "@/components/Sections";
import { Services, Problems, Testimonial, Team } from "@/components/Taarush";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <div className="v3">
      <Reveal />
      <ScrollIntro>
      <header className="nav">
        <div className="l"><a href="#about">about flint</a><a href="#work">work</a></div>
        <a className="logo" href="#" aria-label="Flint Studio home"><Mark /></a>
        <a href="https://cal.com/byflint">Book a call</a>
      </header>
      <Hero />
      </ScrollIntro>
      <Logos />
      <Marquee />
      <Testimonial which="indofast" />
      <Problems />
      <div id="services"><Services /></div>
      <Testimonial which="vlcc" />
      <Team />
      <Faq />
      <Footer />
    </div>
  );
}
