import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import CareerTrack from "./components/CareerTrack.jsx";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Manifesto from "./components/Manifesto.jsx";
import ProcessStory from "./components/ProcessStory.jsx";
import { Contact, Footer, Gallery, ProjectIndex, Skills } from "./components/Sections.jsx";
import ServicesTrack from "./components/ServicesTrack.jsx";
import WorkTrack from "./components/WorkTrack.jsx";
import { ScrollTrigger, startSmoothScroll } from "./lib/gsap.js";

// Smooth scrolling, plus a debounced refresh whenever the page changes height
// (filters, "Show more", images and fonts arriving), so every pin below stays in place.
function useScrollSetup() {
  useEffect(() => {
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 68;
    const stop = startSmoothScroll(header);
    let timer;
    let lastHeight = 0;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      stop();
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);
}

// The page is one story, told in chapters: the hero settles into a grid of projects, a short
// manifesto, what I build (sideways), selected work (sideways), the full index and client stores,
// the process (particles re-form per step), the career (sideways timeline), the stack and contact.
export default function App() {
  useScrollSetup();
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Manifesto />
        <ServicesTrack />
        <WorkTrack />
        <ProjectIndex />
        <Gallery />
        <ProcessStory />
        <CareerTrack />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
