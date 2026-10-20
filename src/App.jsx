import { MotionConfig } from "motion/react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import { Contact, Experience, Footer, Gallery, Process, ProjectIndex, Proof, Services, Skills, Work } from "./components/Sections.jsx";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main">
        <Hero />
        <Proof />
        <Services />
        <Work />
        <ProjectIndex />
        <Gallery />
        <Process />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
