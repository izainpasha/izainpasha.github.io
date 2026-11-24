import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ProcessStory from "./components/ProcessStory.jsx";
import { Contact, Experience, Footer, Gallery, ProjectIndex, Proof, Services, Skills } from "./components/Sections.jsx";
import WorkTrack from "./components/WorkTrack.jsx";
import { ScrollTrigger } from "./lib/gsap.js";

// Scroll positions depend on everything above them. When the page changes height
// (filters, "Show more", images and fonts arriving), recompute every trigger once it settles.
function useScrollRefresh() {
  useEffect(() => {
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
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);
}

export default function App() {
  useScrollRefresh();
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Proof />
        <Services />
        <WorkTrack />
        <ProjectIndex />
        <Gallery />
        <ProcessStory />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
