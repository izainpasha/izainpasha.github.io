import { domAnimation, LazyMotion, m, stagger } from "motion/react";
import { useRef } from "react";
import { profile, proof } from "../data.js";
import { clamp01, gsap, MOTION_OK, useGSAP } from "../lib/gsap.js";
import ParticleCanvas from "./ParticleCanvas.jsx";

const list = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.07) } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};
// The headline only slides (no fade) so it paints straight from the pre-rendered HTML — it's the LCP element.
const headline = {
  hidden: { y: 16 },
  show: { y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

const [count, ...rest] = proof;

// Chapter one. The hero is pinned while the reader scrolls: the intro lifts away, the sea of
// points settles into a grid of storefront tiles, and the tally counts up to 300+.
// Without motion (or JS) it is a plain intro followed by the tally card.
export default function Hero() {
  const root = useRef(null);
  const stage = useRef(null);
  const field = useRef(null);
  const number = useRef(null);

  useGSAP(
    () => {
      const onMove = (e) => field.current?.setPointer((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      addEventListener("pointermove", onMove, { passive: true });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        root.current.classList.add("is-story");
        const tally = { n: 0 };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "+=190%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => field.current?.setProgress(clamp01((self.progress - 0.06) / 0.6)),
          },
        });
        tl.to(".scroll-cue", { autoAlpha: 0, duration: 0.08 }, 0)
          .to(".hero-intro", { yPercent: -14, autoAlpha: 0, duration: 0.3 }, 0.04)
          .fromTo(".tally-card", { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.24 }, 0.4)
          .fromTo(tally, { n: 0 }, {
            n: count.value,
            duration: 0.34,
            onUpdate: () => (number.current.textContent = Math.round(tally.n)),
          }, 0.42)
          .from(".tally-proof > div", { y: 24, autoAlpha: 0, stagger: 0.05, duration: 0.14 }, 0.66)
          .to({}, { duration: 0.14 });

        return () => root.current?.classList.remove("is-story");
      });

      return () => removeEventListener("pointermove", onMove);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-stage" ref={stage}>
        <div className="hero-field">
          <ParticleCanvas mode="hero" apiRef={field} />
        </div>

        <LazyMotion features={domAnimation} strict>
          <m.div className="hero-intro container" variants={list} initial="hidden" animate="show">
            <m.p className="eyebrow" data-hero="" variants={item}>
              <span className="status-dot" aria-hidden="true" />
              Full-stack developer · {profile.location} · Remote worldwide
            </m.p>
            <m.h1 id="hero-title" variants={headline}>
              Stores and websites, <span className="accent">built from scratch</span> and shipped on time.
            </m.h1>
            <m.p className="lede" data-hero="" variants={item}>
              I'm {profile.name}. I build custom Shopify themes and apps, WordPress and Webflow sites,
              and React and PHP web apps, and I lead the teams that ship them.
            </m.p>
            <m.div className="hero-actions" data-hero="" variants={item}>
              <a className="btn" href="#work">See selected work</a>
              <a className="btn btn-ghost" href="#contact">Start a project</a>
            </m.div>
          </m.div>
        </LazyMotion>

        <div className="hero-tally container">
          <div className="tally-card">
            <p className="tally-number">
              <span ref={number}>{count.value}</span>
              {count.suffix}
            </p>
            <p className="tally-label">
              Shopify stores, apps, WordPress and Webflow sites shipped since 2021, as a developer and as the
              lead of the teams that built them.
            </p>
            <dl className="tally-proof">
              {rest.map((p) => (
                <div key={p.label}>
                  <dt>{p.label}</dt>
                  <dd>{p.text ?? `${p.value}${p.suffix}`}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="scroll-cue" aria-hidden="true">Scroll</p>
      </div>
    </section>
  );
}
