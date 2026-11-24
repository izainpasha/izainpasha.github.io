import { useRef } from "react";
import { process } from "../data.js";
import { gsap, MOTION_OK, pad, useGSAP } from "../lib/gsap.js";
import ParticleCanvas from "./ParticleCanvas.jsx";

// Scrollytelling: the steps scroll past a sticky stage. As each step reaches the middle of
// the screen it lights up, and the particles re-form into that step's shape:
// a loose cloud (scope), a lattice (build), a sphere (QA), a rising helix (launch), a ring (support).
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function ProcessStory() {
  const root = useRef(null);
  const steps = useRef(null);
  const word = useRef(null);
  const field = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const section = root.current;
      const items = gsap.utils.toArray("li", steps.current);
      const n = items.length;
      let current = -1;
      section.classList.add("is-story");

      const show = (i) => {
        if (i === current) return;
        current = i;
        items.forEach((li, k) => li.classList.toggle("is-active", k === i));
        word.current.textContent = process[i].title;
        gsap.fromTo(word.current, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out", overwrite: true });
      };
      show(0);

      gsap.timeline({
        scrollTrigger: {
          trigger: steps.current,
          start: "top 55%",
          end: "bottom 55%",
          scrub: true,
          onUpdate(self) {
            // Each step gets a plateau where its shape holds, then a short morph to the next.
            const raw = Math.min(n - 1, Math.max(0, self.progress * n - 0.5));
            const seg = Math.min(Math.floor(raw), n - 2);
            field.current?.setProgress(seg + smooth(0.3, 0.7, raw - seg));
            show(Math.min(n - 1, Math.floor(self.progress * n)));
          },
        },
      });

      return () => {
        section.classList.remove("is-story");
        items.forEach((li) => li.classList.remove("is-active"));
      };
    });
  }, { scope: root });

  return (
    <section className="section container process-story" id="process" aria-labelledby="process-title" ref={root}>
      <div className="process-copy">
        <h2 id="process-title">From brief to launch, and after</h2>
        <ol className="process-steps" ref={steps}>
          {process.map((p, i) => (
            <li key={p.title}>
              <span className="step" aria-hidden="true">{pad(i + 1)}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="process-stage" aria-hidden="true">
        <ParticleCanvas mode="morph" apiRef={field} className="process-canvas" />
        <p className="process-word" ref={word}>{process[0].title}</p>
      </div>
    </section>
  );
}
