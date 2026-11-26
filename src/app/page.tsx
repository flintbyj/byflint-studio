import { Mark } from "@/components/Mark";
import { Hero } from "@/components/Hero";
import { ScrollIntro } from "@/components/ScrollIntro";
import { Logos, Marquee, Services, Problems, Testimonial } from "@/components/Sections";
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
      <div id="services"><Services /></div>
      <Problems />
      <Testimonial which="indofast" />
      <Faq />
      <Testimonial which="vlcc" />
      <Footer />
    </div>
  );
}
